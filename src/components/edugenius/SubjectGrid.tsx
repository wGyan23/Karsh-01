import React, { useState } from 'react';
import { ArrowRight, BookOpen, ExternalLink, MessageSquare } from 'lucide-react';
import type { AppLanguage, ClassLevel, SubjectCategory, SubjectItem } from '../../types/edugenius';
import { SegmentedControl } from '../ui/SegmentedControl';

interface SubjectGridProps {
  classLevel: ClassLevel;
  subjects: SubjectItem[];
  completedChapterIds: string[];
  language?: AppLanguage;
  onSelectSubject: (subject: SubjectItem) => void;
  onAskTutor?: (subject: SubjectItem) => void;
}

type CategoryFilter = 'all' | SubjectCategory;

const ACCENT_BAR: Record<SubjectItem['accentTone'], string> = {
  indigo: 'bg-indigo-600',
  blue: 'bg-blue-600',
  violet: 'bg-violet-600',
  cyan: 'bg-sky-600',
};

const ICON_SURFACE: Record<SubjectItem['accentTone'], string> = {
  indigo: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  blue: 'bg-blue-50 text-blue-700 border-blue-100',
  violet: 'bg-violet-50 text-violet-700 border-violet-100',
  cyan: 'bg-sky-50 text-sky-700 border-sky-100',
};

export function SubjectGrid({
  classLevel,
  subjects,
  completedChapterIds,
  language = 'en',
  onSelectSubject,
  onAskTutor,
}: SubjectGridProps) {
  const [filter, setFilter] = useState<CategoryFilter>('all');

  const filtered =
    filter === 'all' ? subjects : subjects.filter((subject) => subject.category === filter);

  return (
    <section aria-label="Subject Selection Grid" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-sm text-slate-600">
          {language === 'hi'
            ? `कक्षा ${classLevel} · ${filtered.length} NCERT विषय उपलब्ध`
            : `Class ${classLevel} · ${filtered.length} NCERT subjects available`}
        </div>
        <SegmentedControl<CategoryFilter>
          ariaLabel="Filter subjects by category"
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'all', label: language === 'hi' ? 'सभी विषय' : 'All Subjects' },
            { value: 'core', label: language === 'hi' ? 'मुख्य' : 'Core' },
            { value: 'language', label: language === 'hi' ? 'भाषाएँ' : 'Languages' },
            { value: 'elective', label: language === 'hi' ? 'वैकल्पिक' : 'Electives' },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((subject) => {
          const totalChapters = subject.chapters.length;
          const completedCount = subject.chapters.filter((ch) =>
            completedChapterIds.includes(ch.id)
          ).length;
          const pct = totalChapters > 0 ? Math.round((completedCount / totalChapters) * 100) : 0;

          return (
            <article
              key={subject.id}
              className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between gap-4 hover:border-indigo-300 transition-colors duration-150"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <span
                    aria-hidden="true"
                    className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${ICON_SURFACE[subject.accentTone]}`}
                  >
                    <BookOpen className="w-4 h-4" />
                  </span>
                  <div className="text-xs text-slate-500 font-mono tabular-nums text-right">
                    {completedCount}/{totalChapters}{' '}
                    {language === 'hi' ? 'अध्याय' : 'chapters'}
                  </div>
                </div>

                <div>
                  <h4 className="text-base font-semibold text-slate-900 leading-snug">
                    {language === 'hi' ? subject.nameHi : subject.name}
                  </h4>
                  <p className="mt-1 text-xs text-slate-500 flex items-center gap-1.5 flex-wrap">
                    <span>{subject.bookName}</span>
                    <span aria-hidden="true">·</span>
                    <span>
                      {subject.category === 'language'
                        ? language === 'hi'
                          ? 'भाषा'
                          : 'Language'
                        : subject.category === 'elective'
                          ? language === 'hi'
                            ? 'वैकल्पिक'
                            : 'Elective'
                          : language === 'hi'
                            ? 'मुख्य विषय'
                            : 'Core'}
                    </span>
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-200 ${ACCENT_BAR[subject.accentTone]}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 tabular-nums">
                    <span>{language === 'hi' ? 'प्रगति' : 'Progress'}</span>
                    <span className="font-mono font-medium text-slate-700">{pct}%</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onSelectSubject(subject)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 hover:text-indigo-800 min-h-[36px] whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
                >
                  <span>{language === 'hi' ? 'अध्याय खोलें' : 'Open Chapters'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-1">
                  {onAskTutor && (
                    <button
                      type="button"
                      onClick={() => onAskTutor(subject)}
                      title={language === 'hi' ? 'AI शिक्षक से पूछें' : 'Ask AI Tutor'}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 whitespace-nowrap cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{language === 'hi' ? 'AI' : 'Tutor'}</span>
                    </button>
                  )}
                  <a
                    href={subject.ncertPortalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Official NCERT Textbooks Portal"
                    className="inline-flex items-center gap-1 px-2 py-1.5 rounded-md text-xs text-slate-500 hover:bg-slate-100 hover:text-slate-800 whitespace-nowrap"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>NCERT</span>
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
