import React, { createContext, useContext, ReactNode } from 'react';
import { useAuthSynchronizer } from '../hooks/useAuthSynchronizer';
import { ProgramProgress, AppPhase, LeadInfo, DayEvaluation } from '../types';

interface AuthContextType {
  phase: AppPhase;
  setPhase: (phase: AppPhase) => void;
  progress: ProgramProgress;
  saveScanQuiz: (answers: { [questionId: number]: number }) => void;
  saveLead: (lead: LeadInfo) => void;
  getDayStatus: (dayNumber: number) => {
    isCompleted: boolean;
    isUnlocked: boolean;
    isLockedByTime: boolean;
    remainingSeconds: number;
    unlockDate?: Date;
  };
  completeDay: (
    dayNumber: number,
    reflection: string,
    sleepQuality: number,
    energyMorning: number,
    dailyAnswers?: { questionId: number; selectedOptionIndex: number; score: number }[]
  ) => Promise<DayEvaluation | null>;
  resetProgress: () => void;
  isSyncing: boolean;
  syncStatus: 'idle' | 'success' | 'error';
  syncWithServer: (currentProgress: ProgramProgress) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const synchronizer = useAuthSynchronizer();

  return (
    <AuthContext.Provider value={synchronizer}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
