import React, { useState } from 'react';
import { CalendarDays, CheckCircle2, Circle, Plus, Trash2 } from 'lucide-react';
import type { ClassLevel, PlannerTask, StreamType } from '../types/edugenius';
import { getSubjectsForClass } from '../data/ncertCatalog';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { SectionHeader } from '../components/ui/SectionHeader';
import { SegmentedControl } from '../components/ui/SegmentedControl';

interface PlannerViewProps {
  classLevel: ClassLevel;
  stream: StreamType;
  tasks: PlannerTask[];
  onAddTask: (task: Omit<PlannerTask, 'id'>) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export function PlannerView({
  classLevel,
  stream,
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
}: PlannerViewProps) {
  const subjects = getSubjectsForClass(classLevel, stream);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [title, setTitle] = useState('');
  const [subjectName, setSubjectName] = useState(subjects[0]?.name || 'Science');
  const [day, setDay] = useState('Today');
  const [durationMin, setDurationMin] = useState(40);

  const visibleTasks = tasks.filter((t) => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddTask({
      title: title.trim(),
      classLevel,
      subjectName,
      day,
      durationMin,
      completed: false,
    });
    setTitle('');
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title={`Class ${classLevel} Study Planner`}
        subtitle="Schedule chapter revisions, numerical practice, and NCERT mock checks."
        action={
          <SegmentedControl<'all' | 'pending' | 'completed'>
            ariaLabel="Filter study tasks"
            value={filter}
            onChange={setFilter}
            options={[
              { value: 'all', label: 'All Tasks' },
              { value: 'pending', label: 'Pending' },
              { value: 'completed', label: 'Completed' },
            ]}
          />
        }
      />

      {/* Add Study Block Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-slate-200 rounded-xl p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end"
      >
        <div className="lg:col-span-5">
          <label htmlFor="plan-title" className="block text-xs font-medium text-slate-600 mb-1">
            Study Task
          </label>
          <input
            id="plan-title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={`e.g., Revise Class ${classLevel} NCERT Exercise 2`}
            className="w-full min-h-[40px] px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="lg:col-span-3">
          <label htmlFor="plan-sub" className="block text-xs font-medium text-slate-600 mb-1">
            Subject
          </label>
          <select
            id="plan-sub"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            className="w-full min-h-[40px] px-3 rounded-lg border border-slate-200 bg-white text-sm"
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="lg:col-span-2">
          <label htmlFor="plan-day" className="block text-xs font-medium text-slate-600 mb-1">
            Day & Duration
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            <select
              id="plan-day"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="min-h-[40px] px-2 rounded-lg border border-slate-200 bg-white text-xs"
            >
              <option value="Today">Today</option>
              <option value="Tomorrow">Tomorrow</option>
              <option value="Weekend">Weekend</option>
            </select>
            <input
              type="number"
              min={10}
              max={180}
              step={5}
              aria-label="Duration in minutes"
              value={durationMin}
              onChange={(e) => setDurationMin(Number(e.target.value) || 30)}
              className="min-h-[40px] px-2 rounded-lg border border-slate-200 text-xs font-mono tabular-nums"
            />
          </div>
        </div>

        <div className="lg:col-span-2">
          <Button type="submit" variant="primary" className="w-full" leftIcon={<Plus className="w-4 h-4" />}>
            Add Task
          </Button>
        </div>
      </form>

      {visibleTasks.length === 0 ? (
        <EmptyState
          icon={<CalendarDays className="w-5 h-5" />}
          title="No study tasks in this view"
          description="Add a focused NCERT study block above to organize your daily preparation."
        />
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-200">
          {visibleTasks.map((task) => (
            <div
              key={task.id}
              className="p-4 sm:px-6 flex items-center justify-between gap-4 hover:bg-slate-50/70"
            >
              <div className="flex items-start gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() => onToggleTask(task.id)}
                  aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
                  className={`mt-0.5 shrink-0 cursor-pointer ${
                    task.completed ? 'text-indigo-600' : 'text-slate-300 hover:text-indigo-500'
                  }`}
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>
                <div className="min-w-0">
                  <div
                    className={`text-sm font-medium ${
                      task.completed ? 'line-through text-slate-400' : 'text-slate-900'
                    }`}
                  >
                    {task.title}
                  </div>
                  <div className="text-xs text-slate-500 font-mono tabular-nums mt-0.5">
                    Class {task.classLevel} · {task.subjectName} · {task.day} · {task.durationMin} min
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onDeleteTask(task.id)}
                aria-label={`Remove ${task.title}`}
                className="p-2 rounded-lg text-slate-400 hover:text-rose-700 hover:bg-rose-50 shrink-0 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
