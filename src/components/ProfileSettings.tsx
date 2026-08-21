import { useState, FormEvent } from 'react';
import { ProgramProgress, LeadInfo } from '../types';
import { User, Mail, Globe, Phone, ShieldCheck, Check, Sparkles, Wrench, RefreshCw, Trophy } from 'lucide-react';
import { audioCues } from '../utils/audioCues';

interface ProfileSettingsProps {
  progress: ProgramProgress;
  onUpdateLead: (lead: LeadInfo) => void;
  onOpenAdmin: () => void;
  onReset: () => void;
}

export function ProfileSettings({
  progress,
  onUpdateLead,
  onOpenAdmin,
  onReset,
}: ProfileSettingsProps) {
  const [nombre, setNombre] = useState(progress.leadInfo.nombre || '');
  const [email, setEmail] = useState(progress.leadInfo.email || '');
  const [pais, setPais] = useState(progress.leadInfo.pais || 'España');
  const [phone, setPhone] = useState(progress.leadInfo.phone || '');
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onUpdateLead({
      nombre: nombre.trim(),
      email: email.trim(),
      pais,
      phone: phone.trim() || undefined,
    });
    audioCues.playChime(528, 0.4);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-display">
          Ajustes de Perfil & Preferencias
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Gestiona tus datos personales y configuración del protocolo D.U.E.R.M.E.™ Mujer.
        </p>
      </div>

      {/* User Info Form */}
      <div className="bg-slate-900/90 border border-indigo-950 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl backdrop-blur-md">
        <div className="flex items-center justify-between pb-4 border-b border-indigo-950">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-950 border border-indigo-800 flex items-center justify-center text-cyan-400 font-bold text-base">
              {nombre ? nombre.slice(0, 2).toUpperCase() : 'AL'}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 font-display">
                {nombre || 'Alumna Valiosa'}
              </h3>
              <p className="text-xs text-slate-400">{email || 'Sin correo asignado'}</p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-[11px] font-bold text-cyan-300">
            Día {progress.currentDay} en Curso
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>Nombre Completo</span>
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-indigo-950 text-xs sm:text-sm text-slate-100 outline-none focus:border-cyan-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>Correo Electrónico</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-indigo-950 text-xs sm:text-sm text-slate-100 outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>País de Residencia</span>
              </label>
              <input
                type="text"
                value={pais}
                onChange={(e) => setPais(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-indigo-950 text-xs sm:text-sm text-slate-100 outline-none focus:border-cyan-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-cyan-400" />
                <span>WhatsApp / Teléfono</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-indigo-950 text-xs sm:text-sm text-slate-100 outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs flex items-center gap-2 transition-all"
            >
              {isSaved ? <Check className="w-4 h-4 text-slate-950" /> : <Sparkles className="w-4 h-4" />}
              <span>{isSaved ? 'Guardado con Éxito' : 'Actualizar Mis Datos'}</span>
            </button>

            <button
              type="button"
              onClick={onOpenAdmin}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
            >
              <Wrench className="w-3.5 h-3.5 text-cyan-400" />
              <span>Panel de Control (Debug)</span>
            </button>
          </div>
        </form>
      </div>

      {/* Badges and summary */}
      <div className="bg-slate-900/90 border border-indigo-950 rounded-3xl p-6 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Insignias Obtenidas</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {progress.unlockedBadges.map((badge, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-full bg-indigo-950 border border-indigo-800 text-xs text-indigo-300 font-semibold"
            >
              ✨ {badge.replace(/_/g, ' ').toUpperCase()}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
