import React, { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import type {
  AppLanguage,
  ClassLevel,
  QuizAttempt,
  QuizAttemptAnswerDetail,
  QuizQuestion,
  StreamType,
  SubjectItem,
} from '../types/edugenius';
import { STARTER_QUIZ_BANK, getSubjectsForClass } from '../data/ncertCatalog';
import { Button } from '../components/ui/Button';
import { SectionHeader } from '../components/ui/SectionHeader';

interface QuizzesViewProps {
  classLevel: ClassLevel;
  stream: StreamType;
  enrolledSubjectIds: string[];
  language: AppLanguage;
  preselectedSubjectName?: string;
  preselectedChapterTitle?: string;
  onCompleteAttempt: (attempt: QuizAttempt) => void;
}

export function QuizzesView({
  classLevel,
  stream,
  enrolledSubjectIds,
  language,
  preselectedSubjectName,
  preselectedChapterTitle,
  onCompleteAttempt,
}: QuizzesViewProps) {
  const allClassSubjects = getSubjectsForClass(classLevel, stream);
  const subjects: SubjectItem[] = allClassSubjects.filter(
    (s) => enrolledSubjectIds.length === 0 || enrolledSubjectIds.includes(s.id)
  );

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    subjects.find((s) => s.name === preselectedSubjectName)?.id || subjects[0]?.id || ''
  );
  const activeSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];

  const [selectedChapter, setSelectedChapter] = useState<string>(
    preselectedChapterTitle || activeSubject?.chapters[0]?.title || ''
  );

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [quizActive, setQuizActive] = useState(false);
  const [startedAtMs, setStartedAtMs] = useState<number>(Date.now());
  const [elapsedSec, setElapsedSec] = useState(0);

  useEffect(() => {
    if (preselectedSubjectName) {
      const found = subjects.find((s) => s.name === preselectedSubjectName);
      if (found) setSelectedSubjectId(found.id);
    }
  }, [preselectedSubjectName, subjects]);

  useEffect(() => {
    if (preselectedChapterTitle) {
      setSelectedChapter(preselectedChapterTitle);
    } else if (activeSubject && !activeSubject.chapters.some((c) => c.title === selectedChapter)) {
      setSelectedChapter(activeSubject.chapters[0]?.title || '');
    }
  }, [activeSubject, preselectedChapterTitle, selectedChapter]);

  useEffect(() => {
    if (!quizActive) return;
    const timer = window.setInterval(() => {
      setElapsedSec(Math.floor((Date.now() - startedAtMs) / 1000));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [quizActive, startedAtMs]);

  const startStarterQuiz = () => {
    setErrorMsg(null);
    const matching = STARTER_QUIZ_BANK.filter((q) => q.classLevel === classLevel);
    const pool = matching.length > 0 ? matching : [];

    if (pool.length === 0) {
      void generateAiQuiz();
      return;
    }

    setQuestions(pool);
    setAnswers({});
    setCurrentIdx(0);
    setStartedAtMs(Date.now());
    setElapsedSec(0);
    setQuizActive(true);
  };

  const generateAiQuiz = async () => {
    if (!activeSubject || isGenerating) return;
    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classLevel,
          subject: activeSubject.name,
          chapter: selectedChapter || activeSubject.chapters[0]?.title || activeSubject.name,
          language,
          count: 5,
        }),
      });

      const data = (await res.json()) as {
        questions?: Array<{
          id: string;
          question: string;
          options: string[];
          correctIndex: number;
          explanation: string;
        }>;
        error?: string;
      };

      if (!res.ok || !data.questions || data.questions.length === 0) {
        throw new Error(data.error || 'Could not generate chapter quiz.');
      }

      const mapped: QuizQuestion[] = data.questions.map((q) => ({
        id: q.id,
        classLevel,
        subjectId: activeSubject.id,
        chapterTitle: selectedChapter || activeSubject.name,
        question: q.question,
        options: q.options,
        correctIndex: q.correctIndex,
        explanation: q.explanation,
      }));

      setQuestions(mapped);
      setAnswers({});
      setCurrentIdx(0);
      setStartedAtMs(Date.now());
      setElapsedSec(0);
      setQuizActive(true);
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Unable to generate quiz right now.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmitQuiz = () => {
    const durationSec = Math.max(1, Math.floor((Date.now() - startedAtMs) / 1000));
    const details: QuizAttemptAnswerDetail[] = questions.map((q) => {
      const selected = answers[q.id] ?? null;
      const isCorrect = selected === q.correctIndex;
      return {
        questionId: q.id,
        question: q.question,
        options: q.options,
        selectedIndex: selected,
        correctIndex: q.correctIndex,
        isCorrect,
        explanation: q.explanation,
      };
    });

    const score = details.filter((d) => d.isCorrect).length;
    const total = details.length;
    const accuracy = total > 0 ? Math.round((score / total) * 100) : 0;

    const attempt: QuizAttempt = {
      id: `attempt-${Date.now()}`,
      dateIso: new Date().toISOString().slice(0, 10),
      classLevel,
      subjectName: activeSubject?.name || 'NCERT Subject',
      chapterTitle: selectedChapter || 'Class Assessment',
      score,
      total,
      accuracy,
      durationSec,
      details,
    };

    setQuizActive(false);
    onCompleteAttempt(attempt);
  };

  const currentQuestion = questions[currentIdx];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="space-y-6">
      <SectionHeader
        title={`Class ${classLevel} Quizzes & Automatic Scoring`}
        subtitle="Practice NCERT chapter concepts with instant automated grading, explanations, and score tracking."
      />

      {!quizActive ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* AI Chapter Quiz Builder */}
          <section className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <div className="space-y-1">
              <div className="text-xs font-medium text-indigo-700">
                Class {classLevel} Custom Quiz Generator
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                Generate a 5-Question NCERT Chapter Quiz
              </h3>
              <p className="text-sm text-slate-600">
                Pick one of your Class {classLevel} subjects and chapters to generate fresh conceptual MCQs.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="quiz-sub" className="block text-xs font-medium text-slate-600 mb-1.5">
                  Subject (Class {classLevel})
                </label>
                <select
                  id="quiz-sub"
                  value={activeSubject?.id || ''}
                  onChange={(e) => {
                    const nextId = e.target.value;
                    setSelectedSubjectId(nextId);
                    const nextSub = subjects.find((s) => s.id === nextId);
                    setSelectedChapter(nextSub?.chapters[0]?.title || '');
                  }}
                  className="w-full min-h-[42px] px-3 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {subjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {language === 'hi' ? sub.nameHi : sub.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="quiz-ch" className="block text-xs font-medium text-slate-600 mb-1.5">
                  Chapter
                </label>
                <select
                  id="quiz-ch"
                  value={selectedChapter}
                  onChange={(e) => setSelectedChapter(e.target.value)}
                  className="w-full min-h-[42px] px-3 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {(activeSubject?.chapters || []).map((ch) => (
                    <option key={ch.id} value={ch.title}>
                      Ch {ch.number}: {ch.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800">
                {errorMsg}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Button
                variant="primary"
                size="lg"
                loading={isGenerating}
                leftIcon={<Sparkles className="w-4 h-4" />}
                onClick={() => void generateAiQuiz()}
              >
                {isGenerating ? 'Generating Chapter Quiz...' : 'Generate Chapter Quiz'}
              </Button>
            </div>
          </section>

          {/* Instant Curated Quick Check */}
          <section className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between gap-5">
            <div className="space-y-2">
              <div className="text-xs font-medium text-slate-500">
                Instant Practice · Class {classLevel}
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                Quick NCERT Diagnostic Check
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Start an immediate Class {classLevel} assessment with automatic scoring and step-by-step explanations on the Results page.
              </p>
            </div>
            <Button
              variant="secondary"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={startStarterQuiz}
            >
              Start Quick Check
            </Button>
          </section>
        </div>
      ) : (
        currentQuestion && (
          <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="text-xs text-slate-500 font-mono tabular-nums">
                Question {currentIdx + 1} of {questions.length} · Class {classLevel} ·{' '}
                {currentQuestion.chapterTitle}
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono tabular-nums text-indigo-700 font-medium">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {Math.floor(elapsedSec / 60)}:{String(elapsedSec % 60).padStart(2, '0')}
                </span>
              </div>
            </div>

            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-violet-600 transition-all duration-200"
                style={{ width: `${Math.round(((currentIdx + 1) / questions.length) * 100)}%` }}
              />
            </div>

            <h3 className="text-base sm:text-lg font-semibold text-slate-900 leading-relaxed">
              {currentQuestion.question}
            </h3>

            <div className="space-y-2.5">
              {currentQuestion.options.map((opt, idx) => {
                const selected = answers[currentQuestion.id] === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    aria-pressed={selected}
                    onClick={() =>
                      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: idx }))
                    }
                    className={`w-full p-4 rounded-xl border text-left text-sm transition-colors flex items-center gap-3 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                      selected
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-950 font-medium'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full border text-xs font-mono flex items-center justify-center shrink-0 ${
                        selected
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'border-slate-300 text-slate-500'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-500 font-mono tabular-nums">
                {answeredCount} of {questions.length} answered
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                >
                  Previous
                </Button>
                {currentIdx < questions.length - 1 ? (
                  <Button
                    variant="primary"
                    onClick={() => setCurrentIdx((i) => Math.min(questions.length - 1, i + 1))}
                  >
                    Next Question
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    leftIcon={<CheckCircle2 className="w-4 h-4" />}
                    onClick={handleSubmitQuiz}
                  >
                    Submit & View Results
                  </Button>
                )}
              </div>
            </div>
          </section>
        )
      )}
    </div>
  );
}
