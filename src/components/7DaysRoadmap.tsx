import { useState, useEffect, FormEvent } from 'react';
import { SEVEN_DAYS_ROADMAP } from '../questions';
import { DayPlan, ProgramProgress, DayEvaluation } from '../types';
import { audioCues } from '../utils/audioCues';
import { useWhatsAppShare } from '../hooks/useWhatsAppShare';
import {
  CheckCircle2,
  Lock,
  Clock,
  Sparkles,
  ArrowRight,
  Play,
  BrainCircuit,
  Shield,
  Wind,
  Activity,
  UtensilsCrossed,
  Eye,
  Crown,
  X,
  Share2,
  Loader2,
  Brain,
  Waves,
  HeartHandshake,
  Star,
  Check,
} from 'lucide-react';

interface SevenDaysRoadmapProps {
  progress: ProgramProgress;
  getDayStatus: (dayNumber: number) => {
    isCompleted: boolean;
    isUnlocked: boolean;
    isLockedByTime: boolean;
    remainingSeconds: number;
    unlockDate?: Date;
  };
  onCompleteDay: (
    dayNumber: number,
    reflection: string,
    sleepQuality: number,
    energyMorning: number,
    dailyAnswers?: { questionId: number; selectedOptionIndex: number; score: number }[]
  ) => Promise<DayEvaluation | null>;
  onTriggerSound?: (presetId: string) => void;
}

