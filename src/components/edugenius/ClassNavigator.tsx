import React, { useState } from 'react';
import type { AppLanguage, ClassLevel, EducationStage, StreamType } from '../../types/edugenius';
import { CLASS_LEVELS, STAGE_METADATA, getStageForClass } from '../../data/ncertCatalog';
import { SegmentedControl } from '../ui/SegmentedControl';

interface ClassNavigatorProps {
  selectedClass: ClassLevel;
  onSelectClass: (level: ClassLevel) => void;
  selectedStream?: StreamType;
  onSelectStream?: (stream: StreamType) => void;
  language?: AppLanguage;
  compact?: boolean;
}

type StageFilter = 'all' | EducationStage;

export function ClassNavigator({
  selectedClass,
  onSelectClass,
  selectedStream = 'science',
  onSelectStream,
  language = 'en',
  compact = false,
}: ClassNavigatorProps) {
  const [stageFilter, setStageFilter] = useState<StageFilter>('all');

  const visibleClasses =
    stageFilter === 'all' ? CLASS_LEVELS : STAGE_METADATA[stageFilter].classes;

  const activeStage = getStageForClass(selectedClass);

  return (
    <section
      aria-label="Classes 1 to 12 Navigator"
      className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-5"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>{language === 'hi' ? 'एनसीईआरटी पाठ्यक्रम चयन' : 'NCERT Grade Selector'}</span>
            <span aria-hidden="true">·</span>
            <span className="font-medium text-indigo-700">
              {language === 'hi'
                ? STAGE_METADATA[activeStage].labelHi
                : STAGE_METADATA[activeStage].label}{' '}
              ({STAGE_METADATA[activeStage].rangeLabel})
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-slate-900">
            {language === 'hi' ? 'कक्षा 1–12 चुनें' : 'Navigate Classes 1–12'}
          </h3>
        </div>

        <SegmentedControl<StageFilter>
          ariaLabel="Filter classes by NCERT stage"
          value={stageFilter}
          onChange={setStageFilter}
          options={[
            { value: 'all', label: language === 'hi' ? 'सभी (1–12)' : 'All (1–12)' },
            { value: 'primary', label: language === 'hi' ? 'प्राथमिक (1–5)' : 'Primary 1–5' },
            { value: 'middle', label: language === 'hi' ? 'माध्यमिक (6–8)' : 'Middle 6–8' },
            { value: 'secondary', label: language === 'hi' ? 'उच्च (9–10)' : 'Secondary 9–10' },
            { value: 'senior_secondary', label: language === 'hi' ? 'वरिष्ठ (11–12)' : 'Sr. Sec 11–12' },
          ]}
        />
      </div>

      {/* Responsive 1-12 Grade Grid */}
      <div
        className={`grid gap-2.5 ${
          compact
            ? 'grid-cols-4 sm:grid-cols-6 lg:grid-cols-12'
            : 'grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12'
        }`}
      >
        {visibleClasses.map((grade) => {
          const isSelected = grade === selectedClass;
          const stageInfo = STAGE_METADATA[getStageForClass(grade)];
          return (
            <button
              key={grade}
              type="button"
              onClick={() => onSelectClass(grade)}
              aria-pressed={isSelected}
              className={`min-h-[54px] px-2.5 py-2 rounded-lg border text-left transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-slate-50/70 text-slate-800 border-slate-200 hover:bg-indigo-50/60 hover:border-indigo-200'
              }`}
            >
              <span
                className={`text-xs font-mono tabular-nums ${
                  isSelected ? 'text-indigo-100' : 'text-slate-500'
                }`}
              >
                {language === 'hi' ? 'कक्षा' : 'Class'}
              </span>
              <div className="flex items-baseline justify-between gap-1">
                <span className="text-base font-bold font-mono tabular-nums">{grade}</span>
                {!compact && (
                  <span
                    className={`text-[10px] truncate ${
                      isSelected ? 'text-indigo-100' : 'text-slate-400'
                    }`}
                  >
                    {stageInfo.label.split(' ')[0]}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Stream Selector for Senior Secondary (Classes 11-12) */}
      {selectedClass >= 11 && onSelectStream && (
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-600">
            {language === 'hi'
              ? `कक्षा ${selectedClass} के लिए संकाय (Stream) चुनें:`
              : `Select academic stream for Class ${selectedClass}:`}
          </div>
          <SegmentedControl<StreamType>
            ariaLabel="Senior secondary academic stream"
            value={selectedStream}
            onChange={onSelectStream}
            options={[
              { value: 'science', label: language === 'hi' ? 'विज्ञान (Science)' : 'Science' },
              { value: 'commerce', label: language === 'hi' ? 'वाणिज्य (Commerce)' : 'Commerce' },
              { value: 'humanities', label: language === 'hi' ? 'मानविकी (Humanities)' : 'Humanities' },
            ]}
          />
        </div>
      )}
    </section>
  );
}
