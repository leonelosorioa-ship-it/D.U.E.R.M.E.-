import { useState } from 'react';
import { ProgramProgress } from '../types';
import jsPDF from 'jspdf';
import {
  Crown,
  FileDown,
  Sparkles,
  Award,
  BookOpen,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  Star,
  Download,
  Loader2,
  Calendar,
  Share2,
} from 'lucide-react';
import { audioCues } from '../utils/audioCues';
import { useWhatsAppShare } from '../hooks/useWhatsAppShare';

interface PremiumDashboardProps {
  progress: ProgramProgress;
  onNavigateToRoadmap?: () => void;
}

export function PremiumDashboard({ progress, onNavigateToRoadmap }: PremiumDashboardProps) {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const { shareAppInvite } = useWhatsAppShare();

  const isAllDaysCompleted = progress.completedDays.length >= 7;

  const handleDownloadPDF = () => {
    setIsGeneratingPdf(true);
    audioCues.playChime(528, 0.4);

    try {
      const doc = new jsPDF();
      const userName = progress.leadInfo.nombre || 'Alumna Valiosa';
      const userEmail = progress.leadInfo.email || 'No especificado';
      const archetype = progress.scanResult?.archetypeTitle || 'Mente Hiperexcitada por Cortisol';
      const insomniaLevel = progress.scanResult?.insomniaLevel || 'Moderado';

      // Cover Header
      doc.setFillColor(13, 27, 62); // #0d1b3e
      doc.rect(0, 0, 210, 45, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.text('D.U.E.R.M.E.™ MUJER', 20, 22);

      doc.setFontSize(10);
      doc.setTextColor(56, 189, 248); // Cyan
      doc.text('INFORME SOMÁTICO INTEGRAL DE 7 DÍAS • TU PODER MENTAL™ MUJER', 20, 32);

      // User info box
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(12);
      doc.text(`Alumna: ${userName}`, 20, 58);
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text(`Email: ${userEmail} | Fecha de Emisión: ${new Date().toLocaleDateString()}`, 20, 65);
      doc.text(`Mentora: Clara Luz | Diagnóstico: ${archetype} (Nivel ${insomniaLevel})`, 20, 72);

      // Divider line
      doc.setDrawColor(203, 213, 225);
      doc.line(20, 78, 190, 78);

      // Section 1: Summary
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(14);
      doc.text('1. Síntesis de la Transformación Neurocircadiana', 20, 90);

      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105);
      const summaryText =
        `Durante este programa de 7 noches, ${userName} ha implementado las herramientas somáticas de regulación vagal, higiene lumínica, cofactores minerales de magnesio y neuroacústica binaural. La corteza prefrontal ha reducido su hiperactivación nocturna, permitiendo una transición fluida hacia las ondas lentas Delta.`;
      doc.text(doc.splitTextToSize(summaryText, 170), 20, 98);

      // Section 2: 7 Days Protocol Summary
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(14);
      doc.text('2. Registro de Evaluaciones Diarias de Clara Luz', 20, 125);

      let yPos = 135;
      for (let i = 1; i <= 7; i++) {
        const evalData = progress.dayEvaluations[i];
        doc.setFontSize(10);
        doc.setTextColor(13, 27, 62);
        doc.text(`• Día ${i}: ${evalData ? evalData.summary.substring(0, 70) + '...' : 'Integración completada'}`, 25, yPos);
        yPos += 8;
      }

      // Section 3: Permanent 3-Block Sleep Protocol
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(14);
      doc.text('3. Tu Ritual Nocturno Permanente (Los 3 Bloques D.U.E.R.M.E.™)', 20, 205);

      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85);
      doc.text('• Bloque 1 (60 min antes): Vaciado mental en papel + infusión tibia con magnesio bisglicinato.', 25, 215);
      doc.text('• Bloque 2 (30 min antes): Luces cálidas bajas, dormitorio a 18°C y desconexión total de pantallas.', 25, 223);
      doc.text('• Bloque 3 (En cama): 4 ciclos de respiración 4-7-8 + Terapia Acústica Delta 1.5 Hz + Anclaje somático.', 25, 231);

      // Footer
      doc.setFillColor(241, 245, 249);
      doc.rect(0, 265, 210, 32, 'F');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text('Tu Poder Mental™ Mujer • Mentora Clara Luz • Leps Software Solutions™', 20, 278);
      doc.text('Recupera el sueño para recuperar tu energía y tu paz.', 20, 285);

      doc.save(`DUERME_Mujer_Informe_${userName.replace(/\s+/g, '_')}.pdf`);
    } catch (e) {
      console.error('Error generating PDF:', e);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/80 border border-amber-700/50 text-amber-300 text-xs font-semibold">
          <Crown className="w-3.5 h-3.5 text-amber-400" />
          <span>Ecosistema VIP Tu Poder Mental™ Mujer</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-100 font-display">
          Consolidación & Informe Integral D.U.E.R.M.E.™
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          Descarga tu informe clínico en PDF, accede a los protocolos avanzados de Clara Luz y mantén tu ritual para siempre.
        </p>
      </div>

      {/* PDF Download Action Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-indigo-800/80 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <FileDown className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl font-bold text-slate-100 font-display">
                Informe Integral Somático en PDF
              </h2>
            </div>
            <p className="text-xs text-slate-300 max-w-md">
              Genera tu documento oficial con el diagnóstico de Clara Luz, desglose de los 7 días y la guía permanente de los 3 bloques de sueño.
            </p>
          </div>

          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPdf}
            className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-xl shadow-amber-950/40 transition-all transform hover:scale-105 shrink-0"
          >
            {isGeneratingPdf ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generando Documento...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Descargar Informe PDF</span>
              </>
            )}
          </button>
        </div>

        {!isAllDaysCompleted && (
          <div className="p-3 rounded-xl bg-slate-950/60 border border-indigo-950 text-xs text-slate-400 flex items-center justify-between">
            <span>
              Progreso actual: <strong>{progress.completedDays.length}/7 días</strong> completados. Puedes descargar tu informe preliminar en cualquier momento.
            </span>
            {onNavigateToRoadmap && (
              <button
                onClick={onNavigateToRoadmap}
                className="text-cyan-400 hover:underline font-semibold text-xs ml-2"
              >
                Continuar Programa
              </button>
            )}
          </div>
        )}
      </div>

      {/* Badges Collection */}
      <div className="bg-slate-900/90 border border-indigo-950 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl backdrop-blur-md">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Award className="w-4 h-4 text-cyan-400" />
          Insignias de Maestría Somática
        </h3>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-indigo-950 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400 font-bold">
              🌱
            </div>
            <h4 className="text-sm font-bold text-slate-100">Iniciada de la Calma</h4>
            <p className="text-xs text-slate-400">Completaste tu escaneo diagnóstico y diste el primer paso.</p>
          </div>

          <div
            className={`p-4 rounded-2xl border space-y-2 ${
              progress.unlockedBadges.includes('coherencia_vagal')
                ? 'bg-indigo-950/60 border-cyan-400/80 text-slate-100'
                : 'bg-slate-950/30 border-slate-800 text-slate-500 opacity-60'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-700 flex items-center justify-center text-indigo-300 font-bold">
              🫁
            </div>
            <h4 className="text-sm font-bold">Coherencia Vagal</h4>
            <p className="text-xs text-slate-400">3 días completados de respiración 4-7-8 y sincronización.</p>
          </div>

          <div
            className={`p-4 rounded-2xl border space-y-2 ${
              progress.unlockedBadges.includes('maestra_del_descanso')
                ? 'bg-amber-950/60 border-amber-500/80 text-slate-100'
                : 'bg-slate-950/30 border-slate-800 text-slate-500 opacity-60'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-600 flex items-center justify-center text-amber-300 font-bold">
              👑
            </div>
            <h4 className="text-sm font-bold">Maestra del Descanso</h4>
            <p className="text-xs text-slate-400">Los 7 pilares integrados en tu arquitectura vital.</p>
          </div>
        </div>
      </div>

      {/* Share with Friends */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-indigo-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-slate-100">
            ¿Conoces a una mujer que necesite recuperar su descanso?
          </h4>
          <p className="text-xs text-slate-400">
            Comparte la plataforma D.U.E.R.M.E.™ Mujer de forma gratuita en WhatsApp.
          </p>
        </div>

        <button
          onClick={shareAppInvite}
          className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-colors shrink-0"
        >
          <Share2 className="w-4 h-4" />
          <span>Compartir D.U.E.R.M.E.™</span>
        </button>
      </div>
    </div>
  );
}
