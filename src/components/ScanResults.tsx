import { useState } from 'react';
import { ScanDiagnosis } from '../types';
import { Sparkles, Moon, AlertTriangle, CheckCircle2, ArrowRight, Share2, Waves, Brain, Clock, ShieldCheck, Heart } from 'lucide-react';

interface ScanResultsProps {
  diagnosis: ScanDiagnosis;
  onProceed: () => void;
  onRetest: () => void;
}

export function ScanResults({ diagnosis, onProceed, onRetest }: ScanResultsProps) {
  const [copied, setCopied] = useState(false);

  const getSeverityBadge = () => {
    switch (diagnosis.insomniaLevel) {
      case 'Crítico':
        return {
          bg: 'bg-rose-950/70 border-rose-600/60 text-rose-300',
          dot: 'bg-rose-500',
          title: 'Nivel Crítico de Disrupción Circadiana',
        };
      case 'Severo':
        return {
          bg: 'bg-amber-950/70 border-amber-600/60 text-amber-300',
          dot: 'bg-amber-500',
          title: 'Nivel Severo de Sobrecarga Somática',
        };
      case 'Moderado':
        return {
          bg: 'bg-yellow-950/70 border-yellow-600/60 text-yellow-300',
          dot: 'bg-yellow-500',
          title: 'Nivel Moderado con Latencia Elevada',
        };
      default:
        return {
          bg: 'bg-emerald-950/70 border-emerald-600/60 text-emerald-300',
          dot: 'bg-emerald-500',
          title: 'Nivel Leve / Preventivo',
        };
    }
  };

  const badge = getSeverityBadge();

  // WhatsApp Share encoded text
  const handleShareWhatsApp = () => {
    const message = `🌙 *Mi Diagnóstico en D.U.E.R.M.E.™*\n` +
      `• *Nivel de Disrupción:* ${diagnosis.insomniaLevel} (${diagnosis.percentage}%)\n` +
      `• *Deuda de Sueño:* ~${diagnosis.sleepDebtHours}h diarias\n` +
      `• *Frecuencia Recomendada:* ${diagnosis.recommendedFrequency}\n` +
      `• *Foco Somático:* ${diagnosis.personalizedRoadmapFocus}\n\n` +
      `Descubre tu arquitectura del descanso en D.U.E.R.M.E.™ - Tu Poder Mental™ Mujer: ${window.location.origin}`;
    
    const encoded = encodeURIComponent(message);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-700/50 text-indigo-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Diagnóstico Somático Completado</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-100 font-display">
          Tu Arquitectura Actual del Descanso
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          Hemos analizado tu latencia, tono neuromuscular y ritmo circadiano. Este es tu mapa de recuperación inicial.
        </p>
      </div>

      {/* Main Diagnosis Card */}
      <div className="bg-slate-900/90 border border-indigo-950 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-md relative overflow-hidden">
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Severity Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-indigo-950/80">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Índice de Disrupción</span>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-xl border text-xs font-bold flex items-center gap-2 ${badge.bg}`}>
                <span className={`w-2 h-2 rounded-full animate-pulse ${badge.dot}`} />
                {badge.title}
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-cyan-400 font-display">
              {diagnosis.percentage}%
            </span>
            <span className="text-xs text-slate-400">de saturación simpática ({diagnosis.totalScore}/{diagnosis.maxScore} pts)</span>
          </div>
        </div>

        {/* 3 Metric Grid */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-indigo-950 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Deuda de Sueño</span>
            </div>
            <p className="text-lg font-bold text-slate-100">~{diagnosis.sleepDebtHours} horas/noche</p>
            <p className="text-[11px] text-slate-400">Déficit acumulado en fases profundas</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-indigo-950 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Waves className="w-3.5 h-3.5 text-cyan-400" />
              <span>Frecuencia Óptima</span>
            </div>
            <p className="text-lg font-bold text-cyan-400">{diagnosis.recommendedFrequency}</p>
            <p className="text-[11px] text-slate-400">Para inducción hipnagógica</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-indigo-950 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Brain className="w-3.5 h-3.5 text-indigo-400" />
              <span>Foco Somático</span>
            </div>
            <p className="text-xs font-bold text-indigo-200 line-clamp-2">{diagnosis.personalizedRoadmapFocus}</p>
            <p className="text-[11px] text-slate-400">Meta prioritaria de los 7 días</p>
          </div>
        </div>

        {/* Clinical Summary & Vulnerability */}
        <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-900/50 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Vulnerabilidad Biológica Detectada:</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
            {diagnosis.keyVulnerability}
          </p>
          <p className="text-xs text-slate-400 leading-relaxed pt-1">
            {diagnosis.summaryMessage}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onProceed}
            className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-indigo-950 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
          >
            <span>Desbloquear Mi Hoja de Ruta de 7 Días</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="w-full sm:w-auto py-4 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>Compartir en WhatsApp</span>
          </button>
        </div>

        <div className="text-center pt-1">
          <button
            onClick={onRetest}
            className="text-xs text-slate-400 hover:text-slate-200 underline decoration-slate-600 transition-colors"
          >
            ¿Quieres repetir las preguntas del test?
          </button>
        </div>
      </div>
    </div>
  );
}
