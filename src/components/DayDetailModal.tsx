import { useState, FormEvent } from 'react';
import { DayPlan, DayEvaluation } from '../types';
import { audioEngine } from '../utils/audioEngine';
import { X, Sparkles, CheckCircle2, Moon, Wind, Brain, Waves, Play, HeartHandshake, ShieldCheck, ArrowRight, Loader2, Star } from 'lucide-react';

interface DayDetailModalProps {
  day: DayPlan;
  isCompleted: boolean;
  isUnlocked: boolean;
  evaluation?: DayEvaluation;
  onClose: () => void;
  onCompleteDay: (dayNumber: number, reflection: string, sleepQuality: number, energyMorning: number) => Promise<any>;
  onOpenSoundPreset?: (presetId: string) => void;
}

export function DayDetailModal({
  day,
  isCompleted,
  isUnlocked,
  evaluation,
  onClose,
  onCompleteDay,
  onOpenSoundPreset,
}: DayDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'guide' | 'reflection'>('guide');
  const [tasks, setTasks] = useState(day.tasks);
  const [reflection, setReflection] = useState(evaluation?.userReflection || '');
  const [sleepQuality, setSleepQuality] = useState(evaluation?.sleepQualityRating || 4);
  const [energyMorning, setEnergyMorning] = useState(evaluation?.energyMorningRating || 3);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiFeedback, setAiFeedback] = useState(evaluation?.aiFeedback);

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };

  const handlePlayRecommendedSound = () => {
    const preset = day.soundTherapyPreset;
    if (preset.id === 'preset_delta_15' || preset.id === 'preset_theta_45' || preset.id === 'preset_solfeggio_528') {
      audioEngine.playBinaural(preset.id === 'preset_solfeggio_528' ? 528 : (preset.id === 'preset_delta_15' ? 216 : 210), preset.frequencyHz, preset.id, 30);
    } else if (preset.id === 'preset_pink_noise') {
      audioEngine.playPinkNoise(preset.id, 45);
    } else {
      audioEngine.playRainNoise(preset.id, 30);
    }
  };

  const handleSubmitEvaluation = async (e: FormEvent) => {
    e.preventDefault();
    if (!reflection.trim()) return;

    setIsSubmitting(true);
    try {
      const feedback = await onCompleteDay(day.dayNumber, reflection, sleepQuality, energyMorning);
      if (feedback) {
        setAiFeedback(feedback);
      }
      setActiveTab('reflection');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-slate-900 border border-indigo-900/80 rounded-3xl max-w-2xl w-full my-auto shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-indigo-950/80 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-[11px] font-bold">
                Día {day.dayNumber} de 7
              </span>
              <span className="text-xs text-indigo-300 font-semibold">{day.theme}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-100 font-display">{day.title}</h2>
            <p className="text-xs text-slate-400 italic">"{day.tagline}"</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-indigo-950 px-6 bg-slate-950/40">
          <button
            onClick={() => setActiveTab('guide')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'guide'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>Guía & Protocolo Práctico</span>
          </button>
          <button
            onClick={() => setActiveTab('reflection')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'reflection'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{isCompleted ? 'Evaluación Clara Luz' : 'Completar Día & Feedback IA'}</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
          {activeTab === 'guide' ? (
            <>
              {/* Objective */}
              <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-900/50 space-y-1.5">
                <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">Objetivo Circadiano</span>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                  {day.objective}
                </p>
              </div>

              {/* Somatic Technique */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-indigo-950 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                    <Wind className="w-4 h-4 text-cyan-400" />
                    {day.somaticTechnique.name}
                  </span>
                  <span className="text-[10px] text-slate-400 px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800">
                    {day.somaticTechnique.recommendedTime}
                  </span>
                </div>

                <ol className="space-y-2 text-xs text-slate-300">
                  {day.somaticTechnique.instructions.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2 leading-relaxed">
                      <span className="w-5 h-5 rounded-full bg-indigo-900/60 text-cyan-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Cognitive Reframe */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-indigo-950 space-y-3">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Brain className="w-4 h-4 text-indigo-400" />
                  Reencuadre Neurocognitivo
                </span>

                <div className="grid sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/30 space-y-1">
                    <span className="text-[10px] font-bold text-rose-400">Mito / Pensamiento Ansioso:</span>
                    <p className="text-rose-200/80 italic text-[11px]">"{day.cognitiveReframe.myth}"</p>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/30 space-y-1">
                    <span className="text-[10px] font-bold text-emerald-400">Verdad Somática & Científica:</span>
                    <p className="text-emerald-200/90 font-medium text-[11px]">{day.cognitiveReframe.truth}</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-indigo-900/20 border border-indigo-700/40 text-center space-y-1">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Afirmación de Entrega:</span>
                  <p className="text-xs text-indigo-200 font-semibold italic">"{day.cognitiveReframe.affirmation}"</p>
                </div>
              </div>

              {/* Sound Recommendation */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-950 border border-indigo-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400">
                    <Waves className="w-4 h-4" />
                    <span>Frecuencia del Día: {day.soundTherapyPreset.name}</span>
                  </div>
                  <p className="text-xs text-slate-400">{day.soundTherapyPreset.description}</p>
                </div>

                <button
                  onClick={handlePlayRecommendedSound}
                  className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shrink-0 transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Activar Audio</span>
                </button>
              </div>

              {/* Task Checklist */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Checklist del Día
                </span>
                <div className="space-y-2">
                  {tasks.map(task => (
                    <div
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 hover:border-slate-700 cursor-pointer flex items-center gap-3 transition-colors"
                    >
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                        task.completed ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-slate-700'
                      }`}>
                        {task.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                      <div className="flex-1">
                        <span className={`text-xs font-medium ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                          {task.title}
                        </span>
                        <p className="text-[11px] text-slate-400">{task.description}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{task.durationMinutes} min</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hypnagogic Anchor */}
              <div className="text-center p-3 rounded-xl bg-slate-950/80 border border-indigo-950">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Anclaje Hipnagógico para dormir:</span>
                <span className="text-xs text-indigo-300 font-bold italic">"{day.hypnagogicAnchor}"</span>
              </div>
            </>
          ) : (
            /* Reflection & AI Feedback Tab */
            <div className="space-y-6">
              {/* Existing AI feedback display */}
              {aiFeedback && (
                <div className="bg-gradient-to-br from-indigo-950/90 via-slate-900 to-slate-950 border border-cyan-500/40 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 font-bold text-xs">
                      CL
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                        <span>Devolución de Clara Luz</span>
                        <span className="text-[10px] font-normal text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800/60">
                          Mentora D.U.E.R.M.E.™
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-400">Análisis somático y psicológico del Día {day.dayNumber}</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs leading-relaxed">
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-indigo-950 space-y-1">
                      <span className="font-bold text-cyan-400 text-[11px] flex items-center gap-1">
                        <HeartHandshake className="w-3.5 h-3.5" />
                        Observación Somática:
                      </span>
                      <p className="text-slate-200">{aiFeedback.somaticObservation}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/60 border border-indigo-950 space-y-1">
                      <span className="font-bold text-indigo-300 text-[11px] flex items-center gap-1">
                        <Brain className="w-3.5 h-3.5" />
                        Acompañamiento Psicológico:
                      </span>
                      <p className="text-slate-200">{aiFeedback.psychologicalInsight}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/60 border border-indigo-950 space-y-1">
                      <span className="font-bold text-amber-300 text-[11px]">Recomendación para el Siguiente Ciclo:</span>
                      <p className="text-slate-200">{aiFeedback.nextStepRecommendation}</p>
                    </div>

                    <p className="text-center italic font-semibold text-cyan-300 pt-1 text-xs">
                      "{aiFeedback.closingAffirmation}"
                    </p>
                  </div>
                </div>
              )}

              {/* Reflection Form */}
              <form onSubmit={handleSubmitEvaluation} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-200 block">
                    ¿Cómo ha respondido tu cuerpo y mente a las prácticas de hoy?
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Escribe qué sentiste al aplicar el protocolo, si lograste soltar los pensamientos y cómo sientes tu nivel de calma..."
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                    className="w-full p-4 rounded-2xl bg-slate-950/70 border border-indigo-950 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-slate-100 text-xs leading-relaxed outline-none"
                  />
                </div>

                {/* Ratings */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-indigo-950 space-y-2">
                    <span className="text-xs font-semibold text-slate-300 block">Calidad de Sueño / Calma (1-5)</span>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setSleepQuality(star)}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                            sleepQuality >= star
                              ? 'bg-amber-500/20 border-amber-500/60 text-amber-300'
                              : 'bg-slate-900 border-slate-800 text-slate-600'
                          }`}
                        >
                          ★ {star}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-indigo-950 space-y-2">
                    <span className="text-xs font-semibold text-slate-300 block">Claridad / Energía Matutina (1-5)</span>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setEnergyMorning(star)}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                            energyMorning >= star
                              ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300'
                              : 'bg-slate-900 border-slate-800 text-slate-600'
                          }`}
                        >
                          ★ {star}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !reflection.trim()}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-50 text-white font-bold text-xs shadow-xl shadow-indigo-950 flex items-center justify-center gap-2 transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Clara Luz está analizando tu día...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-cyan-300" />
                      <span>{isCompleted ? 'Actualizar Reflexión y Evaluación' : 'Completar Día y Recibir Devolución Somática'}</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-indigo-950 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Asimilación Circadiana de 24 horas
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
