import React, { useState } from 'react';
import { Award, CheckCircle2, Clock, Target, XCircle } from 'lucide-react';
import type { ClassLevel, NavRoute, QuizAttempt } from '../types/edugenius';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { SectionHeader } from '../components/ui/SectionHeader';
import { StatMetric } from '../components/ui/StatMetric';

interface ResultsViewProps {
  classLevel: ClassLevel;
  attempts: QuizAttempt[];
  selectedAttemptId?: string;
  onNavigate: (route: NavRoute) => void;
}

export function ResultsView({
  classLevel,
  attempts,
  selectedAttemptId,
  onNavigate,
}: ResultsViewProps) {
  const classAttempts = attempts.filter((a) => a.classLevel === classLevel);
  const [activeId, setActiveId] = useState<string>(
    selectedAttemptId || classAttempts[0]?.id || attempts[0]?.id || ''
  );

  const visibleAttempts = classAttempts.length > 0 ? classAttempts : attempts;
  const activeAttempt =
    visibleAttempts.find((a) => a.id === activeId) || visibleAttempts[0] || null;

  const avgAccuracy =
    visibleAttempts.length > 0
      ? Math.round(
          visibleAttempts.reduce((sum, a) => sum + a.accuracy, 0) / visibleAttempts.length
        )
      : 0;

  const totalQuestionsAnswered = visibleAttempts.reduce((sum, a) => sum + a.total, 0);
  const totalCorrect = visibleAttempts.reduce((sum, a) => sum + a.score, 0);

  if (!activeAttempt) {
    return (
      <div className="space-y-6">
        <SectionHeader
          title={`Class ${classLevel} Final Results & Progress`}
          subtitle="Review marks, correct answers, NCERT explanations, and accuracy trends."
        />
        <EmptyState
          icon={<Award className="w-5 h-5" />}
          title="No quiz results recorded yet"
          description="Complete a Class quiz to view your marks, correct answers, and detailed concept explanations."
          action={
            <Button variant="primary" onClick={() => onNavigate('quizzes')}>
              Take a Class {classLevel} Quiz
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        title={`Class ${classLevel} Results, Answers & Progress`}
        subtitle="Inspect your latest marks, compare your selections against correct NCERT answers, and track accuracy."
        action={
          <Button variant="primary" onClick={() => onNavigate('quizzes')}>
            Take Another Quiz
          </Button>
        }
      />

      {/* Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatMetric
          label="Latest Marks"
          value={`${activeAttempt.score} / ${activeAttempt.total}`}
          detail={`${activeAttempt.subjectName} · ${activeAttempt.dateIso}`}
          icon={<Award className="w-4 h-4" />}
          accent="indigo"
        />
        <StatMetric
          label="Latest Accuracy"
          value={`${activeAttempt.accuracy}%`}
          detail={activeAttempt.chapterTitle}
          icon={<Target className="w-4 h-4" />}
          accent="blue"
        />
        <StatMetric
          label="Cumulative Average"
          value={`${avgAccuracy}%`}
          detail={`${totalCorrect}/${totalQuestionsAnswered} total questions correct`}
          icon={<CheckCircle2 className="w-4 h-4" />}
          accent="violet"
        />
        <StatMetric
          label="Completion Time"
          value={`${Math.floor(activeAttempt.durationSec / 60)}m ${activeAttempt.durationSec % 60}s`}
          detail={`${visibleAttempts.length} attempt(s) logged`}
          icon={<Clock className="w-4 h-4" />}
          accent="slate"
        />
      </div>

      {/* Attempt Selector + Answer Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Attempt History List */}
        <section className="lg:col-span-4 bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/60">
            <h3 className="text-sm font-semibold text-slate-900">
              Attempt History ({visibleAttempts.length})
            </h3>
          </div>
          <div className="divide-y divide-slate-200">
            {visibleAttempts.map((attempt) => {
              const selected = attempt.id === activeAttempt.id;
              return (
                <button
                  key={attempt.id}
                  type="button"
                  onClick={() => setActiveId(attempt.id)}
                  className={`w-full p-4 text-left transition-colors cursor-pointer ${
                    selected ? 'bg-indigo-50/70' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-indigo-700 truncate">
                      {attempt.subjectName}
                    </span>
                    <span className="text-xs font-mono tabular-nums font-semibold text-slate-900">
                      {attempt.score}/{attempt.total} ({attempt.accuracy}%)
                    </span>
                  </div>
                  <div className="mt-1 text-sm font-medium text-slate-900 truncate">
                    {attempt.chapterTitle}
                  </div>
                  <div className="mt-0.5 text-xs text-slate-500 font-mono tabular-nums">
                    Class {attempt.classLevel} · {attempt.dateIso}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Detailed Question-by-Question Answer & Explanation Review */}
        <section className="lg:col-span-8 bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="text-xs text-slate-500">
                Class {activeAttempt.classLevel} · {activeAttempt.subjectName} · {activeAttempt.dateIso}
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                {activeAttempt.chapterTitle} — Answer Key & Explanations
              </h3>
            </div>
            <div className="text-sm font-mono tabular-nums font-bold text-indigo-700">
              Score: {activeAttempt.score}/{activeAttempt.total} ({activeAttempt.accuracy}%)
            </div>
          </div>

          <div className="divide-y divide-slate-200">
            {activeAttempt.details.map((item, idx) => (
              <div key={item.questionId} className="p-5 sm:p-6 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="text-xs font-mono text-slate-500 tabular-nums">
                      Question {idx + 1}
                    </div>
                    <h4 className="text-sm sm:text-base font-semibold text-slate-900">
                      {item.question}
                    </h4>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold shrink-0 ${
                      item.isCorrect ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {item.isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Correct</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4" />
                        <span>Incorrect</span>
                      </>
                    )}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/70">
                    <span className="text-slate-500 block mb-0.5">Your Answer</span>
                    <span className="font-medium text-slate-900">
                      {item.selectedIndex !== null
                        ? item.options[item.selectedIndex]
                        : 'Not answered'}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/50">
                    <span className="text-emerald-700 block mb-0.5">Correct NCERT Answer</span>
                    <span className="font-semibold text-emerald-950">
                      {item.options[item.correctIndex]}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-indigo-50/50 border border-indigo-100 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <span className="font-semibold text-indigo-900">Explanation: </span>
                  {item.explanation}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
