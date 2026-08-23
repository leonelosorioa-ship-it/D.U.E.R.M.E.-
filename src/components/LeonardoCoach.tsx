import { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, User, Loader2, Moon, Brain, HeartHandshake, AlertCircle } from 'lucide-react';
import { audioCues } from '../utils/audioCues';
import { LEONARDO_PROFILE } from '../data/leonardoProfile';

interface Message {
  id: string;
  sender: 'user' | 'leonardo';
  text: string;
  timestamp: string;
}

interface LeonardoCoachProps {
  userName?: string;
  dominantArchetype?: string;
  currentDay?: number;
  onOpenProfile?: () => void;
}

export function LeonardoCoach({
  userName = 'Alumna',
  dominantArchetype = 'Mente Hiperexcitada por Cortisol',
  currentDay = 1,
  onOpenProfile,
}: LeonardoCoachProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome_1',
      sender: 'leonardo',
      text: `Buenas noches, ${userName}. Soy Leonardo, Director de Bienestar e Innovación Humana en Tu Poder Mental™ Mujer. Estoy aquí para acompañarte paso a paso, regular juntos tu sistema nervioso y transformar tu descanso en una experiencia biológicamente restauradora. ¿Qué pensamientos, tensión física o dudas circulan por tu mente en este momento?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const quickPrompts = [
    'Mi mente no para de rumiar pendientes para mañana',
    'Me desperté a las 3:00 AM y no logro volver a conciliar el sueño',
    'Siento opresión en el pecho, mandíbula rígida y taquicardia',
    '¿Qué frecuencia binaural y técnica de respiración aplico hoy?',
    '¿Cómo tomo el magnesio y qué infusión me aconsejas?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isLoading) return;

    const userMsg: Message = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);
    audioCues.playChime(440, 0.2);

    try {
      const historyPayload = messages.slice(-8).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }],
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query.trim(),
          userName,
          currentDay,
          dominantArchetype,
          history: historyPayload,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const leonardoMsg: Message = {
          id: `l_${Date.now()}`,
          sender: 'leonardo',
          text: data.reply || 'Aquí estoy contigo. Respira hondo y recuerda que el descanso es un acto de rendición pacífica.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, leonardoMsg]);
        audioCues.playChime(528, 0.3);
      } else {
        throw new Error('API response not ok');
      }
    } catch (err) {
      console.warn('Chat error, using empathetic fallback:', err);
      const fallbackMsg: Message = {
        id: `l_${Date.now()}`,
        sender: 'leonardo',
        text: `Querida ${userName}, siente cómo tu cuerpo se sostiene en la cama. No tienes que forzar el sueño en este instante; permítete el alivio de permanecer en reposo sin expectativas. Inhala suavemente en 4 segundos, retén en 7 y exhala en 8. Tu biología sabe cómo sanar cuando le das permiso para descansar.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="leonardo-coach-container" className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border border-indigo-900/60 rounded-3xl p-5 sm:p-6 shadow-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div
            onClick={onOpenProfile}
            className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-950 cursor-pointer hover:scale-105 transition-transform"
            title="Ver perfil de Leonardo"
          >
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-400 font-extrabold text-base font-display">
              L
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-100 font-display">Leonardo</h2>
              <span className="px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-800/80 text-[10px] font-bold text-cyan-300">
                Director CWO • Guía IA
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {LEONARDO_PROFILE.institution} • {LEONARDO_PROFILE.techPartner}
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-indigo-950">
          <Moon className="w-3.5 h-3.5 text-cyan-400" />
          <span>Arquetipo: {dominantArchetype.split(' ')[0]}</span>
        </div>
      </div>

      {/* Quick Prompts Carousel */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          Consultas Frecuentes con Leonardo:
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-indigo-950 text-slate-300 hover:text-cyan-300 text-xs whitespace-nowrap transition-colors flex items-center gap-1.5 shrink-0"
            >
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>{prompt}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Messages Container */}
      <div className="bg-slate-900/90 border border-indigo-950 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-md h-[420px] overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isLeonardo = msg.sender === 'leonardo';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isLeonardo ? 'justify-start' : 'justify-end'}`}
            >
              {isLeonardo && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-[11px] font-extrabold text-slate-950 shrink-0 mt-0.5 shadow-md">
                  L
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  isLeonardo
                    ? 'bg-slate-950/80 border border-indigo-900/60 text-slate-200 shadow-md'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-md shadow-indigo-950'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <span
                  className={`block text-[10px] mt-1.5 text-right ${
                    isLeonardo ? 'text-slate-500' : 'text-indigo-200'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>

              {!isLeonardo && (
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-950 border border-indigo-700 flex items-center justify-center text-cyan-400 text-xs">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-indigo-950 text-xs text-slate-400 italic">
              Leonardo está calibrando la respuesta somática...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          placeholder="Escribe tus sensaciones o consulta a Leonardo..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isLoading}
          className="flex-1 px-4 py-3.5 rounded-2xl bg-slate-900/90 border border-indigo-950 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-slate-100 text-xs sm:text-sm placeholder-slate-500 outline-none transition-all shadow-inner"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-40 text-white font-bold text-sm shadow-xl shadow-indigo-950 flex items-center justify-center gap-1.5 transition-all"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Enviar</span>
        </button>
      </form>
    </div>
  );
}
