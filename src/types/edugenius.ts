export type ClassLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type EducationStage = 'primary' | 'middle' | 'secondary' | 'senior_secondary';

export type StreamType = 'science' | 'commerce' | 'humanities';

export type AppLanguage = 'en' | 'hi';

export type TutorLanguage = 'en' | 'hi' | 'hinglish';

export type TutorMode = 'concept' | 'solver' | 'revision' | 'search';

export type SubjectCategory = 'core' | 'language' | 'elective';

export type NavRoute =
  | 'dashboard'
  | 'classes'
  | 'subjects'
  | 'library'
  | 'assistant'
  | 'notes'
  | 'quizzes'
  | 'results'
  | 'planner'
  | 'components'
  | 'profile';

export interface ChapterInfo {
  id: string;
  number: number;
  title: string;
  titleHi: string;
  bookTitle: string;
  summary: string;
  keyTopics: string[];
  officialUrl: string;
}

export interface SubjectItem {
  id: string;
  name: string;
  nameHi: string;
  category: SubjectCategory;
  streams?: StreamType[];
  bookName: string;
  accentTone: 'indigo' | 'blue' | 'violet' | 'cyan';
  chapters: ChapterInfo[];
  ncertPortalUrl: string;
  epathshalaUrl: string;
}

export interface OfficialResource {
  id: string;
  title: string;
  titleHi: string;
  provider: 'NCERT' | 'ePathshala' | 'DIKSHA' | 'SWAYAM' | 'NCERT Exemplar';
  description: string;
  descriptionHi: string;
  stages: string;
  url: string;
}

export interface QuizQuestion {
  id: string;
  classLevel: ClassLevel;
  subjectId: string;
  chapterTitle: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizAttemptAnswerDetail {
  questionId: string;
  question: string;
  options: string[];
  selectedIndex: number | null;
  correctIndex: number;
  isCorrect: boolean;
  explanation: string;
}

export interface QuizAttempt {
  id: string;
  dateIso: string;
  classLevel: ClassLevel;
  subjectName: string;
  chapterTitle: string;
  score: number;
  total: number;
  accuracy: number;
  durationSec: number;
  details: QuizAttemptAnswerDetail[];
}

export interface StudyNote {
  id: string;
  title: string;
  classLevel: ClassLevel;
  subjectName: string;
  content: string;
  updatedAt: string;
  source: 'manual' | 'ai';
}

export interface PlannerTask {
  id: string;
  title: string;
  classLevel: ClassLevel;
  subjectName: string;
  day: string;
  durationMin: number;
  completed: boolean;
}

export interface StudentProfile {
  name: string;
  email: string;
  dob: string;
  classLevel: ClassLevel;
  stream: StreamType;
  enrolledSubjectIds: string[];
  language: AppLanguage;
  dailyGoalMin: number;
  board: string;
  onboarded: boolean;
}

export interface GroundedSource {
  title: string;
  uri: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  contextLabel?: string;
  sources?: GroundedSource[];
}
