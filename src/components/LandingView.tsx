import { Moon, Sparkles, Wind, Brain, ShieldCheck, Waves, ArrowRight, CheckCircle2, Bed, HeartHandshake, Bot, Clock } from 'lucide-react';

interface LandingViewProps {
  onStartScan: () => void;
  hasPreviousProgress?: boolean;
  onResume?: () => void;
}

export function LandingView({ onStartScan, hasPreviousProgress, onResume }: LandingViewProps) {
  const pillars = [
    { icon: Bed, title: 'Insomnio & Latencia', desc: 'Protocolo de freno cognitivo para reducir el tiempo en conciliar el sueño de horas a minutos.' },
    { icon: Moon, title: 'Rutinas Nocturnas & Higiene', desc: 'Santuario del sueño, termorregulación y sincronización circadiana natural de la melatonina.' },
    { icon: Wind, title: 'Técnicas de Relajación 4-7-8', desc: 'Respiración somática para estimular el nervio vago y desacelerar la frecuencia cardíaca.' },
    { icon: Waves, title: 'Frecuencias Binaurales Nativas', desc: 'Ondas Delta 1.5Hz y Theta 4.5Hz sintetizadas en tiempo real con Web Audio API.' },
    { icon: Bot, title: 'Mentora Clara Luz con IA', desc: 'Devoluciones somáticas y psicológicas empáticas tras cada jornada de asimilación circadiana.' },
    { icon: Clock, title: 'Candado Circadiano de 24h', desc: 'Asimilación neurológica progresiva entre días para consolidar hábitos neuroplásticos duraderos.' },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-12 text-center max-w-4xl mx-auto px-4">
        {/* Subtle decorative glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-[500px] h-80 sm:h-[500px] bg-gradient-to-tr from-indigo-900/30 via-blue-800/20 to-cyan-500/20 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-700/50 text-indigo-200 text-xs font-semibold mb-6 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Ecosistema Tu Poder Mental™ Mujer</span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-slate-100 tracking-tight leading-[1.15] font-display">
          Recupera el sueño para <br />
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
            recuperar tu energía vital.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          <strong className="text-slate-100 font-semibold">D.U.E.R.M.E.™</strong> es el sistema inteligente de descanso mental y recuperación somática. Dormir bien no es un lujo: es el pilar sagrado de tu bienestar físico, mental y emocional.
        </p>

        {/* Transition Promise Box */}
        <div className="mt-8 grid sm:grid-cols-2 gap-3 max-w-2xl mx-auto bg-slate-900/80 border border-indigo-950 rounded-2xl p-4 text-left backdrop-blur-sm">
          <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-900/30 space-y-1">
            <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">Punto de Partida</span>
            <p className="text-xs text-rose-200/90 italic">
              "Llevo mucho tiempo sin descansar realmente; me acuesto agotada y despierto sin energía."
            </p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-900/30 space-y-1">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Tu Nueva Realidad</span>
            <p className="text-xs text-emerald-200/90 font-medium">
              "Estoy recuperando hábitos saludables que favorecen un descanso profundo y reparador."
            </p>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onStartScan}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-base shadow-xl shadow-indigo-950/60 flex items-center justify-center gap-2 group transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Comenzar Escaneo de Sueño</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          {hasPreviousProgress && onResume && (
            <button
              onClick={onResume}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-indigo-800/40 text-indigo-300 font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <Moon className="w-4 h-4 text-cyan-400" />
              <span>Continuar Mi Hoja de Ruta</span>
            </button>
          )}
        </div>

        <p className="mt-3 text-xs text-slate-400">
          ✨ Test clínico y somático gratuito de 2 minutos • Sin registro previo requerido
        </p>
      </section>

      {/* 6 Specialized Core Pillars */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 font-display">
            Especializado en la Arquitectura Biológica del Descanso
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Integra neurociencia somática, frecuencias binaurales puras y acompañamiento psicológico empático.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-900/60 border border-indigo-950/80 hover:border-indigo-800/60 transition-all space-y-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-950/90 border border-indigo-800/50 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform shadow-md shadow-indigo-950">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-100">{pillar.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{pillar.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How the 7-day methodology works */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="bg-gradient-to-br from-indigo-950/50 via-slate-900/90 to-slate-950 border border-indigo-900/40 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950 border border-cyan-500/30 text-cyan-400">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">La Metodología Circadiana de 7 Días</h3>
              <p className="text-xs text-slate-400">¿Por qué existe un candado de 24 horas entre cada día?</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 pt-2">
            <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
              <span className="text-cyan-400 font-bold text-xs">1. Descompresión</span>
              <p className="text-xs text-slate-300">
                Aprenderás a soltar la memoria de trabajo y desacelerar la corteza prefrontal antes de la cama.
              </p>
            </div>
            <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
              <span className="text-indigo-300 font-bold text-xs">2. Asimilación 24h</span>
              <p className="text-xs text-slate-300">
                Tu cerebro necesita experimentar una noche completa con el nuevo estímulo para consolidar la neuroplasticidad.
              </p>
            </div>
            <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
              <span className="text-emerald-400 font-bold text-xs">3. Informe Clara Luz</span>
              <p className="text-xs text-slate-300">
                Recibe retroalimentación somática y psicológica personalizada de tu mentora al completar cada práctica.
              </p>
            </div>
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={onStartScan}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-900/40 inline-flex items-center gap-2 transition-colors"
            >
              <span>Comenzar Evaluación Inicial</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
