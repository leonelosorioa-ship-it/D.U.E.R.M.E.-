import { useState, useEffect } from 'react';
import { SOUND_PRESETS } from '../questions';
import { SoundPreset } from '../types';
import { audioEngine } from '../utils/audioEngine';
import { Play, Square, Volume2, Headphones, Timer, Sparkles, Moon, Waves, CloudRain, HeartHandshake } from 'lucide-react';

interface SoundTherapyProps {
  initialPresetId?: string;
}

export function SoundTherapy({ initialPresetId }: SoundTherapyProps) {
  const [activePreset, setActivePreset] = useState<SoundPreset>(() => {
    return SOUND_PRESETS.find(p => p.id === initialPresetId) || SOUND_PRESETS[0];
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [remainingSec, setRemainingSec] = useState(0);

  useEffect(() => {
    audioEngine.setCallbacks(
      (rem) => setRemainingSec(rem),
      () => setIsPlaying(false)
    );

    const status = audioEngine.getStatus();
    setIsPlaying(status.isPlaying);
    if (status.presetId) {
      const found = SOUND_PRESETS.find(p => p.id === status.presetId);
      if (found) setActivePreset(found);
    }
  }, []);

  const handleTogglePlay = (preset: SoundPreset) => {
    if (isPlaying && activePreset.id === preset.id) {
      audioEngine.stop();
      setIsPlaying(false);
      return;
    }

    setActivePreset(preset);
    audioEngine.setVolume(volume);

    if (preset.type === 'delta' || preset.type === 'theta' || preset.type === 'solfeggio') {
      audioEngine.playBinaural(preset.carrierFreq, preset.beatFreq, preset.id, durationMinutes);
    } else if (preset.type === 'pink') {
      audioEngine.playPinkNoise(preset.id, durationMinutes);
    } else if (preset.type === 'rain') {
      audioEngine.playRainNoise(preset.id, durationMinutes);
    }

    setIsPlaying(true);
    setRemainingSec(durationMinutes * 60);
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    audioEngine.setVolume(newVol);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPresetIcon = (iconName: string) => {
    switch (iconName) {
      case 'Moon': return Moon;
      case 'Sparkles': return Sparkles;
      case 'Waves': return Waves;
      case 'CloudRain': return CloudRain;
      case 'HeartHandshake': return HeartHandshake;
      default: return Waves;
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header & Headphone Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-indigo-950 p-5 rounded-3xl backdrop-blur-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2 font-display">
            <Waves className="w-5 h-5 text-cyan-400" />
            <span>Frecuencias Binaurales & Acústica Terapéutica</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Motor acústico nativo Web Audio API para sincronización de ondas cerebrales.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-semibold shrink-0">
          <Headphones className="w-4 h-4 text-cyan-400" />
          <span>Usa auriculares para ondas binaurales</span>
        </div>
      </div>

      {/* Main Active Player Card */}
      <div className="bg-gradient-to-br from-indigo-950/70 via-slate-900/90 to-slate-950 border border-indigo-900/60 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Visual Pulse effect when playing */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {/* Visualizer Circle */}
            <div className="relative">
              <div
                className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all ${
                  isPlaying
                    ? 'bg-gradient-to-tr from-cyan-500 to-indigo-600 shadow-lg shadow-cyan-500/30 text-white animate-pulse'
                    : 'bg-slate-800 border border-slate-700 text-slate-400'
                }`}
              >
                {(() => {
                  const Icon = getPresetIcon(activePreset.icon);
                  return <Icon className="w-9 h-9" />;
                })()}
              </div>
              {isPlaying && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-slate-950 flex items-center justify-center animate-ping" />
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-slate-100">{activePreset.name}</span>
                {isPlaying && (
                  <span className="px-2 py-0.5 rounded-md bg-cyan-950 border border-cyan-400/40 text-[10px] font-bold text-cyan-300">
                    EN VIVO
                  </span>
                )}
              </div>
              <p className="text-xs text-indigo-300 font-medium">{activePreset.subtitle}</p>
              <p className="text-xs text-slate-400 max-w-md leading-relaxed">{activePreset.description}</p>
            </div>
          </div>

          {/* Player controls */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            {isPlaying && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-indigo-900/60 text-cyan-400 font-mono text-sm font-bold">
                <Timer className="w-4 h-4" />
                <span>{formatTime(remainingSec)}</span>
              </div>
            )}

            <button
              onClick={() => handleTogglePlay(activePreset)}
              className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xl ${
                isPlaying
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-950'
              }`}
            >
              {isPlaying ? (
                <>
                  <Square className="w-4 h-4 fill-white" />
                  <span>Pausar Terapia</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Reproducir Ahora</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Sliders and Configuration */}
        <div className="grid sm:grid-cols-2 gap-6 pt-4 border-t border-indigo-950/80">
          {/* Volume Control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1.5 font-semibold">
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                Volumen Suave ({Math.round(volume * 100)}%)
              </span>
              <span className="text-slate-500 text-[11px]">Nivel recomendado: 30-50%</span>
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
          </div>

          {/* Timer Selector */}
          <div className="space-y-2">
            <span className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
              <Timer className="w-3.5 h-3.5 text-cyan-400" />
              Temporizador de Apagado
            </span>
            <div className="flex gap-2">
              {[15, 30, 45, 60].map((mins) => (
                <button
                  key={mins}
                  onClick={() => {
                    setDurationMinutes(mins);
                    if (isPlaying) {
                      setRemainingSec(mins * 60);
                    }
                  }}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    durationMinutes === mins
                      ? 'bg-indigo-600 border-cyan-400 text-white shadow-md'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Preset Library Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
          Biblioteca de Frecuencias de Recuperación
        </h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SOUND_PRESETS.map((preset) => {
            const isThisPlaying = isPlaying && activePreset.id === preset.id;
            const isSelected = activePreset.id === preset.id;
            const Icon = getPresetIcon(preset.icon);

            return (
              <div
                key={preset.id}
                onClick={() => handleTogglePlay(preset)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 group ${
                  isThisPlaying
                    ? 'bg-indigo-900/40 border-cyan-400 ring-2 ring-cyan-500/20 shadow-lg shadow-indigo-950'
                    : isSelected
                    ? 'bg-slate-900/90 border-indigo-700/60'
                    : 'bg-slate-900/60 border-indigo-950/80 hover:border-indigo-800/60 hover:bg-slate-900/80'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-slate-950 border border-indigo-900/60 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>

                    <span className="text-[10px] font-semibold text-slate-400 px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800">
                      {preset.recommendedDuration}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-100">{preset.name}</h4>
                    <p className="text-[11px] text-cyan-300 font-medium">{preset.subtitle}</p>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {preset.description}
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-indigo-950/60 text-xs">
                  <span className="text-slate-400">
                    {preset.type === 'delta' || preset.type === 'theta' ? `${preset.beatFreq} Hz Binaural` : 'Acústica Natural'}
                  </span>

                  <span className={`font-semibold flex items-center gap-1 ${
                    isThisPlaying ? 'text-rose-400' : 'text-cyan-400 group-hover:underline'
                  }`}>
                    {isThisPlaying ? 'Detener' : 'Escuchar'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
