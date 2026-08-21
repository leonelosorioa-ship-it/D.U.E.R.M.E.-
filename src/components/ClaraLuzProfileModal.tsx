import { X, Moon, Heart, Sparkles, ShieldCheck, Award, BookOpen } from 'lucide-react';

interface ClaraLuzProfileModalProps {
  onClose: () => void;
}

export function ClaraLuzProfileModal({ onClose }: ClaraLuzProfileModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-indigo-900/80 rounded-3xl max-w-xl w-full my-auto shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-indigo-950 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-400 p-0.5 shadow-xl shadow-indigo-950">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-400 font-extrabold text-lg font-display">
                CL
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-slate-100 font-display">Clara Luz</h2>
                <span className="px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-800 text-[10px] font-bold text-cyan-300">
                  Fundadora & Mentora
                </span>
              </div>
              <p className="text-xs text-indigo-300 font-medium">
                Tu Poder Mental™ Mujer ("Fortalece tu mente · Reconecta contigo")
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-300 text-xs sm:text-sm leading-relaxed">
          <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/40 space-y-2">
            <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">
              Manifiesto de la Mentora
            </span>
            <p className="italic text-slate-200 font-medium">
              "Dormir bien no es una meta que se conquista luchando; es una rendición amorosa del cuerpo que solo ocurre cuando la mente se siente completamente a salvo."
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-100 font-display flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Sobre Clara Luz y el Método D.U.E.R.M.E.™
            </h3>
            <p>
              Clara Luz ha dedicado más de una década al estudio de la neurobiología del descanso, la regulación del nervio vago y la reprogramación somática de la hiperalerta en mujeres de alta autoexigencia.
            </p>
            <p>
              A través del ecosistema <strong>Tu Poder Mental™ Mujer</strong>, Clara Luz ha transformado la vida de miles de mujeres que padecían insomnio crónico, despertares nocturnos con pánico y agotamiento suprarrenal, devolviéndoles la soberanía sobre su descanso sin fármacos ni dependencias.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-indigo-950 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Enfoque Somático Puro</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Desactivación refleja de la corteza prefrontal y el tono simpático.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-indigo-950 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                <Heart className="w-4 h-4 text-rose-400" />
                <span>Acompañamiento Cercano</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Inteligencia artificial calibrada con tono cálido, empático y maternal.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-indigo-950 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>Tu Poder Mental™ Mujer • Clara Luz</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
