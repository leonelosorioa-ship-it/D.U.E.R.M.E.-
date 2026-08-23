import { Moon, Sparkles, ArrowRight, Brain, Wind, Headphones, ShieldCheck, Heart, Star } from 'lucide-react';
import { audioCues } from '../utils/audioCues';

interface LandingHeroProps {
  onStartQuiz: () => void;
  onOpenSound: () => void;
  onOpenProfile: () => void;
  hasPreviousProgress?: boolean;
  onContinueProgress?: () => void;
}

export function LandingHero({
  onStartQuiz,
  onOpenSound,
  onOpenProfile,
  hasPreviousProgress = false,
  onContinueProgress,
}: LandingHeroProps) {
  const handleStart = () => {
    audioCues.playChime(528, 0.4);
    onStartQuiz();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-12">
      {/* Hero Header */}
      <div className="text-center space-y-5">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-950/90 border border-indigo-700/60 text-indigo-200 text-xs font-semibold shadow-lg shadow-indigo-950/50">
          <Moon className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400/20" />
          <span>Tu Poder Mental™ Mujer • Mentor: Leo</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-100 font-display tracking-tight leading-tight">
          Recupera el sueño para{' '}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
            recuperar tu energía.
          </span>
        </h1>

        <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Acompañamiento estratégico y tecnológico para optimizar tus relaciones y tu proyecto de vida. D.U.E.R.M.E.™ es el sistema inteligente diseñado para desactivar la rumiación nocturna y devolverte un descanso profundo.
        </p>

        {/* CTAs */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleStart}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-indigo-950/70 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
          >
            <span>Iniciar Escaneo Somático (7 Preguntas)</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {hasPreviousProgress && onContinueProgress && (
            <button
              onClick={onContinueProgress}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900/90 border border-indigo-800 text-cyan-300 hover:bg-slate-800 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <span>Continuar Mi Programa de 7 Días</span>
            </button>
          )}

          <button
            onClick={onOpenSound}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-950/80 border border-indigo-950 text-slate-300 hover:text-cyan-300 hover:border-indigo-800 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Headphones className="w-4 h-4 text-cyan-400" />
            <span>Escuchar Frecuencias Delta</span>
          </button>
        </div>
      </div>

      {/* 4 Specialized Pillars Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-indigo-950 space-y-2.5 backdrop-blur-md">
          <div className="w-10 h-10 rounded-2xl bg-indigo-950 border border-indigo-800 flex items-center justify-center text-cyan-400">
            <Brain className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-100 font-display">
            Desactivación de Cortisol
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Neutraliza la hipervigilancia de la corteza prefrontal y el hábito de rumiar en la cama.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/80 border border-indigo-950 space-y-2.5 backdrop-blur-md">
          <div className="w-10 h-10 rounded-2xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
            <Headphones className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-100 font-display">
            Neuroacústica Pura
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Ondas binaurales Delta (1.5 Hz), Theta y Ruido Rosa generadas en tiempo real.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/80 border border-indigo-950 space-y-2.5 backdrop-blur-md">
          <div className="w-10 h-10 rounded-2xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400">
            <Wind className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-100 font-display">
            Freno Parasimpático
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Respiración 4-7-8 y técnica militar para relajar mandíbula, cuello y tórax.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/80 border border-indigo-950 space-y-2.5 backdrop-blur-md">
          <div className="w-10 h-10 rounded-2xl bg-amber-950 border border-amber-800 flex items-center justify-center text-amber-300">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-100 font-display">
            Asimilación 24 Horas
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Protocolo de 7 noches con candado circadiano para una neuroplasticidad duradera.
          </p>
        </div>
      </div>

      {/* Mentor Leo Spotlight */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-950/90 via-slate-900 to-indigo-950 border border-indigo-800/60 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 p-0.5 shadow-xl shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-400 font-extrabold text-2xl font-display">
              L
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-100 font-display">
                Guiada por Leo
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-bold border border-cyan-800">
                Mentor de Vínculos y Conexión Digital
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              "Acompañamiento estratégico y tecnológico para optimizar tus relaciones y tu proyecto de vida. Dormir bien es el cimiento de tu equilibrio interior."
            </p>
          </div>
        </div>

        <button
          onClick={onOpenProfile}
          className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors whitespace-nowrap shrink-0 border border-indigo-900/60"
        >
          Conocer a Leo
        </button>
      </div>
    </div>
  );
}
