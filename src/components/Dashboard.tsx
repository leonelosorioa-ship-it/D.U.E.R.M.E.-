import { useState } from 'react';
import { DashboardTab, ProgramProgress, DayEvaluation, LeadInfo } from '../types';
import { SevenDaysRoadmap } from './7DaysRoadmap';
import { SoundTherapy } from './SoundTherapy';
import { PeaceGarden } from './PeaceGarden';
import { LeonardoCoach } from './LeonardoCoach';
import { SleepCalculator } from './SleepCalculator';
import { PremiumDashboard } from './PremiumDashboard';
import { ProfileSettings } from './ProfileSettings';
import { BottomNav } from './BottomNav';
import { AdminPanel } from './AdminPanel';
import { LeonardoProfileModal } from './LeonardoProfileModal';

interface DashboardProps {
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
  onUpdateLead: (lead: LeadInfo) => void;
  onResetProgress: () => void;
  initialTab?: DashboardTab;
}

export function Dashboard({
  progress,
  getDayStatus,
  onCompleteDay,
  onUpdateLead,
  onResetProgress,
  initialTab = 'roadmap',
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>(initialTab);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLeonardoModalOpen, setIsLeonardoModalOpen] = useState(false);
  const [selectedSoundPresetId, setSelectedSoundPresetId] = useState<string | undefined>(undefined);

  const completedDaysCount = progress.completedDays.length;
  const isDay7Completed = progress.completedDays.includes(7);

  const handleTriggerSoundFromRoadmap = (presetId: string) => {
    setSelectedSoundPresetId(presetId);
    setActiveTab('sounds');
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-6xl mx-auto space-y-6">
      {/* Tab Content Rendering */}
      {activeTab === 'roadmap' && (
        <SevenDaysRoadmap
          progress={progress}
          getDayStatus={getDayStatus}
          onCompleteDay={onCompleteDay}
          onTriggerSound={handleTriggerSoundFromRoadmap}
        />
      )}

      {activeTab === 'sounds' && (
        <SoundTherapy initialPresetId={selectedSoundPresetId} />
      )}

      {activeTab === 'garden' && (
        <PeaceGarden
          gardenLevel={progress.activeGardenLevel}
          completedDaysCount={completedDaysCount}
        />
      )}

      {(activeTab === 'leo_ai' || activeTab === 'leonardo_ai' || (activeTab as any) === 'clara_ai') && (
        <LeonardoCoach
          userName={progress.leadInfo.nombre}
          dominantArchetype={progress.scanResult?.archetypeTitle}
          currentDay={progress.currentDay}
          onOpenProfile={() => setIsLeonardoModalOpen(true)}
        />
      )}

      {activeTab === 'calculator' && (
        <SleepCalculator />
      )}

      {activeTab === 'premium' && (
        <div className="space-y-10">
          <PremiumDashboard
            progress={progress}
            onNavigateToRoadmap={() => setActiveTab('roadmap')}
          />
          <div className="border-t border-indigo-950 pt-8">
            <ProfileSettings
              progress={progress}
              onUpdateLead={onUpdateLead}
              onOpenAdmin={() => setIsAdminOpen(true)}
              onReset={onResetProgress}
            />
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <ProfileSettings
          progress={progress}
          onUpdateLead={onUpdateLead}
          onOpenAdmin={() => setIsAdminOpen(true)}
          onReset={onResetProgress}
        />
      )}

      {/* Persistent Bottom PWA Navigation */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setSelectedSoundPresetId(undefined);
          setActiveTab(tab);
        }}
        completedDaysCount={completedDaysCount}
        isDay7Completed={isDay7Completed}
      />

      {/* Admin Testing Modal */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        progress={progress}
        onCompleteDay={onCompleteDay}
        onReset={onResetProgress}
      />

      {/* Leonardo Profile Modal */}
      {isLeonardoModalOpen && (
        <LeonardoProfileModal onClose={() => setIsLeonardoModalOpen(false)} />
      )}
    </div>
  );
}
