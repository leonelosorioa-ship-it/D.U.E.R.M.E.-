import { useState, useEffect } from 'react';
import { ProgramProgress } from '../types';
import jsPDF from 'jspdf';
import {
  Crown,
  FileDown,
  Sparkles,
  Award,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  Star,
  Download,
  Loader2,
  Share2,
  Flower2,
  Wind,
  Moon,
  Flame,
  Droplets,
  CheckSquare,
  Square,
  Trophy,
  Heart,
  ThermometerSnowflake,
  Music,
  EyeOff,
  Coffee,
  Check,
} from 'lucide-react';
import { audioCues } from '../utils/audioCues';
import { useWhatsAppShare } from '../hooks/useWhatsAppShare';

interface PremiumDashboardProps {
  progress: ProgramProgress;
  onNavigateToRoadmap?: () => void;
}

interface MicroChallenge {
  id: string;
  title: string;
  category: 'luz' | 'mente' | 'bioquimica' | 'respiracion' | 'ambiente' | 'acustica';
  description: string;
  points: number;
  icon: string;
}

const NIGHTLY_MICRO_CHALLENGES: MicroChallenge[] = [
  {
    id: 'luz_apagada',
    title: 'Apagón de Luz Azul (60 min antes)',
    category: 'luz',
    description: 'Atenúa luces blancas a luz ámbar cálida y guarda el móvil para activar tu melatonina natural.',
    points: 25,
    icon: 'eye_off',
  },
  {
    id: 'vaciado_mental',
    title: 'Vaciado Mental en Papel',
    category: 'mente',
    description: 'Escribe 3 pendientes o preocupaciones en una libreta para liberar a la corteza prefrontal.',
    points: 30,
    icon: 'heart',
  },
  {
    id: 'magnesio_infusion',
    title: 'Magnesio o Infusión Relajante',
    category: 'bioquimica',
    description: 'Toma magnesio bisglicinato o infusión tibia de manzanilla/melisa sin azúcar.',
    points: 20,
    icon: 'coffee',
  },
  {
    id: 'respiracion_478',
    title: '4 Ciclos de Respiración Vagal (4-7-8)',
    category: 'respiracion',
    description: 'Inhala en 4s, retén 7s y exhala en 8s para activar el freno parasimpático inmediato.',
    points: 35,
    icon: 'wind',
  },
  {
    id: 'temperatura_fresca',
    title: 'Santuario Fresco y Oscuro (18°C)',
    category: 'ambiente',
    description: 'Ventila la habitación y asegura una temperatura fresca para facilitar la caída térmica corporal.',
    points: 20,
    icon: 'thermometer',
  },
  {
    id: 'frecuencia_delta',
    title: 'Inmersión Acústica Delta 1.5 Hz',
    category: 'acustica',
    description: 'Reproduce frecuencias binaurales Delta durante 20 minutos con auriculares.',
    points: 30,
    icon: 'music',
  },
];

