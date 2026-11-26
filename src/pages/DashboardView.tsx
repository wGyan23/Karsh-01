import React, { useState } from 'react';
import {
  ArrowRight,
  BookCheck,
  CalendarCheck2,
  CheckCircle2,
  GraduationCap,
  MessageSquare,
  Target,
} from 'lucide-react';
import type {
  NavRoute,
  PlannerTask,
  QuizAttempt,
  StudentProfile,
  SubjectItem,
} from '../types/edugenius';
import { getSubjectsForClass } from '../data/ncertCatalog';
import { Button } from '../components/ui/Button';
import { SectionHeader } from '../components/ui/SectionHeader';
import { StatMetric } from '../components/ui/StatMetric';
import { SubjectGrid } from '../components/edugenius/SubjectGrid';

interface DashboardViewProps {
  profile: StudentProfile;
  heroImageUrl: string;
  completedChapterIds: string[];
  quizAttempts: QuizAttempt[];
  plannerTasks: PlannerTask[];
  onNavigate: (route: NavRoute) => void;
  onOpenSubject: (subject: SubjectItem) => void;
  onAskTutorForSubject: (subject: SubjectItem) => void;
}

export function DashboardView({
  profile,
  heroImageUrl,
  completedChapterIds,
  quizAttempts,
  plannerTasks,
  onNavigate,
  onOpenSubject,
  onAskTutorForSubject,
}: DashboardViewProps) {
  const [heroImgFailed, setHeroImgFailed] = useState(false);

  const allClassSubjects = getSubjectsForClass(profile.classLevel, profile.stream);
  const enrolledSubjects = allClassSubjects.filter(
    (s) => profile.enrolledSubjectIds.length === 0 || profile.enrolledSubjectIds.includes(s.id)
  );

  const totalChaptersInClass = enrolledSubjects.reduce((sum, s) => sum + s.chapters.length, 0);
  const completedInClass = enrolledSubjects.reduce(
    (sum, s) => sum + s.chapters.filter((ch) => completedChapterIds.includes(ch.id)).length,
    0
  );

  const classAttempts = quizAttempts.filter((a) => a.classLevel === profile.classLevel);
  const avgAccuracy =
    classAttempts.length > 0
      ? Math.round(
          classAttempts.reduce((acc, item) => acc + item.accuracy, 0) / classAttempts.length
        )
      : 0;

  const classPendingTasks = plannerTasks.filter(
    (t) => t.classLevel === profile.classLevel && !t.completed
  ).length;

  return (
    <div className="space-y-8">
      {/* Hero Split */}
      <section className="bg-white border border-slate-200 rounded-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between gap-6">
          <div className="space-y-3">
            <div className="text-xs font-medium text-indigo-700 flex items-center gap-2 flex-wrap">
              <span>
                {profile.language === 'hi'
                  ? `कक्षा ${profile.classLevel} · ${profile.board}`
                  : `Class ${profile.classLevel} · ${profile.board}`}
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-500">
                {profile.language === 'hi'
                  ? `${enrolledSubjects.length} नामांकित विषय`
                  : `${enrolledSubjects.length} Enrolled Subjects`}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 text-balance max-w-xl">
              {profile.language === 'hi'
                ? `${profile.name}, कक्षा ${profile.classLevel} के आज के लक्ष्य`
                : `Welcome back, ${profile.name}. Class ${profile.classLevel} Workspace`}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
              {profile.language === 'hi'
                ? `आपकी चुनी हुई कक्षा ${profile.classLevel} के लिए NCERT विषय, अध्याय, नोट्स, क्विज़, आधिकारिक ePathshala लिंक और AI शिक्षक।`
                : `Dedicated NCERT workspace for Class ${profile.classLevel}: explore your enrolled subjects, take auto-scored quizzes, review answer explanations, and ask the AI tutor.`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              size="lg"
              leftIcon={<MessageSquare className="w-4 h-4" />}
              onClick={() => onNavigate('assistant')}
            >
              {profile.language === 'hi' ? 'AI शिक्षक शुरू करें' : 'Launch AI Tutor'}
            </Button>
            <Button
              variant="outline"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => onNavigate('quizzes')}
            >
              {profile.language === 'hi'
                ? `कक्षा ${profile.classLevel} क्विज़ दें`
                : `Take Class ${profile.classLevel} Quiz`}
            </Button>
          </div>
        </div>

        <div className="lg:col-span-5 relative min-h-[220px] bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-100 border-t lg:border-t-0 lg:border-l border-slate-200">
          {!heroImgFailed ? (
            <img
              src={heroImageUrl}
              alt="Organized student study desk with NCERT textbooks and tablet"
              referrerPolicy="no-referrer"
              onError={() => setHeroImgFailed(true)}
              className="w-full h-full object-cover lg:absolute lg:inset-0"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-indigo-800 gap-2">
              <GraduationCap className="w-10 h-10 text-indigo-600" />
              <span className="text-sm font-semibold">EDUGENIUS AI · Class {profile.classLevel}</span>
            </div>
          )}
        </div>
      </section>

      {/* 4-Column Tabular KPI Strip */}
      <section aria-label="Study metrics" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatMetric
          label={profile.language === 'hi' ? 'पूर्ण अध्याय' : 'Chapters Completed'}
          value={`${completedInClass}/${totalChaptersInClass}`}
          detail={`Class ${profile.classLevel} enrolled syllabus`}
          icon={<BookCheck className="w-4 h-4" />}
          accent="indigo"
        />
        <StatMetric
          label={profile.language === 'hi' ? 'क्विज़ प्रयास' : 'Quizzes Attempted'}
          value={classAttempts.length}
          detail={`Class ${profile.classLevel} completed checks`}
          icon={<CheckCircle2 className="w-4 h-4" />}
          accent="blue"
        />
        <StatMetric
          label={profile.language === 'hi' ? 'औसत सटीकता' : 'Average Accuracy'}
          value={`${avgAccuracy}%`}
          detail={classAttempts.length > 0 ? 'Based on scored attempts' : 'Take a quiz to record accuracy'}
          icon={<Target className="w-4 h-4" />}
          accent="violet"
        />
        <StatMetric
          label={profile.language === 'hi' ? 'लंबित अध्ययन कार्य' : 'Pending Study Tasks'}
          value={classPendingTasks}
          detail={`Daily target: ${profile.dailyGoalMin} min/day`}
          icon={<CalendarCheck2 className="w-4 h-4" />}
          accent="slate"
        />
      </section>

      {/* Class-Locked Subject Selection Grid */}
      <div className="space-y-4">
        <SectionHeader
          title={
            profile.language === 'hi'
              ? `कक्षा ${profile.classLevel} के NCERT विषय`
              : `Your Class ${profile.classLevel} NCERT Subjects`
          }
          subtitle={
            profile.language === 'hi'
              ? 'अध्याय सूची देखने, प्रगति चिह्नित करने या AI शिक्षक से समझने के लिए कोई विषय चुनें।'
              : `Showing only your enrolled Class ${profile.classLevel} subjects. Open chapters, launch AI tutoring, or visit NCERT/ePathshala portals.`
          }
          action={
            <Button variant="ghost" size="sm" onClick={() => onNavigate('classes')}>
              {profile.language === 'hi' ? 'सभी अध्याय देखें' : `Open Class ${profile.classLevel} Page`}
            </Button>
          }
        />

        <SubjectGrid
          classLevel={profile.classLevel}
          subjects={enrolledSubjects}
          completedChapterIds={completedChapterIds}
          language={profile.language}
          onSelectSubject={onOpenSubject}
          onAskTutor={onAskTutorForSubject}
        />
      </div>
    </div>
  );
}
