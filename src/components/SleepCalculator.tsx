import { useState } from 'react';
import { Clock, Moon, Sun, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export function SleepCalculator() {
  const [calcMode, setCalcMode] = useState<'wake' | 'bed'>('wake');
  const [targetTime, setTargetTime] = useState('06:30');

  const calculateSleepTimes = () => {
    const [hours, minutes] = targetTime.split(':').map(Number);
    const targetDate = new Date();
    targetDate.setHours(hours, minutes, 0, 0);

    const cycles = [6, 5, 4, 3]; // 9h, 7.5h, 6h, 4.5h

    if (calcMode === 'wake') {
      // User wants to wake up at targetTime -> calculate bed times (- (cycles * 90 min + 15 min latency))
      return cycles.map(c => {
        const totalMinutes = c * 90 + 15; // 15 min to fall asleep
        const bedDate = new Date(targetDate.getTime() - totalMinutes * 60 * 1000);
        const hh = bedDate.getHours().toString().padStart(2, '0');
        const mm = bedDate.getMinutes().toString().padStart(2, '0');
        return {
          cycles: c,
          hours: (c * 1.5).toFixed(1),
          time: `${hh}:${mm}`,
          isRecommended: c === 5 || c === 6,
          label: c === 6 ? 'Óptimo (9h - Reparación profunda)' : c === 5 ? 'Recomendado (7.5h - Equilibrio perfecto)' : c === 4 ? 'Mínimo funcional (6h)' : 'Emergencia (4.5h)',
        };
      });
    } else {
      // User is going to bed now -> calculate wake times (+ (cycles * 90 min + 15 min latency))
      const now = new Date();
      return cycles.map(c => {
        const totalMinutes = c * 90 + 15;
        const wakeDate = new Date(now.getTime() + totalMinutes * 60 * 1000);
        const hh = wakeDate.getHours().toString().padStart(2, '0');
        const mm = wakeDate.getMinutes().toString().padStart(2, '0');
        return {
          cycles: c,
          hours: (c * 1.5).toFixed(1),
          time: `${hh}:${mm}`,
          isRecommended: c === 5 || c === 6,
          label: c === 6 ? 'Óptimo (9h - 6 Ciclos NREM/REM)' : c === 5 ? 'Recomendado (7.5h - 5 Ciclos)' : c === 4 ? '4 Ciclos (6h)' : '3 Ciclos (4.5h)',
        };
      });
    }
  };

  const results = calculateSleepTimes();

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-100 font-display flex items-center justify-center gap-2">
          <Clock className="w-6 h-6 text-cyan-400" />
          <span>Calculadora de Ciclos Ultradianos (90 min)</span>
        </h2>
        <p className="text-xs text-slate-400 max-w-lg mx-auto">
          Despertar en medio de la fase NREM3 provoca inercia de sueño y fatiga matutina. Sincroniza tu alarma con el final de un ciclo biológico.
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => setCalcMode('wake')}
          className={`flex-1 p-4 rounded-2xl border transition-all flex items-center gap-3 ${
            calcMode === 'wake'
              ? 'bg-indigo-900/40 border-cyan-400 text-slate-100 shadow-lg shadow-indigo-950 ring-2 ring-cyan-500/20'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-slate-200'
          }`}
        >
          <Sun className="w-5 h-5 text-amber-400 shrink-0" />
          <div className="text-left">
            <span className="text-xs font-bold block">Quiero levantarme a cierta hora</span>
            <span className="text-[11px] text-slate-400">Calcula a qué hora meterte en cama</span>
          </div>
        </button>

        <button
          onClick={() => setCalcMode('bed')}
          className={`flex-1 p-4 rounded-2xl border transition-all flex items-center gap-3 ${
            calcMode === 'bed'
              ? 'bg-indigo-900/40 border-cyan-400 text-slate-100 shadow-lg shadow-indigo-950 ring-2 ring-cyan-500/20'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-slate-200'
          }`}
        >
          <Moon className="w-5 h-5 text-cyan-400 shrink-0" />
          <div className="text-left">
            <span className="text-xs font-bold block">Me voy a dormir ahora</span>
            <span className="text-[11px] text-slate-400">Calcula tus horas óptimas de alarma</span>
          </div>
        </button>
      </div>

      {/* Time Picker if 'wake' mode */}
      {calcMode === 'wake' && (
        <div className="bg-slate-900/80 border border-indigo-950 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-200 block">
              ¿A qué hora deseas levantarte mañana?
            </label>
            <p className="text-[11px] text-slate-400">Incluye 15 minutos automáticos de inducción al sueño.</p>
          </div>

          <input
            type="time"
            value={targetTime}
            onChange={(e) => setTargetTime(e.target.value)}
            className="px-5 py-3 rounded-2xl bg-slate-950 border border-indigo-900 text-xl font-bold font-mono text-cyan-300 focus:border-cyan-400 outline-none shadow-inner"
          />
        </div>
      )}

      {/* Results Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          {calcMode === 'wake' ? 'Horarios Sugeridos para Acostarte:' : 'Horas Sugeridas para tu Alarma:'}
        </h3>

        <div className="grid sm:grid-cols-2 gap-4">
          {results.map((r, i) => (
            <div
              key={i}
              className={`p-5 rounded-2xl border transition-all relative overflow-hidden ${
                r.isRecommended
                  ? 'bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-950 border-cyan-400/80 shadow-xl shadow-cyan-950/20'
                  : 'bg-slate-950/50 border-slate-800/80 text-slate-300'
              }`}
            >
              {r.isRecommended && (
                <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/50 text-[10px] font-bold text-cyan-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Recomendado
                </span>
              )}

              <div className="space-y-1">
                <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-100 font-display">
                  {r.time}
                </span>
                <p className="text-xs font-semibold text-cyan-300">
                  {r.cycles} ciclos • {r.hours} horas de sueño
                </p>
                <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                  {r.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
