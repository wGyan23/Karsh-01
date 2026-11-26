import React from 'react';

interface StatMetricProps {
  label: string;
  value: string | number;
  detail: string;
  icon?: React.ReactNode;
  accent?: 'indigo' | 'blue' | 'violet' | 'slate';
}

const ICON_TONE: Record<NonNullable<StatMetricProps['accent']>, string> = {
  indigo: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  blue: 'bg-blue-50 text-blue-700 border-blue-100',
  violet: 'bg-violet-50 text-violet-700 border-violet-100',
  slate: 'bg-slate-100 text-slate-700 border-slate-200',
};

export function StatMetric({
  label,
  value,
  detail,
  icon,
  accent = 'indigo',
}: StatMetricProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between gap-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-slate-500 truncate">{label}</span>
        {icon && (
          <span
            aria-hidden="true"
            className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${ICON_TONE[accent]}`}
          >
            {icon}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
        {value}
      </div>
      <p className="text-xs text-slate-500 leading-relaxed">{detail}</p>
    </div>
  );
}
