import { useState, useEffect } from 'react';
import { SEVEN_DAYS_ROADMAP } from '../questions';
import { DayPlan, ProgramProgress } from '../types';
import { DayDetailModal } from './DayDetailModal';
import { CheckCircle2, Lock, Clock, Sparkles, ArrowRight, Play, BrainCircuit, Shield, Wind, Activity, UtensilsCrossed, Eye, Crown, ShieldAlert } from 'lucide-react';

interface SevenDaysRoadmapProps {
  progress: ProgramProgress;
  getDayStatus: (dayNumber: number) => {
    isCompleted: boolean;
    isUnlocked: boolean;
    isLockedByTime: boolean;
    remainingSeconds: number;
    unlockDate?: Date;
  };
  onCompleteDay: (dayNumber: number, reflection: string, sleepQuality: number, energyMorning: number) => Promise<any>;
}

export function SevenDaysRoadmap({ progress, getDayStatus, onCompleteDay }: SevenDaysRoadmapProps) {
  const [selectedDay, setSelectedDay] = useState<DayPlan | null>(null);
  const [now, setNow] = useState(Date.now());

  // Live timer tick every second for real-time HH:MM:SS countdown
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
      case 'ShieldMoon': return Shield;
      case 'Wind': return Wind;
      case 'Activity': return Activity;
      case 'UtensilsCrossed': return UtensilsCrossed;
      case 'Eye': return Eye;
      case 'Crown': return Crown;
      default: return Sparkles;
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
              Completa cada día y permite 24 horas de integración circadiana para asentar las nuevas conexiones neuronales del descanso.
            </p>
          </div>

          {/* Progress metric */}
          <div className="sm:text-right space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Progreso Global</span>
            <div className="flex items-center sm:justify-end gap-2">
              <span className="text-3xl font-extrabold text-cyan-400 font-display">{completedCount}/7</span>
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
          const evaluation = progress.dayEvaluations[day.dayNumber];

          // Determine Card Styles
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
                // Allowed to open if unlocked or completed, or preview if in countdown
                if (status.isUnlocked || status.isCompleted || status.isLockedByTime) {
                  setSelectedDay(day);
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

      {/* Selected Day Modal */}
      {selectedDay && (
        <DayDetailModal
          day={selectedDay}
          isCompleted={progress.completedDays.includes(selectedDay.dayNumber)}
          isUnlocked={getDayStatus(selectedDay.dayNumber).isUnlocked}
          evaluation={progress.dayEvaluations[selectedDay.dayNumber]}
          onClose={() => setSelectedDay(null)}
          onCompleteDay={onCompleteDay}
        />
      )}
    </div>
  );
}
