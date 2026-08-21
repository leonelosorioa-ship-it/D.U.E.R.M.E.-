import { useState } from 'react';
import { INITIAL_SCAN_QUESTIONS } from '../questions';
import { Sparkles, ArrowRight, ArrowLeft, Moon, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { audioCues } from '../utils/audioCues';

interface ScanWizardProps {
  onComplete: (answers: { [questionId: number]: number }) => void;
  onCancel: () => void;
}

export function ScanWizard({ onComplete, onCancel }: ScanWizardProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [questionId: number]: number }>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const currentQuestion = INITIAL_SCAN_QUESTIONS[currentStepIndex];
  const totalQuestions = INITIAL_SCAN_QUESTIONS.length;
  const progressPercent = Math.round(((currentStepIndex + 1) / totalQuestions) * 100);

  const handleSelectOption = (index: number) => {
    setSelectedOption(index);
    audioCues.playChime(432, 0.2);
  };

  const handleNext = () => {
    if (selectedOption === null) return;

    const newAnswers = {
      ...answers,
      [currentQuestion.id]: selectedOption,
    };
    setAnswers(newAnswers);

    if (currentStepIndex < totalQuestions - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      // Pre-select if previously answered
      const nextQ = INITIAL_SCAN_QUESTIONS[currentStepIndex + 1];
      setSelectedOption(newAnswers[nextQ.id] ?? null);
    } else {
      audioCues.playChime(528, 0.6);
      onComplete(newAnswers);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      const prevQ = INITIAL_SCAN_QUESTIONS[currentStepIndex - 1];
      setSelectedOption(answers[prevQ.id] ?? null);
    } else {
      onCancel();
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Header & Progress Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <button
            onClick={handlePrevious}
            className="flex items-center gap-1 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{currentStepIndex === 0 ? 'Volver al Inicio' : 'Anterior'}</span>
          </button>

          <span className="font-bold text-cyan-400 uppercase tracking-wider text-[11px]">
            Pregunta {currentStepIndex + 1} de {totalQuestions}
          </span>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="w-full h-2 rounded-full bg-slate-900 border border-indigo-950 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-slate-900/90 border border-indigo-950 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-md relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Question Heading */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-800/60 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Evaluación Somática Circadiana</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100 font-display leading-snug">
            {currentQuestion.question}
          </h2>

          {currentQuestion.subtitle && (
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {currentQuestion.subtitle}
            </p>
          )}
        </div>

        {/* Options List */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOption === idx;

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between gap-4 transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-indigo-950 to-blue-950/80 border-cyan-400 ring-2 ring-cyan-500/20 text-slate-100 shadow-lg shadow-indigo-950'
                    : 'bg-slate-950/60 border-indigo-950/80 text-slate-300 hover:border-indigo-800 hover:bg-slate-900/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-500 text-slate-950'
                        : 'border-slate-700 bg-slate-900'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>

                  <span className="text-xs sm:text-sm font-medium leading-relaxed">
                    {option.text}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Navigation Action */}
        <div className="pt-4 flex items-center justify-end">
          <button
            onClick={handleNext}
            disabled={selectedOption === null}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm shadow-xl shadow-indigo-950 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
          >
            <span>{currentStepIndex === totalQuestions - 1 ? 'Analizar Mi Descanso' : 'Siguiente'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
