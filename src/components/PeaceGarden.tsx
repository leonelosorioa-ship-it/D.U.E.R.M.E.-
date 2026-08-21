import { useState, useEffect } from 'react';
import { audioCues } from '../utils/audioCues';
import {
  Flower2,
  Sparkles,
  Wind,
  Heart,
  Moon,
  Play,
  Square,
  ShieldCheck,
  Award,
  Flame,
} from 'lucide-react';

interface PeaceGardenProps {
  gardenLevel: number;
  completedDaysCount: number;
}

export function PeaceGarden({ gardenLevel, completedDaysCount }: PeaceGardenProps) {
  // Breathing Coach State (4-7-8 method or 5.5s Heart Coherence)
  const [breathingMode, setBreathingMode] = useState<'478' | 'coherence'>('478');
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhala' | 'Retén' | 'Exhala' | 'Espera'>('Inhala');
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState(4);
  const [completedCycles, setCompletedCycles] = useState(0);

  // Intentions / Daily Gratitude Notes
  const [intentions, setIntentions] = useState<string[]>([
    'Hoy elijo soltar todo lo que escapa a mi control.',
    'Mi cuerpo es sabio y se repara mientras descanso.',
  ]);
  const [newIntention, setNewIntention] = useState('');

  // 4-7-8 Breathing Engine Loop
  useEffect(() => {
    if (!isBreathingActive) return;

    let timer: number;
    let phase = 'Inhala' as 'Inhala' | 'Retén' | 'Exhala' | 'Espera';
    let duration = breathingMode === '478' ? 4 : 5;
    setBreathPhase(phase);
    setPhaseSecondsLeft(duration);
    audioCues.playChime(528, 0.4);

    const interval = window.setInterval(() => {
      setPhaseSecondsLeft((prev) => {
        if (prev <= 1) {
          // Transition to next phase
          if (breathingMode === '478') {
            if (phase === 'Inhala') {
              phase = 'Retén';
              duration = 7;
              audioCues.playChime(432, 0.2);
            } else if (phase === 'Retén') {
              phase = 'Exhala';
              duration = 8;
              audioCues.playChime(396, 0.4);
            } else {
              phase = 'Inhala';
              duration = 4;
              setCompletedCycles((c) => c + 1);
              audioCues.playChime(528, 0.4);
            }
          } else {
            // Heart Coherence (5s Inhale, 5s Exhale)
            if (phase === 'Inhala') {
              phase = 'Exhala';
              duration = 5;
              audioCues.playChime(432, 0.3);
            } else {
              phase = 'Inhala';
              duration = 5;
              setCompletedCycles((c) => c + 1);
              audioCues.playChime(528, 0.3);
            }
          }
          setBreathPhase(phase);
          return duration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isBreathingActive, breathingMode]);

  const handleToggleBreathing = () => {
    if (isBreathingActive) {
      setIsBreathingActive(false);
      setBreathPhase('Inhala');
      setPhaseSecondsLeft(4);
    } else {
      setIsBreathingActive(true);
      setCompletedCycles(0);
    }
  };

  const handleAddIntention = () => {
    if (!newIntention.trim()) return;
    setIntentions((prev) => [newIntention.trim(), ...prev]);
    setNewIntention('');
    audioCues.playChime(528, 0.3);
  };

  const gardenStages = [
    { level: 1, title: 'Semilla Serena', desc: 'Raíces de calma sembradas en tu sistema nervioso.' },
    { level: 2, title: 'Brote Lunar', desc: 'Primeras hojas de melatonina y descanso circadiano.' },
    { level: 3, title: 'Flor de Loto Nocturna', desc: 'Equilibrio vagal y reducción del cortisol.' },
    { level: 4, title: 'Árbol de la Calma', desc: 'Santuario interior consolidado frente al estrés.' },
    { level: 5, title: 'Jardín de Paz Estelar', desc: 'Fases NREM3 profundas y regeneración celular.' },
    { level: 6, title: 'Oasis Zen del Buen Dormir', desc: 'Arquitectura del sueño sincronizada.' },
    { level: 7, title: 'Loto Cósmico Dorado', desc: 'Maestría permanente del descanso y vitalidad.' },
  ];

  const currentStage = gardenStages[Math.min(6, Math.max(0, gardenLevel - 1))];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-700/50 text-emerald-300 text-xs font-semibold">
          <Flower2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Jardín Somático & Freno Parasimpático</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-100 font-display">
          El Jardín del Sueño & Coherencia Vagal
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          Nutre tu santuario interior a medida que completas días de asimilación circadiana y activa el reflejo de relajación con respiración guiada.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Breathing Visualizer Tool */}
        <div className="bg-slate-900/90 border border-indigo-950 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-md flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Wind className="w-4 h-4" />
                Guía de Respiración Vagal
              </span>

              {/* Mode Switch */}
              <div className="flex bg-slate-950 rounded-xl p-1 border border-indigo-950">
                <button
                  onClick={() => {
                    setBreathingMode('478');
                    setIsBreathingActive(false);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                    breathingMode === '478' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400'
                  }`}
                >
                  Técnica 4-7-8
                </button>
                <button
                  onClick={() => {
                    setBreathingMode('coherence');
                    setIsBreathingActive(false);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                    breathingMode === 'coherence' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400'
                  }`}
                >
                  Coherencia 5:5
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-400">
              {breathingMode === '478'
                ? 'Inhala 4s por la nariz, retén 7s llenando tus células de calma, exhala 8s soltando la tensión.'
                : 'Inhala 5s, exhala 5s para sincronizar la variabilidad de la frecuencia cardíaca (VFC).'}
            </p>
          </div>

          {/* Animated Pulsing Ring */}
          <div className="py-8 flex flex-col items-center justify-center relative">
            <div
              className={`w-48 h-48 sm:w-56 sm:h-56 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-1000 shadow-2xl ${
                isBreathingActive
                  ? breathPhase === 'Inhala'
                    ? 'border-cyan-400 bg-cyan-950/40 scale-110 shadow-cyan-500/20'
                    : breathPhase === 'Retén'
                    ? 'border-indigo-400 bg-indigo-950/50 scale-105 shadow-indigo-500/20'
                    : 'border-emerald-400 bg-emerald-950/30 scale-90 shadow-emerald-500/20'
                  : 'border-slate-800 bg-slate-950/60 scale-100'
              }`}
            >
              {isBreathingActive ? (
                <>
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-display animate-pulse">
                    {breathPhase}
                  </span>
                  <span className="text-3xl sm:text-4xl font-extrabold text-cyan-400 font-mono mt-1">
                    {phaseSecondsLeft}s
                  </span>
                  <span className="text-[10px] text-slate-400 mt-2 font-medium">
                    Ciclos: {completedCycles}
                  </span>
                </>
              ) : (
                <div className="text-center p-4 space-y-2">
                  <Wind className="w-8 h-8 text-cyan-400 mx-auto opacity-70" />
                  <span className="text-xs text-slate-300 font-semibold block">
                    Presiona Iniciar para Desactivar la Alerta
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Trigger Button */}
          <button
            onClick={handleToggleBreathing}
            className={`w-full py-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              isBreathingActive
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-xl shadow-indigo-950'
            }`}
          >
            {isBreathingActive ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
            <span>{isBreathingActive ? 'Detener Ejercicio' : 'Iniciar Respiración Guiada'}</span>
          </button>
        </div>

        {/* Botanical Garden Progression & Intentions */}
        <div className="space-y-6">
          {/* Garden Level Card */}
          <div className="bg-slate-900/90 border border-indigo-950 rounded-3xl p-6 space-y-4 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                  <Flower2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-emerald-400 block">
                    Nivel del Jardín: {gardenLevel}/7
                  </span>
                  <h3 className="text-base font-bold text-slate-100 font-display">
                    {currentStage.title}
                  </h3>
                </div>
              </div>

              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-indigo-300">
                {completedDaysCount} Días Integrados
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {currentStage.desc}
            </p>

            {/* Stages Dots */}
            <div className="grid grid-cols-7 gap-1 pt-1">
              {gardenStages.map((s) => (
                <div
                  key={s.level}
                  className={`h-2 rounded-full transition-all ${
                    s.level <= gardenLevel
                      ? 'bg-gradient-to-r from-emerald-500 to-cyan-400 shadow-sm shadow-cyan-500/50'
                      : 'bg-slate-800'
                  }`}
                  title={s.title}
                />
              ))}
            </div>
          </div>

          {/* Hypnagogic Intentions Box */}
          <div className="bg-slate-900/90 border border-indigo-950 rounded-3xl p-6 space-y-4 shadow-xl backdrop-blur-md">
            <div className="space-y-1">
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Anclajes e Intenciones Nocturnas
              </span>
              <p className="text-xs text-slate-400">
                Graba frases de paz mental para reprogramar tu diálogo interno antes del sueño.
              </p>
            </div>

            {/* Input Form */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ej. Me permito descansar y recargarme..."
                value={newIntention}
                onChange={(e) => setNewIntention(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddIntention()}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-indigo-950 focus:border-cyan-400 text-xs text-slate-100 placeholder-slate-500 outline-none"
              />
              <button
                onClick={handleAddIntention}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors shrink-0"
              >
                Guardar
              </button>
            </div>

            {/* List */}
            <div className="space-y-2 max-h-44 overflow-y-auto">
              {intentions.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 text-xs text-slate-200 flex items-start gap-2 leading-relaxed"
                >
                  <Moon className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                  <span>"{item}"</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
