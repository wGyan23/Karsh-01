import React, { useEffect, useState } from 'react';
import type {
  AppLanguage,
  NavRoute,
  PlannerTask,
  QuizAttempt,
  StudentProfile,
  StudyNote,
  SubjectItem,
} from './types/edugenius';
import {
  INITIAL_NOTES,
  INITIAL_PLANNER_TASKS,
  INITIAL_QUIZ_ATTEMPTS,
  getSubjectsForClass,
} from './data/ncertCatalog';
import { AppShell } from './components/edugenius/AppShell';
import { AssistantWorkspace } from './components/edugenius/AssistantWorkspace';
import { ComponentLibraryView } from './pages/ComponentLibraryView';
import { DashboardView } from './pages/DashboardView';
import { MyClassView } from './pages/MyClassView';
import { NcertLibraryView } from './pages/NcertLibraryView';
import { NotesView } from './pages/NotesView';
import { OnboardingView } from './pages/OnboardingView';
import { PlannerView } from './pages/PlannerView';
import { ProfileView } from './pages/ProfileView';
import { QuizzesView } from './pages/QuizzesView';
import { ResultsView } from './pages/ResultsView';

const HERO_IMG = '/src/assets/images/hero_ncert_study_1795692750494.jpg';
const LIBRARY_IMG = '/src/assets/images/library_ncert_books_1795692751221.jpg';
const AVATAR_IMG = '/src/assets/images/avatar_student_aarav_1795692752124.jpg';

const DEFAULT_PROFILE: StudentProfile = {
  name: 'Aarav Sharma',
  email: 'aarav.sharma@student.edu',
  dob: '2010-08-14',
  classLevel: 10,
  stream: 'science',
  enrolledSubjectIds: getSubjectsForClass(10, 'science').map((s) => s.id),
  language: 'en',
  dailyGoalMin: 60,
  board: 'CBSE (NCERT Curriculum)',
  onboarded: false,
};

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota errors
  }
}

