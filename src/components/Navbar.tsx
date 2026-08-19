import { useState, useEffect } from 'react';
import { Moon, Sparkles, Volume2, RotateCcw, Download, ShieldCheck } from 'lucide-react';
import { AppScreen } from '../types';
import { audioEngine } from '../utils/audioEngine';

interface NavbarProps {
  currentStep: AppScreen;
  onNavigate: (step: AppScreen) => void;
  onOpenQuickSound?: () => void;
  onReset: () => void;
  userName?: string;
}

export function Navbar({ currentStep, onNavigate, onOpenQuickSound, onReset, userName }: NavbarProps) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioPreset, setAudioPreset] = useState<string | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    const interval = setInterval(() => {
      const status = audioEngine.getStatus();
      setIsPlayingAudio(status.isPlaying);
      setAudioPreset(status.presetId);
    }, 1000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      clearInterval(interval);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-md border-b border-indigo-950/60 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => onNavigate(currentStep === 'DASHBOARD' ? 'DASHBOARD' : 'LANDING')}
          className="flex items-center gap-3 text-left group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-900 via-blue-700 to-cyan-400 p-0.5 shadow-lg shadow-indigo-950/50 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Moon className="w-5 h-5 text-cyan-400 fill-cyan-400/20" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-wider text-slate-100 font-display">
                D.U.E.R.M.E.<span className="text-cyan-400 text-xs font-normal align-super">™</span>
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-900/60 text-indigo-300 border border-indigo-700/40">
                Mujer
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden xs:block">Descanso Mental & Ritmo Circadiano</p>
          </div>
        </button>

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Audio pill indicator */}
          {isPlayingAudio && (
            <button
              onClick={onOpenQuickSound}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 text-xs font-medium animate-pulse hover:bg-cyan-900/50 transition-colors"
              title="Reproduciendo Terapia Sonora"
            >
              <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
              <span className="hidden sm:inline">Sonido Activo</span>
            </button>
          )}

          {/* Install PWA button */}
          {deferredPrompt && !isInstalled && (
            <button
              onClick={handleInstallClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-md shadow-indigo-900/40 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Instalar PWA</span>
            </button>
          )}

          {/* Quick shortcuts if in dashboard */}
          {currentStep === 'DASHBOARD' && (
            <div className="flex items-center gap-2">
              {userName && (
                <span className="hidden md:flex items-center gap-1 text-xs text-indigo-300 bg-indigo-950/70 border border-indigo-800/40 px-2.5 py-1 rounded-full">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  {userName}
                </span>
              )}
              <button
                onClick={() => setShowConfirmReset(true)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors"
                title="Reiniciar progreso"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Confirm Reset Modal */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">¿Reiniciar Programa D.U.E.R.M.E.™?</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Esto borrará las respuestas del test, los días completados del mapa de 7 días y los registros locales.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setShowConfirmReset(false);
                  onReset();
                }}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
              >
                Sí, Reiniciar
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
