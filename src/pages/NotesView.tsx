import React, { useState } from 'react';
import { Download, NotebookPen, Plus, Trash2 } from 'lucide-react';
import type { ClassLevel, StudyNote } from '../types/edugenius';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { FormattedText } from '../components/ui/FormattedText';
import { SectionHeader } from '../components/ui/SectionHeader';

interface NotesViewProps {
  notes: StudyNote[];
  defaultClass: ClassLevel;
  onAddNote: (note: Omit<StudyNote, 'id' | 'updatedAt'>) => void;
  onDeleteNote: (id: string) => void;
}

export function NotesView({ notes, defaultClass, onAddNote, onDeleteNote }: NotesViewProps) {
  const [search, setSearch] = useState('');
  const [showComposer, setShowComposer] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [subjectName, setSubjectName] = useState('Science');
  const [content, setContent] = useState('');

  const filtered = notes.filter((note) => {
    const matchesClass = note.classLevel === defaultClass;
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      note.title.toLowerCase().includes(q) ||
      note.subjectName.toLowerCase().includes(q) ||
      note.content.toLowerCase().includes(q);
    return matchesClass && matchesSearch;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onAddNote({
      title: title.trim(),
      classLevel: defaultClass,
      subjectName: subjectName.trim() || 'General',
      content: content.trim(),
      source: 'manual',
    });
    setTitle('');
    setContent('');
    setShowComposer(false);
  };

  const handleDownloadMarkdown = (note: StudyNote) => {
    const body = `# ${note.title}\n\nClass ${note.classLevel} · ${note.subjectName} · Updated ${note.updatedAt}\n\n${note.content}\n`;
    const blob = new Blob([body], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${note.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title={`Class ${defaultClass} Study Notes`}
        subtitle="Organize chapter summaries, formulas, and explanations saved from the AI Tutor."
        action={
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setShowComposer((prev) => !prev)}
          >
            {showComposer ? 'Close Editor' : 'New Study Note'}
          </Button>
        }
      />

      {showComposer && (
        <form
          onSubmit={handleCreate}
          className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label htmlFor="note-title" className="block text-xs font-medium text-slate-600 mb-1">
                Note Title
              </label>
              <input
                id="note-title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={`e.g., Class ${defaultClass} — Key Formulas & Concepts`}
                className="w-full min-h-[40px] px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="note-sub" className="block text-xs font-medium text-slate-600 mb-1">
                Subject (Class {defaultClass})
              </label>
              <input
                id="note-sub"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                className="w-full min-h-[40px] px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="note-content" className="block text-xs font-medium text-slate-600 mb-1">
              Key Concepts & Formulas
            </label>
            <textarea
              id="note-content"
              required
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write bullet points, definitions, or worked steps..."
              className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowComposer(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Note
            </Button>
          </div>
        </form>
      )}

      {/* Search Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search Class ${defaultClass} notes by title, subject, or formula...`}
          aria-label="Search study notes"
          className="flex-1 min-h-[40px] px-3.5 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<NotebookPen className="w-5 h-5" />}
          title={`No study notes for Class ${defaultClass} yet`}
          description="Create a new study note or save any explanation directly from the AI Assistant."
          action={
            <Button variant="primary" size="sm" onClick={() => setShowComposer(true)}>
              Create First Note
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((note) => (
            <article
              key={note.id}
              className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                  <span>
                    Class {note.classLevel} · {note.subjectName} ·{' '}
                    {note.source === 'ai' ? 'Saved from AI Tutor' : 'Personal Note'}
                  </span>
                  <span className="font-mono tabular-nums">{note.updatedAt}</span>
                </div>
                <h3 className="text-base font-semibold text-slate-900">{note.title}</h3>
                <FormattedText text={note.content} />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleDownloadMarkdown(note)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-700 hover:text-indigo-800 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Markdown</span>
                </button>

                {confirmDeleteId === note.id ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onDeleteNote(note.id);
                        setConfirmDeleteId(null);
                      }}
                      className="text-xs font-semibold text-rose-700 hover:underline cursor-pointer"
                    >
                      Confirm Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(null)}
                      className="text-xs text-slate-500 hover:underline cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteId(note.id)}
                    aria-label={`Delete ${note.title}`}
                    className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-rose-700 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
