import { useState } from 'react';
import { useAuthSynchronizer } from './hooks/useAuthSynchronizer';
import { Navbar } from './components/Navbar';
import { LandingView } from './components/LandingView';
import { ScanWizard } from './components/ScanWizard';
import { ScanResults } from './components/ScanResults';
import { CaptureLeadView } from './components/CaptureLeadView';
import { Dashboard } from './components/Dashboard';
import { SoundTherapy } from './components/SoundTherapy';
import { X, Moon, ShieldCheck, Heart } from 'lucide-react';

export default function App() {
  const {
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
  } = useAuthSynchronizer();

  const [showQuickSoundModal, setShowQuickSoundModal] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navigation */}
      <Navbar
        currentStep={progress.currentStep}
        onNavigate={setStep}
        onOpenQuickSound={() => setShowQuickSoundModal(true)}
        onReset={resetProgress}
        userName={progress.lead?.name}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6">
        {progress.currentStep === 'LANDING' && (
          <LandingView
            onStartScan={() => setStep('SCAN_QUIZ')}
            hasPreviousProgress={progress.completedDays.length > 0 || !!progress.lead}
            onResume={() => setStep('DASHBOARD')}
          />
        )}

        {progress.currentStep === 'SCAN_QUIZ' && (
          <ScanWizard
            onComplete={(answers) => saveQuizAnswers(answers)}
            onCancel={() => setStep('LANDING')}
          />
        )}

        {progress.currentStep === 'SCAN_RESULTS' && progress.diagnosis && (
          <ScanResults
            diagnosis={progress.diagnosis}
            onProceed={() => setStep(progress.lead ? 'DASHBOARD' : 'CAPTURE_LEAD')}
            onRetest={() => setStep('SCAN_QUIZ')}
          />
        )}

        {progress.currentStep === 'CAPTURE_LEAD' && (
          <CaptureLeadView
            onSaveLead={saveLead}
            defaultStruggle={progress.diagnosis?.keyVulnerability}
          />
        )}

        {progress.currentStep === 'DASHBOARD' && (
          <Dashboard
            progress={progress}
            getDayStatus={getDayStatus}
            onCompleteDay={completeDay}
            onAddSleepLog={addSleepLog}
          />
        )}
      </main>

      {/* Quick Sound Modal Launcher */}
      {showQuickSoundModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-slate-900 border border-indigo-900/80 rounded-3xl max-w-3xl w-full my-auto p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-indigo-950 pb-3">
              <div className="flex items-center gap-2">
                <Moon className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-slate-100 font-display">Terapia Sonora en Vivo</h3>
              </div>
              <button
                onClick={() => setShowQuickSoundModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <SoundTherapy />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full border-t border-indigo-950/70 bg-slate-950/90 py-8 text-center text-xs text-slate-400 space-y-2 mt-auto">
        <div className="flex items-center justify-center gap-2 text-slate-400">
          <Moon className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-slate-300">D.U.E.R.M.E.™</span>
          <span>•</span>
          <span>Ecosistema Tu Poder Mental™ Mujer</span>
        </div>
        <p className="text-[11px] text-slate-400 max-w-md mx-auto">
          Descanso Mental y Recuperación del Sueño • Sincronización neurocircadiana con Web Audio API y Clara Luz con IA.
        </p>
      </footer>
    </div>
  );
}
