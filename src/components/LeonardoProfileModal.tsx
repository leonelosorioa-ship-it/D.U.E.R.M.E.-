import { X, Moon, Heart, Sparkles, ShieldCheck, Award, BookOpen, SunMoon, HeartPulse, Headphones, CheckCircle2 } from 'lucide-react';
import { LEONARDO_PROFILE } from '../data/leonardoProfile';

interface LeonardoProfileModalProps {
  onClose: () => void;
}

export function LeonardoProfileModal({ onClose }: LeonardoProfileModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-slate-900 border border-indigo-900/80 rounded-3xl max-w-2xl w-full my-auto shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-indigo-950 bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 p-0.5 shadow-xl shadow-indigo-950">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-400 font-extrabold text-xl font-display">
                L
              </div>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-extrabold text-slate-100 font-display">{LEONARDO_PROFILE.name}</h2>
                <span className="px-2 py-0.5 rounded-full bg-cyan-950/90 border border-cyan-700/60 text-[10px] font-bold text-cyan-300">
                  {LEONARDO_PROFILE.badge}
                </span>
              </div>
              <p className="text-xs text-indigo-300 font-medium mt-0.5">
                {LEONARDO_PROFILE.institution} • {LEONARDO_PROFILE.brandMotto}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Cerrar perfil"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-300 text-xs sm:text-sm leading-relaxed custom-scrollbar">
          {/* Manifesto / Philosophy Quote */}
          <div className="p-4.5 rounded-2xl bg-indigo-950/40 border border-indigo-800/40 space-y-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
            <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">
              Filosofía del Mentor
            </span>
            <p className="italic text-slate-200 font-medium leading-relaxed">
              "{LEONARDO_PROFILE.philosophy}"
            </p>
          </div>

          {/* Bio and Background */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-100 font-display flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Sobre Leonardo y el Método D.U.E.R.M.E.™</span>
            </h3>
            <p className="text-slate-300 leading-relaxed">
              {LEONARDO_PROFILE.bio}
            </p>
          </div>

          {/* 4 Pillars */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Pilares de la Metodología D.U.E.R.M.E.™
            </h4>
            <div className="grid sm:grid-cols-2 gap-3">
              {LEONARDO_PROFILE.pillars.map((pillar, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-950/60 border border-indigo-950 space-y-1.5 hover:border-indigo-800 transition-colors">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                    {idx === 0 && <SunMoon className="w-4 h-4 text-amber-400" />}
                    {idx === 1 && <HeartPulse className="w-4 h-4 text-rose-400" />}
                    {idx === 2 && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                    {idx === 3 && <Headphones className="w-4 h-4 text-indigo-400" />}
                    <span>{pillar.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Letter from Leonardo */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-indigo-900/40 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
              <BookOpen className="w-4 h-4" />
              <span>Carta Personal de Leonardo para tu Transformación</span>
            </div>
            <div className="text-xs text-slate-300 whitespace-pre-line leading-relaxed font-sans opacity-95">
              {LEONARDO_PROFILE.letterToStudent}
            </div>
          </div>

          {/* Credentials */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-cyan-400" />
              <span>Acreditaciones & Desarrollo</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              {LEONARDO_PROFILE.credentials.map((cred, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{cred}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-indigo-950 bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-300">{LEONARDO_PROFILE.institution}</span>
            <span>•</span>
            <span className="text-[11px] text-slate-400">{LEONARDO_PROFILE.techPartner}</span>
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-slate-950 font-bold shadow-lg shadow-cyan-950/40 transition-all"
          >
            Entendido, Gracias
          </button>
        </div>
      </div>
    </div>
  );
}
