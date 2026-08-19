import { useState, useEffect, useCallback } from 'react';
import { ProgramProgress, AppScreen, QuizAnswers, UserLead, DayEvaluation, SleepLogEntry } from '../types';
import { calculateDiagnosis } from '../questions';

const STORAGE_KEY = 'DUERME_PROGRESS_V1';
const CIRCADIAN_LOCK_HOURS = 24; // 24 hours lock between days

const DEFAULT_PROGRESS: ProgramProgress = {
  currentStep: 'LANDING',
  quizAnswers: {},
  activeDay: 1,
  completedDays: [],
  dayCompletionTimestamps: {},
  dayEvaluations: {},
  sleepLogs: [],
  soundPreferences: {
    favoritePreset: 'preset_delta_15',
    defaultVolume: 0.5,
    timerMinutes: 30,
  },
};

export function useAuthSynchronizer() {
  const [progress, setProgress] = useState<ProgramProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_PROGRESS,
          ...parsed,
          soundPreferences: {
            ...DEFAULT_PROGRESS.soundPreferences,
            ...(parsed.soundPreferences || {}),
          },
        };
      }
    } catch (e) {
      console.warn('Could not load progress from localStorage', e);
    }
    return DEFAULT_PROGRESS;
  });

  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncError, setLastSyncError] = useState<string | null>(null);

  // Sync to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [progress]);

  // Background sync with /api/progress/sync
  const syncWithServer = useCallback(async (dataToSync: ProgramProgress) => {
    setIsSyncing(true);
    setLastSyncError(null);
    try {
      const res = await fetch('/api/progress/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead: dataToSync.lead,
          progress: dataToSync,
          updatedAt: new Date().toISOString(),
        }),
      });
      if (res.ok) {
        const json = await res.json();
        setProgress(prev => ({
          ...prev,
          lastSyncedAt: json.syncedAt || new Date().toISOString(),
        }));
      }
    } catch (err) {
      console.warn('Background sync failed (will retry or work offline):', err);
      setLastSyncError('Offline: Progreso guardado localmente');
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Update step
  const setStep = useCallback((step: AppScreen) => {
    setProgress(prev => {
      const updated = { ...prev, currentStep: step };
      syncWithServer(updated);
      return updated;
    });
  }, [syncWithServer]);

  // Save Quiz Answers & calculate diagnosis
  const saveQuizAnswers = useCallback((answers: QuizAnswers) => {
    const diagnosis = calculateDiagnosis(answers);
    setProgress(prev => {
      const updated: ProgramProgress = {
        ...prev,
        quizAnswers: answers,
        diagnosis,
        currentStep: 'SCAN_RESULTS',
      };
      syncWithServer(updated);
      return updated;
    });
  }, [syncWithServer]);

  // Save Lead information
  const saveLead = useCallback((lead: UserLead) => {
    setProgress(prev => {
      const updated: ProgramProgress = {
        ...prev,
        lead,
        currentStep: 'DASHBOARD',
      };
      syncWithServer(updated);
      return updated;
    });
  }, [syncWithServer]);

  /**
   * Evaluates if a given day is unlocked according to the strict 24-hour circadian lock rule.
   * Day 1 is always unlocked.
   * Day N requires Day (N-1) to be completed AND >= 24 hours elapsed since completion timestamp.
   */
  const getDayStatus = useCallback((dayNumber: number): {
    isCompleted: boolean;
    isUnlocked: boolean;
    isLockedByTime: boolean;
    remainingSeconds: number;
    unlockDate?: Date;
  } => {
    const isCompleted = progress.completedDays.includes(dayNumber);
    
    // Day 1 is always unlocked
    if (dayNumber === 1) {
      return {
        isCompleted,
        isUnlocked: true,
        isLockedByTime: false,
        remainingSeconds: 0,
      };
    }

    // Previous day must be completed
    const prevDay = dayNumber - 1;
    const isPrevCompleted = progress.completedDays.includes(prevDay);
    if (!isPrevCompleted) {
      return {
        isCompleted: false,
        isUnlocked: false,
        isLockedByTime: false,
        remainingSeconds: 0,
      };
    }

    // Check 24-hour lock timestamp from previous day completion
    const prevCompletionTimestamp = progress.dayCompletionTimestamps[prevDay];
    if (!prevCompletionTimestamp) {
      // If completed but no timestamp, assume unlocked
      return {
        isCompleted,
        isUnlocked: true,
        isLockedByTime: false,
        remainingSeconds: 0,
      };
    }

    const completionTime = new Date(prevCompletionTimestamp).getTime();
    const unlockTime = completionTime + CIRCADIAN_LOCK_HOURS * 60 * 60 * 1000;
    const now = Date.now();
    const remainingMs = unlockTime - now;

    if (remainingMs > 0) {
      return {
        isCompleted,
        isUnlocked: false,
        isLockedByTime: true,
        remainingSeconds: Math.ceil(remainingMs / 1000),
        unlockDate: new Date(unlockTime),
      };
    }

    return {
      isCompleted,
      isUnlocked: true,
      isLockedByTime: false,
      remainingSeconds: 0,
      unlockDate: new Date(unlockTime),
    };
  }, [progress.completedDays, progress.dayCompletionTimestamps]);

  // Complete a Day and trigger AI evaluation
  const completeDay = useCallback(async (
    dayNumber: number,
    reflection: string,
    sleepQualityRating: number,
    energyMorningRating: number
  ) => {
    const nowIso = new Date().toISOString();
    
    // Request AI feedback from server
    let aiFeedback: DayEvaluation['aiFeedback'] = undefined;
    try {
      const res = await fetch('/api/ai/evaluate-day', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dayNumber,
          reflection,
          sleepQualityRating,
          energyMorningRating,
          userName: progress.lead?.name || 'Guerrera del Descanso',
          primaryStruggle: progress.lead?.primaryStruggle || progress.diagnosis?.keyVulnerability,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        aiFeedback = data.feedback;
      }
    } catch (e) {
      console.warn('AI evaluation endpoint error, using fallback mentor feedback:', e);
      aiFeedback = {
        mentorName: 'Clara Luz',
        somaticObservation: 'Tu cuerpo está registrando una disminución en la tensión basal simpática. Las prácticas respiratorias están abriendo espacio visceral.',
        psychologicalInsight: 'Al escribir tu reflexión has desactivado parte de la memoria operativa de alerta. Permitirte no tener todo resuelto es tu primer gran acto de autocuidado.',
        nextStepRecommendation: 'Respeta el intervalo de asimilación circadiana de 24 horas. Esta noche hidrátate con infusión tibia y activa las frecuencias binaurales.',
        closingAffirmation: 'Tu descanso no es negociable; es tu santuario sagrado.',
      };
    }

    const evaluation: DayEvaluation = {
      dayNumber,
      timestamp: nowIso,
      userReflection: reflection,
      sleepQualityRating,
      energyMorningRating,
      aiFeedback,
    };

    setProgress(prev => {
      const updatedCompleted = Array.from(new Set([...prev.completedDays, dayNumber]));
      const updatedTimestamps = {
        ...prev.dayCompletionTimestamps,
        [dayNumber]: nowIso,
      };
      const updatedEvaluations = {
        ...prev.dayEvaluations,
        [dayNumber]: evaluation,
      };
      const nextActiveDay = Math.min(7, dayNumber + 1);

      const updated: ProgramProgress = {
        ...prev,
        completedDays: updatedCompleted,
        dayCompletionTimestamps: updatedTimestamps,
        dayEvaluations: updatedEvaluations,
        activeDay: nextActiveDay,
      };

      syncWithServer(updated);
      return updated;
    });

    return aiFeedback;
  }, [progress.lead, progress.diagnosis, syncWithServer]);

  // Log Sleep entry
  const addSleepLog = useCallback((log: Omit<SleepLogEntry, 'id'>) => {
    const newEntry: SleepLogEntry = {
      ...log,
      id: 'log_' + Date.now(),
    };
    setProgress(prev => {
      const updated = {
        ...prev,
        sleepLogs: [newEntry, ...prev.sleepLogs],
      };
      syncWithServer(updated);
      return updated;
    });
  }, [syncWithServer]);

  // Reset progress (for test or clean start)
  const resetProgress = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch { /* ignore */ }
    setProgress(DEFAULT_PROGRESS);
  }, []);

  return {
    progress,
    setStep,
    saveQuizAnswers,
    saveLead,
    getDayStatus,
    completeDay,
    addSleepLog,
    resetProgress,
    isSyncing,
    lastSyncError,
  };
}
