import React, { useEffect, useState } from 'react';
import { ArrowRight, BookOpen, Check, GraduationCap, ShieldCheck } from 'lucide-react';
import type { AppLanguage, ClassLevel, StreamType, StudentProfile } from '../types/edugenius';
import { getSubjectsForClass } from '../data/ncertCatalog';
import { Button } from '../components/ui/Button';
import { SegmentedControl } from '../components/ui/SegmentedControl';
import { ClassNavigator } from '../components/edugenius/ClassNavigator';

interface OnboardingViewProps {
  initialProfile: StudentProfile;
  heroImageUrl: string;
  onComplete: (profile: StudentProfile) => void;
}

const BOARDS = [
  'CBSE (NCERT Curriculum)',
  'State Board (NCERT Aligned)',
  'Kendriya Vidyalaya / Navodaya',
  'ICSE / NCERT Reference',
];

export function OnboardingView({
  initialProfile,
  heroImageUrl,
  onComplete,
}: OnboardingViewProps) {
  const [name, setName] = useState(initialProfile.name || '');
  const [email, setEmail] = useState(initialProfile.email || '');
  const [dob, setDob] = useState(initialProfile.dob || '2010-08-14');
  const [board, setBoard] = useState(initialProfile.board || BOARDS[0]);
  const [classLevel, setClassLevel] = useState<ClassLevel>(initialProfile.classLevel || 10);
  const [stream, setStream] = useState<StreamType>(initialProfile.stream || 'science');
  const [language, setLanguage] = useState<AppLanguage>(initialProfile.language || 'en');
  const [dailyGoalMin, setDailyGoalMin] = useState<number>(initialProfile.dailyGoalMin || 60);

  const availableSubjects = getSubjectsForClass(classLevel, stream);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>(() =>
    initialProfile.enrolledSubjectIds.length > 0
      ? initialProfile.enrolledSubjectIds
      : availableSubjects.map((s) => s.id)
  );
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    const nextSubjects = getSubjectsForClass(classLevel, stream);
    setSelectedSubjectIds(nextSubjects.map((s) => s.id));
  }, [classLevel, stream]);

  const toggleSubject = (subjectId: string) => {
    setSelectedSubjectIds((prev) =>
      prev.includes(subjectId)
        ? prev.length > 1
          ? prev.filter((id) => id !== subjectId)
          : prev
        : [...prev, subjectId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({
      name: name.trim() || 'Aarav Sharma',
      email: email.trim() || 'student@edugenius.edu',
      dob: dob || '2010-08-14',
      board,
      classLevel,
      stream,
      enrolledSubjectIds:
        selectedSubjectIds.length > 0 ? selectedSubjectIds : availableSubjects.map((s) => s.id),
      language,
      dailyGoalMin,
      onboarded: true,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Clean Top Brand Strip */}
      <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 text-white font-bold text-sm flex items-center justify-center shrink-0"
          >
            E
          </span>
          <span className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap">
            EDUGENIUS AI
          </span>
        </div>

        <SegmentedControl<AppLanguage>
          ariaLabel="Onboarding language"
          value={language}
          onChange={setLanguage}
          options={[
            { value: 'en', label: 'English' },
            { value: 'hi', label: 'हिन्दी' },
          ]}
        />
      </header>

      <main className="flex-1 w-full max-w-[1160px] mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
        {/* Intro Split */}
        <section className="bg-white border border-slate-200 rounded-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-center space-y-3">
            <div className="text-xs font-medium text-indigo-700">
              {language === 'hi'
                ? 'छात्र लॉगिन और ऑनबोर्डिंग · कक्षा 1–12'
                : 'Student Login & Onboarding · Classes 1–12'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 text-balance">
              {language === 'hi'
                ? 'अपनी कक्षा और NCERT विषय चुनें'
                : 'Personalize Your NCERT Learning Workspace'}
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed max-w-xl">
              {language === 'hi'
                ? 'आपकी कक्षा चुनने के बाद, पूरा डैशबोर्ड, विषय, नोट्स, क्विज़ और AI शिक्षक केवल आपकी चुनी हुई कक्षा के लिए खुलेंगे।'
                : 'Enter your student details and select your class. Once onboarded, your dashboard, chapters, notes, quizzes, and AI tutor unlock specifically for your selected class.'}
            </p>
            <div className="pt-1 flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>
                Class-locked NCERT workspace · Official NCERT & ePathshala links included
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 relative min-h-[190px] bg-indigo-50 border-t lg:border-t-0 lg:border-l border-slate-200">
            {!imgFailed ? (
              <img
                src={heroImageUrl}
                alt="Student study desk with NCERT books"
                referrerPolicy="no-referrer"
                onError={() => setImgFailed(true)}
                className="w-full h-full object-cover lg:absolute lg:inset-0"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-indigo-700">
                <GraduationCap className="w-10 h-10" />
              </div>
            )}
          </div>
        </section>

        {/* Onboarding Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-5">
            <div className="space-y-1">
              <h2 className="text-base sm:text-lg font-semibold text-slate-900">
                {language === 'hi' ? '1. छात्र विवरण' : '1. Student Profile & Login Details'}
              </h2>
              <p className="text-xs text-slate-500">
                Used to tailor explanations, grade difficulty, and study planner goals.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label htmlFor="onb-name" className="block text-xs font-medium text-slate-700 mb-1.5">
                  Student Name
                </label>
                <input
                  id="onb-name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Aarav Sharma"
                  className="w-full min-h-[42px] px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="onb-email" className="block text-xs font-medium text-slate-700 mb-1.5">
                  Student Email
                </label>
                <input
                  id="onb-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@school.edu"
                  className="w-full min-h-[42px] px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="onb-dob" className="block text-xs font-medium text-slate-700 mb-1.5">
                  Date of Birth
                </label>
                <input
                  id="onb-dob"
                  type="date"
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full min-h-[42px] px-3 rounded-lg border border-slate-200 text-sm font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="onb-board" className="block text-xs font-medium text-slate-700 mb-1.5">
                  Education Board
                </label>
                <select
                  id="onb-board"
                  value={board}
                  onChange={(e) => setBoard(e.target.value)}
                  className="w-full min-h-[42px] px-3 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {BOARDS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Step 2: Reusable ClassNavigator */}
          <ClassNavigator
            selectedClass={classLevel}
            onSelectClass={setClassLevel}
            selectedStream={stream}
            onSelectStream={setStream}
            language={language}
          />

          {/* Step 3: Subject Enrollment */}
          <section className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-slate-900">
                  {language === 'hi'
                    ? `3. कक्षा ${classLevel} के विषय चुनें`
                    : `3. Select Subjects for Class ${classLevel}`}
                </h2>
                <p className="text-xs text-slate-500">
                  Only your selected subjects and Class {classLevel} materials will appear in your workspace.
                </p>
              </div>
              <div className="text-xs font-mono tabular-nums text-indigo-700 font-medium">
                {selectedSubjectIds.length} / {availableSubjects.length} selected
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {availableSubjects.map((sub) => {
                const checked = selectedSubjectIds.includes(sub.id);
                return (
                  <button
                    key={sub.id}
                    type="button"
                    aria-pressed={checked}
                    onClick={() => toggleSubject(sub.id)}
                    className={`p-3.5 rounded-xl border text-left transition-colors flex items-start gap-3 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                      checked
                        ? 'bg-indigo-50/70 border-indigo-400 text-slate-900'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center shrink-0 border ${
                        checked
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'bg-white border-slate-300'
                      }`}
                    >
                      {checked && <Check className="w-3.5 h-3.5" />}
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span className="truncate">
                          {language === 'hi' ? sub.nameHi : sub.name}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 truncate">
                        {sub.bookName} · {sub.chapters.length} chapters
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <label htmlFor="onb-goal" className="text-xs font-medium text-slate-700 whitespace-nowrap">
                  Daily Study Goal:
                </label>
                <select
                  id="onb-goal"
                  value={dailyGoalMin}
                  onChange={(e) => setDailyGoalMin(Number(e.target.value))}
                  className="min-h-[38px] px-3 rounded-lg border border-slate-200 bg-white text-xs font-mono tabular-nums"
                >
                  <option value={30}>30 min / day</option>
                  <option value={45}>45 min / day</option>
                  <option value={60}>60 min / day</option>
                  <option value={90}>90 min / day</option>
                  <option value={120}>120 min / day</option>
                </select>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {language === 'hi'
                  ? `कक्षा ${classLevel} डैशबोर्ड खोलें`
                  : `Enter Class ${classLevel} Workspace`}
              </Button>
            </div>
          </section>
        </form>
      </main>
    </div>
  );
}
