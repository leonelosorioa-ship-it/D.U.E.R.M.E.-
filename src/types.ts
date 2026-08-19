/**
 * D.U.E.R.M.E.™ Data Models & State Types
 * Tu Poder Mental™ Mujer Ecosystem
 */

export type AppScreen =
  | 'LANDING'
  | 'SCAN_QUIZ'
  | 'SCAN_RESULTS'
  | 'CAPTURE_LEAD'
  | 'DASHBOARD';

export type DashboardTab = 'roadmap' | 'sounds' | 'breath' | 'calculator' | 'clara_ai' | 'journal';

export interface UserLead {
  name: string;
  email: string;
  phone?: string;
  primaryStruggle?: string;
  createdAt: string;
}

export interface QuizOption {
  id: string;
  text: string;
  score: number; // 0 to 3 scale (higher = more disruption)
  category?: 'latency' | 'maintenance' | 'early_waking' | 'circadian' | 'cognitive_load' | 'somatic_tension';
}

export interface QuizQuestion {
  id: string;
  category: 'insomnia' | 'circadian' | 'cognitive' | 'somatic' | 'habits';
  title: string;
  subtitle?: string;
  options: QuizOption[];
}

export interface QuizAnswers {
  [questionId: string]: {
    optionId: string;
    score: number;
  };
}

export interface ScanDiagnosis {
  totalScore: number;
  maxScore: number;
  percentage: number;
  insomniaLevel: 'Leve' | 'Moderado' | 'Severo' | 'Crítico';
  sleepDebtHours: number;
  primaryChronotypeIssue: string;
  keyVulnerability: string;
  recommendedFrequency: 'Delta 1.5Hz' | 'Theta 4.5Hz' | 'Ruido Rosa / Océano';
  summaryMessage: string;
  personalizedRoadmapFocus: string;
}

export interface DayTask {
  id: string;
  title: string;
  description: string;
  category: 'somatic' | 'cognitive' | 'circadian' | 'sound';
  durationMinutes: number;
  completed: boolean;
}

export interface DayPlan {
  dayNumber: number;
  title: string;
  subtitle: string;
  tagline: string;
  theme: string;
  iconName: string;
  objective: string;
  somaticTechnique: {
    name: string;
    instructions: string[];
    recommendedTime: string;
  };
  cognitiveReframe: {
    myth: string;
    truth: string;
    affirmation: string;
  };
  soundTherapyPreset: {
    id: string;
    name: string;
    frequencyHz: number;
    description: string;
    type: 'binaural_delta' | 'binaural_theta' | 'pink_noise' | 'rain_noise' | 'solfeggio_528';
  };
  tasks: DayTask[];
  hypnagogicAnchor: string;
}

export interface DayEvaluation {
  dayNumber: number;
  timestamp: string;
  userReflection: string;
  sleepQualityRating: number; // 1 to 5
  energyMorningRating: number; // 1 to 5
  aiFeedback?: {
    mentorName: string; // 'Clara Luz'
    somaticObservation: string;
    psychologicalInsight: string;
    nextStepRecommendation: string;
    closingAffirmation: string;
  };
}

export interface SleepLogEntry {
  id: string;
  date: string;
  bedTime: string;
  wakeTime: string;
  timeToFallAsleepMin: number;
  awakeningsCount: number;
  qualityRating: number; // 1-5
  morningEnergyRating: number; // 1-5
  notes?: string;
  binauralUsed?: string;
}

export interface ProgramProgress {
  currentStep: AppScreen;
  lead?: UserLead;
  quizAnswers: QuizAnswers;
  diagnosis?: ScanDiagnosis;
  activeDay: number; // 1 to 7
  completedDays: number[]; // e.g. [1, 2]
  dayCompletionTimestamps: {
    [dayNumber: number]: string; // ISO string when the day was finished
  };
  dayEvaluations: {
    [dayNumber: number]: DayEvaluation;
  };
  sleepLogs: SleepLogEntry[];
  soundPreferences: {
    favoritePreset: string;
    defaultVolume: number;
    timerMinutes: number;
  };
  lastSyncedAt?: string;
}

export interface SoundPreset {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  type: 'delta' | 'theta' | 'alpha' | 'pink' | 'rain' | 'solfeggio';
  carrierFreq: number; // Hz for binaural
  beatFreq: number; // Hz (e.g. 1.5 for Delta, 4.5 for Theta)
  icon: string;
  recommendedDuration: string;
  color: string;
}
