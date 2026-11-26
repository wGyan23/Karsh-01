import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  action,
  className = '',
}: SectionHeaderProps) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 ${className}`}>
      <div className="space-y-1 max-w-2xl">
        <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-slate-900 text-balance">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-slate-600 leading-relaxed">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
