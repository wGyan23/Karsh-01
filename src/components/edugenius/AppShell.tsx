import React, { useState } from 'react';
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  CheckSquare,
  GraduationCap,
  Layers,
  LayoutDashboard,
  Library,
  Menu,
  MessageSquare,
  NotebookPen,
  UserCircle2,
  X,
} from 'lucide-react';
import type { AppLanguage, NavRoute, StudentProfile } from '../../types/edugenius';
import { UI_COPY } from '../../data/ncertCatalog';
import { Button } from '../ui/Button';
import { SegmentedControl } from '../ui/SegmentedControl';

interface AppShellProps {
  activeRoute: NavRoute;
  onNavigate: (route: NavRoute) => void;
  profile: StudentProfile;
  onLanguageChange: (lang: AppLanguage) => void;
  onOpenOnboarding: () => void;
  avatarUrl: string;
  children: React.ReactNode;
}

interface NavItemConfig {
  id: NavRoute;
  icon: React.ReactNode;
  group: 'learn' | 'practice' | 'system';
}

const NAV_ITEMS: NavItemConfig[] = [
  { id: 'dashboard', icon: <LayoutDashboard className="w-4 h-4" />, group: 'learn' },
  { id: 'classes', icon: <GraduationCap className="w-4 h-4" />, group: 'learn' },
  { id: 'subjects', icon: <BookOpen className="w-4 h-4" />, group: 'learn' },
  { id: 'library', icon: <Library className="w-4 h-4" />, group: 'learn' },
  { id: 'assistant', icon: <MessageSquare className="w-4 h-4" />, group: 'practice' },
  { id: 'notes', icon: <NotebookPen className="w-4 h-4" />, group: 'practice' },
  { id: 'quizzes', icon: <CheckSquare className="w-4 h-4" />, group: 'practice' },
  { id: 'results', icon: <BarChart3 className="w-4 h-4" />, group: 'practice' },
  { id: 'planner', icon: <CalendarDays className="w-4 h-4" />, group: 'practice' },
  { id: 'components', icon: <Layers className="w-4 h-4" />, group: 'system' },
  { id: 'profile', icon: <UserCircle2 className="w-4 h-4" />, group: 'system' },
];

export function AppShell({
  activeRoute,
  onNavigate,
  profile,
  onLanguageChange,
  onOpenOnboarding,
  avatarUrl,
  children,
}: AppShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);
  const copy = UI_COPY[profile.language];

  const handleSelectRoute = (route: NavRoute) => {
    onNavigate(route);
    setMobileMenuOpen(false);
  };

  const getNavLabel = (id: NavRoute): string => {
    if (id === 'classes') {
      return profile.language === 'hi'
        ? `कक्षा ${profile.classLevel} पृष्ठ`
        : `Class ${profile.classLevel} Page`;
    }
    return copy.nav[id];
  };

  const renderNavSection = (group: NavItemConfig['group'], heading: string) => {
    const items = NAV_ITEMS.filter((i) => i.group === group);
    return (
      <div className="space-y-1">
        <div className="px-3 pt-2 pb-1 text-xs font-medium text-slate-400">{heading}</div>
        {items.map((item) => {
          const isActive = activeRoute === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelectRoute(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <span aria-hidden="true" className={isActive ? 'text-indigo-600' : 'text-slate-400'}>
                {item.icon}
              </span>
              <span className="truncate">{getNavLabel(item.id)}</span>
            </button>
          );
        })}
      </div>
    );
  };

  const sidebarBody = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      <div className="h-16 px-5 border-b border-slate-200 flex items-center justify-between shrink-0">
        <button
          type="button"
          onClick={() => handleSelectRoute('dashboard')}
          className="flex items-center gap-2.5 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md"
        >
          <span
            aria-hidden="true"
            className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 text-white font-bold text-sm flex items-center justify-center shrink-0"
          >
            E
          </span>
          <span className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap">
            {copy.brand}
          </span>
        </button>
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70">
        <div className="text-xs text-slate-500">{copy.activeClass}</div>
        <div className="mt-0.5 flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-slate-900 tabular-nums">
            {profile.language === 'hi' ? `कक्षा ${profile.classLevel}` : `Class ${profile.classLevel}`}
            {profile.classLevel >= 11 ? ` · ${profile.stream[0].toUpperCase()}${profile.stream.slice(1)}` : ''}
          </span>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenOnboarding();
            }}
            className="text-xs font-medium text-indigo-700 hover:text-indigo-800 whitespace-nowrap cursor-pointer"
          >
            {profile.language === 'hi' ? 'बदलें' : 'Onboarding'}
          </button>
        </div>
      </div>

      <nav aria-label="Primary navigation" className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {renderNavSection('learn', profile.language === 'hi' ? 'अध्ययन' : 'Curriculum')}
        {renderNavSection('practice', profile.language === 'hi' ? 'अभ्यास और सहायता' : 'Workspace')}
        {renderNavSection('system', profile.language === 'hi' ? 'प्रणाली' : 'Architecture & Account')}
      </nav>

      <div className="p-3 border-t border-slate-200">
        <button
          type="button"
          onClick={() => handleSelectRoute('profile')}
          className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors text-left cursor-pointer"
        >
          <div className="w-9 h-9 rounded-full overflow-hidden bg-indigo-100 border border-slate-200 shrink-0 flex items-center justify-center text-indigo-700 font-semibold text-xs">
            {!avatarFailed ? (
              <img
                src={avatarUrl}
                alt={profile.name}
                referrerPolicy="no-referrer"
                onError={() => setAvatarFailed(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              profile.name.slice(0, 2).toUpperCase()
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-slate-900 truncate">{profile.name}</div>
            <div className="text-xs text-slate-500 truncate">{profile.board}</div>
          </div>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 sticky top-0 h-screen">
        {sidebarBody}
      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-10 w-72 max-w-[85vw] h-full">{sidebarBody}</div>
        </div>
      )}

      {/* Main Viewport */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Clean 3-Zone Top Header Bar */}
        <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Zone 1: Menu toggle + Breadcrumb */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              aria-label="Open navigation menu"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-1 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-sm min-w-0">
              <span className="hidden sm:inline font-semibold text-slate-900 whitespace-nowrap">
                {copy.brand}
              </span>
              <span aria-hidden="true" className="hidden sm:inline text-slate-300">
                /
              </span>
              <span className="font-medium text-indigo-700 truncate">
                {getNavLabel(activeRoute)}
              </span>
            </div>
          </div>

          {/* Zone 2: Language Switcher */}
          <div className="hidden md:flex items-center shrink-0">
            <SegmentedControl
              ariaLabel="Interface language"
              value={profile.language}
              onChange={onLanguageChange}
              options={[
                { value: 'en', label: 'English' },
                { value: 'hi', label: 'हिन्दी' },
              ]}
            />
          </div>

          {/* Zone 3: Single Primary Action */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onLanguageChange(profile.language === 'en' ? 'hi' : 'en')}
              className="md:hidden min-h-[40px] px-3 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 whitespace-nowrap shrink-0 cursor-pointer"
            >
              {profile.language === 'en' ? 'हिन्दी' : 'EN'}
            </button>
            <Button
              size="sm"
              variant="primary"
              leftIcon={<MessageSquare className="w-4 h-4" />}
              onClick={() => onNavigate('assistant')}
            >
              {copy.askTutor}
            </Button>
          </div>
        </header>

        <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
