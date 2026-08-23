import { useState } from 'react';
import { X, HelpCircle, Phone, Database, RefreshCw, Download, Trash2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { ProgramProgress } from '../types';

interface TechnicalSupportDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  progress: ProgramProgress;
  onResetProgress: () => void;
  syncStatus: 'idle' | 'success' | 'error';
  isSyncing: boolean;
}

export function TechnicalSupportDrawer({
  isOpen,
  onClose,
  progress,
  onResetProgress,
  syncStatus,
  isSyncing,
}: TechnicalSupportDrawerProps) {
  const [confirmReset, setConfirmReset] = useState(false);

  if (!isOpen) return null;

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(progress, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `DUERME_Mujer_Backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleWhatsAppSupport = () => {
    const text = encodeURIComponent(
      `🌙 *Soporte Técnico D.U.E.R.M.E.™ Mujer*\nAlumna: ${progress.leadInfo.nombre || 'No registrado'}\nEmail: ${progress.leadInfo.email || 'No registrado'}\nDía actual: ${progress.currentDay}\nDías completados: ${progress.completedDays.join(', ')}\n\nHola equipo de Leps Software Solutions™, necesito asistencia con mi aplicación.`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex justify-end">
      <div className="bg-slate-900 border-l border-indigo-950 w-full max-w-md h-full overflow-y-auto p-6 space-y-6 shadow-2xl flex flex-col justify-between">
        <div className="space-y-6">
          {/* Drawer Header */}
          <div className="flex items-start justify-between pb-4 border-b border-indigo-950">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-950 border border-indigo-800 flex items-center justify-center text-cyan-400">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100 font-display">
                  Soporte & Diagnóstico
                </h3>
                <p className="text-[11px] text-slate-400">
                  Leps Software Solutions™
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Development attribution card */}
          <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/40 space-y-2">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
              Desarrollo Tecnológico
            </span>
            <p className="text-xs text-slate-200 font-semibold">
              Leps Software Solutions™
            </p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              División de Inteligencia Artificial y Salud Digital de Leps Digital. Arquitectura orientada a la soberanía del descanso mental.
            </p>
          </div>

          {/* Sync & Persistence status */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Estado de la Plataforma
            </span>

            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-indigo-950 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Sincronización de Datos:</span>
                <span className="font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {isSyncing ? 'Sincronizando...' : 'Activa (Local + Cloud)'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Motor de Audio:</span>
                <span className="font-semibold text-cyan-400">Web Audio API 3.0</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Modo Fuera de Línea (PWA):</span>
                <span className="font-semibold text-emerald-400">Habilitado</span>
              </div>
            </div>
          </div>

          {/* Direct Support via WhatsApp */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Atención Directa
            </span>
            <button
              onClick={handleWhatsAppSupport}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-950/40"
            >
              <Phone className="w-4 h-4" />
              <span>Contactar Soporte en WhatsApp</span>
            </button>
          </div>

          {/* Data Backup & Export */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Copia de Seguridad
            </span>
            <button
              onClick={handleExportData}
              className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Exportar Mi Registro en JSON</span>
            </button>
          </div>

          {/* Reset / Clear Data */}
          <div className="pt-4 border-t border-indigo-950 space-y-2">
            {!confirmReset ? (
              <button
                onClick={() => setConfirmReset(true)}
                className="w-full py-2.5 rounded-xl border border-rose-900/60 hover:bg-rose-950/40 text-rose-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reiniciar Progreso de la App</span>
              </button>
            ) : (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 space-y-2 text-center">
                <p className="text-xs text-rose-200">
                  ¿Segura que deseas reiniciar tus respuestas y días completados?
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onResetProgress();
                      setConfirmReset(false);
                      onClose();
                    }}
                    className="flex-1 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                  >
                    Sí, Reiniciar
                  </button>
                  <button
                    onClick={() => setConfirmReset(false)}
                    className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 text-center text-[10px] text-slate-500 space-y-1">
          <p>© 2026 Tu Poder Mental™ Mujer • Leonardo (Director CWO)</p>
          <p>Potenciado por Leps Software Solutions™</p>
        </div>
      </div>
    </div>
  );
}
