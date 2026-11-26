import React, { useState } from 'react';
import { LogOut, Save, ShieldCheck } from 'lucide-react';
import type { StudentProfile } from '../types/edugenius';
import { getSubjectsForClass } from '../data/ncertCatalog';
import { Button } from '../components/ui/Button';
import { SectionHeader } from '../components/ui/SectionHeader';

interface ProfileViewProps {
  profile: StudentProfile;
  avatarUrl: string;
  onUpdateProfile: (next: StudentProfile) => void;
  onResetOnboarding: () => void;
}

export function ProfileView({
  profile,
  avatarUrl,
  onUpdateProfile,
  onResetOnboarding,
}: ProfileViewProps) {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [dob, setDob] = useState(profile.dob);
  const [board, setBoard] = useState(profile.board);
  const [dailyGoalMin, setDailyGoalMin] = useState(profile.dailyGoalMin);
  const [savedBanner, setSavedBanner] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);

  const classSubjects = getSubjectsForClass(profile.classLevel, profile.stream);
  const enrolledSubjects = classSubjects.filter(
    (s) => profile.enrolledSubjectIds.length === 0 || profile.enrolledSubjectIds.includes(s.id)
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...profile,
      name: name.trim() || profile.name,
      email: email.trim() || profile.email,
      dob: dob || profile.dob,
      board,
      dailyGoalMin,
    });
    setSavedBanner(true);
    window.setTimeout(() => setSavedBanner(false), 3000);
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Student Profile & Account"
        subtitle="Manage your student details, enrolled NCERT subjects, and class workspace settings."
        action={
          <Button
            variant="outline"
            leftIcon={<LogOut className="w-4 h-4" />}
            onClick={onResetOnboarding}
          >
            Switch Student / Re-Onboard
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Identity Card */}
        <section className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-indigo-100 border border-slate-200 shrink-0 flex items-center justify-center text-indigo-700 font-bold text-lg">
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
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-slate-900 truncate">{profile.name}</h2>
              <p className="text-xs text-slate-500 truncate">{profile.email}</p>
              <p className="text-xs font-medium text-indigo-700 mt-1 font-mono tabular-nums">
                Class {profile.classLevel} · {profile.board}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
            <div className="flex justify-between">
              <span className="text-slate-500">Date of Birth</span>
              <span className="font-mono tabular-nums text-slate-900">{profile.dob}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Enrolled Subjects</span>
              <span className="font-mono tabular-nums text-slate-900">
                {enrolledSubjects.length} subjects
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Daily Goal</span>
              <span className="font-mono tabular-nums text-slate-900">
                {profile.dailyGoalMin} min/day
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <span>
              To change your Class (1–12) or subject selection, use the Onboarding flow via the button above.
            </span>
          </div>
        </section>

        {/* Editable Profile Details */}
        <form
          onSubmit={handleSave}
          className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 space-y-5"
        >
          <h3 className="text-base font-semibold text-slate-900">Account Settings</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="prof-name" className="block text-xs font-medium text-slate-600 mb-1.5">
                Full Name
              </label>
              <input
                id="prof-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full min-h-[40px] px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="prof-email" className="block text-xs font-medium text-slate-600 mb-1.5">
                Student Email
              </label>
              <input
                id="prof-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full min-h-[40px] px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="prof-dob" className="block text-xs font-medium text-slate-600 mb-1.5">
                Date of Birth
              </label>
              <input
                id="prof-dob"
                type="date"
                required
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full min-h-[40px] px-3 rounded-lg border border-slate-200 text-sm font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="prof-goal" className="block text-xs font-medium text-slate-600 mb-1.5">
                Daily Study Goal (minutes)
              </label>
              <input
                id="prof-goal"
                type="number"
                min={15}
                max={240}
                step={5}
                value={dailyGoalMin}
                onChange={(e) => setDailyGoalMin(Number(e.target.value) || 60)}
                className="w-full min-h-[40px] px-3 rounded-lg border border-slate-200 text-sm font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="prof-board" className="block text-xs font-medium text-slate-600 mb-1.5">
                Board
              </label>
              <input
                id="prof-board"
                value={board}
                onChange={(e) => setBoard(e.target.value)}
                className="w-full min-h-[40px] px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <div className="text-xs font-medium text-slate-600 mb-2">
              Active Class {profile.classLevel} Enrolled Subjects
            </div>
            <p className="text-sm text-slate-700">
              {enrolledSubjects.map((s) => s.name).join(' · ')}
            </p>
          </div>

          {savedBanner && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
              Student profile updated.
            </div>
          )}

          <div className="flex justify-end">
            <Button type="submit" variant="primary" leftIcon={<Save className="w-4 h-4" />}>
              Save Profile
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
