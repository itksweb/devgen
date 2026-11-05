import React from 'react';
import {
  Users,
  Laptop,
  Clock,
  Award,
  Briefcase,
  Headphones,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const points = [
    {
      title: 'Expert Instructors',
      description: 'Learn directly from seasoned industry practitioners with proven engineering & design backgrounds.',
      icon: Users,
    },
    {
      title: 'Practical Hands-On Learning',
      description: 'Zero theoretical fluff. Every module culminates in real code, live databases, and deployable projects.',
      icon: Laptop,
    },
    {
      title: 'Flexible Learning Pace',
      description: 'Study anytime, anywhere with lifetime access to assignments, video notes, and lecture repositories.',
      icon: Clock,
    },
    {
      title: 'Accredited Quality Education',
      description: 'Structured syllabi aligned with international software industry standards and employer expectations.',
      icon: Award,
    },
    {
      title: 'Career & Portfolio Mentorship',
      description: 'Receive personalized CV reviews, GitHub portfolio critiques, and technical mock interview prep.',
      icon: Briefcase,
    },
    {
      title: 'Dedicated Student Support',
      description: 'Prompt instructor feedback on all assignment submissions with detailed rubric evaluations.',
      icon: Headphones,
    },
  ];

  return (
    <section id="why-choose-us" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Key Features */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#F28C18]">
                Why DevGenius Academy
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#061A3A] tracking-tight mt-1">
                Designed For Serious Learners Ready To Launch Real Tech Careers
              </h2>
              <p className="text-sm sm:text-base text-slate-500 mt-2">
                We combine rigorous curriculum design with individualized instructor grading to ensure
                you graduate with mastery and confidence.
              </p>
            </div>

            {/* 6 Key Points Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              {points.map((pt, idx) => {
                const Icon = pt.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-[#082592]/30 hover:shadow-xs transition-all flex items-start gap-3.5"
                  >
                    <div className="w-9 h-9 rounded-lg bg-blue-100/70 text-[#082592] flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#061A3A]">{pt.title}</h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {pt.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Visual Trust Card matching reference image style */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Visual Frame */}
            <div className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-gradient-to-tr from-[#082592] to-[#1746C5] p-1">
              <div className="rounded-xl overflow-hidden bg-slate-900 relative">
                <img
                  src="/src/assets/images/instructor_portrait_female_1793883782763.jpg"
                  alt="DevGenius Academy mentorship"
                  referrerPolicy="no-referrer"
                  className="w-full h-96 object-cover object-top opacity-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#061A3A] via-transparent to-transparent" />

                {/* Overlaid badge: 15+ Years Excellence */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-white/95 backdrop-blur-md shadow-lg text-[#061A3A] border border-white/50">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-[#082592] text-white flex items-center justify-center font-black text-xl tabular-nums">
                      15+
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[#F28C18]">
                        Proven Track Record
                      </p>
                      <p className="text-sm font-extrabold text-[#061A3A]">
                        Years of Excellence in Technology Training
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 font-semibold">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Certified Curriculum
                    </span>
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      100% Shared Host Ready
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
