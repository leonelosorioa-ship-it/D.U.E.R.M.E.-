export interface LeadInfo {
  nombre: string;
  email: string;
  pais?: string;
  phone?: string;
}

export interface QuizOption {
  text: string;
  points: number;
  archetypeWeight?: 'circadiano' | 'simpatico' | 'cognitivo' | 'ambiental';
}

export interface QuizQuestion {
  id: number;
  question: string;
  subtitle?: string;
  category: 'ciclo_circadiano' | 'alerta_simpatica' | 'higiene_entorno' | 'nutricion_bioquimica';
  options: QuizOption[];
}

export interface DayEvaluation {
  summary: string;
  biologicalInsight: string;
  recommendedFrequency: 'Delta 0.5-4Hz' | 'Theta 4-8Hz' | 'Ruido Rosa' | 'Olas Biorítmicas';
  somaticAction: string;
  closingAffirmation?: string;
  userReflection?: string;
  sleepQualityRating?: number;
  energyMorningRating?: number;
  evaluatedAt?: string;
}

export interface ScanResultData {
  totalScore: number;
  maxScore: number;
  percentage: number;
  circadianScore: number;
  sympatheticScore: number;
  environmentScore: number;
  biochemicalScore: number;
  dominantArchetype: string;
  archetypeTitle: string;
  archetypeDescription: string;
  insomniaLevel: 'Leve' | 'Moderado' | 'Severo' | 'Crítico';
  sleepDebtHours: number;
  recommendedFrequency: string;
  keyVulnerability: string;
  actionPlanSummary: string;
}

export interface ProgramProgress {
  currentDay: number;
  completedDays: number[];
  activationDate: string;
  dayCompletionTimestamps: {
    [dayNumber: number]: string;
  };
  responses: {
    [dayNumber: number]: { questionId: number; selectedOptionIndex: number; score: number }[];
  };
  dayEvaluations: {
    [dayNumber: number]: DayEvaluation;
  };
  leadInfo: LeadInfo;
  leadCaptured: boolean;
  scanResult?: ScanResultData;
  activeGardenLevel: number;
  unlockedBadges: string[];
}

export type AppPhase = 'LANDING' | 'SCAN_QUIZ' | 'SCAN_RESULTS' | 'CAPTURE_LEAD' | 'DASHBOARD';

export type DashboardTab = 'roadmap' | 'sounds' | 'garden' | 'leo_ai' | 'calculator' | 'premium' | 'settings';

export interface SoundPreset {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  type: 'delta' | 'theta' | 'pink' | 'rain' | 'solfeggio';
  carrierFreq: number;
  beatFreq: number;
  icon: string;
  recommendedDuration: string;
}

export interface DailyProtocolTask {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  completed: boolean;
}

export interface DayPlan {
  dayNumber: number;
  title: string;
  subtitle: string;
  theme: string;
  tagline: string;
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
  };
  hypnagogicAnchor: string;
  tasks: DailyProtocolTask[];
  dailyQuestions: {
    id: number;
    question: string;
    options: { text: string; points: number }[];
  }[];
}

export interface SleepLogEntry {
  id: string;
  date: string;
  bedTime: string;
  wakeTime: string;
  timeToFallAsleepMin: number;
  awakeningsCount: number;
  qualityRating: number;
  morningEnergyRating: number;
  notes: string;
}
