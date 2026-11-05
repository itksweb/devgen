import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, CheckCircle2, Users, Star, Sparkles } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { setActiveView, openAuthModal, users, courses } = useApp();

  const studentCount = users.filter((u) => u.role === 'student').length;

  return (
    <section className="relative overflow-hidden bg-[#F2F6FF] py-16 lg:py-24 border-b border-blue-100">
      {/* Subtle background decorative shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl -translate-y-24 translate-x-24 pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-72 h-72 bg-orange-200/30 rounded-full blur-2xl translate-y-16 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/80 text-[#082592] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#F28C18]" />
              <span>Career-Focused Practical Tech Education</span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#061A3A] tracking-tight leading-[1.15]">
              BUILD YOUR FUTURE WITH{' '}
              <span className="text-[#082592] relative">
                DEVGENIUS
                <span className="text-[#F28C18]"> ACADEMY</span>
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Gain practical digital skills, learn from experienced instructors, and develop the
              expertise you need to succeed in today&apos;s technology-driven world. Real projects,
              practical assignments, and verified certificates.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => setActiveView('courses')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-[#082592] hover:bg-[#1746C5] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Explore Courses</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => openAuthModal('register')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-[#F28C18] hover:bg-[#d97706] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Create Free Account</span>
              </button>
            </div>

            {/* Trust points row */}
            <div className="pt-6 border-t border-blue-200/60 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-left">
              <div>
                <p className="text-xl sm:text-2xl font-black text-[#061A3A] tabular-nums">
                  100%
                </p>
                <p className="text-xs text-slate-500 font-medium">Hands-On Practice</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-[#082592] tabular-nums">
                  {courses.filter((c) => c.isActive).length}+
                </p>
                <p className="text-xs text-slate-500 font-medium">Active Courses</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-[#F28C18] tabular-nums">
                  {studentCount}
                </p>
                <p className="text-xs text-slate-500 font-medium">Registered Students</p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual with Student, Blue Blob & Floating Badges */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Blue decorative background circle/blob */}
            <div className="absolute inset-0 m-auto w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-gradient-to-br from-[#1746C5] to-[#082592] opacity-90 scale-95 -rotate-3 transition-transform" />

            {/* Student Image Container */}
            <div className="relative z-10 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-white">
              <img
                src="/src/assets/images/hero_african_student_laptop_1793883781003.jpg"
                alt="Young African student working with laptop at DevGenius Academy"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-cover object-center aspect-4/3 sm:aspect-1/1 hover:scale-102 transition-transform duration-500"
              />
            </div>

            {/* Floating Information Card 1: 20K+ Active Students */}
            <div className="absolute -top-4 -left-4 sm:left-2 bg-white/95 backdrop-blur-sm p-3.5 rounded-xl shadow-xl border border-slate-100 flex items-center gap-3 z-20 animate-fade-in">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#082592] flex items-center justify-center font-bold">
                <Users className="w-5 h-5 text-[#082592]" />
              </div>
              <div>
                <p className="text-sm font-extrabold text-[#061A3A] tabular-nums">20,000+</p>
                <p className="text-[11px] text-slate-500 font-medium">Community Learners</p>
              </div>
            </div>

            {/* Floating Information Card 2: 95% Success Rate */}
            <div className="absolute -bottom-4 right-2 sm:right-0 bg-white/95 backdrop-blur-sm p-3.5 rounded-xl shadow-xl border border-slate-100 flex items-center gap-3 z-20">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-[#F28C18] flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5 text-[#F28C18]" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <p className="text-sm font-extrabold text-[#061A3A] tabular-nums">95%</p>
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Course Completion Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
