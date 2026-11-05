import React from 'react';
import { useApp } from '../../context/AppContext';
import { Instructor } from '../../types';
import { Linkedin, Twitter, Github, BookOpen } from 'lucide-react';

export const InstructorsSection: React.FC = () => {
  const { instructors, currentUser, setActiveView, setSelectedAdminTab } = useApp();

  return (
    <section id="instructors-section" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#F28C18]">
              Expert Faculty
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#061A3A] tracking-tight mt-1">
              Meet Our Top Instructors
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-xl">
              Learn directly from software engineers, UI/UX leads, and data specialists with real-world production experience.
            </p>
          </div>

          {currentUser?.role === 'admin' && (
            <button
              onClick={() => {
                setActiveView('admin-portal');
                setSelectedAdminTab('instructors');
              }}
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors"
            >
              Manage Instructors (Admin)
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {instructors.map((inst: Instructor) => (
            <div
              key={inst.id}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="aspect-square w-full overflow-hidden bg-slate-100 relative">
                <img
                  src={inst.image}
                  alt={inst.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold bg-[#061A3A]/90 text-white backdrop-blur-xs flex items-center gap-1">
                  <BookOpen className="w-3 h-3 text-[#F28C18]" />
                  <span>{inst.courseCount} Courses</span>
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-base font-bold text-[#061A3A] group-hover:text-[#082592] transition-colors">
                    {inst.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#082592] mt-0.5">
                    {inst.specialization}
                  </p>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                    {inst.bio}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center gap-3 text-slate-400">
                  {inst.social.linkedin && (
                    <a
                      href={inst.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded hover:text-[#082592] hover:bg-blue-50 transition-colors"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {inst.social.twitter && (
                    <a
                      href={inst.social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded hover:text-[#1DA1F2] hover:bg-blue-50 transition-colors"
                      aria-label="Twitter"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                  )}
                  {inst.social.github && (
                    <a
                      href={inst.social.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded hover:text-slate-900 hover:bg-slate-100 transition-colors"
                      aria-label="GitHub"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
