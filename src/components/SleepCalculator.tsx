import { useState } from 'react';
import { Clock, Moon, Sun, Sparkles, Brain, CheckCircle2, ArrowRight } from 'lucide-react';
import { audioCues } from '../utils/audioCues';

export function SleepCalculator() {
  const [calcMode, setCalcMode] = useState<'wake' | 'now'>('wake');
  const [wakeHour, setWakeHour] = useState('07');
  const [wakeMinute, setWakeMinute] = useState('00');
  const [wakePeriod, setWakePeriod] = useState<'AM' | 'PM'>('AM');

  const LATENCY_MINUTES = 14; // Average biological time to fall asleep
  const CYCLE_MINUTES = 90; // Ultradian sleep cycle duration

  const calculateBedTimes = () => {
    let hour = parseInt(wakeHour, 10);
    if (wakePeriod === 'PM' && hour !== 12) hour += 12;
    if (wakePeriod === 'AM' && hour === 12) hour = 0;

    const targetDate = new Date();
    targetDate.setHours(hour, parseInt(wakeMinute, 10), 0, 0);

    const cycles = [6, 5, 4, 3]; // 6 cycles = 9h, 5 = 7.5h, 4 = 6h, 3 = 4.5h

    return cycles.map((c) => {
      const totalMinutes = c * CYCLE_MINUTES + LATENCY_MINUTES;
      const bedDate = new Date(targetDate.getTime() - totalMinutes * 60 * 1000);

      let h = bedDate.getHours();
      const m = bedDate.getMinutes().toString().padStart(2, '0');
      const period = h >= 12 ? 'PM' : 'AM';
      h = h % 12;
      if (h === 0) h = 12;

      return {
        cyclesCount: c,
        totalHours: (c * 1.5).toFixed(1),
        timeString: `${h}:${m} ${period}`,
        isOptimal: c === 5 || c === 6,
        description: c === 6 ? 'Excelente (9 horas de regeneración plena)' : c === 5 ? 'Óptimo (7.5 horas de equilibrio perfecto)' : c === 4 ? 'Aceptable (6 horas mínimas)' : 'Emergencia (4.5 horas)',
      };
    });
  };

  const calculateWakeTimesFromNow = () => {
    const now = new Date();
    const cycles = [3, 4, 5, 6];

    return cycles.map((c) => {
      const totalMinutes = c * CYCLE_MINUTES + LATENCY_MINUTES;
      const wakeDate = new Date(now.getTime() + totalMinutes * 60 * 1000);

      let h = wakeDate.getHours();
      const m = wakeDate.getMinutes().toString().padStart(2, '0');
      const period = h >= 12 ? 'PM' : 'AM';
      h = h % 12;
      if (h === 0) h = 12;

      return {
        cyclesCount: c,
        totalHours: (c * 1.5).toFixed(1),
        timeString: `${h}:${m} ${period}`,
        isOptimal: c === 5 || c === 6,
        description: c === 6 ? '6 Ciclos (9h - Descanso Total)' : c === 5 ? '5 Ciclos (7.5h - Más Recomendado)' : c === 4 ? '4 Ciclos (6h)' : '3 Ciclos (4.5h)',
      };
    });
  };

  const bedTimes = calculateBedTimes();
  const wakeTimes = calculateWakeTimesFromNow();

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-700/50 text-indigo-300 text-xs font-semibold">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>Fisiología Ultradiana del Sueño</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-100 font-display">
          Calculadora de Ciclos de 90 Minutos
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          Despertarte en medio de un ciclo NREM3 profundo te dejará con inercia del sueño y niebla mental. Despiértate al finalizar un ciclo completo de 90 minutos para levantarte ligera y llena de energía.
        </p>
      </div>

      {/* Main Calculator Box */}
      <div className="bg-slate-900/90 border border-indigo-950 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-md">
        {/* Toggle Mode */}
        <div className="flex bg-slate-950 rounded-2xl p-1.5 border border-indigo-950 max-w-md mx-auto">
          <button
            onClick={() => setCalcMode('wake')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              calcMode === 'wake'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sun className="w-4 h-4 text-amber-400" />
            <span>Quiero Despertar a las...</span>
          </button>
          <button
            onClick={() => setCalcMode('now')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              calcMode === 'now'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Moon className="w-4 h-4 text-cyan-400" />
            <span>Me Acuesto Ahora Mismo</span>
          </button>
        </div>

        {/* Form when calcMode === 'wake' */}
        {calcMode === 'wake' ? (
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center gap-3">
              <span className="text-xs font-bold text-slate-300">
                Selecciona tu hora deseada de despertar:
              </span>

              <div className="flex items-center gap-2">
                <select
                  value={wakeHour}
                  onChange={(e) => setWakeHour(e.target.value)}
                  className="px-4 py-3 rounded-2xl bg-slate-950 border border-indigo-950 text-xl font-bold text-cyan-400 outline-none"
                >
                  {Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0')).map(
                    (h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    )
                  )}
                </select>

                <span className="text-xl font-bold text-slate-400">:</span>

                <select
                  value={wakeMinute}
                  onChange={(e) => setWakeMinute(e.target.value)}
                  className="px-4 py-3 rounded-2xl bg-slate-950 border border-indigo-950 text-xl font-bold text-cyan-400 outline-none"
                >
                  {['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'].map(
                    (m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    )
                  )}
                </select>

                <select
                  value={wakePeriod}
                  onChange={(e) => setWakePeriod(e.target.value as 'AM' | 'PM')}
                  className="px-4 py-3 rounded-2xl bg-slate-950 border border-indigo-950 text-base font-bold text-indigo-300 outline-none"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>

            {/* Results Grid */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block text-center">
                Horas recomendadas para meterte en la cama (incluye 14 min de latencia):
              </span>

              <div className="grid sm:grid-cols-2 gap-3">
                {bedTimes.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                      item.isOptimal
                        ? 'bg-indigo-950/60 border-cyan-400/80 ring-1 ring-cyan-500/30 text-slate-100 shadow-lg shadow-indigo-950'
                        : 'bg-slate-950/60 border-indigo-950/80 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-extrabold text-cyan-400 font-display">
                          {item.timeString}
                        </span>
                        {item.isOptimal && (
                          <span className="px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/60 text-[10px] font-bold text-cyan-300">
                            Recomendado
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{item.description}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-indigo-300 block">
                        {item.cyclesCount} ciclos
                      </span>
                      <span className="text-[10px] text-slate-500">({item.totalHours} h)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* calcMode === 'now' */
          <div className="space-y-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block text-center">
              Si te acuestas en este instante, programa tu alarma a una de estas horas:
            </span>

            <div className="grid sm:grid-cols-2 gap-3">
              {wakeTimes.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                    item.isOptimal
                      ? 'bg-indigo-950/60 border-cyan-400/80 ring-1 ring-cyan-500/30 text-slate-100 shadow-lg shadow-indigo-950'
                      : 'bg-slate-950/60 border-indigo-950/80 text-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-extrabold text-cyan-400 font-display">
                        {item.timeString}
                      </span>
                      {item.isOptimal && (
                        <span className="px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/60 text-[10px] font-bold text-cyan-300">
                          Óptimo
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{item.description}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-indigo-300 block">
                      {item.cyclesCount} ciclos
                    </span>
                    <span className="text-[10px] text-slate-500">({item.totalHours} h)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Biological Explanation Note */}
        <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/40 flex items-start gap-3 text-xs text-slate-300 leading-relaxed">
          <Brain className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <strong>Regla de Oro de Clara Luz:</strong> Dormir 7 horas y media (5 ciclos) te hará despertar mucho más renovada que dormir 8 horas exactas, porque a las 8 horas te encontrarías en pleno valle de sueño profundo. Respeta los múltiplos de 90 minutos.
          </div>
        </div>
      </div>
    </div>
  );
}