export default function App() {
  const [profile, setProfile] = useState<StudentProfile>(() =>
    readStorage<StudentProfile>('edugenius_v1_profile', DEFAULT_PROFILE)
  );
  const [route, setRoute] = useState<NavRoute>('dashboard');
  const [completedChapterIds, setCompletedChapterIds] = useState<string[]>(() =>
    readStorage<string[]>('edugenius_v1_chapters', ['c10-science-ch-1', 'c10-math-ch-1'])
  );
  const [notes, setNotes] = useState<StudyNote[]>(() =>
    readStorage<StudyNote[]>('edugenius_v1_notes', INITIAL_NOTES)
  );
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>(() =>
    readStorage<QuizAttempt[]>('edugenius_v1_attempts', INITIAL_QUIZ_ATTEMPTS)
  );
  const [plannerTasks, setPlannerTasks] = useState<PlannerTask[]>(() =>
    readStorage<PlannerTask[]>('edugenius_v1_planner', INITIAL_PLANNER_TASKS)
  );

  const [focusedSubjectId, setFocusedSubjectId] = useState<string | undefined>(undefined);
  const [tutorSubjectName, setTutorSubjectName] = useState<string | undefined>(undefined);
  const [tutorChapterTitle, setTutorChapterTitle] = useState<string | undefined>(undefined);
  const [quizSubjectName, setQuizSubjectName] = useState<string | undefined>(undefined);
  const [quizChapterTitle, setQuizChapterTitle] = useState<string | undefined>(undefined);
  const [latestAttemptId, setLatestAttemptId] = useState<string | undefined>(undefined);

  useEffect(() => {
    writeStorage('edugenius_v1_profile', profile);
  }, [profile]);

  useEffect(() => {
    writeStorage('edugenius_v1_chapters', completedChapterIds);
  }, [completedChapterIds]);

  useEffect(() => {
    writeStorage('edugenius_v1_notes', notes);
  }, [notes]);

  useEffect(() => {
    writeStorage('edugenius_v1_attempts', quizAttempts);
  }, [quizAttempts]);

  useEffect(() => {
    writeStorage('edugenius_v1_planner', plannerTasks);
  }, [plannerTasks]);

  const handleCompleteOnboarding = (nextProfile: StudentProfile) => {
    setProfile({ ...nextProfile, onboarded: true });
    setFocusedSubjectId(undefined);
    setTutorSubjectName(undefined);
    setTutorChapterTitle(undefined);
    setRoute('dashboard');
  };

  const handleLanguageChange = (language: AppLanguage) => {
    setProfile((prev) => ({ ...prev, language }));
  };

  const handleToggleChapter = (chapterId: string) => {
    setCompletedChapterIds((prev) =>
      prev.includes(chapterId)
        ? prev.filter((id) => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  const handleOpenSubject = (subject: SubjectItem) => {
    setFocusedSubjectId(subject.id);
    setRoute('classes');
  };

  const handleAskTutor = (subject: SubjectItem, chapterTitle?: string) => {
    setTutorSubjectName(subject.name);
    setTutorChapterTitle(chapterTitle);
    setRoute('assistant');
  };

  const handleGenerateQuizForChapter = (subject: SubjectItem, chapterTitle: string) => {
    setQuizSubjectName(subject.name);
    setQuizChapterTitle(chapterTitle);
    setRoute('quizzes');
  };

  const handleSaveNote = (payload: Omit<StudyNote, 'id' | 'updatedAt'>) => {
    const newNote: StudyNote = {
      ...payload,
      id: `note-${Date.now()}`,
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    setNotes((prev) => [newNote, ...prev]);
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const handleCompleteQuizAttempt = (attempt: QuizAttempt) => {
    setQuizAttempts((prev) => [attempt, ...prev]);
    setLatestAttemptId(attempt.id);
    setRoute('results');
  };

  const handleAddTask = (task: Omit<PlannerTask, 'id'>) => {
    setPlannerTasks((prev) => [{ ...task, id: `task-${Date.now()}` }, ...prev]);
  };

  const handleToggleTask = (id: string) => {
    setPlannerTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleDeleteTask = (id: string) => {
    setPlannerTasks((prev) => prev.filter((t) => t.id !== id));
  };

  if (!profile.onboarded) {
    return (
      <OnboardingView
        initialProfile={profile}
        heroImageUrl={HERO_IMG}
        onComplete={handleCompleteOnboarding}
      />
    );
  }

  return (
    <AppShell
      activeRoute={route}
      onNavigate={setRoute}
      profile={profile}
      onLanguageChange={handleLanguageChange}
      onOpenOnboarding={() => setProfile((prev) => ({ ...prev, onboarded: false }))}
      avatarUrl={AVATAR_IMG}
    >
      {route === 'dashboard' && (
        <DashboardView
          profile={profile}
          heroImageUrl={HERO_IMG}
          completedChapterIds={completedChapterIds}
          quizAttempts={quizAttempts}
          plannerTasks={plannerTasks}
          onNavigate={setRoute}
          onOpenSubject={handleOpenSubject}
          onAskTutorForSubject={(sub) => handleAskTutor(sub)}
        />
      )}

      {(route === 'classes' || route === 'subjects') && (
        <MyClassView
          classLevel={profile.classLevel}
          stream={profile.stream}
          enrolledSubjectIds={profile.enrolledSubjectIds}
          selectedSubjectId={focusedSubjectId}
          completedChapterIds={completedChapterIds}
          language={profile.language}
          onToggleChapterComplete={handleToggleChapter}
          onAskTutor={handleAskTutor}
          onGenerateQuizForChapter={handleGenerateQuizForChapter}
          onOpenOnboarding={() => setProfile((prev) => ({ ...prev, onboarded: false }))}
        />
      )}

      {route === 'library' && (
        <NcertLibraryView
          classLevel={profile.classLevel}
          language={profile.language}
          libraryImageUrl={LIBRARY_IMG}
        />
      )}

      {route === 'assistant' && (
        <AssistantWorkspace
          initialClass={profile.classLevel}
          initialStream={profile.stream}
          enrolledSubjectIds={profile.enrolledSubjectIds}
          lockClass
          initialSubjectName={tutorSubjectName}
          initialChapterTitle={tutorChapterTitle}
          appLanguage={profile.language}
          onSaveToNotes={(notePayload) =>
            handleSaveNote({ ...notePayload, source: 'ai' })
          }
        />
      )}

      {route === 'notes' && (
        <NotesView
          notes={notes}
          defaultClass={profile.classLevel}
          onAddNote={handleSaveNote}
          onDeleteNote={handleDeleteNote}
        />
      )}

      {route === 'quizzes' && (
        <QuizzesView
          classLevel={profile.classLevel}
          stream={profile.stream}
          enrolledSubjectIds={profile.enrolledSubjectIds}
          language={profile.language}
          preselectedSubjectName={quizSubjectName}
          preselectedChapterTitle={quizChapterTitle}
          onCompleteAttempt={handleCompleteQuizAttempt}
        />
      )}

      {route === 'results' && (
        <ResultsView
          classLevel={profile.classLevel}
          attempts={quizAttempts}
          selectedAttemptId={latestAttemptId}
          onNavigate={setRoute}
        />
      )}

      {route === 'planner' && (
        <PlannerView
          classLevel={profile.classLevel}
          stream={profile.stream}
          tasks={plannerTasks.filter((t) => t.classLevel === profile.classLevel)}
          onAddTask={handleAddTask}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
        />
      )}

      {route === 'components' && <ComponentLibraryView />}

      {route === 'profile' && (
        <ProfileView
          profile={profile}
          avatarUrl={AVATAR_IMG}
          onUpdateProfile={setProfile}
          onResetOnboarding={() => setProfile((prev) => ({ ...prev, onboarded: false }))}
        />
      )}
    </AppShell>
  );
}
