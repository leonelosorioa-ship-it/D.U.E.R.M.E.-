import { useState, useEffect } from 'react';
import { Moon, Sparkles, Waves, Headphones, UserCheck, HelpCircle, Download, ShieldCheck } from 'lucide-react';
import { audioCues } from '../utils/audioCues';

interface HeaderProps {
  onOpenQuickSound: () => void;
  onOpenProfile: () => void;
  onOpenSupport: () => void;
  onNavigateHome?: () => void;
  userName?: string;
  isDashboard?: boolean;
}

export function Header({
  onOpenQuickSound,
  onOpenProfile,
  onOpenSupport,
  onNavigateHome,
  userName,
  isDashboard = false,
}: HeaderProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [audioStatus, setAudioStatus] = useState(() => audioCues.getStatus());

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const interval = setInterval(() => {
      setAudioStatus(audioCues.getStatus());
    }, 1000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearInterval(interval);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-950/85 border-b border-indigo-950/80 transition-all">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
        {/* Brand Logo & Mentora */}
        <div
          onClick={onNavigateHome}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-950 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-400">
              <Moon className="w-5 h-5 fill-cyan-400/20" />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm sm:text-base tracking-wide bg-gradient-to-r from-slate-100 via-slate-200 to-cyan-300 bg-clip-text text-transparent font-display">
                D.U.E.R.M.E.™
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-950 border border-indigo-800 text-indigo-300">
                MUJER
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium -mt-0.5">
              Tu Poder Mental™ • Leonardo
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Sound Launcher */}
          <button
            onClick={onOpenQuickSound}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              audioStatus.isPlaying
                ? 'bg-cyan-950 border-cyan-400 text-cyan-300 animate-pulse shadow-md shadow-cyan-950'
                : 'bg-slate-900/80 border-indigo-950 text-slate-300 hover:bg-slate-800 hover:text-cyan-300'
            }`}
            title="Terapia Sonora Inmediata"
          >
            <Waves className={`w-3.5 h-3.5 ${audioStatus.isPlaying ? 'text-cyan-400' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">
              {audioStatus.isPlaying ? 'Audio Activo' : 'Ondas Delta'}
            </span>
          </button>

          {/* Leonardo Profile Button */}
          <button
            onClick={onOpenProfile}
            className="p-2 rounded-xl bg-slate-900/80 border border-indigo-950 hover:border-indigo-800 text-slate-300 hover:text-cyan-300 transition-colors flex items-center gap-1.5 text-xs"
            title="Conoce a Leonardo (Director CWO)"
          >
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-[10px] font-extrabold text-slate-950">
              L
            </div>
            <span className="hidden md:inline font-medium">Leonardo</span>
          </button>

          {/* Technical Support Drawer */}
          <button
            onClick={onOpenSupport}
            className="p-2 rounded-xl bg-slate-900/80 border border-indigo-950 hover:border-indigo-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Soporte Técnico Leps Software Solutions™"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* PWA Install Button */}
          {isInstallable && (
            <button
              onClick={handleInstallClick}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs flex items-center gap-1 shadow-md shadow-cyan-950 transition-all hover:scale-105"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Instalar App</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
