import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, BarChart3, Star, User, BookOpen, ArrowRight, Check } from 'lucide-react';
import { Course } from '../../types';

export const FeaturedCourses: React.FC = () => {
  const { courses, enrolments, currentUser, enrollCourse, setSelectedCourseId, setActiveView } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Web Development', 'Programming', 'Design', 'Database Management', 'Digital Marketing'];

  const filteredCourses = courses.filter((c) => {
    if (!c.isActive) return false;
    if (selectedCategory === 'All') return true;
    return c.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const isUserEnrolled = (courseId: string) => {
    if (!currentUser) return false;
    return enrolments.some((e) => e.userId === currentUser.id && e.courseId === courseId);
  };

  return (
    <section id="featured-courses" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-[#F28C18]">
            Popular Curriculum
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#061A3A] tracking-tight">
            Explore Our Featured Courses
          </h2>
          <p className="text-sm sm:text-base text-slate-500">
            Discover our most popular courses designed to help you learn in-demand skills and advance your career.
          </p>
        </div>

        {/* Category Filters (Segmented control) */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-[#082592] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Courses Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course: Course) => {
            const enrolled = isUserEnrolled(course.id);
            return (
              <div
                key={course.id}
                className="group flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Thumbnail */}
                <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      // Fallback gradient if external fails
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Category Pill Tag */}
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-md text-[11px] font-bold bg-[#061A3A]/90 text-white backdrop-blur-xs">
                    {course.category}
                  </span>

                  {/* Level Tag */}
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-white/95 text-[#082592] shadow-xs">
                    {course.level}
                  </span>
                </div>

                {/* Course Details Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    {/* Meta info: duration and rating */}
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{course.durationWeeks} Weeks ({course.durationHours} hrs)</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-600 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{course.rating.toFixed(1)}</span>
                        <span className="text-slate-400 font-normal">({course.reviewCount})</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3
                      onClick={() => {
                        setSelectedCourseId(course.id);
                        setActiveView('course-details');
                      }}
                      className="text-lg font-bold text-[#061A3A] hover:text-[#082592] cursor-pointer line-clamp-1 transition-colors"
                      title={course.title}
                    >
                      {course.title}
                    </h3>

                    {/* Short Description */}
                    <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
                      {course.shortDescription}
                    </p>
                  </div>

                  {/* Instructor & Price Row */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-[#082592] text-xs font-bold overflow-hidden">
                        {course.instructorImage ? (
                          <img
                            src={course.instructorImage}
                            alt={course.instructorName}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <span className="text-xs font-semibold text-slate-700 truncate max-w-[120px]">
                        {course.instructorName}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-extrabold text-[#082592]">
                        {course.price > 0 ? `$${course.price.toFixed(2)}` : 'Free / Scholarship'}
                      </span>
                    </div>
                  </div>

                  {/* Actions: View Details & Enrol */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => {
                        setSelectedCourseId(course.id);
                        setActiveView('course-details');
                      }}
                      className="w-full py-2 px-3 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer text-center"
                    >
                      View Syllabus
                    </button>

                    {enrolled ? (
                      <button
                        onClick={() => {
                          setActiveView('student-portal');
                        }}
                        className="w-full py-2 px-3 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Enrolled</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => enrollCourse(course.id)}
                        className="w-full py-2 px-3 rounded-lg bg-[#F28C18] hover:bg-[#d97706] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs active:scale-95 text-center"
                      >
                        Enrol Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Courses CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={() => setActiveView('courses')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#061A3A] hover:bg-[#082592] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm hover:shadow"
          >
            <span>View All Courses</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
