import { useState, FormEvent } from 'react';
import { UserLead } from '../types';
import { Sparkles, Moon, ArrowRight, ShieldCheck, HeartHandshake, User, Mail, Compass } from 'lucide-react';

interface CaptureLeadViewProps {
  onSaveLead: (lead: UserLead) => void;
  defaultStruggle?: string;
}

export function CaptureLeadView({ onSaveLead, defaultStruggle }: CaptureLeadViewProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [primaryStruggle, setPrimaryStruggle] = useState(defaultStruggle || 'Insomnio y rumiación al acostarme');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor ingresa tu nombre para personalizar tu hoja de ruta.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Por favor ingresa un correo electrónico válido.');
      return;
    }

    const lead: UserLead = {
      name: name.trim(),
      email: email.trim(),
      primaryStruggle,
      createdAt: new Date().toISOString(),
    };

    onSaveLead(lead);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-700/50 text-indigo-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Personalización de Hoja de Ruta</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-display">
          Desbloquea tu Programa D.U.E.R.M.E.™
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Tu mentora con IA, <strong>Clara Luz</strong>, calibrará tus reflexiones diarias y desbloqueará el protocolo de 7 días.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-slate-900/90 border border-indigo-950 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl backdrop-blur-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span>¿Cómo te llamas?</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Valeria, Sofía, Elena..."
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError(null);
              }}
              className="w-full px-4 py-3 rounded-xl bg-slate-950/70 border border-indigo-950 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-slate-100 placeholder-slate-500 text-sm outline-none transition-all"
            />
          </div>

          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              <span>Tu Correo Electrónico</span>
            </label>
            <input
              type="email"
              required
              placeholder="ejemplo@tupodermental.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              className="w-full px-4 py-3 rounded-xl bg-slate-950/70 border border-indigo-950 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-slate-100 placeholder-slate-500 text-sm outline-none transition-all"
            />
            <p className="text-[11px] text-slate-400">
              Para sincronizar tus avances y enviarte los resúmenes de asimilación circadiana.
            </p>
          </div>

          {/* Primary Struggle */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>Tu Mayor Desafío con el Sueño</span>
            </label>
            <select
              value={primaryStruggle}
              onChange={(e) => setPrimaryStruggle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950/70 border border-indigo-950 focus:border-cyan-400 text-slate-100 text-sm outline-none"
            >
              <option value="Insomnio y rumiación al acostarme">Insomnio y rumiación al acostarme (Mente acelerada)</option>
              <option value="Despertares nocturnos en la madrugada (2-4 AM)">Despertares nocturnos en la madrugada (2:00 - 4:00 AM)</option>
              <option value="Tensión corporal y bruxismo">Tensión física, cuello rígido o bruxismo</option>
              <option value="Uso excesivo de pantallas de noche">Uso excesivo de pantallas y desajuste circadiano</option>
              <option value="Despertar con fatiga crónica y pesadez">Despertar con fatiga crónica y sensación de no descansar</option>
            </select>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-indigo-950/60 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
          >
            <span>Ingresar a Mi Panel D.U.E.R.M.E.™</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 flex items-center justify-center gap-2 text-center text-slate-400 text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Privacidad asegurada • Ecosistema Tu Poder Mental™ Mujer</span>
        </div>
      </div>
    </div>
  );
}
