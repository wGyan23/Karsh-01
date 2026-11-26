import React, { useState } from 'react';
import { BookCheck, Layers, MessageSquare, Sparkles } from 'lucide-react';
import type { ClassLevel, StreamType } from '../types/edugenius';
import { getSubjectsForClass } from '../data/ncertCatalog';
import { Button } from '../components/ui/Button';
import { SectionHeader } from '../components/ui/SectionHeader';
import { SegmentedControl } from '../components/ui/SegmentedControl';
import { StatMetric } from '../components/ui/StatMetric';
import { ClassNavigator } from '../components/edugenius/ClassNavigator';
import { SubjectGrid } from '../components/edugenius/SubjectGrid';

export function ComponentLibraryView() {
  const [previewClass, setPreviewClass] = useState<ClassLevel>(10);
  const [previewStream, setPreviewStream] = useState<StreamType>('science');
  const [previewTab, setPreviewTab] = useState<'tokens' | 'navigator' | 'subjects' | 'assistant'>('tokens');

  const previewSubjects = getSubjectsForClass(previewClass, previewStream);

  return (
    <div className="space-y-8">
      <SectionHeader
        title="EDUGENIUS UI/UX & Reusable Component Library"
        subtitle="Architectural design tokens, Classes 1–12 navigator, subject selection grid, and responsive AI assistant layout specifications."
        action={
          <SegmentedControl<'tokens' | 'navigator' | 'subjects' | 'assistant'>
            ariaLabel="Inspect component module"
            value={previewTab}
            onChange={setPreviewTab}
            options={[
              { value: 'tokens', label: 'Tokens & Shell' },
              { value: 'navigator', label: 'ClassNavigator' },
              { value: 'subjects', label: 'SubjectGrid' },
              { value: 'assistant', label: 'AI Chat Layout' },
            ]}
          />
        }
      />

      {previewTab === 'tokens' && (
        <div className="space-y-6">
          {/* 60-30-10 Color System */}
          <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h3 className="text-base font-semibold text-slate-900">
              1. 60–30–10 Blue-Purple Palette & Surface Hierarchy
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-slate-200 rounded-xl p-4 space-y-2 bg-slate-50">
                <div className="h-10 rounded-lg bg-slate-50 border border-slate-200" />
                <div className="text-sm font-semibold text-slate-900">60% Neutral Canvas</div>
                <p className="text-xs text-slate-600 font-mono">
                  #F8FAFC (slate-50) · #FFFFFF surfaces
                </p>
              </div>
              <div className="border border-slate-200 rounded-xl p-4 space-y-2 bg-white">
                <div className="h-10 rounded-lg bg-slate-100 border border-slate-200" />
                <div className="text-sm font-semibold text-slate-900">30% Structural Surfaces</div>
                <p className="text-xs text-slate-600 font-mono">
                  #F1F5F9 · #E2E8F0 hairline borders · #0F172A ink
                </p>
              </div>
              <div className="border border-slate-200 rounded-xl p-4 space-y-2 bg-white">
                <div className="h-10 rounded-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600" />
                <div className="text-sm font-semibold text-slate-900">10% Brand Accent</div>
                <p className="text-xs text-slate-600 font-mono">
                  Blue #2563EB → Indigo #4F46E5 → Violet #7C3AED
                </p>
              </div>
            </div>
          </section>

          {/* Primitive Controls */}
          <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <h3 className="text-base font-semibold text-slate-900">
              2. Core UI Primitives (Button, StatMetric, SegmentedControl)
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" leftIcon={<Sparkles className="w-4 h-4" />}>
                Primary Action
              </Button>
              <Button variant="secondary">Secondary Indigo</Button>
              <Button variant="outline">Outline Surface</Button>
              <Button variant="ghost">Ghost Control</Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <StatMetric
                label="Tabular Metric"
                value="94%"
                detail="Uses font-mono tabular-nums for vertical precision"
                icon={<BookCheck className="w-4 h-4" />}
                accent="indigo"
              />
              <StatMetric
                label="Bilingual Typography"
                value="EN / हिं"
                detail="Plus Jakarta Sans + DM Sans + Noto Sans Devanagari"
                icon={<Layers className="w-4 h-4" />}
                accent="blue"
              />
              <StatMetric
                label="Elevation Policy"
                value="1-Level"
                detail="Hairline 1px borders without nested card sandwiches"
                icon={<MessageSquare className="w-4 h-4" />}
                accent="violet"
              />
            </div>
          </section>
        </div>
      )}

      {previewTab === 'navigator' && (
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Interactive sandbox for <code className="font-mono text-indigo-700">ClassNavigator</code>:
            supports stage filtering (Primary 1–5, Middle 6–8, Secondary 9–10, Sr. Secondary 11–12),
            12-column responsive grade grid, and automatic Stream switcher for Classes 11–12.
          </p>
          <ClassNavigator
            selectedClass={previewClass}
            onSelectClass={setPreviewClass}
            selectedStream={previewStream}
            onSelectStream={setPreviewStream}
          />
        </div>
      )}

      {previewTab === 'subjects' && (
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Interactive sandbox for <code className="font-mono text-indigo-700">SubjectGrid</code>:
            filters by Core / Languages / Electives, renders chapter progress bars, unboxed NCERT
            book metadata, and single-click actions.
          </p>
          <SubjectGrid
            classLevel={previewClass}
            subjects={previewSubjects}
            completedChapterIds={[]}
            onSelectSubject={() => {}}
          />
        </div>
      )}

      {previewTab === 'assistant' && (
        <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <h3 className="text-base font-semibold text-slate-900">
            Responsive AI Assistant Two-Zone Architecture
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-4 border border-slate-200 rounded-xl p-4 bg-slate-50/70 space-y-2">
              <div className="text-xs font-semibold text-indigo-700">
                Zone 1: Context Rail (300px Desktop / Slide-Over Mobile)
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pins Class (1–12), Subject, Chapter focus, Language (English / हिन्दी / Hinglish),
                Pedagogical Mode (Concept, Step Solver, Revision, NCERT Search), and Search Grounding toggle.
              </p>
            </div>
            <div className="md:col-span-8 border border-slate-200 rounded-xl p-4 bg-white space-y-2">
              <div className="text-xs font-semibold text-indigo-700">
                Zone 2: Stream & Composer Viewport
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Displays safe React-formatted NCERT explanations, grounded web source citations,
                1-click &ldquo;Save to Notes&rdquo;, and a sticky multi-line composer with Enter-to-send.
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
