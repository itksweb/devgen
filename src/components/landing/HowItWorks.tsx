import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserPlus, Search, GraduationCap, CheckCircle } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const { openAuthModal, setActiveView } = useApp();

  const steps = [
    {
      step: '01',
      title: 'Create Your Account',
      description: 'Fill out the simple registration form with your name and email. Instant access to your personal student portal.',
      icon: UserPlus,
      action: () => openAuthModal('register'),
      actionLabel: 'Register Now',
    },
    {
      step: '02',
      title: 'Explore Available Courses',
      description: 'Review curriculum syllabi, weekly topic breakdowns, project prerequisites, and instructor credentials.',
      icon: Search,
      action: () => setActiveView('courses'),
      actionLabel: 'Browse Tracks',
    },
    {
      step: '03',
      title: 'Enrol in Your Course',
      description: 'Click Enrol Now on any active course. Get immediate access to course materials, weekly assignments, and schedule.',
      icon: GraduationCap,
      action: () => setActiveView('courses'),
      actionLabel: 'Pick a Course',
    },
    {
      step: '04',
      title: 'Submit & Get Graded',
      description: 'Build your project files, upload submissions securely, and receive detailed qualitative feedback and numerical grades.',
      icon: CheckCircle,
      action: () => openAuthModal('login'),
      actionLabel: 'View Results',
    },
  ];

  return (
    <section className="py-20 bg-[#F2F6FF]/40 border-b border-blue-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <p className="text-xs font-bold uppercase tracking-wider text-[#F28C18]">
            Simple 4-Step Process
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#061A3A] tracking-tight">
            How It Works at DevGenius Academy
          </h2>
          <p className="text-sm text-slate-500">
            From enrollment to certification, our structured pathway keeps you focused on building real skills.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between relative group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-[#082592]/30 group-hover:text-[#082592] transition-colors tabular-nums">
                      {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#082592] flex items-center justify-center group-hover:bg-[#082592] group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-[#061A3A] group-hover:text-[#082592] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100">
                  <button
                    onClick={item.action}
                    className="text-xs font-bold text-[#F28C18] hover:text-[#d97706] flex items-center gap-1 group-hover:translate-x-1 transition-all cursor-pointer"
                  >
                    <span>{item.actionLabel}</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
