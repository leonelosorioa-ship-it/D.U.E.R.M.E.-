import { useState, useEffect } from 'react';
import { SOUND_PRESETS } from '../questions';
import { SoundPreset } from '../types';
import { audioCues } from '../utils/audioCues';
import {
  Play,
  Pause,
  Square,
  Headphones,
  Moon,
  Sparkles,
  Waves,
  CloudRain,
  HeartHandshake,
  Volume2,
  Timer,
  ShieldCheck,
} from 'lucide-react';

interface SoundTherapyProps {
  initialPresetId?: string;
}

export function SoundTherapy({ initialPresetId }: SoundTherapyProps) {
  const [activePreset, setActivePreset] = useState<SoundPreset>(() => {
    const found = SOUND_PRESETS.find((p) => p.id === initialPresetId);
    return found || SOUND_PRESETS[0];
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [selectedDurationMin, setSelectedDurationMin] = useState(30);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  useEffect(() => {
    const status = audioCues.getStatus();
    setIsPlaying(status.isPlaying);
    if (status.isPlaying && status.presetId) {
      const found = SOUND_PRESETS.find((p) => p.id === status.presetId);
      if (found) setActivePreset(found);
      setRemainingSeconds(status.remainingSeconds);
    }

    audioCues.setCallbacks(
      (secondsLeft) => {
        setRemainingSeconds(secondsLeft);
      },
      () => {
        setIsPlaying(false);
        setRemainingSeconds(0);
      }
    );
  }, []);

  const handlePlayToggle = (preset?: SoundPreset) => {
    const target = preset || activePreset;
    if (isPlaying && activePreset.id === target.id) {
      audioCues.stop();
      setIsPlaying(false);
      return;
    }

    setActivePreset(target);
    setIsPlaying(true);

    if (target.type === 'delta' || target.type === 'theta') {
      audioCues.playBinaural(target.carrierFreq, target.beatFreq, target.id, selectedDurationMin);
    } else if (target.type === 'pink') {
      audioCues.playPinkNoise(target.id, selectedDurationMin);
    } else if (target.type === 'solfeggio') {
      audioCues.playBinaural(target.carrierFreq, 0, target.id, selectedDurationMin);
    } else {
      audioCues.playRainNoise(target.id, selectedDurationMin);
    }
  };

  const handleStop = () => {
    audioCues.stop();
    setIsPlaying(false);
    setRemainingSeconds(0);
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    audioCues.setVolume(newVol);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const getPresetIcon = (icon: string) => {
    switch (icon) {
      case 'Moon': return Moon;
      case 'Sparkles': return Sparkles;
      case 'Waves': return Waves;
      case 'CloudRain': return CloudRain;
      case 'HeartHandshake': return HeartHandshake;
      default: return Waves;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header & Headphone Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-700/50 text-cyan-300 text-xs font-semibold">
          <Headphones className="w-3.5 h-3.5 text-cyan-400" />
          <span>Neuroacústica Nativa Web Audio API (Sin Archivos Externos)</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-100 font-display">
          Terapia Sonora & Frecuencias Somáticas
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          Generación en tiempo real de ondas binaurales puras para desacelerar la corteza cerebral hacia frecuencias Delta (0.5 - 4 Hz) y Theta (4 - 8 Hz).
        </p>
      </div>

      {/* Main Interactive Player Box */}
      <div className="bg-slate-900/90 border border-indigo-950 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-md relative overflow-hidden">
        {/* Animated Sound Wave Glow */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-cyan-500/5 via-indigo-500/10 to-transparent pointer-events-none transition-opacity duration-700 ${
            isPlaying ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Current Active Sound Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-indigo-950/80 relative z-10">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
              {isPlaying ? 'Reproduciendo Ahora' : 'Pista Seleccionada'}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 font-display">
              {activePreset.name}
            </h2>
            <p className="text-xs text-slate-400">{activePreset.subtitle}</p>
          </div>

          {/* Timer Display */}
          <div className="flex items-center gap-3">
            {isPlaying && (
              <div className="px-3.5 py-1.5 rounded-xl bg-slate-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-sm font-bold flex items-center gap-1.5 shadow-inner">
                <Timer className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>{formatTime(remainingSeconds)}</span>
              </div>
            )}

            <button
              onClick={() => handlePlayToggle()}
              className={`p-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-xl ${
                isPlaying
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-950/50'
                  : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-indigo-950'
              }`}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-slate-950" /> : <Play className="w-5 h-5 fill-white" />}
              <span className="text-xs">{isPlaying ? 'Pausar' : 'Iniciar Sesión'}</span>
            </button>

            {isPlaying && (
              <button
                onClick={handleStop}
                className="p-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Detener Audio"
              >
                <Square className="w-4 h-4 fill-slate-300" />
              </button>
            )}
          </div>
        </div>

        {/* Controls: Volume & Duration */}
        <div className="grid sm:grid-cols-2 gap-4 relative z-10">
          {/* Volume Slider */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-indigo-950 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-cyan-400" />
                Volumen Suave
              </span>
              <span className="font-mono text-[11px] text-slate-400">{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <p className="text-[10px] text-slate-400">Recomendado: 30-50% para descanso profundo.</p>
          </div>

          {/* Sleep Timer Selector */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-indigo-950 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
              <span className="flex items-center gap-1.5">
                <Timer className="w-4 h-4 text-cyan-400" />
                Temporizador de Apagado
              </span>
              <span className="text-[11px] text-cyan-400 font-bold">{selectedDurationMin} min</span>
            </div>

            <div className="grid grid-cols-5 gap-1.5">
              {[15, 30, 45, 60, 90].map((min) => (
                <button
                  key={min}
                  onClick={() => setSelectedDurationMin(min)}
                  className={`py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                    selectedDurationMin === min
                      ? 'bg-cyan-950 border-cyan-400 text-cyan-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {min}m
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-400">Se desvanece suavemente sin sobresaltos.</p>
          </div>
        </div>

        {/* Headphone Advisory */}
        <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-800/40 flex items-center gap-3 text-xs text-slate-300">
          <Headphones className="w-5 h-5 text-cyan-400 shrink-0" />
          <span>
            <strong>Recomendación Neurofisiológica:</strong> Para las pistas Delta y Theta, utiliza auriculares estéreo. El cerebro crea el tercer tono (onda binaural) por la diferencia entre ambos oídos.
          </span>
        </div>
      </div>

      {/* Preset Library List */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
          Biblioteca de Frecuencias Circadianas
        </h3>

        <div className="grid sm:grid-cols-2 gap-4">
          {SOUND_PRESETS.map((preset) => {
            const Icon = getPresetIcon(preset.icon);
            const isThisPlaying = isPlaying && activePreset.id === preset.id;
            const isSelected = activePreset.id === preset.id;

            return (
              <div
                key={preset.id}
                onClick={() => handlePlayToggle(preset)}
                className={`p-5 rounded-3xl border cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                  isThisPlaying
                    ? 'bg-gradient-to-r from-cyan-950/60 to-indigo-950/60 border-cyan-400 ring-2 ring-cyan-500/20 text-slate-100 shadow-xl shadow-cyan-950/40'
                    : isSelected
                    ? 'bg-slate-900/90 border-indigo-800 text-slate-200'
                    : 'bg-slate-950/60 border-indigo-950/80 text-slate-300 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-950/80 border border-indigo-800/60 flex items-center justify-center text-cyan-400">
                      <Icon className="w-5 h-5" />
                    </div>

                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
                      {preset.recommendedDuration}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-slate-100 font-display">
                      {preset.name}
                    </h4>
                    <p className="text-xs text-indigo-300 font-medium">{preset.subtitle}</p>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {preset.description}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-indigo-950/60 text-xs font-semibold text-cyan-400">
                  <span className="flex items-center gap-1.5">
                    {isThisPlaying ? 'Sonando en Vivo' : 'Seleccionar Frecuencia'}
                  </span>
                  <div className="w-7 h-7 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                    {isThisPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
