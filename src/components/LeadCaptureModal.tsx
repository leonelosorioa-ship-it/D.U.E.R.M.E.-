import { useState, FormEvent } from 'react';
import { LeadInfo } from '../types';
import { Sparkles, ArrowRight, ShieldCheck, User, Mail, Globe, Phone, Moon } from 'lucide-react';
import { audioCues } from '../utils/audioCues';

interface LeadCaptureModalProps {
  onSaveLead: (lead: LeadInfo) => void;
  defaultEmail?: string;
}

export function LeadCaptureModal({ onSaveLead, defaultEmail }: LeadCaptureModalProps) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState(defaultEmail || '');
  const [pais, setPais] = useState('España');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);

  const countries = [
    'España',
    'México',
    'Colombia',
    'Argentina',
    'Chile',
    'Perú',
    'Estados Unidos',
    'Ecuador',
    'Uruguay',
    'Costa Rica',
    'Panamá',
    'Guatemala',
    'Otro País',
  ];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setError('Por favor escribe tu nombre para que Leonardo pueda personalizar tu guía.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Por favor ingresa un correo electrónico válido.');
      return;
    }

    audioCues.playChime(528, 0.5);

    const lead: LeadInfo = {
      nombre: nombre.trim(),
      email: email.trim(),
      pais,
      phone: phone.trim() || undefined,
    };

    onSaveLead(lead);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-700/50 text-indigo-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Acceso al Ecosistema Tu Poder Mental™</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-display">
          Personaliza Tu Hoja de Ruta D.U.E.R.M.E.™
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Tu guía <strong>Leonardo</strong> (Director CWO) adaptará cada una de las 7 noches a tu fisiología y ritmo circadiano.
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
              value={nombre}
              onChange={(e) => {
                setNombre(e.target.value);
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
              Para sincronizar tu progreso y enviarte el Informe Integral en PDF al terminar el Día 7.
            </p>
          </div>

          {/* Country Field */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>País de Residencia</span>
              </label>
              <select
                value={pais}
                onChange={(e) => setPais(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950/70 border border-indigo-950 focus:border-cyan-400 text-slate-100 text-xs sm:text-sm outline-none"
              >
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Optional Phone / WhatsApp */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-cyan-400" />
                <span>WhatsApp (Opcional)</span>
              </label>
              <input
                type="tel"
                placeholder="+34 600 000 000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950/70 border border-indigo-950 focus:border-cyan-400 text-slate-100 placeholder-slate-500 text-xs sm:text-sm outline-none transition-all"
              />
            </div>
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