export function PremiumDashboard({ progress, onNavigateToRoadmap }: PremiumDashboardProps) {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const { shareAppInvite } = useWhatsAppShare();

  // Local storage for completed nightly micro-challenges
  const [completedChallenges, setCompletedChallenges] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('duerme_micro_challenges');
      return saved ? JSON.parse(saved) : ['luz_apagada'];
    } catch {
      return ['luz_apagada'];
    }
  });

  const [gardenWaterCount, setGardenWaterCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('duerme_garden_waters');
      return saved ? parseInt(saved, 10) : 3;
    } catch {
      return 3;
    }
  });

  const [waterAnimation, setWaterAnimation] = useState(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('duerme_micro_challenges', JSON.stringify(completedChallenges));
    } catch (e) {
      console.warn('Could not save micro challenges:', e);
    }
  }, [completedChallenges]);

  useEffect(() => {
    try {
      localStorage.setItem('duerme_garden_waters', gardenWaterCount.toString());
    } catch (e) {
      console.warn('Could not save garden waters:', e);
    }
  }, [gardenWaterCount]);

  const toggleChallenge = (id: string, points: number) => {
    setCompletedChallenges((prev) => {
      const isAlreadyCompleted = prev.includes(id);
      if (!isAlreadyCompleted) {
        audioCues.playChime(528, 0.4);
        return [...prev, id];
      } else {
        audioCues.playChime(396, 0.2);
        return prev.filter((item) => item !== id);
      }
    });
  };

  const handleWaterGarden = () => {
    setGardenWaterCount((c) => c + 1);
    setWaterAnimation(true);
    audioCues.playChime(528, 0.5);
    setTimeout(() => {
      audioCues.playChime(639, 0.3);
      setWaterAnimation(false);
    }, 1200);
  };

  // Calculate gamification points & garden stage
  const completedDaysCount = progress.completedDays.length;
  const isAllDaysCompleted = completedDaysCount >= 7;

  const challengeScore = completedChallenges.reduce((acc, id) => {
    const found = NIGHTLY_MICRO_CHALLENGES.find((c) => c.id === id);
    return acc + (found ? found.points : 0);
  }, 0);

  const totalSomaticPoints = completedDaysCount * 100 + challengeScore + gardenWaterCount * 15;
  const streakDays = Math.max(1, completedDaysCount);

  // Botanical Garden Stages (1 - 7)
  const gardenStages = [
    {
      level: 1,
      title: 'Semilla Serena en Tierra Fértil',
      subtitle: 'Inicio de la regulación del eje HPA y cortisol.',
      icon: '🌱',
      color: 'from-emerald-600 to-teal-500',
      ambientGlow: 'rgba(16, 185, 129, 0.2)',
      quote: 'Cada noche que decides cuidarte, siembras paz en tu biología.',
    },
    {
      level: 2,
      title: 'Brote Lunar de Melatonina',
      subtitle: 'Sincronización de tu reloj circadiano maestro (NSQ).',
      icon: '🌿',
      color: 'from-teal-500 to-cyan-500',
      ambientGlow: 'rgba(20, 184, 166, 0.25)',
      quote: 'Tu melatonina despierta al alejarte de la luz azul invasiva.',
    },
    {
      level: 3,
      title: 'Flor de Loto Vagal Nocturna',
      subtitle: 'Freno parasimpático fortalecido y ritmo cardíaco coherente.',
      icon: '🪷',
      color: 'from-cyan-500 to-blue-500',
      ambientGlow: 'rgba(6, 182, 212, 0.3)',
      quote: 'Tu nervio vago abraza a tu corazón cuando exhalas lento.',
    },
    {
      level: 4,
      title: 'Árbol de la Calma Inmutable',
      subtitle: 'Raíces profundas contra la rumiación y la autoexigencia.',
      icon: '🌳',
      color: 'from-blue-500 to-indigo-500',
      ambientGlow: 'rgba(59, 130, 246, 0.35)',
      quote: 'La mente se aquieta cuando el cuerpo se siente plenamente a salvo.',
    },
    {
      level: 5,
      title: 'Jardín de Paz Estelar NREM3',
      subtitle: 'Ondas Delta lentas y reparación celular neuroprotectora.',
      icon: '✨',
      color: 'from-indigo-500 to-purple-500',
      ambientGlow: 'rgba(99, 102, 241, 0.4)',
      quote: 'En el sueño profundo se limpian los residuos tóxicos neuronales.',
    },
    {
      level: 6,
      title: 'Oasis Zen del Buen Dormir',
      subtitle: 'Arquitectura circadiana autorregulada sin esfuerzo ni fármacos.',
      icon: '💎',
      color: 'from-purple-500 to-amber-500',
      ambientGlow: 'rgba(168, 85, 247, 0.45)',
      quote: 'Tu santuario interior te cobija cada noche en serenidad absoluta.',
    },
    {
      level: 7,
      title: 'Loto Cósmico Dorado de Soberanía',
      subtitle: 'Maestría permanente: vitalidad radiante cada mañana.',
      icon: '👑',
      color: 'from-amber-400 to-yellow-300',
      ambientGlow: 'rgba(245, 158, 11, 0.5)',
      quote: 'Has recuperado tu sueño para recuperar tu paz, tu luz y tu vida.',
    },
  ];

  // Derive current garden level (1-7)
  const currentGardenLevelIndex = Math.min(6, Math.max(0, completedDaysCount === 0 ? 0 : completedDaysCount - 1));
  const currentStage = gardenStages[currentGardenLevelIndex];
  const progressPercent = Math.min(100, Math.round(((completedDaysCount + (completedChallenges.length / 6)) / 8) * 100));

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
        `Durante este programa de 7 noches, ${userName} ha implementado las herramientas somáticas de regulación vagal, higiene lumínica, cofactores minerales de magnesio y neuroacústica binaural. La corteza prefrontal ha reducido su hiperactivación nocturna, permitiendo una transición fluida hacia las ondas lentas Delta. Puntos de calma acumulados: ${totalSomaticPoints} pts.`;
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

  const getChallengeIcon = (type: string) => {
    switch (type) {
      case 'eye_off':
        return <EyeOff className="w-4 h-4 text-amber-400" />;
      case 'heart':
        return <Heart className="w-4 h-4 text-rose-400" />;
      case 'coffee':
        return <Coffee className="w-4 h-4 text-emerald-400" />;
      case 'wind':
        return <Wind className="w-4 h-4 text-cyan-400" />;
      case 'thermometer':
        return <ThermometerSnowflake className="w-4 h-4 text-blue-400" />;
      case 'music':
        return <Music className="w-4 h-4 text-indigo-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div id="premium-dashboard-container" className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/80 border border-amber-700/50 text-amber-300 text-xs font-semibold shadow-lg shadow-amber-950/40">
          <Crown className="w-3.5 h-3.5 text-amber-400" />
          <span>Ecosistema VIP Tu Poder Mental™ Mujer</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-100 font-display">
          Jardín del Sueño & Micro-Retos Nocturnos
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto">
          Nutre tu santuario botánico interior, cumple tus micro-retos de higiene somática y consolida tu transformación neurocircadiana permanente.
        </p>
      </div>

      {/* Top Gamification Bar: Points, Streaks & Status */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-indigo-950/80 shadow-lg flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-950/70 border border-amber-600/50 flex items-center justify-center text-amber-400 shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Puntos de Calma</span>
            <span className="text-lg sm:text-xl font-extrabold text-amber-300 font-display">{totalSomaticPoints} <span className="text-xs font-normal text-slate-400">pts</span></span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-indigo-950/80 shadow-lg flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-950/70 border border-rose-600/50 flex items-center justify-center text-rose-400 shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Racha Somática</span>
            <span className="text-lg sm:text-xl font-extrabold text-rose-300 font-display">{streakDays} <span className="text-xs font-normal text-slate-400">noches</span></span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-indigo-950/80 shadow-lg flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-950/70 border border-emerald-600/50 flex items-center justify-center text-emerald-400 shrink-0">
            <Flower2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Nivel del Jardín</span>
            <span className="text-lg sm:text-xl font-extrabold text-emerald-300 font-display">Etapa {currentGardenLevelIndex + 1}/7</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-indigo-950/80 shadow-lg flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/70 border border-cyan-600/50 flex items-center justify-center text-cyan-400 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Retos Hoy</span>
            <span className="text-lg sm:text-xl font-extrabold text-cyan-300 font-display">{completedChallenges.length}/{NIGHTLY_MICRO_CHALLENGES.length}</span>
          </div>
        </div>
      </div>

      {/* SECTION 1: Evolving 'Jardín del Sueño' Visualization */}
      <div className="bg-gradient-to-b from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-900/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
        {/* Ambient subtle glow */}
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-all duration-1000"
          style={{ background: currentStage.ambientGlow }}
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{currentStage.icon}</span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-100 font-display">
                {currentStage.title}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-cyan-300 font-medium">
              {currentStage.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="water-garden-button"
              onClick={handleWaterGarden}
              className="px-4 py-2.5 rounded-2xl bg-cyan-950/80 hover:bg-cyan-900/80 border border-cyan-500/50 text-cyan-300 text-xs font-bold flex items-center gap-2 shadow-lg shadow-cyan-950/50 transition-all transform active:scale-95"
            >
              <Droplets className={`w-4 h-4 text-cyan-400 ${waterAnimation ? 'animate-bounce' : ''}`} />
              <span>Regar con Serenidad ({gardenWaterCount})</span>
            </button>
          </div>
        </div>

        {/* Botanical Visual Centerpiece */}
        <div className="py-6 flex flex-col items-center justify-center relative">
          <div
            className={`w-44 h-44 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr ${currentStage.color} p-1 shadow-2xl transition-all duration-700 relative flex items-center justify-center ${
              waterAnimation ? 'scale-105 ring-8 ring-cyan-400/30' : ''
            }`}
          >
            <div className="w-full h-full bg-slate-950/90 rounded-full flex flex-col items-center justify-center p-4 text-center relative overflow-hidden backdrop-blur-sm">
              {/* Pulsing rings */}
              <div className="absolute inset-0 rounded-full border border-white/10 animate-ping opacity-20" />
              
              <span className="text-5xl sm:text-6xl filter drop-shadow-md select-none transform transition-transform duration-500 hover:scale-110">
                {currentStage.icon}
              </span>

              <span className="text-xs font-extrabold text-slate-100 font-display mt-2">
                Nivel {currentGardenLevelIndex + 1} de 7
              </span>
              <span className="text-[10px] text-slate-400">
                {completedDaysCount} Días Asimilados
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-300 italic text-center max-w-md mt-4 leading-relaxed font-medium">
            "{currentStage.quote}"
          </p>
        </div>

        {/* 7-Stage Botanical Progress Path */}
        <div className="space-y-2 pt-2 border-t border-indigo-950/80">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Evolución Botánica del Sueño:</span>
            <span className="text-cyan-300">{progressPercent}% Vitalidad Somática</span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {gardenStages.map((stage, idx) => {
              const isUnlocked = idx <= currentGardenLevelIndex;
              const isCurrent = idx === currentGardenLevelIndex;

              return (
                <div
                  key={stage.level}
                  className={`p-2 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                    isCurrent
                      ? 'bg-cyan-950/80 border-cyan-400 shadow-md shadow-cyan-950 ring-1 ring-cyan-400/50'
                      : isUnlocked
                      ? 'bg-slate-900 border-emerald-800/80 text-emerald-300'
                      : 'bg-slate-950/40 border-slate-800/60 text-slate-600 opacity-50'
                  }`}
                  title={`${stage.title}: ${stage.subtitle}`}
                >
                  <span className="text-base sm:text-lg mb-0.5">{stage.icon}</span>
                  <span className="text-[9px] font-bold truncate max-w-full hidden sm:block">
                    Día {stage.level}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION 2: Gamification Micro-Retos Nocturnos */}
      <div className="bg-slate-900/90 border border-indigo-950 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-indigo-950">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-bold text-slate-100 font-display">
                Micro-Retos del Descanso Nocturno
              </h3>
            </div>
            <p className="text-xs text-slate-300">
              Marca las acciones somáticas que realizas esta noche para sumar puntos de calma y florecer tu jardín.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-950 px-3.5 py-1.5 rounded-xl border border-indigo-950 text-xs">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="text-slate-300 font-semibold">
              Hoy: <strong className="text-amber-300">+{challengeScore} pts</strong>
            </span>
          </div>
        </div>

        {/* Micro-Challenges Grid */}
        <div className="grid sm:grid-cols-2 gap-3.5">
          {NIGHTLY_MICRO_CHALLENGES.map((challenge) => {
            const isDone = completedChallenges.includes(challenge.id);

            return (
              <div
                key={challenge.id}
                onClick={() => toggleChallenge(challenge.id, challenge.points)}
                className={`p-4 rounded-2xl border cursor-pointer select-none transition-all flex items-start justify-between gap-3.5 ${
                  isDone
                    ? 'bg-indigo-950/60 border-cyan-400/80 shadow-md shadow-indigo-950 ring-1 ring-cyan-500/30'
                    : 'bg-slate-950/60 border-indigo-950/80 hover:border-indigo-800 hover:bg-slate-900/80'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                    {getChallengeIcon(challenge.icon)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className={`text-xs sm:text-sm font-bold ${isDone ? 'text-slate-100' : 'text-slate-200'}`}>
                        {challenge.title}
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {challenge.description}
                    </p>
                    <span className="inline-block text-[10px] font-bold text-amber-300 bg-amber-950/50 border border-amber-700/40 px-2 py-0.5 rounded-md">
                      +{challenge.points} Puntos de Calma
                    </span>
                  </div>
                </div>

                <div className="shrink-0 mt-1">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-colors ${
                      isDone
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-400 border-cyan-300 text-slate-950'
                        : 'border-slate-700 bg-slate-900 text-transparent'
                    }`}
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: Somatic Badges & PDF Official Report */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Somatic Mastery Badges */}
        <div className="bg-slate-900/90 border border-indigo-950 rounded-3xl p-6 space-y-4 shadow-xl backdrop-blur-md flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-cyan-400" />
              Insignias de Maestría Somática
            </h3>
            <p className="text-xs text-slate-400">
              Desbloquea condecoraciones exclusivas conforme integras el protocolo de Clara Luz.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2.5 pt-2">
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-indigo-950 space-y-1 text-center">
              <div className="w-9 h-9 mx-auto rounded-xl bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400 font-bold text-sm">
                🌱
              </div>
              <h4 className="text-[11px] font-bold text-slate-100">Iniciada</h4>
              <p className="text-[9px] text-slate-400">Escaneo listo</p>
            </div>

            <div
              className={`p-3 rounded-2xl border space-y-1 text-center transition-all ${
                progress.unlockedBadges.includes('coherencia_vagal') || completedDaysCount >= 3
                  ? 'bg-indigo-950/60 border-cyan-400/80 text-slate-100'
                  : 'bg-slate-950/30 border-slate-800 text-slate-500 opacity-60'
              }`}
            >
              <div className="w-9 h-9 mx-auto rounded-xl bg-indigo-950 border border-indigo-700 flex items-center justify-center text-indigo-300 font-bold text-sm">
                🫁
              </div>
              <h4 className="text-[11px] font-bold">Vagal 4-7-8</h4>
              <p className="text-[9px] text-slate-400">3 Días logrados</p>
            </div>

            <div
              className={`p-3 rounded-2xl border space-y-1 text-center transition-all ${
                progress.unlockedBadges.includes('maestra_del_descanso') || isAllDaysCompleted
                  ? 'bg-amber-950/60 border-amber-500/80 text-slate-100'
                  : 'bg-slate-950/30 border-slate-800 text-slate-500 opacity-60'
              }`}
            >
              <div className="w-9 h-9 mx-auto rounded-xl bg-amber-950 border border-amber-600 flex items-center justify-center text-amber-300 font-bold text-sm">
                👑
              </div>
              <h4 className="text-[11px] font-bold">Maestra VIP</h4>
              <p className="text-[9px] text-slate-400">7 Días totales</p>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={shareAppInvite}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Invitar a una Amiga por WhatsApp</span>
            </button>
          </div>
        </div>

        {/* PDF Download Clinical Report Banner */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-indigo-800/80 rounded-3xl p-6 space-y-4 shadow-xl backdrop-blur-md flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FileDown className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-slate-100 font-display">
                Informe Integral Somático en PDF
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Descarga tu expediente oficial con el diagnóstico de Clara Luz, desglose de los 7 días de asimilación y la guía permanente de los 3 bloques de sueño.
            </p>
          </div>

          <div className="space-y-3">
            <button
              id="download-pdf-button"
              onClick={handleDownloadPDF}
              disabled={isGeneratingPdf}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-xl shadow-amber-950/40 transition-all transform hover:scale-102 shrink-0"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generando Documento Clínico...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Descargar Informe Somático PDF</span>
                </>
              )}
            </button>

            {onNavigateToRoadmap && !isAllDaysCompleted && (
              <button
                onClick={onNavigateToRoadmap}
                className="w-full py-2.5 text-xs text-cyan-300 hover:text-cyan-200 font-semibold text-center hover:underline flex items-center justify-center gap-1"
              >
                <span>Continuar mi viaje de 7 días en el Roadmap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
