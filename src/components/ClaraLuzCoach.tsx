import { useState, useRef, useEffect } from 'react';
import { Send, Bot, Sparkles, User, Loader2, HeartHandshake, Moon, HelpCircle } from 'lucide-react';
import { UserLead } from '../types';

interface Message {
  id: string;
  sender: 'clara' | 'user';
  text: string;
  timestamp: string;
}

interface ClaraLuzCoachProps {
  lead?: UserLead;
  activeDay: number;
}

export function ClaraLuzCoach({ lead, activeDay }: ClaraLuzCoachProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init_1',
      sender: 'clara',
      text: `Hola ${lead?.name || 'amiga'}, soy Clara Luz, tu mentora de descanso en D.U.E.R.M.E.™ Mujer. Estoy aquí para acompañarte a despresurizar tu cuerpo, regular tu sistema nervioso y transformar tu noche en un santuario sagrado de recuperación. ¿Qué sientes en tu cuerpo o mente en este momento?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'Me desperté a las 3:00 AM y no puedo volver a dormir',
    'Siento la mandíbula apretada y el cuello rígido',
    'Tengo pensamientos en bucle sobre mis pendientes',
    '¿Cuál es el mejor ritual de infusión para hoy?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = textToSend || input;
    if (!messageText.trim() || isLoading) return;

    const userMsg: Message = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text: messageText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.text,
          userName: lead?.name || 'Mujer Guerrera',
          activeDay,
          primaryStruggle: lead?.primaryStruggle,
          chatHistory: messages.map(m => ({
            role: m.sender === 'user' ? 'user' : 'model',
            text: m.text,
          })),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const claraReply: Message = {
          id: 'clara_' + Date.now(),
          sender: 'clara',
          text: data.reply || 'Aquí estoy contigo. Respira hondo y recuerda que tu descanso es tu mayor medicina.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, claraReply]);
      } else {
        throw new Error('Chat API error');
      }
    } catch (e) {
      console.warn('AI chat error, fallback response:', e);
      const fallbackReply: Message = {
        id: 'clara_' + Date.now(),
        sender: 'clara',
        text: 'Respira profundamente, exhala despacio durante 8 segundos. Suelta el peso del cuello y los hombros. Esta noche no tienes nada que solucionar; permite que tu cuerpo descanse suavemente.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, fallbackReply]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Header */}
      <div className="bg-slate-900/90 border border-indigo-950 p-4 sm:p-5 rounded-3xl flex items-center justify-between gap-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-700 via-blue-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-950">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-300 font-bold text-sm">
              CL
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-100 text-sm sm:text-base font-display">
                Clara Luz • Mentora de Descanso
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-xs text-slate-400">Guía Somática & Neurocognitiva Tu Poder Mental™</p>
          </div>
        </div>

        <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-indigo-950 border border-indigo-800 text-[11px] font-semibold text-indigo-300">
          Día {activeDay} de Asimilación
        </span>
      </div>

      {/* Chat Container */}
      <div className="bg-slate-900/70 border border-indigo-950 rounded-3xl p-4 sm:p-6 flex flex-col h-[500px] shadow-2xl backdrop-blur-md">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((msg) => {
            const isClara = msg.sender === 'clara';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isClara ? 'justify-start' : 'justify-end'}`}
              >
                {isClara && (
                  <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    CL
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed space-y-1 shadow-md ${
                    isClara
                      ? 'bg-slate-950/80 border border-indigo-900/60 text-slate-200'
                      : 'bg-indigo-600 text-white rounded-br-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <span
                    className={`text-[10px] block text-right ${
                      isClara ? 'text-slate-500' : 'text-indigo-200'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {!isClara && (
                  <div className="w-8 h-8 rounded-full bg-indigo-950 border border-indigo-800 text-indigo-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 items-center text-xs text-slate-400 pl-2">
              <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center justify-center shrink-0">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <span className="italic">Clara Luz está sintonizando con tu descanso...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div className="pt-3 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-indigo-900/60 text-[11px] text-slate-300 shrink-0 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="pt-2 flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Pregúntale a Clara Luz sobre tu descanso, respiración o rumiación..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-2xl bg-slate-950 border border-indigo-950 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none"
          />

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 transition-colors shrink-0 shadow-lg shadow-cyan-950"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
