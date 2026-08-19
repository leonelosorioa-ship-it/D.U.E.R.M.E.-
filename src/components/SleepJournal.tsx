import { useState, FormEvent } from 'react';
import { SleepLogEntry } from '../types';
import { BookOpen, Plus, Moon, Sun, Star, Clock, Calendar, AlertCircle } from 'lucide-react';

interface SleepJournalProps {
  logs: SleepLogEntry[];
  onAddLog: (log: Omit<SleepLogEntry, 'id'>) => void;
}

export function SleepJournal({ logs, onAddLog }: SleepJournalProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [bedTime, setBedTime] = useState('23:00');
  const [wakeTime, setWakeTime] = useState('07:00');
  const [timeToFallAsleepMin, setTimeToFallAsleepMin] = useState(25);
  const [awakeningsCount, setAwakeningsCount] = useState(1);
  const [qualityRating, setQualityRating] = useState(4);
  const [morningEnergyRating, setMorningEnergyRating] = useState(3);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onAddLog({
      date,
      bedTime,
      wakeTime,
      timeToFallAsleepMin: Number(timeToFallAsleepMin),
      awakeningsCount: Number(awakeningsCount),
      qualityRating,
      morningEnergyRating,
      notes: notes.trim(),
    });
    setShowAddForm(false);
    setNotes('');
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 font-display flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-cyan-400" />
            <span>Diario Somático del Sueño</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Monitorea tu evolución circadiana, latencia de inicio y calidad del despertar.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(prev => !prev)}
          className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-950 transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? 'Cancelar' : 'Registrar Noche'}</span>
        </button>
      </div>

      {/* Add Form Card */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-slate-900/90 border border-indigo-900/60 rounded-3xl p-6 space-y-4 shadow-2xl backdrop-blur-md">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
            Registrar Noche de Descanso
          </h3>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Fecha</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-indigo-950 text-xs text-slate-100 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Hora en la Cama</label>
              <input
                type="time"
                required
                value={bedTime}
                onChange={(e) => setBedTime(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-indigo-950 text-xs text-slate-100 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Hora de Despertar</label>
              <input
                type="time"
                required
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-indigo-950 text-xs text-slate-100 outline-none"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Minutos hasta dormir (Latencia)</label>
              <input
                type="number"
                min="0"
                max="300"
                value={timeToFallAsleepMin}
                onChange={(e) => setTimeToFallAsleepMin(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-indigo-950 text-xs text-slate-100 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Despertares nocturnos</label>
              <input
                type="number"
                min="0"
                max="20"
                value={awakeningsCount}
                onChange={(e) => setAwakeningsCount(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-indigo-950 text-xs text-slate-100 outline-none"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Calidad de Sueño (1-5)</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(v => (
                  <button
                    type="button"
                    key={v}
                    onClick={() => setQualityRating(v)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold border ${
                      qualityRating >= v ? 'bg-amber-500/20 border-amber-500 text-amber-300' : 'bg-slate-950 border-slate-800 text-slate-500'
                    }`}
                  >
                    ★ {v}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Energía Matutina (1-5)</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(v => (
                  <button
                    type="button"
                    key={v}
                    onClick={() => setMorningEnergyRating(v)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold border ${
                      morningEnergyRating >= v ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' : 'bg-slate-950 border-slate-800 text-slate-500'
                    }`}
                  >
                    ★ {v}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Notas Somáticas o Emocionales</label>
            <input
              type="text"
              placeholder="Ej. Usé ondas Delta, cena liviana, me desperté sin pesadez..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-indigo-950 text-xs text-slate-100 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg transition-colors"
          >
            Guardar Entrada en Diario
          </button>
        </form>
      )}

      {/* Logs List */}
      <div className="space-y-3">
        {logs.length === 0 ? (
          <div className="p-8 rounded-3xl bg-slate-900/40 border border-indigo-950 text-center space-y-2">
            <Moon className="w-8 h-8 text-cyan-400 mx-auto opacity-40" />
            <p className="text-xs text-slate-400">
              No tienes registros de sueño aún. Haz clic en "Registrar Noche" para documentar tu evolución.
            </p>
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="p-4 sm:p-5 rounded-2xl bg-slate-900/70 border border-indigo-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{log.date}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-indigo-300">{log.bedTime} - {log.wakeTime}</span>
                </div>
                {log.notes && <p className="text-xs text-slate-300 italic">"{log.notes}"</p>}
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px]">Latencia</span>
                  <span className="font-bold text-slate-200">{log.timeToFallAsleepMin} min</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px]">Despertares</span>
                  <span className="font-bold text-slate-200">{log.awakeningsCount}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px]">Calidad</span>
                  <span className="font-bold text-amber-400">★ {log.qualityRating}/5</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
