import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Circle,
  ExternalLink,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import type {
  AppLanguage,
  ClassLevel,
  StreamType,
  SubjectItem,
} from '../types/edugenius';
import { STAGE_METADATA, getStageForClass, getSubjectsForClass } from '../data/ncertCatalog';
import { Button } from '../components/ui/Button';
import { SectionHeader } from '../components/ui/SectionHeader';
import { SubjectGrid } from '../components/edugenius/SubjectGrid';

interface MyClassViewProps {
  classLevel: ClassLevel;
  stream: StreamType;
  enrolledSubjectIds: string[];
  selectedSubjectId?: string;
  completedChapterIds: string[];
  language: AppLanguage;
  onToggleChapterComplete: (chapterId: string) => void;
  onAskTutor: (subject: SubjectItem, chapterTitle?: string) => void;
  onGenerateQuizForChapter: (subject: SubjectItem, chapterTitle: string) => void;
  onOpenOnboarding: () => void;
}

export function MyClassView({
  classLevel,
  stream,
  enrolledSubjectIds,
  selectedSubjectId,
  completedChapterIds,
  language,
  onToggleChapterComplete,
  onAskTutor,
  onGenerateQuizForChapter,
  onOpenOnboarding,
}: MyClassViewProps) {
  const allClassSubjects = getSubjectsForClass(classLevel, stream);
  const enrolledSubjects = allClassSubjects.filter(
    (s) => enrolledSubjectIds.length === 0 || enrolledSubjectIds.includes(s.id)
  );

  const [activeSubjectId, setActiveSubjectId] = useState<string>(
    selectedSubjectId || enrolledSubjects[0]?.id || ''
  );

  useEffect(() => {
    if (selectedSubjectId && enrolledSubjects.some((s) => s.id === selectedSubjectId)) {
      setActiveSubjectId(selectedSubjectId);
    } else if (!enrolledSubjects.some((s) => s.id === activeSubjectId)) {
      setActiveSubjectId(enrolledSubjects[0]?.id || '');
    }
  }, [selectedSubjectId, enrolledSubjects, activeSubjectId]);

  const activeSubject =
    enrolledSubjects.find((s) => s.id === activeSubjectId) || enrolledSubjects[0];
  const stageInfo = STAGE_METADATA[getStageForClass(classLevel)];

  return (
    <div className="space-y-8">
      {/* Dedicated Class-Specific Header */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="text-xs font-medium text-indigo-700 flex items-center gap-2">
            <span>
              {language === 'hi' ? stageInfo.labelHi : stageInfo.label} Stage
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-500">
              {classLevel >= 11 ? `${stream.toUpperCase()} Stream` : 'NCERT Class-Locked View'}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {language === 'hi'
              ? `कक्षा ${classLevel} — पाठ्यक्रम और अध्याय`
              : `Class ${classLevel} — Dedicated NCERT Workspace`}
          </h1>
          <p className="text-sm text-slate-600">
            {language === 'hi'
              ? `यह पृष्ठ केवल आपकी चयनित कक्षा (${classLevel}) के विषयों, अध्यायों और आधिकारिक NCERT लिंक को दिखाता है।`
              : `Showing only your enrolled Class ${classLevel} subjects, chapters, and official NCERT & ePathshala portals.`}
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={onOpenOnboarding}>
          {language === 'hi' ? 'कक्षा / विषय बदलें' : 'Update Class or Subjects'}
        </Button>
      </section>

      {/* Class-Locked Subject Selection Grid */}
      <div className="space-y-4">
        <SectionHeader
          title={
            language === 'hi'
              ? `कक्षा ${classLevel} के नामांकित विषय`
              : `Your Class ${classLevel} Subjects`
          }
          subtitle="Click any subject card to inspect its chapters below, launch the AI tutor, or visit official NCERT textbooks."
        />
        <SubjectGrid
          classLevel={classLevel}
          subjects={enrolledSubjects}
          completedChapterIds={completedChapterIds}
          language={language}
          onSelectSubject={(sub) => setActiveSubjectId(sub.id)}
          onAskTutor={(sub) => onAskTutor(sub)}
        />
      </div>

      {/* Chapter Syllabus Inspector */}
      {activeSubject && (
        <section
          aria-label="Chapter Syllabus Inspector"
          className="bg-white border border-slate-200 rounded-xl overflow-hidden"
        >
          <div className="p-5 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/60">
            <div className="space-y-1">
              <div className="text-xs text-slate-500">
                Class {classLevel} · {activeSubject.bookName}
              </div>
              <h2 className="text-lg font-semibold text-slate-900">
                {language === 'hi' ? activeSubject.nameHi : activeSubject.name} — Chapters
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={activeSubject.ncertPortalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 min-h-[38px] px-3 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap"
              >
                <span>NCERT Textbooks</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href={activeSubject.epathshalaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 min-h-[38px] px-3 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap"
              >
                <span>ePathshala</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <Button
                size="sm"
                variant="primary"
                leftIcon={<MessageSquare className="w-3.5 h-3.5" />}
                onClick={() => onAskTutor(activeSubject)}
              >
                Ask AI Tutor
              </Button>
            </div>
          </div>

          <div className="divide-y divide-slate-200">
            {activeSubject.chapters.map((chapter) => {
              const isDone = completedChapterIds.includes(chapter.id);
              return (
                <div
                  key={chapter.id}
                  className="p-5 sm:px-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
                >
                  <div className="flex items-start gap-3.5 max-w-2xl">
                    <button
                      type="button"
                      onClick={() => onToggleChapterComplete(chapter.id)}
                      aria-label={isDone ? 'Mark chapter incomplete' : 'Mark chapter complete'}
                      className={`mt-0.5 shrink-0 cursor-pointer rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                        isDone ? 'text-indigo-600' : 'text-slate-300 hover:text-indigo-500'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <div className="space-y-1">
                      <div className="text-xs text-slate-500 font-mono tabular-nums">
                        Chapter {String(chapter.number).padStart(2, '0')} ·{' '}
                        {isDone ? 'Completed' : 'In Progress'}
                      </div>
                      <h3 className="text-sm sm:text-base font-semibold text-slate-900">
                        {language === 'hi' ? chapter.titleHi : chapter.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {chapter.summary}
                      </p>
                      <div className="text-xs text-slate-500 pt-0.5">
                        Key topics: {chapter.keyTopics.join(' · ')}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0 pl-8 lg:pl-0">
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={<MessageSquare className="w-3.5 h-3.5" />}
                      onClick={() => onAskTutor(activeSubject, chapter.title)}
                    >
                      Explain Chapter
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Sparkles className="w-3.5 h-3.5" />}
                      onClick={() => onGenerateQuizForChapter(activeSubject, chapter.title)}
                    >
                      Chapter Quiz
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
