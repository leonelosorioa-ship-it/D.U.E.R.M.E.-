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

// 3. AI Day Evaluation endpoint with Leo persona
app.post('/api/ai/evaluate-day', async (req, res) => {
  try {
    const { dayNumber, reflection, sleepQualityRating, energyMorningRating, userName, primaryStruggle } = req.body;

    const ai = getAIClient();

    const prompt = `
Eres Leo, Mentor de Vínculos y Conexión Digital en Tu Poder Mental™ Mujer y guía del programa D.U.E.R.M.E.™ Mujer (Desarrollado por Leps Software Solutions™).
Tu slogan y filosofía central es: "Acompañamiento estratégico y tecnológico para optimizar tus relaciones y tu proyecto de vida."
Tu tono es cercano, empático, pedagógico, sereno, científico, estratégico y orientador.
Explicas la neurobiología del descanso y la gestión de la energía de forma accesible y acogedora, validando los desafíos de la mujer contemporánea (sobrecarga digital, hiperalerta, exigencia vincular y rumiación nocturna) y modulando el sistema nervioso autónomo.

Datos de la alumna:
- Nombre: ${userName || 'Querida amiga'}
- Desafío principal: ${primaryStruggle || 'Insomnio, rumiación nocturna, sobrecarga digital y mental'}
- Día evaluado: Día ${dayNumber} de 7
- Calidad de sueño / calma percibida: ${sleepQualityRating}/5
- Nivel de energía al despertar: ${energyMorningRating}/5
- Reflexión personal de la alumna: "${reflection}"

Genera una devolución estructurada somática, neurobiológica y psicológica que valide su esfuerzo, analice las respuestas de su cuerpo y tono vagal, desacelere cualquier culpa o autoexigencia cognitiva, y brinde una pauta de oro para las próximas 24 horas de asimilación circadiana.
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
            somaticObservation: { type: Type.STRING, description: 'Observación sobre el tono muscular, nervio vago, temperatura y respiración' },
            psychologicalInsight: { type: Type.STRING, description: 'Reencuadre de la rumiación cognitiva, autoexigencia y descanso compasivo' },
            nextStepRecommendation: { type: Type.STRING, description: 'Consejo práctico para las 24 horas de asimilación circadiana y desconexión' },
            closingAffirmation: { type: Type.STRING, description: 'Frase corta de anclaje de paz, serenidad y enfoque' },
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
        mentorName: 'Leo',
        somaticObservation: 'Tu cuerpo está registrando una disminución progresiva en la tensión basal simpática. La respiración y el anclaje están activando tu freno vagal natural.',
        psychologicalInsight: 'Al plasmar tu reflexión, liberas a tu corteza prefrontal de la sobrecarga de retener pendientes. Permitirte desconectar es la clave para cuidar tus vínculos y tu energía vital.',
        nextStepRecommendation: 'Respeta el ciclo de 24 horas de asimilación circadiana. Esta noche atenúa las pantallas, toma una infusión tibia y sumérgete en las frecuencias binaurales Delta.',
        closingAffirmation: 'Tu descanso es el cimiento estratégico para tu paz, tus relaciones y tu proyecto de vida.',
      },
    });
  }
});

// 4. AI Interactive Chat with Leo
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, userName, activeDay, primaryStruggle, chatHistory } = req.body;
    const ai = getAIClient();

    const systemInstruction = `
Eres Leo, Mentor de Vínculos y Conexión Digital en Tu Poder Mental™ Mujer y guía del programa D.U.E.R.M.E.™ Mujer (Desarrollado tecnológicamente por Leps Software Solutions™).
Tu slogan y norte rector es: "Acompañamiento estratégico y tecnológico para optimizar tus relaciones y tu proyecto de vida."
Tu tono es cercano, empático, pedagógico, sereno, estratégico, científico y orientador.
Acompañas a las alumnas a recuperar su sueño y claridad mediante cronobiología, modulación del nervio vago, higiene lumínica y digital, nutrición nocturna, técnicas somáticas (4-7-8, técnica militar) y frecuencias binaurales Delta (1.5 Hz) y Theta (4.5 Hz).
Hablas en español impecable, cálido y tranquilizador. Respuestas concisas (2 a 4 párrafos bien estructurados), con consejos prácticos y anclajes de calma inmediatos.
Datos de la usuaria: Nombre: ${userName || 'Amiga'}, Día activo: ${activeDay || 1}, Desafío principal: ${primaryStruggle || 'Insomnio y sobrecarga'}.
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
      reply: 'Inhala suavemente en 4 segundos, retén el aire 7 segundos y exhala despacio durante 8 segundos. Suelta el peso del cuello y la mandíbula. En este instante tu único propósito es descansar y permitir que tu cuerpo se renueve en paz.',
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
