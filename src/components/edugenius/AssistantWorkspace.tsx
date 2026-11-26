import React, { useEffect, useRef, useState } from 'react';
import {
  BookmarkPlus,
  Check,
  ExternalLink,
  Globe,
  RotateCcw,
  Send,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import type {
  AppLanguage,
  ChatMessage,
  ClassLevel,
  GroundedSource,
  StreamType,
  SubjectItem,
  TutorLanguage,
  TutorMode,
} from '../../types/edugenius';
import { CLASS_LEVELS, getSubjectsForClass } from '../../data/ncertCatalog';
import { Button } from '../ui/Button';
import { FormattedText } from '../ui/FormattedText';
import { SegmentedControl } from '../ui/SegmentedControl';

interface AssistantWorkspaceProps {
  initialClass: ClassLevel;
  initialStream: StreamType;
  enrolledSubjectIds?: string[];
  lockClass?: boolean;
  initialSubjectName?: string;
  initialChapterTitle?: string;
  appLanguage: AppLanguage;
  onSaveToNotes: (payload: {
    title: string;
    classLevel: ClassLevel;
    subjectName: string;
    content: string;
  }) => void;
}

const STARTER_PROMPTS: Record<TutorMode, string[]> = {
  concept: [
    'Explain Ohm’s Law with a simple everyday analogy and formula.',
    'Why do ionic compounds have high melting points?',
    'Explain the difference between Fundamental Rights and Directive Principles.',
  ],
  solver: [
    'Solve step-by-step: Find the roots of 2x² − 7x + 3 = 0.',
    'A concave mirror produces 3× magnified real image at 10 cm from pole. Find focal length.',
    'Calculate the pH and nature of a solution that turns red litmus blue.',
  ],
  revision: [
    'Create quick board-exam revision notes for Carbon and its Compounds.',
    'Summarize key formulas of Surface Areas and Volumes for Class 10.',
    'List the key events of the Non-Cooperation Movement (1920–22).',
  ],
  search: [
    'Find official NCERT & ePathshala Class 10 Science resources.',
    'Find NCERT Exemplar problems portal for Class 12 Physics.',
    'Find DIKSHA digital lessons for Class 8 Mathematics.',
  ],
};

export function AssistantWorkspace({
  initialClass,
  initialStream,
  enrolledSubjectIds,
  lockClass = false,
  initialSubjectName,
  initialChapterTitle,
  appLanguage,
  onSaveToNotes,
}: AssistantWorkspaceProps) {
  const [classLevel, setClassLevel] = useState<ClassLevel>(initialClass);
  const [stream, setStream] = useState<StreamType>(initialStream);
  const allSubjects: SubjectItem[] = getSubjectsForClass(classLevel, stream);
  const subjects: SubjectItem[] =
    enrolledSubjectIds && enrolledSubjectIds.length > 0
      ? allSubjects.filter((s) => enrolledSubjectIds.includes(s.id))
      : allSubjects;

  const [subjectName, setSubjectName] = useState<string>(
    initialSubjectName || subjects[0]?.name || 'Science'
  );
  const [chapterTitle, setChapterTitle] = useState<string>(initialChapterTitle || '');
  const [tutorLanguage, setTutorLanguage] = useState<TutorLanguage>(
    appLanguage === 'hi' ? 'hi' : 'en'
  );
  const [mode, setMode] = useState<TutorMode>('concept');
  const [useSearch, setUseSearch] = useState<boolean>(false);
  const [mobileConfigOpen, setMobileConfigOpen] = useState<boolean>(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      timestamp: 'Ready',
      contextLabel: `Class ${initialClass} · ${initialSubjectName || subjects[0]?.name || 'NCERT'}`,
      text:
        appLanguage === 'hi'
          ? `नमस्ते! मैं **EDUGENIUS AI** शिक्षक हूँ। कक्षा ${initialClass} के किसी भी NCERT विषय या अध्याय के बारे में पूछें—अवधारणा, चरण-दर-चरण हल, या परीक्षा दोहराव नोट्स।`
          : `Hello! I am your **EDUGENIUS AI** tutor. Ask any NCERT question for Class ${initialClass}—concept explanations, step-by-step numericals, exam revision notes, or official NCERT/ePathshala resource lookup.`,
    },
  ]);

  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (initialSubjectName) setSubjectName(initialSubjectName);
    if (initialChapterTitle) setChapterTitle(initialChapterTitle);
    setClassLevel(initialClass);
  }, [initialClass, initialSubjectName, initialChapterTitle]);

  useEffect(() => {
    const available = getSubjectsForClass(classLevel, stream);
    if (!available.some((s) => s.name === subjectName)) {
      setSubjectName(available[0]?.name || 'General Studies');
      setChapterTitle('');
    }
  }, [classLevel, stream, subjectName]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isSending]);

  const activeSubjectObj = subjects.find((s) => s.name === subjectName) || subjects[0];

  const sendMessage = async (promptOverride?: string) => {
    const trimmed = (promptOverride ?? input).trim();
    if (!trimmed || isSending) return;

    setErrorMsg(null);
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      contextLabel: `Class ${classLevel} · ${subjectName}`,
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    if (!promptOverride) setInput('');
    setIsSending(true);

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: trimmed,
          classLevel,
          subject: subjectName,
          chapter: chapterTitle,
          language: tutorLanguage,
          mode,
          useSearch: useSearch || mode === 'search',
          history: nextMessages.slice(-6).map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      const data = (await res.json()) as {
        reply?: string;
        sources?: GroundedSource[];
        error?: string;
      };

      if (!res.ok || !data.reply) {
        throw new Error(data.error || 'Unable to generate a response.');
      }

      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        text: data.reply,
        sources: Array.isArray(data.sources) ? data.sources : [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        contextLabel: `Class ${classLevel} · ${subjectName}${chapterTitle ? ` · ${chapterTitle}` : ''}`,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Network error while reaching the AI tutor.'
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleSaveReply = (msg: ChatMessage) => {
    onSaveToNotes({
      title: `${subjectName} (Class ${classLevel}) — AI Study Note`,
      classLevel,
      subjectName,
      content: msg.text,
    });
    setSavedIds((prev) => (prev.includes(msg.id) ? prev : [...prev, msg.id]));
  };

  const handleResetChat = () => {
    setErrorMsg(null);
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        timestamp: 'Ready',
        contextLabel: `Class ${classLevel} · ${subjectName}`,
        text: `Started a fresh NCERT session for **Class ${classLevel} ${subjectName}**${chapterTitle ? ` (${chapterTitle})` : ''}. Ask any concept, numerical, or revision question below.`,
      },
    ]);
  };

  const contextRailBody = (
    <div className="space-y-5">
      <div className="flex items-center justify-between lg:hidden pb-2 border-b border-slate-200">
        <span className="text-sm font-semibold text-slate-900">Tutor Context</span>
        <button
          type="button"
          aria-label="Close context panel"
          onClick={() => setMobileConfigOpen(false)}
          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Class & Subject Selectors */}
      <div className="space-y-3">
        <div>
          <label htmlFor="tutor-class" className="block text-xs font-medium text-slate-600 mb-1.5">
            {lockClass ? 'Enrolled Class' : 'Class (1–12)'}
          </label>
          {lockClass ? (
            <div className="w-full min-h-[40px] px-3 rounded-lg border border-slate-200 bg-slate-100/70 text-sm font-medium text-slate-800 flex items-center justify-between">
              <span>Class {classLevel}</span>
              <span className="text-xs text-indigo-700 font-mono">Class-Locked</span>
            </div>
          ) : (
            <select
              id="tutor-class"
              value={classLevel}
              onChange={(e) => setClassLevel(Number(e.target.value) as ClassLevel)}
              className="w-full min-h-[40px] px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {CLASS_LEVELS.map((c) => (
                <option key={c} value={c}>
                  Class {c}
                </option>
              ))}
            </select>
          )}
        </div>

        {!lockClass && classLevel >= 11 && (
          <div>
            <label htmlFor="tutor-stream" className="block text-xs font-medium text-slate-600 mb-1.5">
              Stream
            </label>
            <select
              id="tutor-stream"
              value={stream}
              onChange={(e) => setStream(e.target.value as StreamType)}
              className="w-full min-h-[40px] px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="science">Science</option>
              <option value="commerce">Commerce</option>
              <option value="humanities">Humanities</option>
            </select>
          </div>
        )}

        <div>
          <label htmlFor="tutor-subject" className="block text-xs font-medium text-slate-600 mb-1.5">
            Subject
          </label>
          <select
            id="tutor-subject"
            value={subjectName}
            onChange={(e) => {
              setSubjectName(e.target.value);
              setChapterTitle('');
            }}
            className="w-full min-h-[40px] px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.name}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="tutor-chapter" className="block text-xs font-medium text-slate-600 mb-1.5">
            Chapter Focus (Optional)
          </label>
          <select
            id="tutor-chapter"
            value={chapterTitle}
            onChange={(e) => setChapterTitle(e.target.value)}
            className="w-full min-h-[40px] px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All chapters in {subjectName}</option>
            {(activeSubjectObj?.chapters || []).map((ch) => (
              <option key={ch.id} value={ch.title}>
                Ch {ch.number}: {ch.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Response Language */}
      <div className="space-y-1.5">
        <span className="block text-xs font-medium text-slate-600">Response Language</span>
        <SegmentedControl<TutorLanguage>
          ariaLabel="Tutor response language"
          value={tutorLanguage}
          onChange={setTutorLanguage}
          className="w-full justify-between"
          options={[
            { value: 'en', label: 'English' },
            { value: 'hi', label: 'हिन्दी' },
            { value: 'hinglish', label: 'Hinglish' },
          ]}
        />
      </div>

      {/* Study Mode */}
      <div className="space-y-1.5">
        <span className="block text-xs font-medium text-slate-600">Tutor Mode</span>
        <div className="grid grid-cols-2 gap-1.5">
          {(
            [
              ['concept', 'Concept'],
              ['solver', 'Step Solver'],
              ['revision', 'Revision'],
              ['search', 'NCERT Search'],
            ] as Array<[TutorMode, string]>
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setMode(id)}
              className={`min-h-[38px] px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap ${
                mode === id
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Official Web Grounding Toggle */}
      <label className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-200 bg-slate-50/70 cursor-pointer">
        <input
          type="checkbox"
          checked={useSearch || mode === 'search'}
          onChange={(e) => setUseSearch(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
        />
        <span className="text-xs text-slate-700 leading-relaxed">
          <span className="font-semibold text-slate-900 block">Verify with Search Grounding</span>
          Attach official NCERT, ePathshala, and DIKSHA web citations when available.
        </span>
      </label>

      {/* Prompt Starters */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <div className="text-xs font-medium text-slate-500">Try a prompt</div>
        <div className="space-y-1.5">
          {STARTER_PROMPTS[mode].map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => {
                setMobileConfigOpen(false);
                void sendMessage(prompt);
              }}
              className="w-full text-left p-2.5 rounded-lg border border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/40 text-xs text-slate-700 leading-snug transition-colors cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden grid grid-cols-1 lg:grid-cols-[300px_1fr] min-h-[640px] max-h-[calc(100vh-150px)]">
      {/* Left Context Rail (Desktop) */}
      <aside className="hidden lg:block border-r border-slate-200 p-5 overflow-y-auto bg-slate-50/40">
        {contextRailBody}
      </aside>

      {/* Mobile Slide-Over Context Drawer */}
      {mobileConfigOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          <div
            className="fixed inset-0 bg-slate-900/40"
            onClick={() => setMobileConfigOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-10 w-80 max-w-[90vw] h-full bg-white p-5 overflow-y-auto shadow-xl">
            {contextRailBody}
          </div>
        </div>
      )}

      {/* Right Responsive Chat Viewport */}
      <div className="flex flex-col min-h-0 h-full">
        {/* Chat Sub-Header */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-slate-200 flex items-center justify-between gap-3 bg-white shrink-0">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-slate-900 truncate">
              NCERT AI Tutor — Class {classLevel} · {subjectName}
            </h3>
            <p className="text-xs text-slate-500 truncate">
              {chapterTitle ? `Chapter: ${chapterTitle}` : 'All chapters'} ·{' '}
              {tutorLanguage === 'hi' ? 'हिन्दी' : tutorLanguage === 'hinglish' ? 'Hinglish' : 'English'}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setMobileConfigOpen(true)}
              className="lg:hidden inline-flex items-center gap-1.5 min-h-[38px] px-3 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Context</span>
            </button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              onClick={handleResetChat}
            >
              New Chat
            </Button>
          </div>
        </div>

        {/* Message Stream */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-5 bg-slate-50/40">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            const isSaved = savedIds.includes(msg.id);

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-2 mb-1.5 text-xs text-slate-500">
                  <span className="font-medium text-slate-700">
                    {isUser ? 'You' : 'EDUGENIUS AI'}
                  </span>
                  {msg.contextLabel && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>{msg.contextLabel}</span>
                    </>
                  )}
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">{msg.timestamp}</span>
                </div>

                <div
                  className={`max-w-[92%] sm:max-w-[82%] rounded-xl px-4 py-3.5 ${
                    isUser
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm leading-relaxed'
                      : 'bg-white border border-slate-200 text-slate-800'
                  }`}
                >
                  {isUser ? (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  ) : (
                    <div className="space-y-3">
                      <FormattedText text={msg.text} />

                      {msg.sources && msg.sources.length > 0 && (
                        <div className="pt-3 border-t border-slate-100 space-y-1.5">
                          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                            <Globe className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Verified Web Sources</span>
                          </div>
                          <ul className="space-y-1">
                            {msg.sources.map((src) => (
                              <li key={src.uri}>
                                <a
                                  href={src.uri}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-xs text-indigo-700 hover:underline break-all"
                                >
                                  <ExternalLink className="w-3 h-3 shrink-0" />
                                  <span>{src.title}</span>
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {msg.id !== 'welcome-msg' && (
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                          <button
                            type="button"
                            onClick={() => handleSaveReply(msg)}
                            disabled={isSaved}
                            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                              isSaved
                                ? 'text-emerald-700 bg-emerald-50'
                                : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-700'
                            }`}
                          >
                            {isSaved ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Saved to Notes</span>
                              </>
                            ) : (
                              <>
                                <BookmarkPlus className="w-3.5 h-3.5" />
                                <span>Save to Notes</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isSending && (
            <div className="flex flex-col items-start">
              <div className="text-xs text-slate-500 mb-1.5">EDUGENIUS AI · Thinking...</div>
              <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-600">
                Preparing NCERT-aligned explanation...
              </div>
            </div>
          )}
        </div>

        {/* Error Banner */}
        {errorMsg && (
          <div
            role="alert"
            className="mx-4 sm:mx-6 my-2 px-3.5 py-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center justify-between gap-2"
          >
            <span>{errorMsg}</span>
            <button
              type="button"
              onClick={() => setErrorMsg(null)}
              className="text-rose-700 font-medium hover:underline shrink-0 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Composer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void sendMessage();
          }}
          className="p-4 sm:px-6 bg-white border-t border-slate-200 shrink-0"
        >
          <div className="flex items-end gap-2.5">
            <label htmlFor="assistant-prompt-input" className="sr-only">
              Ask your NCERT question
            </label>
            <textarea
              id="assistant-prompt-input"
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  void sendMessage();
                }
              }}
              placeholder={
                tutorLanguage === 'hi'
                  ? `कक्षा ${classLevel} ${subjectName} से अपना प्रश्न लिखें...`
                  : `Ask a Class ${classLevel} ${subjectName} question (Shift+Enter for new line)...`
              }
              className="flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isSending}
              disabled={!input.trim() || isSending}
              rightIcon={<Send className="w-4 h-4" />}
            >
              Send
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
