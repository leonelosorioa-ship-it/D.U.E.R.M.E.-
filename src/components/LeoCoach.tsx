import React, { useState, useRef, useEffect, FormEvent } from 'react';
import { Send, Bot, User, Sparkles, Loader2, Moon, Compass, ShieldCheck, HeartPulse, RefreshCw } from 'lucide-react';
import { LEO_PROFILE } from '../data/leoProfile';

interface Message {
  id: string;
  sender: 'leo' | 'user';
  text: string;
  timestamp: string;
}

interface LeoCoachProps {
  userName: string;
  dominantArchetype?: string;
  activeDay?: number;
  onOpenProfile: () => void;
}

export function LeoCoach({
  userName,
  dominantArchetype = 'Mente en Hipervigilancia',
  activeDay = 1,
  onOpenProfile,
}: LeoCoachProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome_1',
      sender: 'leo',
      text: `Buenas noches, ${userName}. Soy Leo, Mentor de Vínculos y Conexión Digital en Tu Poder Mental™ Mujer. Mi propósito es brindarte acompañamiento estratégico y tecnológico para optimizar tus relaciones, tu proyecto de vida y tu descanso reparador. ¿Qué pensamientos, tensión o dudas circulan por tu mente en este momento?`,
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
    'Mi mente no para de rumiar pendientes y proyectos',
    'Me desperté a las 3:00 AM y no logro volver a conciliar el sueño',
    'Siento sobrecarga mental por pantallas, mensajes y autoexigencia',
    '¿Qué frecuencia binaural y técnica de respiración aplico hoy?',
    '¿Cómo tomo el magnesio y qué infusión me aconsejas?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          userName,
          activeDay,
          primaryStruggle: dominantArchetype,
          chatHistory: messages.map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            content: m.text,
          })),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const botReply: Message = {
          id: `bot_${Date.now()}`,
          sender: 'leo',
          text: data.reply || 'Respira hondo... tu sistema nervioso está soltando el control y preparándose para regenerarse.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botReply]);
      } else {
        throw new Error('Chat API offline');
      }
    } catch (err) {
      // Fallback message
      const fallbackReply: Message = {
        id: `fallback_${Date.now()}`,
        sender: 'leo',
        text: `Comprendo profundamente lo que experimentas, ${userName}. Cuando la sobrecarga y la autoexigencia saturan tu mente, el nervio vago necesita una señal física de seguridad. Por favor, inhala en 4 tiempos por la nariz, sostén 7 segundos y exhala suavemente en 8 tiempos por la boca durante 3 ciclos. Permítete soltar el control: tu descanso es el cimiento de tu proyecto de vida.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  return (
    <div className="bg-slate-900 border border-indigo-900/80 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[650px] max-h-[82vh]">
      {/* Coach Header */}
      <div className="p-4 sm:p-5 border-b border-indigo-950 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            onClick={onOpenProfile}
            className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-950 cursor-pointer hover:scale-105 transition-transform"
            title="Ver perfil de Leo"
          >
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-400 font-extrabold text-base font-display">
              L
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-100 font-display">Leo</h2>
              <span className="px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-800/80 text-[10px] font-bold text-cyan-300">
                Mentor de Vínculos y Conexión Digital
              </span>
            </div>
            <p className="text-xs text-slate-400 line-clamp-1">
              {LEO_PROFILE.brandMotto}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenProfile}
          className="text-xs font-bold text-cyan-400 hover:text-cyan-300 px-3 py-1.5 rounded-xl bg-cyan-950/60 border border-cyan-800/60 transition-colors whitespace-nowrap hidden sm:inline-block"
        >
          Ver Perfil
        </button>
      </div>

      {/* Quick Prompts Carousel */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          Consultas Frecuentes con Leo:
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="text-[11px] text-slate-300 hover:text-cyan-300 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-indigo-950 hover:border-cyan-500/50 transition-all whitespace-nowrap shrink-0 shadow-sm"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 text-xs sm:text-sm custom-scrollbar bg-slate-950/40">
        {messages.map((msg) => {
          const isLeo = msg.sender === 'leo';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isLeo ? 'justify-start' : 'justify-end'}`}
            >
              {isLeo && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 shrink-0 shadow-md">
                  <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-cyan-400 font-extrabold text-xs">
                    L
                  </div>
                </div>
              )}

              <div
                className={`max-w-[82%] sm:max-w-[75%] p-4 rounded-3xl space-y-1.5 shadow-md leading-relaxed ${
                  isLeo
                    ? 'bg-slate-900/90 border border-indigo-950 text-slate-200 rounded-tl-sm'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-sm'
                }`}
              >
                <div className="flex items-center justify-between gap-3 text-[10px]">
                  <span className="font-bold opacity-80">
                    {isLeo ? 'Leo' : userName}
                  </span>
                  <span
                    className={
                      isLeo ? 'text-slate-500' : 'text-indigo-200'
                    }
                  >
                    {msg.timestamp}
                  </span>
                </div>
                <p className="whitespace-pre-line text-xs sm:text-sm">{msg.text}</p>
              </div>

              {!isLeo && (
                <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md font-bold text-xs">
                  {userName.charAt(0) || 'U'}
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-3 animate-pulse">
            <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-indigo-950 text-xs text-slate-400 italic">
              Leo está preparando su orientación estratégica...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form
        onSubmit={handleFormSubmit}
        className="p-3 sm:p-4 border-t border-indigo-950 bg-slate-900/90 flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Escribe tus sensaciones o consulta a Leo..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isLoading}
          className="flex-1 bg-slate-950 border border-indigo-950 focus:border-cyan-500 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-colors"
        />

        <button
          type="submit"
          disabled={isLoading || !inputText.trim()}
          className="p-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-40 text-slate-950 font-bold transition-all shadow-md shadow-cyan-950 shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
