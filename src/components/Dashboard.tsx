import { useState } from 'react';
import { ProgramProgress, DashboardTab } from '../types';
import { SevenDaysRoadmap } from './SevenDaysRoadmap';
import { SoundTherapy } from './SoundTherapy';
import { BreathingGuide } from './BreathingGuide';
import { SleepCalculator } from './SleepCalculator';
import { ClaraLuzCoach } from './ClaraLuzCoach';
import { SleepJournal } from './SleepJournal';
import {
  CalendarDays,
  Waves,
  Wind,
  Clock,
  Bot,
  BookOpen,
  Sparkles,
  Moon,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface DashboardProps {
  progress: ProgramProgress;
  getDayStatus: (dayNumber: number) => {
    isCompleted: boolean;
    isUnlocked: boolean;
    isLockedByTime: boolean;
    remainingSeconds: number;
    unlockDate?: Date;
  };
  onCompleteDay: (dayNumber: number, reflection: string, sleepQuality: number, energyMorning: number) => Promise<any>;
  onAddSleepLog: (log: any) => void;
  defaultTab?: DashboardTab;
}

export function Dashboard({
  progress,
  getDayStatus,
  onCompleteDay,
  onAddSleepLog,
  defaultTab = 'roadmap',
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>(defaultTab);

  const tabs: { id: DashboardTab; label: string; icon: any; badge?: string }[] = [
    { id: 'roadmap', label: 'Hoja de Ruta 7D', icon: CalendarDays, badge: `${progress.completedDays.length}/7` },
    { id: 'sounds', label: 'Terapia Sonora', icon: Waves },
    { id: 'breath', label: 'Respiración 4-7-8', icon: Wind },
    { id: 'calculator', label: 'Ciclos de 90m', icon: Clock },
    { id: 'clara_ai', label: 'Mentora Clara Luz', icon: Bot, badge: 'IA' },
    { id: 'journal', label: 'Diario Somático', icon: BookOpen },
  ];

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto px-3 sm:px-4">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 border border-indigo-950/80 p-4 rounded-3xl backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-950 border border-indigo-800/60 flex items-center justify-center text-cyan-400">
            <Moon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-100 font-display">
              Bienvenida, {progress.lead?.name || 'Guerrera del Descanso'}
            </h1>
            <p className="text-xs text-slate-400">
              Foco Somático: <span className="text-cyan-300 font-medium">{progress.diagnosis?.personalizedRoadmapFocus || 'Regulación Circadiana'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('sounds')}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-950 border border-cyan-500/40 hover:bg-cyan-900/50 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Waves className="w-3.5 h-3.5" />
            <span>Frecuencia Delta</span>
          </button>
        </div>
      </div>

      {/* Main Tab Navigation Bar */}
      <div className="flex gap-1.5 p-1.5 rounded-2xl bg-slate-900/90 border border-indigo-950 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-2.5 px-3.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-950'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950/40'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                    isSelected
                      ? 'bg-cyan-400 text-slate-950'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content Panels */}
      <div className="pt-2">
        {activeTab === 'roadmap' && (
          <SevenDaysRoadmap
            progress={progress}
            getDayStatus={getDayStatus}
            onCompleteDay={onCompleteDay}
          />
        )}

        {activeTab === 'sounds' && (
          <SoundTherapy />
        )}

        {activeTab === 'breath' && (
          <BreathingGuide />
        )}

        {activeTab === 'calculator' && (
          <SleepCalculator />
        )}

        {activeTab === 'clara_ai' && (
          <ClaraLuzCoach lead={progress.lead} activeDay={progress.activeDay} />
        )}

        {activeTab === 'journal' && (
          <SleepJournal logs={progress.sleepLogs} onAddLog={onAddSleepLog} />
        )}
      </div>
    </div>
  );
}
