import { useState } from 'react';
import { ScanResultData, LeadInfo } from '../types';
import { useWhatsAppShare } from '../hooks/useWhatsAppShare';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';
import {
  Sparkles,
  Share2,
  Copy,
  Check,
  ArrowRight,
  Clock,
  Waves,
  Brain,
  ShieldCheck,
  AlertTriangle,
  HeartHandshake,
} from 'lucide-react';

interface ScanResultsProps {
  result: ScanResultData;
  lead?: LeadInfo;
  onUnlockRoadmap: () => void;
  onRetest: () => void;
}

export function ScanResults({
  result,
  lead,
  onUnlockRoadmap,
  onRetest,
}: ScanResultsProps) {
  const [copied, setCopied] = useState(false);
  const { shareScanResult } = useWhatsAppShare();

  const chartData = [
    { subject: 'Alerta Simpática', value: result.sympatheticScore, fullMark: 100 },
    { subject: 'Ciclo Circadiano', value: result.circadianScore, fullMark: 100 },
    { subject: 'Higiene Entorno', value: result.environmentScore, fullMark: 100 },
    { subject: 'Bioquímica 3AM', value: result.biochemicalScore, fullMark: 100 },
  ];

  const handleCopy = () => {
    const text = `🌙 Mi Diagnóstico D.U.E.R.M.E.™ Mujer:\n• Nivel de Insomnio: ${result.insomniaLevel} (${result.percentage}%)\n• Arquetipo: ${result.archetypeTitle}\n• Deuda de Sueño: ~${result.sleepDebtHours}h/noche\n• Frecuencia: ${result.recommendedFrequency}\n• Test: ${window.location.origin}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getBadgeStyle = () => {
    switch (result.insomniaLevel) {
      case 'Crítico':
        return 'bg-rose-950/80 border-rose-600/60 text-rose-300';
      case 'Severo':
        return 'bg-amber-950/80 border-amber-600/60 text-amber-300';
      case 'Moderado':
        return 'bg-yellow-950/80 border-yellow-600/60 text-yellow-300';
      default:
        return 'bg-emerald-950/80 border-emerald-600/60 text-emerald-300';
    }
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
          Tu Arquitectura del Descanso
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          Hemos analizado la saturación de tu sistema simpático, la latencia circadiana y tu arquetipo de sobrecarga nocturna.
        </p>
      </div>

      {/* Main Diagnostic Card */}
      <div className="bg-slate-900/90 border border-indigo-950 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-md relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Severity Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-indigo-950/80">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Índice de Disrupción Somática
            </span>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-xl border text-xs font-bold ${getBadgeStyle()}`}>
                Nivel {result.insomniaLevel} ({result.percentage}%)
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-cyan-400 font-display">
              {result.totalScore}
            </span>
            <span className="text-xs text-slate-400">/ {result.maxScore} puntos diagnósticos</span>
          </div>
        </div>

        {/* Dominant Archetype Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border border-indigo-800/60 space-y-2">
          <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold uppercase tracking-wider">
            <Brain className="w-4 h-4 text-cyan-400" />
            <span>Arquetipo Detectado:</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-100 font-display">
            {result.archetypeTitle}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {result.archetypeDescription}
          </p>
        </div>

        {/* Recharts Radar Chart */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block text-center">
            Matriz de Disrupción por Ejes
          </span>
          <div className="w-full h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="75%">
                <PolarGrid stroke="#1e1b4b" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fontSize: 11, fill: '#cbd5e1' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" tick={false} />
                <Radar
                  name="Disrupción"
                  dataKey="value"
                  stroke="#38bdf8"
                  fill="#38bdf8"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3 Metric Grid */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-indigo-950 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Deuda de Sueño</span>
            </div>
            <p className="text-lg font-bold text-slate-100">~{result.sleepDebtHours}h diarias</p>
            <p className="text-[11px] text-slate-400">Déficit en fases profundas</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-indigo-950 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Waves className="w-3.5 h-3.5 text-cyan-400" />
              <span>Frecuencia Óptima</span>
            </div>
            <p className="text-xs font-bold text-cyan-400 line-clamp-1">{result.recommendedFrequency}</p>
            <p className="text-[11px] text-slate-400">Para arrastre electroencefálico</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-indigo-950 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Protocolo Prioritario</span>
            </div>
            <p className="text-xs font-bold text-indigo-200 line-clamp-1">{result.actionPlanSummary}</p>
            <p className="text-[11px] text-slate-400">Enfoque de 7 Días con Clara Luz</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onUnlockRoadmap}
            className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-indigo-950 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
          >
            <span>Desbloquear Mi Hoja de Ruta de 7 Días</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => shareScanResult(result, lead)}
            className="w-full sm:w-auto py-4 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>Compartir en WhatsApp</span>
          </button>

          <button
            onClick={handleCopy}
            className="w-full sm:w-auto py-4 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            title="Copiar Diagnóstico"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copiado' : 'Copiar'}</span>
          </button>
        </div>

        <div className="text-center pt-1">
          <button
            onClick={onRetest}
            className="text-xs text-slate-400 hover:text-slate-200 underline decoration-slate-600 transition-colors"
          >
            ¿Quieres repetir las 7 preguntas del test diagnóstico?
          </button>
        </div>
      </div>
    </div>
  );
}