export function SevenDaysRoadmap({
  progress,
  getDayStatus,
  onCompleteDay,
  onTriggerSound,
}: SevenDaysRoadmapProps) {
  const [selectedDay, setSelectedDay] = useState<DayPlan | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'protocol' | 'evaluation'>('protocol');
  const [now, setNow] = useState(Date.now());
  const { shareDayCompleted } = useWhatsAppShare();

  // Modal Form States
  const [tasks, setTasks] = useState<{ [taskId: string]: boolean }>({});
  const [dailyQuizAnswers, setDailyQuizAnswers] = useState<{ [qId: number]: number }>({});
  const [reflection, setReflection] = useState('');
  const [sleepQuality, setSleepQuality] = useState(4);
  const [energyMorning, setEnergyMorning] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<DayEvaluation | null>(null);

  // Live timer tick every second for HH:MM:SS
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (totalSeconds: number) => {
    if (totalSeconds <= 0) return '00:00:00';
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = Math.floor(totalSeconds % 60);
    return `${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
  };

  const getDayIcon = (iconName: string) => {
    switch (iconName) {
      case 'BrainCircuit': return BrainCircuit;
      case 'Shield': return Shield;
      case 'UtensilsCrossed': return UtensilsCrossed;
      case 'Activity': return Activity;
      case 'Wind': return Wind;
      case 'Eye': return Eye;
      case 'Crown': return Crown;
      default: return Sparkles;
    }
  };

  const openDayModal = (day: DayPlan) => {
    setSelectedDay(day);
    const evalData = progress.dayEvaluations[day.dayNumber];
    if (evalData) {
      setCurrentFeedback(evalData);
      setReflection(evalData.userReflection || '');
      setSleepQuality(evalData.sleepQualityRating || 4);
      setEnergyMorning(evalData.energyMorningRating || 3);
      setActiveModalTab('evaluation');
    } else {
      setCurrentFeedback(null);
      setReflection('');
      setActiveModalTab('protocol');
    }

    // Initialize tasks state
    const initialTasks: { [key: string]: boolean } = {};
    day.tasks.forEach((t) => {
      initialTasks[t.id] = false;
    });
    setTasks(initialTasks);
  };

  const toggleTask = (taskId: string) => {
    setTasks((prev) => {
      const next = { ...prev, [taskId]: !prev[taskId] };
      if (next[taskId]) {
        audioCues.playChime(440, 0.2);
      }
      return next;
    });
  };

  const handlePlaySound = (presetId: string) => {
    if (onTriggerSound) {
      onTriggerSound(presetId);
    } else {
      if (presetId === 'preset_delta_15') {
        audioCues.playBinaural(216, 1.5, presetId, 30);
      } else if (presetId === 'preset_theta_45') {
        audioCues.playBinaural(210, 4.5, presetId, 30);
      } else if (presetId === 'preset_pink_noise') {
        audioCues.playPinkNoise(presetId, 45);
      } else if (presetId === 'preset_solfeggio_528') {
        audioCues.playBinaural(528, 0, presetId, 30);
      } else {
        audioCues.playRainNoise(presetId, 30);
      }
    }
  };

  const handleSubmitDay = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedDay) return;

    setIsSubmitting(true);
    try {
      const formattedAnswers = selectedDay.dailyQuestions.map((q) => {
        const selIdx = dailyQuizAnswers[q.id] ?? 0;
        const opt = q.options[selIdx] || q.options[0];
        return {
          questionId: q.id,
          selectedOptionIndex: selIdx,
          score: opt.points,
        };
      });

      const evalResult = await onCompleteDay(
        selectedDay.dayNumber,
        reflection.trim() || 'Prácticas del día integradas con éxito.',
        sleepQuality,
        energyMorning,
        formattedAnswers
      );

      if (evalResult) {
        setCurrentFeedback(evalResult);
        audioCues.playChime(528, 0.8);
      }
      setActiveModalTab('evaluation');
    } catch (err) {
      console.error('Error completing day:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const completedCount = progress.completedDays.length;
  const progressPercent = Math.round((completedCount / 7) * 100);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header Banner & Summary */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-950 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-900/60 border border-indigo-700/50 text-indigo-300 text-xs font-bold">
                Programa D.U.E.R.M.E.™ 7 Días
              </span>
              <span className="text-xs text-slate-400">Asimilación Neurocircadiana</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-100 mt-2 font-display">
              Tu Hoja de Ruta de Recuperación Somática
            </h2>
            <p className="text-xs text-slate-300 max-w-lg mt-1">
              Completa cada día y permite 24 horas de integración circadiana para consolidar las nuevas conexiones neuronales del descanso.
            </p>
          </div>

          {/* Progress metric */}
          <div className="sm:text-right space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Progreso Global
            </span>
            <div className="flex items-center sm:justify-end gap-2">
              <span className="text-3xl font-extrabold text-cyan-400 font-display">
                {completedCount}/7
              </span>
              <span className="text-xs text-slate-400">días ({progressPercent}%)</span>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full h-2.5 rounded-full bg-slate-950 border border-indigo-950 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 7 Days Timeline Grid */}
      <div className="space-y-4">
        {SEVEN_DAYS_ROADMAP.map((day) => {
          const status = getDayStatus(day.dayNumber);
          const Icon = getDayIcon(day.iconName);

          let cardStyle = 'bg-slate-950/40 border-slate-800/80 text-slate-400 opacity-60';
          let statusBadge = (
            <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Bloqueado
            </span>
          );

          if (status.isCompleted) {
            cardStyle = 'bg-emerald-950/25 border-emerald-500/40 text-slate-100 hover:border-emerald-400 transition-all shadow-lg shadow-emerald-950/30';
            statusBadge = (
              <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/60 text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Completado
              </span>
            );
          } else if (status.isLockedByTime) {
            cardStyle = 'bg-amber-950/20 border-amber-500/40 text-slate-200 hover:border-amber-400/80 transition-all shadow-lg shadow-amber-950/20';
            statusBadge = (
              <span className="px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/60 text-xs font-bold text-amber-300 flex items-center gap-1.5 animate-pulse">
                <Clock className="w-3.5 h-3.5" />
                <span>Asimilación 24h: {formatCountdown(status.remainingSeconds)}</span>
              </span>
            );
          } else if (status.isUnlocked) {
            cardStyle = 'bg-indigo-950/50 border-cyan-400/80 ring-2 ring-cyan-500/20 text-slate-100 shadow-xl shadow-indigo-950 hover:scale-[1.01] transition-all';
            statusBadge = (
              <span className="px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400 text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                Día Activo
              </span>
            );
          }

          return (
            <div
              key={day.dayNumber}
              onClick={() => {
                if (status.isUnlocked || status.isCompleted || status.isLockedByTime) {
                  openDayModal(day);
                }
              }}
              className={`p-5 sm:p-6 rounded-3xl border flex flex-col sm:flex-row sm:items-center justify-between gap-5 cursor-pointer ${cardStyle}`}
            >
              {/* Left Day info */}
              <div className="flex items-start sm:items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                    status.isCompleted
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-400'
                      : status.isUnlocked
                      ? 'bg-cyan-950 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-950'
                      : status.isLockedByTime
                      ? 'bg-amber-950 border-amber-500 text-amber-400'
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                      Día {day.dayNumber}
                    </span>
                    <span className="text-xs text-indigo-300 font-semibold">• {day.theme}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-100 font-display">
                    {day.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-1">
                    {day.subtitle}
                  </p>
                </div>
              </div>

              {/* Right Status / Action */}
              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                {statusBadge}

                <div className="flex items-center gap-1 text-xs font-semibold text-slate-400 group-hover:text-slate-200">
                  {status.isCompleted ? (
                    <span className="text-emerald-400 text-xs font-bold">Ver Devolución</span>
                  ) : status.isUnlocked ? (
                    <span className="text-cyan-400 text-xs font-bold flex items-center gap-1">
                      Comenzar <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  ) : status.isLockedByTime ? (
                    <span className="text-amber-300 text-xs">Revisar Guía</span>
                  ) : (
                    <Lock className="w-4 h-4 text-slate-600" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Day Modal Popup */}
      {selectedDay && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-slate-900 border border-indigo-900/80 rounded-3xl max-w-2xl w-full my-auto shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-indigo-950/80 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-[11px] font-bold">
                    Día {selectedDay.dayNumber} de 7
                  </span>
                  <span className="text-xs text-indigo-300 font-semibold">{selectedDay.theme}</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-100 font-display">
                  {selectedDay.title}
                </h2>
                <p className="text-xs text-slate-400 italic">"{selectedDay.tagline}"</p>
              </div>

              <button
                onClick={() => setSelectedDay(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tab Switcher */}
            <div className="flex border-b border-indigo-950 px-6 bg-slate-950/40">
              <button
                onClick={() => setActiveModalTab('protocol')}
                className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeModalTab === 'protocol'
                    ? 'border-cyan-400 text-cyan-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Brain className="w-3.5 h-3.5" />
                <span>Protocolo & Prácticas</span>
              </button>
              <button
                onClick={() => setActiveModalTab('evaluation')}
                className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeModalTab === 'evaluation'
                    ? 'border-cyan-400 text-cyan-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {progress.completedDays.includes(selectedDay.dayNumber)
                    ? 'Devolución Clara Luz'
                    : 'Test Diario & Evaluación'}
                </span>
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
              {activeModalTab === 'protocol' ? (
                <>
                  {/* Objective */}
                  <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-900/50 space-y-1.5">
                    <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                      Objetivo Circadiano
                    </span>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                      {selectedDay.objective}
                    </p>
                  </div>

                  {/* Somatic Technique */}
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-indigo-950 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                        <Wind className="w-4 h-4 text-cyan-400" />
                        {selectedDay.somaticTechnique.name}
                      </span>
                      <span className="text-[10px] text-slate-400 px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800">
                        {selectedDay.somaticTechnique.recommendedTime}
                      </span>
                    </div>

                    <ol className="space-y-2 text-xs text-slate-300">
                      {selectedDay.somaticTechnique.instructions.map((step, idx) => (
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
                        <span className="text-[10px] font-bold text-rose-400">Mito / Rumiación:</span>
                        <p className="text-rose-200/80 italic text-[11px]">
                          "{selectedDay.cognitiveReframe.myth}"
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/30 space-y-1">
                        <span className="text-[10px] font-bold text-emerald-400">Verdad Somática:</span>
                        <p className="text-emerald-200/90 font-medium text-[11px]">
                          {selectedDay.cognitiveReframe.truth}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-indigo-900/20 border border-indigo-700/40 text-center space-y-1">
                      <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                        Afirmación de Entrega:
                      </span>
                      <p className="text-xs text-indigo-200 font-semibold italic">
                        "{selectedDay.cognitiveReframe.affirmation}"
                      </p>
                    </div>
                  </div>

                  {/* Sound Recommendation */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-950 border border-indigo-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400">
                        <Waves className="w-4 h-4" />
                        <span>Frecuencia del Día: {selectedDay.soundTherapyPreset.name}</span>
                      </div>
                      <p className="text-xs text-slate-400">{selectedDay.soundTherapyPreset.description}</p>
                    </div>

                    <button
                      onClick={() => handlePlaySound(selectedDay.soundTherapyPreset.id)}
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
                      {selectedDay.tasks.map((task) => {
                        const isDone = !!tasks[task.id];
                        return (
                          <div
                            key={task.id}
                            onClick={() => toggleTask(task.id)}
                            className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 hover:border-slate-700 cursor-pointer flex items-center gap-3 transition-colors"
                          >
                            <div
                              className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                                isDone
                                  ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                                  : 'border-slate-700'
                              }`}
                            >
                              {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                            <div className="flex-1">
                              <span
                                className={`text-xs font-medium ${
                                  isDone ? 'line-through text-slate-500' : 'text-slate-200'
                                }`}
                              >
                                {task.title}
                              </span>
                              <p className="text-[11px] text-slate-400">{task.description}</p>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {task.durationMinutes} min
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Hypnagogic Anchor */}
                  <div className="text-center p-3 rounded-xl bg-slate-950/80 border border-indigo-950">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                      Anclaje Hipnagógico al acostarte:
                    </span>
                    <span className="text-xs text-indigo-300 font-bold italic">
                      "{selectedDay.hypnagogicAnchor}"
                    </span>
                  </div>
                </>
              ) : (
                /* Tab 2: Test & AI Feedback */
                <div className="space-y-6">
                  {/* Render Existing Leo AI Feedback */}
                  {currentFeedback && (
                    <div className="bg-gradient-to-br from-indigo-950/90 via-slate-900 to-slate-950 border border-cyan-500/40 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 font-extrabold text-xs font-display">
                            L
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                              <span>Devolución de Leo</span>
                              <span className="text-[10px] font-normal text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800/60">
                                Mentor de Vínculos y Conexión Digital
                              </span>
                            </h4>
                            <p className="text-[11px] text-slate-400">
                              Análisis del Día {selectedDay.dayNumber}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() =>
                            shareDayCompleted(
                              selectedDay.dayNumber,
                              selectedDay.title,
                              progress.leadInfo
                            )
                          }
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md shadow-emerald-950/50"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Compartir</span>
                        </button>
                      </div>

                      <div className="space-y-3 text-xs leading-relaxed">
                        <div className="p-3 rounded-xl bg-slate-950/60 border border-indigo-950 space-y-1">
                          <span className="font-bold text-cyan-400 text-[11px] flex items-center gap-1">
                            <HeartHandshake className="w-3.5 h-3.5" />
                            Observación Somática:
                          </span>
                          <p className="text-slate-200">{currentFeedback.summary}</p>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-950/60 border border-indigo-950 space-y-1">
                          <span className="font-bold text-indigo-300 text-[11px] flex items-center gap-1">
                            <Brain className="w-3.5 h-3.5" />
                            Acompañamiento Psicológico:
                          </span>
                          <p className="text-slate-200">{currentFeedback.biologicalInsight}</p>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-950/60 border border-indigo-950 space-y-1">
                          <span className="font-bold text-amber-300 text-[11px]">
                            Asimilación Circadiana (24 Horas):
                          </span>
                          <p className="text-slate-200">{currentFeedback.somaticAction}</p>
                        </div>

                        {currentFeedback.closingAffirmation && (
                          <p className="text-center italic font-semibold text-cyan-300 pt-1 text-xs">
                            "{currentFeedback.closingAffirmation}"
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Daily Micro-Quiz (3 questions) */}
                  <form onSubmit={handleSubmitDay} className="space-y-5">
                    <div className="space-y-3">
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Evaluación del Día (3 Preguntas Rápidas)
                      </span>

                      {selectedDay.dailyQuestions.map((dq) => (
                        <div
                          key={dq.id}
                          className="p-4 rounded-2xl bg-slate-950/60 border border-indigo-950 space-y-2"
                        >
                          <p className="text-xs font-bold text-slate-200">{dq.question}</p>
                          <div className="space-y-1.5">
                            {dq.options.map((opt, optIdx) => {
                              const isSel = (dailyQuizAnswers[dq.id] ?? 0) === optIdx;
                              return (
                                <button
                                  type="button"
                                  key={optIdx}
                                  onClick={() =>
                                    setDailyQuizAnswers((prev) => ({ ...prev, [dq.id]: optIdx }))
                                  }
                                  className={`w-full p-2.5 rounded-xl border text-left text-xs transition-colors flex items-center gap-2 ${
                                    isSel
                                      ? 'bg-indigo-900/60 border-cyan-400 text-cyan-200'
                                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                                  }`}
                                >
                                  <div
                                    className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                                      isSel
                                        ? 'border-cyan-400 bg-cyan-500 text-slate-950'
                                        : 'border-slate-700'
                                    }`}
                                  >
                                    {isSel && '✓'}
                                  </div>
                                  <span>{opt.text}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Reflection Textarea */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-200 block">
                        Reflexión somática: ¿Qué sensaciones experimentó tu cuerpo hoy?
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Escribe qué sentiste al aplicar el protocolo, si lograste soltar los pensamientos y cómo sientes tu nivel de calma..."
                        value={reflection}
                        onChange={(e) => setReflection(e.target.value)}
                        className="w-full p-3.5 rounded-2xl bg-slate-950/70 border border-indigo-950 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-slate-100 text-xs leading-relaxed outline-none"
                      />
                    </div>

                    {/* 5-star ratings */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-indigo-950 space-y-2">
                        <span className="text-xs font-semibold text-slate-300 block">
                          Calidad de Sueño / Calma (1-5)
                        </span>
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
                        <span className="text-xs font-semibold text-slate-300 block">
                          Claridad / Energía Matutina (1-5)
                        </span>
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

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-50 text-white font-bold text-xs shadow-xl shadow-indigo-950 flex items-center justify-center gap-2 transition-all"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Leo está analizando tu día...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-cyan-300" />
                          <span>
                            {progress.completedDays.includes(selectedDay.dayNumber)
                              ? 'Actualizar Evaluación y Devolución'
                              : 'Completar Día & Iniciar Asimilación de 24h'}
                          </span>
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
                <Clock className="w-4 h-4 text-cyan-400" />
                Candado Circadiano de 24 Horas
              </span>
              <button
                onClick={() => setSelectedDay(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
