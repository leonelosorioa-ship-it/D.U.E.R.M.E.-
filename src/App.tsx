import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { LandingHero } from './components/LandingHero';
import { ScanWizard } from './components/ScanWizard';
import { ScanResults } from './components/ScanResults';
import { LeadCaptureModal } from './components/LeadCaptureModal';
import { Dashboard } from './components/Dashboard';
import { LeoProfileModal } from './components/LeoProfileModal';
import { TechnicalSupportDrawer } from './components/TechnicalSupportDrawer';
import { SoundTherapy } from './components/SoundTherapy';
import { X } from 'lucide-react';
import { audioCues } from './utils/audioCues';
import { LeadInfo } from './types';

function MainApp() {
  const {
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
  } = useAuth();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isQuickSoundOpen, setIsQuickSoundOpen] = useState(false);

  const handleUpdateLead = (updatedLead: LeadInfo) => {
    saveLead(updatedLead);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Global Application Header */}
      <Header
        onOpenQuickSound={() => setIsQuickSoundOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenSupport={() => setIsSupportOpen(true)}
        onNavigateHome={() => {
          if (progress.leadCaptured) {
            setPhase('DASHBOARD');
          } else {
            setPhase('LANDING');
          }
        }}
        userName={progress.leadInfo.nombre}
        isDashboard={phase === 'DASHBOARD'}
      />

      {/* Main Phase Viewport */}
      <main className="flex-1 w-full flex flex-col justify-center">
        {phase === 'LANDING' && (
          <LandingHero
            onStartQuiz={() => setPhase('SCAN_QUIZ')}
            onOpenSound={() => setIsQuickSoundOpen(true)}
            onOpenProfile={() => setIsProfileOpen(true)}
            hasPreviousProgress={progress.completedDays.length > 0 || !!progress.scanResult}
            onContinueProgress={() => {
              if (progress.leadCaptured) {
                setPhase('DASHBOARD');
              } else if (progress.scanResult) {
                setPhase('SCAN_RESULTS');
              }
            }}
          />
        )}

        {phase === 'SCAN_QUIZ' && (
          <ScanWizard
            onComplete={(answers) => saveScanQuiz(answers)}
            onCancel={() => setPhase('LANDING')}
          />
        )}

        {phase === 'SCAN_RESULTS' && progress.scanResult && (
          <ScanResults
            result={progress.scanResult}
            lead={progress.leadInfo}
            onUnlockRoadmap={() => {
              if (progress.leadCaptured) {
                setPhase('DASHBOARD');
              } else {
                setPhase('CAPTURE_LEAD');
              }
            }}
            onRetest={() => setPhase('SCAN_QUIZ')}
          />
        )}

        {phase === 'CAPTURE_LEAD' && (
          <LeadCaptureModal
            onSaveLead={(lead) => saveLead(lead)}
            defaultEmail={progress.leadInfo.email}
          />
        )}

        {phase === 'DASHBOARD' && (
          <Dashboard
            progress={progress}
            getDayStatus={getDayStatus}
            onCompleteDay={completeDay}
            onUpdateLead={handleUpdateLead}
            onResetProgress={resetProgress}
          />
        )}
      </main>

      {/* Quick Sound Therapy Modal Overlay */}
      {isQuickSoundOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-indigo-900 rounded-3xl max-w-3xl w-full my-auto shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-indigo-950 pb-3">
              <span className="text-sm font-bold text-cyan-400">
                Terapia Acústica Inmediata
              </span>
              <button
                onClick={() => setIsQuickSoundOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <SoundTherapy />
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {isProfileOpen && (
        <LeoProfileModal onClose={() => setIsProfileOpen(false)} />
      )}

      {/* Technical Support Drawer */}
      <TechnicalSupportDrawer
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
        progress={progress}
        onResetProgress={resetProgress}
        syncStatus={syncStatus}
        isSyncing={isSyncing}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
