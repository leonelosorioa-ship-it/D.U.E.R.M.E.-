import { useState } from 'react';
import { X, Wrench, Unlock, CheckSquare, Trash2, Database } from 'lucide-react';
import { ProgramProgress } from '../types';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  progress: ProgramProgress;
  onCompleteDay: (dayNumber: number, reflection: string, sleepQuality: number, energyMorning: number) => void;
  onReset: () => void;
}

export function AdminPanel({
  isOpen,
  onClose,
  progress,
  onCompleteDay,
  onReset,
}: AdminPanelProps) {
  if (!isOpen) return null;

  const handleSimulateAllDays = async () => {
    for (let i = 1; i <= 7; i++) {
      await onCompleteDay(i, `Día ${i} completado en modo simulación de pruebas.`, 5, 5);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-indigo-900/80 rounded-3xl max-w-2xl w-full my-auto shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-indigo-950 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
            <Wrench className="w-4 h-4" />
            <span>Panel de Diagnóstico & Testing D.U.E.R.M.E.™</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          <div className="space-y-3">
            <h4 className="font-bold text-slate-100 uppercase tracking-wider text-[11px]">
              Acciones de Prueba Rápida
            </h4>

            <div className="grid sm:grid-cols-2 gap-3">
              <button
                onClick={handleSimulateAllDays}
                className="p-3.5 rounded-xl bg-indigo-950/60 border border-indigo-700/60 hover:bg-indigo-900/60 text-cyan-300 font-bold flex items-center gap-2 transition-colors"
              >
                <CheckSquare className="w-4 h-4" />
                <span>Simular 7 Días Completos (Desbloquear Todo)</span>
              </button>

              <button
                onClick={() => {
                  onReset();
                  onClose();
                }}
                className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800 hover:bg-rose-900/40 text-rose-300 font-bold flex items-center gap-2 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Borrar Todo y Volver al Inicio</span>
              </button>
            </div>
          </div>

          {/* Current State Inspector */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-100 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span>Inspector de Estado JSON en Vivo</span>
            </h4>
            <pre className="p-4 rounded-2xl bg-slate-950 border border-indigo-950 font-mono text-[11px] text-slate-400 overflow-x-auto max-h-64">
              {JSON.stringify(progress, null, 2)}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-indigo-950 bg-slate-950/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
          >
            Cerrar Panel
          </button>
        </div>
      </div>
    </div>
  );
}
