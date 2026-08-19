import { useState, useEffect, useRef } from 'react';
import { Wind, Play, Square, Sparkles, HeartHandshake, Info } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

type BreathTechnique = '478' | 'box' | 'resonant';

export function BreathingGuide() {
  const [technique, setTechnique] = useState<BreathTechnique>('478');
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'Inhala' | 'Retén' | 'Exhala' | 'Pausa'>('Inhala');
  const [secondsLeftInPhase, setSecondsLeftInPhase] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  const timerRef = useRef<number | null>(null);

  const configs = {
    '478': {
      name: 'Respiración Relajante 4-7-8 (Dr. Weil)',
      subtitle: 'El freno vagal por excelencia para inducir somnolencia en menos de 3 minutos.',
      phases: [
        { label: 'Inhala', duration: 4, tone: 396 },
        { label: 'Retén', duration: 7, tone: 432 },
        { label: 'Exhala', duration: 8, tone: 330 },
      ] as const,
    },
    'box': {
      name: 'Respiración Cuadrada (Box Breathing 4-4-4-4)',
      subtitle: 'Equilibra el sistema nervioso y detiene la taquicardia o ansiedad anticipatoria.',
      phases: [
        { label: 'Inhala', duration: 4, tone: 396 },
        { label: 'Retén', duration: 4, tone: 432 },
        { label: 'Exhala', duration: 4, tone: 330 },
        { label: 'Pausa', duration: 4, tone: 294 },
      ] as const,
    },
    'resonant': {
      name: 'Coherencia Cardíaca (5.5s Inhala / 5.5s Exhala)',
      subtitle: 'Sincroniza la variabilidad de la frecuencia cardíaca (HRV) con el ritmo cerebral.',
      phases: [
        { label: 'Inhala', duration: 5, tone: 396 },
        { label: 'Exhala', duration: 5, tone: 330 },
      ] as const,
    },
  };

  const currentConfig = configs[technique];

  useEffect(() => {
    if (!isActive) {
      if (timerRef.current) clearInterval(timerRef.current);
      setPhase('Inhala');
      setSecondsLeftInPhase(currentConfig.phases[0].duration);
      return;
    }

    let phaseIndex = 0;
    let secLeft = currentConfig.phases[0].duration;
    setPhase(currentConfig.phases[0].label as any);
    setSecondsLeftInPhase(secLeft);
    audioEngine.playTone(currentConfig.phases[0].tone, 0.6);

    timerRef.current = window.setInterval(() => {
      secLeft -= 1;
      if (secLeft <= 0) {
        // Next phase
        phaseIndex = (phaseIndex + 1) % currentConfig.phases.length;
        if (phaseIndex === 0) {
          setCyclesCompleted(c => c + 1);
        }
        const next = currentConfig.phases[phaseIndex];
        secLeft = next.duration;
        setPhase(next.label as any);
        audioEngine.playTone(next.tone, 0.6);
      }
      setSecondsLeftInPhase(secLeft);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, technique]);

  const handleToggle = () => {
    if (isActive) {
      setIsActive(false);
    } else {
      setCyclesCompleted(0);
      setIsActive(true);
    }
  };

  // Scale calculations for animated circle
  const getCircleScale = () => {
    if (!isActive) return 'scale-100';
    if (phase === 'Inhala') return 'scale-125 duration-[4000ms]';
    if (phase === 'Retén') return 'scale-125 duration-100';
    if (phase === 'Exhala') return 'scale-90 duration-[8000ms]';
    return 'scale-90';
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-100 font-display flex items-center justify-center gap-2">
          <Wind className="w-6 h-6 text-cyan-400" />
          <span>Guía de Respiración Somática</span>
        </h2>
        <p className="text-xs text-slate-400">
          Modula tu sistema nervioso autónomo y activa la respuesta de relajación visceral.
        </p>
      </div>

      {/* Technique Selector */}
      <div className="flex gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-indigo-950">
        {(['478', 'box', 'resonant'] as BreathTechnique[]).map((t) => (
          <button
            key={t}
            onClick={() => {
              setIsActive(false);
              setTechnique(t);
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
              technique === t
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t === '478' ? '4-7-8 Relajante' : t === 'box' ? 'Cuadrada 4x4' : 'Coherencia 5.5s'}
          </button>
        ))}
      </div>

      {/* Animated Visual Breath Stage */}
      <div className="bg-slate-900/80 border border-indigo-950 rounded-3xl p-8 sm:p-12 flex flex-col items-center justify-center space-y-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Breathing Circle */}
        <div className="relative flex items-center justify-center w-64 h-64">
          {/* Outer Ring */}
          <div
            className={`absolute inset-0 rounded-full border-2 border-dashed border-cyan-500/30 transition-transform ${
              isActive ? 'animate-spin' : ''
            }`}
            style={{ animationDuration: '24s' }}
          />

          {/* Main Expanding Ball */}
          <div
            className={`w-44 h-44 rounded-full bg-gradient-to-tr from-indigo-900 via-blue-600 to-cyan-400 flex flex-col items-center justify-center text-center p-4 shadow-2xl shadow-cyan-500/20 transform transition-all ease-in-out ${getCircleScale()}`}
          >
            <span className="text-xl font-extrabold text-white font-display tracking-wider">
              {isActive ? phase : 'Listo'}
            </span>
            <span className="text-3xl font-mono font-black text-cyan-200 mt-1">
              {isActive ? secondsLeftInPhase : '0'}s
            </span>
          </div>
        </div>

        {/* Cycle count & Controls */}
        <div className="flex flex-col items-center gap-4 w-full">
          {isActive && (
            <span className="text-xs font-semibold text-indigo-300">
              Ciclos completados: <strong className="text-cyan-400 text-sm">{cyclesCompleted}</strong>
            </span>
          )}

          <button
            onClick={handleToggle}
            className={`w-full sm:w-64 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-xl transition-all ${
              isActive
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950'
                : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-indigo-950'
            }`}
          >
            {isActive ? (
              <>
                <Square className="w-4 h-4 fill-white" />
                <span>Detener Práctica</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Iniciar Respiración</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Description Info */}
      <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-900/50 space-y-1 text-xs text-slate-300">
        <div className="flex items-center gap-1.5 font-bold text-cyan-400">
          <Info className="w-4 h-4" />
          <span>{currentConfig.name}</span>
        </div>
        <p className="leading-relaxed">{currentConfig.subtitle}</p>
      </div>
    </div>
  );
}
