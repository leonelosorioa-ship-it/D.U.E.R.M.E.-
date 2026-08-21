import { useState, useEffect, useCallback, useRef } from 'react';
import { ProgramProgress, AppPhase, LeadInfo, ScanResultData, DayEvaluation } from '../types';
import { calculateScanResult, INITIAL_SCAN_QUESTIONS } from '../questions';

const STORAGE_KEY = 'DUERME_MUJER_PROGRESS_V2';
const LOCK_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours strict circadian assimilation

const INITIAL_PROGRESS: ProgramProgress = {
  currentDay: 1,
  completedDays: [],
  activationDate: new Date().toISOString(),
  dayCompletionTimestamps: {},
  responses: {},
  dayEvaluations: {},
  leadInfo: {
    nombre: '',
    email: '',
    pais: '',
    phone: '',
  },
  leadCaptured: false,
  activeGardenLevel: 1,
  unlockedBadges: ['iniciada'],
};

export function useAuthSynchronizer() {
  const [phase, setPhase] = useState<AppPhase>('LANDING');
  const [progress, setProgress] = useState<ProgramProgress>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...INITIAL_PROGRESS,
          ...parsed,
        };
      }
    } catch (e) {
      console.warn('Error reading from localStorage:', e);
    }
    return INITIAL_PROGRESS;
  });

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const initialLoadDone = useRef(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error('Error writing to localStorage:', e);
    }
  }, [progress]);

  // Determine initial phase on mount
  useEffect(() => {
    if (!initialLoadDone.current) {
      initialLoadDone.current = true;
      if (progress.leadCaptured && progress.completedDays.length > 0) {
        setPhase('DASHBOARD');
      } else if (progress.leadCaptured && progress.scanResult) {
        setPhase('DASHBOARD');
      } else if (progress.scanResult && !progress.leadCaptured) {
        setPhase('SCAN_RESULTS');
      }
    }
  }, [progress.leadCaptured, progress.scanResult, progress.completedDays.length]);

  // Sync with Server API
  const syncWithServer = useCallback(async (currentProgress: ProgramProgress) => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/progress/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead: currentProgress.leadInfo,
          progress: currentProgress,
        }),
      });

      if (res.ok) {
        setSyncStatus('success');
      } else {
        setSyncStatus('error');
      }
    } catch (e) {
      console.warn('Sync API error:', e);
      setSyncStatus('error');
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Save Initial Quiz Answers & compute ScanResult
  const saveScanQuiz = useCallback((answers: { [questionId: number]: number }) => {
    const result = calculateScanResult(answers);
    setProgress((prev) => {
      const updated: ProgramProgress = {
        ...prev,
        scanResult: result,
      };
      return updated;
    });
    setPhase('SCAN_RESULTS');
  }, []);

  // Save Lead
  const saveLead = useCallback((lead: LeadInfo) => {
    setProgress((prev) => {
      const updated: ProgramProgress = {
        ...prev,
        leadInfo: lead,
        leadCaptured: true,
        activationDate: prev.activationDate || new Date().toISOString(),
      };
      syncWithServer(updated);
      return updated;
    });
    setPhase('DASHBOARD');
  }, [syncWithServer]);

  // Check status of any day (1-7) with 24-hour circadian lock
  const getDayStatus = useCallback((dayNumber: number) => {
    const isCompleted = progress.completedDays.includes(dayNumber);

    // Day 1 is unlocked by default if lead is captured
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

    // Check 24h timer from previous day completion
    const prevCompletedTimestamp = progress.dayCompletionTimestamps[prevDay];
    if (!prevCompletedTimestamp) {
      return {
        isCompleted,
        isUnlocked: true,
        isLockedByTime: false,
        remainingSeconds: 0,
      };
    }

    const prevTime = new Date(prevCompletedTimestamp).getTime();
    const unlockTime = prevTime + LOCK_DURATION_MS;
    const now = Date.now();
    const diffMs = unlockTime - now;

    if (diffMs > 0) {
      return {
        isCompleted,
        isUnlocked: false,
        isLockedByTime: true,
        remainingSeconds: Math.ceil(diffMs / 1000),
        unlockDate: new Date(unlockTime),
      };
    }

    return {
      isCompleted,
      isUnlocked: true,
      isLockedByTime: false,
      remainingSeconds: 0,
    };
  }, [progress.completedDays, progress.dayCompletionTimestamps]);

  // Complete a Day + AI evaluation
  const completeDay = useCallback(async (
    dayNumber: number,
    reflection: string,
    sleepQuality: number,
    energyMorning: number,
    dailyAnswers?: { questionId: number; selectedOptionIndex: number; score: number }[]
  ): Promise<DayEvaluation | null> => {
    const timestamp = new Date().toISOString();

    let aiEvaluation: DayEvaluation = {
      summary: `Día ${dayNumber} completado con éxito. Asimilación circadiana iniciada.`,
      biologicalInsight: 'Tu sistema parasimpático y nervio vago han recibido las señales de relajación necesarias para inducir ondas lentas Delta.',
      recommendedFrequency: dayNumber === 6 ? 'Delta 0.5-4Hz' : dayNumber === 1 ? 'Theta 4-8Hz' : 'Ruido Rosa',
      somaticAction: 'Mantén el santuario oscuro y permite 24 horas de reposo neural.',
      closingAffirmation: 'Tu descanso es tu santuario sagrado; cada noche te reconstruyes con amor.',
      userReflection: reflection,
      sleepQualityRating: sleepQuality,
      energyMorningRating: energyMorning,
      evaluatedAt: timestamp,
    };

    // Call server AI endpoint for Clara Luz evaluation
    try {
      const res = await fetch('/api/ai/evaluate-day', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dayNumber,
          reflection,
          sleepQualityRating: sleepQuality,
          energyMorningRating: energyMorning,
          userName: progress.leadInfo.nombre || 'Alumna',
          primaryStruggle: progress.scanResult?.dominantArchetype || 'Insomnio',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.feedback) {
          aiEvaluation = {
            ...aiEvaluation,
            summary: data.feedback.somaticObservation || aiEvaluation.summary,
            biologicalInsight: data.feedback.psychologicalInsight || aiEvaluation.biologicalInsight,
            somaticAction: data.feedback.nextStepRecommendation || aiEvaluation.somaticAction,
            closingAffirmation: data.feedback.closingAffirmation || aiEvaluation.closingAffirmation,
          };
        }
      }
    } catch (e) {
      console.warn('AI evaluation error, using fallback:', e);
    }

    setProgress((prev) => {
      const newCompleted = prev.completedDays.includes(dayNumber)
        ? prev.completedDays
        : [...prev.completedDays, dayNumber].sort((a, b) => a - b);

      const nextDay = Math.min(7, dayNumber + 1);

      // Unlock badges
      const newBadges = [...prev.unlockedBadges];
      if (newCompleted.length >= 3 && !newBadges.includes('coherencia_vagal')) {
        newBadges.push('coherencia_vagal');
      }
      if (newCompleted.length >= 7 && !newBadges.includes('maestra_del_descanso')) {
        newBadges.push('maestra_del_descanso');
      }

      const updated: ProgramProgress = {
        ...prev,
        currentDay: nextDay,
        completedDays: newCompleted,
        dayCompletionTimestamps: {
          ...prev.dayCompletionTimestamps,
          [dayNumber]: timestamp,
        },
        dayEvaluations: {
          ...prev.dayEvaluations,
          [dayNumber]: aiEvaluation,
        },
        responses: dailyAnswers ? {
          ...prev.responses,
          [dayNumber]: dailyAnswers,
        } : prev.responses,
        activeGardenLevel: Math.min(7, newCompleted.length + 1),
        unlockedBadges: newBadges,
      };

      syncWithServer(updated);
      return updated;
    });

    return aiEvaluation;
  }, [progress.leadInfo.nombre, progress.scanResult?.dominantArchetype, syncWithServer]);

  // Reset progress (for test/debug or user request)
  const resetProgress = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setProgress(INITIAL_PROGRESS);
    setPhase('LANDING');
  }, []);

  return {
    phase,
    setPhase,
    progress,
    saveScanQuiz,
    saveLead,
    getDayStatus,
    completeDay,
    resetProgress,
    isSyncing,
    syncStatus,
    syncWithServer,
  };
}
