import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Code2,
  Terminal,
  Palette,
  Megaphone,
  Database,
  Cpu,
  ArrowRight
} from 'lucide-react';

export const CourseCategories: React.FC = () => {
  const { setActiveView, courses } = useApp();

  const categories = [
    {
      name: 'Web Development',
      description: 'HTML5, CSS3, JavaScript, Full-Stack & cPanel Hosting',
      icon: Code2,
      count: courses.filter((c) => c.category === 'Web Development').length,
    },
    {
      name: 'Programming',
      description: 'Python 3, OOP, Logic building, Automation & APIs',
      icon: Terminal,
      count: courses.filter((c) => c.category === 'Programming').length,
    },
    {
      name: 'UI/UX & Design',
      description: 'Figma wireframing, User Research, Graphic Identity',
      icon: Palette,
      count: courses.filter((c) => c.category === 'Design').length,
    },
    {
      name: 'Digital Marketing',
      description: 'SEO, Content Strategy, Performance Ads & Analytics',
      icon: Megaphone,
      count: courses.filter((c) => c.category === 'Digital Marketing').length,
    },
    {
      name: 'Database & SQL',
      description: 'Relational Schemas, MySQL, Optimization & phpMyAdmin',
      icon: Database,
      count: courses.filter((c) => c.category === 'Database Management').length,
    },
    {
      name: 'Computer Appreciation',
      description: 'Hardware, OS Architecture, Cloud & IT Literacy',
      icon: Cpu,
      count: 2,
    },
  ];

  return (
    <section className="py-16 bg-[#F2F6FF]/60 border-y border-blue-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#F28C18]">
              Skill Tracks
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#061A3A] tracking-tight mt-1">
              Explore Course Categories
            </h2>
          </div>
          <button
            onClick={() => setActiveView('courses')}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#082592] hover:text-[#1746C5] transition-colors"
          >
            <span>View All Tracks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                onClick={() => setActiveView('courses')}
                className="bg-white p-5 rounded-xl border border-slate-200/80 hover:border-[#082592] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#082592] group-hover:bg-[#082592] group-hover:text-white transition-colors flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-[#061A3A] group-hover:text-[#082592] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span>{cat.count} {cat.count === 1 ? 'Course' : 'Courses'}</span>
                  <span className="text-[#082592] font-bold group-hover:translate-x-0.5 transition-transform">→</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
