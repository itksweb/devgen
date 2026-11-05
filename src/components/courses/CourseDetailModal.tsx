import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Clock,
  BarChart3,
  Star,
  CheckCircle2,
  BookOpen,
  User,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export const CourseDetailModal: React.FC = () => {
  const {
    selectedCourseId,
    setSelectedCourseId,
    courses,
    enrolments,
    currentUser,
    enrollCourse,
    setActiveView
  } = useApp();

  if (!selectedCourseId) return null;

  const course = courses.find((c) => c.id === selectedCourseId);
  if (!course) return null;

  const isEnrolled = currentUser
    ? enrolments.some((e) => e.userId === currentUser.id && e.courseId === course.id)
    : false;

  const handleEnroll = () => {
    const res = enrollCourse(course.id);
    if (res.success) {
      setSelectedCourseId(null);
      setActiveView('student-portal');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#061A3A]/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 relative animate-fade-in my-8">
        {/* Close Button */}
        <button
          onClick={() => setSelectedCourseId(null)}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-900/60 text-white hover:bg-slate-900 flex items-center justify-center transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Cover Image */}
        <div className="relative aspect-21/9 w-full bg-slate-900 overflow-hidden">
          <img
            src={course.thumbnail}
            alt={course.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#061A3A] via-[#061A3A]/40 to-transparent" />

          <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#F28C18] text-white">
                {course.category}
              </span>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-white/20 text-white backdrop-blur-xs">
                {course.level} Level
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">{course.title}</h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Top Quick Meta */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
            <div>
              <p className="text-slate-400 font-medium">Duration</p>
              <p className="font-bold text-[#061A3A] mt-0.5">{course.durationWeeks} Weeks ({course.durationHours} hrs)</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Rating</p>
              <p className="font-bold text-amber-600 mt-0.5 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{course.rating.toFixed(1)} ({course.reviewCount})</span>
              </p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Instructor</p>
              <p className="font-bold text-[#082592] mt-0.5 truncate">{course.instructorName}</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Tuition</p>
              <p className="font-extrabold text-[#F28C18] mt-0.5">
                {course.price > 0 ? `$${course.price.toFixed(2)}` : 'Scholarship / Free'}
              </p>
            </div>
          </div>

          {/* Course Overview */}
          <div>
            <h3 className="text-base font-extrabold text-[#061A3A] mb-2">Course Overview</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{course.fullDescription}</p>
          </div>

          {/* Prerequisites */}
          <div>
            <h3 className="text-base font-extrabold text-[#061A3A] mb-2">Prerequisites & Requirements</h3>
            <ul className="space-y-2">
              {course.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Curriculum Syllabus */}
          <div>
            <h3 className="text-base font-extrabold text-[#061A3A] mb-3">Weekly Curriculum</h3>
            <div className="space-y-3">
              {course.syllabus.map((item) => (
                <div
                  key={item.week}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-[#082592]/30 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-md bg-blue-100 text-[#082592] text-xs font-black flex items-center justify-center shrink-0">
                      W{item.week}
                    </span>
                    <h4 className="text-sm font-bold text-[#061A3A]">{item.title}</h4>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pl-8">
                    {item.topics.map((t, ti) => (
                      <span
                        key={ti}
                        className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Action */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-xs text-slate-400">Status</p>
              <p className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Open for Registration</span>
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => setSelectedCourseId(null)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
              >
                Close
              </button>

              {isEnrolled ? (
                <button
                  onClick={() => {
                    setSelectedCourseId(null);
                    setActiveView('student-portal');
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <span>Go to My Course</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleEnroll}
                  className="w-full sm:w-auto px-7 py-2.5 rounded-xl bg-[#F28C18] hover:bg-[#d97706] text-white text-xs font-extrabold shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Enrol In This Course</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
