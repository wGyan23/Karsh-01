import React from 'react';

function renderInlineSegments(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={idx} className="font-semibold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <code
          key={idx}
          className="px-1.5 py-0.5 rounded bg-slate-100 text-indigo-700 font-mono text-[13px]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

export function FormattedText({ text }: { text: string }) {
  const lines = text.split('\n');

  return (
    <div className="space-y-2 text-sm text-slate-700 leading-relaxed">
      {lines.map((rawLine, index) => {
        const line = rawLine.trim();
        if (!line) {
          return <div key={index} className="h-1" />;
        }

        if (line.startsWith('### ') || line.startsWith('## ') || line.startsWith('# ')) {
          const clean = line.replace(/^#{1,3}\s+/, '');
          return (
            <h4 key={index} className="text-sm font-semibold text-slate-900 pt-1.5">
              {renderInlineSegments(clean)}
            </h4>
          );
        }

        if (line.startsWith('- ') || line.startsWith('• ') || line.startsWith('* ')) {
          const content = line.slice(2).trim();
          return (
            <div key={index} className="flex items-start gap-2.5 pl-1">
              <span aria-hidden="true" className="text-indigo-600 font-semibold mt-0.5">
                •
              </span>
              <span className="flex-1">{renderInlineSegments(content)}</span>
            </div>
          );
        }

        const numberedMatch = line.match(/^(\d+\.)\s+(.*)$/);
        if (numberedMatch) {
          return (
            <div key={index} className="flex items-start gap-2 pl-1">
              <span className="font-mono text-xs font-semibold text-indigo-700 mt-0.5 min-w-[20px] tabular-nums">
                {numberedMatch[1]}
              </span>
              <span className="flex-1">{renderInlineSegments(numberedMatch[2])}</span>
            </div>
          );
        }

        return <p key={index}>{renderInlineSegments(line)}</p>;
      })}
    </div>
  );
}
