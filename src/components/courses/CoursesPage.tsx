import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Course } from '../../types';
import { Search, Clock, Star, User, Check, ArrowLeft, Filter } from 'lucide-react';

export const CoursesPage: React.FC = () => {
  const { courses, enrolments, currentUser, enrollCourse, setSelectedCourseId, setActiveView } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');

  const categories = ['All', 'Web Development', 'Programming', 'Design', 'Database Management', 'Digital Marketing'];
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filtered = courses.filter((c) => {
    if (!c.isActive) return false;
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.instructorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || c.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesLevel = selectedLevel === 'All' || c.level.toLowerCase() === selectedLevel.toLowerCase();
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const isUserEnrolled = (courseId: string) => {
    if (!currentUser) return false;
    return enrolments.some((e) => e.userId === currentUser.id && e.courseId === courseId);
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Breadcrumb / Back button */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => setActiveView('home')}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#082592] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
          <span className="text-xs text-slate-400 font-medium">
            Showing {filtered.length} of {courses.filter((c) => c.isActive).length} courses
          </span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-[#061A3A] tracking-tight">
            Academic Courses & Programs
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Choose from comprehensive, career-ready programs designed and taught by experienced tech leaders.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses, instructors, topics..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#082592]"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              Category:
            </span>
            <div className="flex flex-wrap gap-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    selectedCategory === cat
                      ? 'bg-[#082592] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Course Cards Grid */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-700">No courses found</h3>
            <p className="text-xs text-slate-500">
              Try adjusting your search criteria or clear the filters to explore all active programs.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedLevel('All');
              }}
              className="px-4 py-2 rounded-lg bg-[#082592] text-white text-xs font-bold hover:bg-[#1746C5]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((course: Course) => {
              const enrolled = isUserEnrolled(course.id);
              return (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
                >
                  <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#061A3A]/90 text-white backdrop-blur-xs">
                      {course.category}
                    </span>
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-white/95 text-[#082592] shadow-xs">
                      {course.level}
                    </span>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{course.durationWeeks} Weeks</span>
                        </div>
                        <div className="flex items-center gap-1 text-amber-600 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{course.rating.toFixed(1)}</span>
                          <span className="text-slate-400 font-normal">({course.reviewCount})</span>
                        </div>
                      </div>

                      <h3
                        onClick={() => setSelectedCourseId(course.id)}
                        className="text-base font-bold text-[#061A3A] hover:text-[#082592] cursor-pointer line-clamp-1 transition-colors"
                      >
                        {course.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
                        {course.shortDescription}
                      </p>
                    </div>

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
                      <span className="text-sm font-extrabold text-[#082592]">
                        {course.price > 0 ? `$${course.price.toFixed(2)}` : 'Scholarship'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => setSelectedCourseId(course.id)}
                        className="w-full py-2 px-3 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer text-center"
                      >
                        Details
                      </button>

                      {enrolled ? (
                        <button
                          onClick={() => setActiveView('student-portal')}
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
        )}
      </div>
    </div>
  );
};
