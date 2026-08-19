import { useState } from 'react';
import { ArrowLeft, ArrowRight, Sparkles, HelpCircle, Check, Moon, ShieldAlert } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../questions';
import { QuizAnswers } from '../types';

interface ScanWizardProps {
  onComplete: (answers: QuizAnswers) => void;
  onCancel: () => void;
}

export function ScanWizard({ onComplete, onCancel }: ScanWizardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  const currentQuestion = QUIZ_QUESTIONS[currentIndex];
  const totalQuestions = QUIZ_QUESTIONS.length;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  const handleSelectOption = (optionId: string, score: number) => {
    setSelectedOptionId(optionId);
    const updatedAnswers: QuizAnswers = {
      ...answers,
      [currentQuestion.id]: {
        optionId,
        score,
      },
    };
    setAnswers(updatedAnswers);

    // Auto-advance after brief soothing visual delay
    setTimeout(() => {
      if (currentIndex < totalQuestions - 1) {
        setCurrentIndex(prev => prev + 1);
        const nextQ = QUIZ_QUESTIONS[currentIndex + 1];
        setSelectedOptionId(updatedAnswers[nextQ.id]?.optionId || null);
      } else {
        onComplete(updatedAnswers);
      }
    }, 280);
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevIdx = currentIndex - 1;
      setCurrentIndex(prevIdx);
      const prevQ = QUIZ_QUESTIONS[prevIdx];
      setSelectedOptionId(answers[prevQ.id]?.optionId || null);
    } else {
      onCancel();
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Top Header & Back */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrev}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{currentIndex === 0 ? 'Volver al Inicio' : 'Pregunta Anterior'}</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-cyan-400">
            Pregunta {currentIndex + 1} de {totalQuestions}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 rounded-full bg-slate-900 border border-indigo-950 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-slate-900/90 border border-indigo-950/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-md">
        {/* Category Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-700/50 text-[11px] font-semibold text-indigo-300">
          <Moon className="w-3 h-3 text-cyan-400" />
          <span className="capitalize">{currentQuestion.category}</span>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 leading-snug font-display">
            {currentQuestion.title}
          </h2>
          {currentQuestion.subtitle && (
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {currentQuestion.subtitle}
            </p>
          )}
        </div>

        {/* Options List */}
        <div className="space-y-3 pt-2">
          {currentQuestion.options.map((option) => {
            const isSelected = selectedOptionId === option.id;
            return (
              <button
                key={option.id}
                onClick={() => handleSelectOption(option.id, option.score)}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 group ${
                  isSelected
                    ? 'bg-indigo-900/40 border-cyan-400/80 ring-2 ring-cyan-500/20 text-slate-100 shadow-lg shadow-indigo-950'
                    : 'bg-slate-950/50 border-slate-800/80 hover:border-indigo-700/60 hover:bg-slate-900/80 text-slate-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-cyan-500 border-cyan-400 text-slate-950'
                      : 'border-slate-700 group-hover:border-slate-500'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>

                <div className="flex-1">
                  <span className="text-xs sm:text-sm font-medium leading-relaxed">
                    {option.text}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Safety / Privacy Note */}
      <div className="flex items-center justify-center gap-2 text-center text-slate-400 text-[11px]">
        <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
        <span>Tus respuestas son estrictamente confidenciales y sirven para calibrar tu frecuencia acústica ideal.</span>
      </div>
    </div>
  );
}
