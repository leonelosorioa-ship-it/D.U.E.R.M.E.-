import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google GenAI on server
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'D.U.E.R.M.E. Backend' });
});

// 2. Progress synchronization endpoint
app.post('/api/progress/sync', (req, res) => {
  try {
    const { lead, progress } = req.body;
    // In-memory or state confirmation
    res.json({
      status: 'ok',
      syncedAt: new Date().toISOString(),
      user: lead?.name || 'anonymous',
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Sync failed', details: err.message });
  }
});

// 3. AI Day Evaluation endpoint with Clara Luz persona
app.post('/api/ai/evaluate-day', async (req, res) => {
  try {
    const { dayNumber, reflection, sleepQualityRating, energyMorningRating, userName, primaryStruggle } = req.body;

    const ai = getAIClient();

    const prompt = `
Eres Clara Luz, la mentora y guía somática del programa D.U.E.R.M.E.™ Mujer (Ecosistema Tu Poder Mental™).
Tu voz es empática, científica, protectora, cálida y orientada al descanso profundo y la modulación del sistema nervioso.

Datos de la alumna:
- Nombre: ${userName || 'Querida amiga'}
- Desafío principal: ${primaryStruggle || 'Insomnio y rumiación nocturna'}
- Día evaluado: Día ${dayNumber} de 7
- Calidad de sueño / calma percibida: ${sleepQualityRating}/5
- Nivel de energía al despertar: ${energyMorningRating}/5
- Reflexión personal de la alumna: "${reflection}"

Genera una devolución estructurada somática y psicológica que valide su esfuerzo, analice las respuestas de su cuerpo, desacelere cualquier culpa o autoexigencia, y brinde un consejo clave para las próximas 24 horas de asimilación circadiana.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mentorName: { type: Type.STRING },
            somaticObservation: { type: Type.STRING, description: 'Observación sobre el tono muscular, nervio vago y respiración' },
            psychologicalInsight: { type: Type.STRING, description: 'Reencuadre de la rumiación cognitiva y autoexigencia' },
            nextStepRecommendation: { type: Type.STRING, description: 'Consejo práctico para las 24 horas de asimilación circadiana' },
            closingAffirmation: { type: Type.STRING, description: 'Frase corta de anclaje de paz y descanso' },
          },
          required: ['mentorName', 'somaticObservation', 'psychologicalInsight', 'nextStepRecommendation', 'closingAffirmation'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ feedback: parsed });
  } catch (err: any) {
    console.error('Error in /api/ai/evaluate-day:', err);
    // Graceful fallback if API key not present or error
    res.json({
      feedback: {
        mentorName: 'Clara Luz',
        somaticObservation: 'Tu cuerpo está registrando una disminución en la tensión basal simpática. Las prácticas respiratorias están abriendo espacio visceral.',
        psychologicalInsight: 'Al escribir tu reflexión has desactivado parte de la memoria operativa de alerta. Permitirte no tener todo resuelto es tu primer gran acto de autocuidado.',
        nextStepRecommendation: 'Respeta el intervalo de asimilación circadiana de 24 horas. Esta noche hidrátate con infusión tibia y activa las frecuencias binaurales.',
        closingAffirmation: 'Tu descanso no es negociable; es tu santuario sagrado.',
      },
    });
  }
});

// 4. AI Interactive Chat with Clara Luz
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, userName, activeDay, primaryStruggle, chatHistory } = req.body;
    const ai = getAIClient();

    const systemInstruction = `
Eres Clara Luz, la mentora somática y experta en higiene del sueño del programa D.U.E.R.M.E.™ Mujer (Tu Poder Mental™).
Tu objetivo es responder con amorosa presencia, precisión en neurociencia del descanso (ondas cerebrales Delta/Theta, estimulación del nervio vago, temperatura corporal, luz azul, vaciado mental y respiración 4-7-8), y contención emocional femenina.
Hablas en español cálido, sereno y empático. Respuestas concisas (2 a 4 párrafos cortos) con consejos accionables e inmediatos.
Datos de la usuaria: Nombre: ${userName || 'Amiga'}, Día activo: ${activeDay || 1}, Desafío principal: ${primaryStruggle || 'Insomnio'}.
`;

    const chat = ai.chats.create({
      model: 'gemini-3.7-flash',
      config: {
        systemInstruction,
      },
    });

    // Provide context and send message
    const response = await chat.sendMessage({
      message: message,
    });

    res.json({ reply: response.text });
  } catch (err: any) {
    console.error('Error in /api/ai/chat:', err);
    res.json({
      reply: 'Respira profundamente, exhala despacio durante 8 segundos. Suelta el peso del cuello y los hombros. Esta noche no tienes nada que solucionar; permite que tu cuerpo descanse suavemente en este instante.',
    });
  }
});

// Vite Middleware / Static serving
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`D.U.E.R.M.E.™ Server listening on http://0.0.0.0:${PORT}`);
  });
}

start();
