import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  FileCheck2,
  Award,
  User as UserIcon,
  LogOut,
  Clock,
  CheckCircle2,
  AlertCircle,
  Upload,
  FileText,
  MessageSquare,
  Search,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  FolderDown
} from 'lucide-react';
import { Course, Assignment, AssignmentSubmission } from '../../types';

export const StudentPortal: React.FC = () => {
  const {
    currentUser,
    logout,
    courses,
    enrolments,
    assignments,
    submissions,
    enrollCourse,
    submitAssignment,
    selectedStudentTab,
    setSelectedStudentTab,
    setSelectedCourseId,
    setActiveView,
    setIsCpanelModalOpen
  } = useApp();

  // Submission modal state
  const [activeSubmitAssignment, setActiveSubmitAssignment] = useState<Assignment | null>(null);
  const [submissionFile, setSubmissionFile] = useState<File | null>(null);
  const [mockFileName, setMockFileName] = useState('');
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Profile edit state
  const [profilePhone, setProfilePhone] = useState(currentUser?.phone || '');
  const [profileBio, setProfileBio] = useState(currentUser?.bio || '');
  const [profileSaved, setProfileSaved] = useState(false);

  if (!currentUser) return null;

  // Filter student-specific data
  const myEnrolments = enrolments.filter((e) => e.userId === currentUser.id);
  const myEnrolledCourses = courses.filter((c) =>
    myEnrolments.some((e) => e.courseId === c.id)
  );
  const myEnrolledCourseIds = myEnrolledCourses.map((c) => c.id);

  // Assignments relevant to student's enrolled courses
  const myRelevantAssignments = assignments.filter((a) =>
    myEnrolledCourseIds.includes(a.courseId)
  );

  const mySubmissions = submissions.filter((s) => s.userId === currentUser.id);
  const pendingSubmissions = mySubmissions.filter((s) => s.status === 'pending');
  const gradedSubmissions = mySubmissions.filter((s) => s.status === 'graded');

  const handleOpenSubmission = (asg: Assignment) => {
    const existing = mySubmissions.find((s) => s.assignmentId === asg.id);
    setActiveSubmitAssignment(asg);
    setMockFileName(existing ? existing.fileName : '');
    setComments(existing ? existing.comments : '');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSubmissionFile(file);
      setMockFileName(file.name);
    }
  };

  const handleSubmitAssignmentForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSubmitAssignment) return;

    const fileNameToUse = mockFileName.trim() || 'student_project_assignment.zip';
    const fileSizeToUse = submissionFile
      ? `${(submissionFile.size / (1024 * 1024)).toFixed(2)} MB`
      : '1.2 MB';

    setSubmitting(true);
    submitAssignment(activeSubmitAssignment.id, fileNameToUse, fileSizeToUse, comments);
    setSubmitting(false);
    setActiveSubmitAssignment(null);
    setSubmissionFile(null);
    setMockFileName('');
    setComments('');
  };

  const calculateGradeLetter = (score?: number) => {
    if (score === undefined) return 'N/A';
    if (score >= 90) return 'A (Distinction)';
    if (score >= 80) return 'B (Very Good)';
    if (score >= 70) return 'C (Credit)';
    if (score >= 60) return 'D (Pass)';
    return 'F (Fail)';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#061A3A] text-white flex flex-col shrink-0 border-r border-white/10">
        {/* User Card */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#082592] text-white flex items-center justify-center font-bold text-base border border-blue-400/30">
              {currentUser.fullName.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <h3 className="text-sm font-bold text-white truncate">{currentUser.fullName}</h3>
              <p className="text-[11px] text-blue-200 truncate">{currentUser.email}</p>
              <span className="inline-block px-2 py-0.5 mt-1 rounded bg-[#F28C18]/20 text-[#F28C18] text-[9px] font-bold uppercase tracking-wider">
                Student Account
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5 flex-1">
          <button
            onClick={() => setSelectedStudentTab('overview')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              selectedStudentTab === 'overview'
                ? 'bg-[#082592] text-white shadow-xs'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-[#F28C18]" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setSelectedStudentTab('browse')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              selectedStudentTab === 'browse'
                ? 'bg-[#082592] text-white shadow-xs'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4 text-blue-400" />
            <span>Browse Courses</span>
          </button>

          <button
            onClick={() => setSelectedStudentTab('my-courses')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              selectedStudentTab === 'my-courses'
                ? 'bg-[#082592] text-white shadow-xs'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              <span>My Courses</span>
            </div>
            <span className="px-1.5 py-0.2 rounded bg-white/10 text-[10px] font-bold">
              {myEnrolledCourses.length}
            </span>
          </button>

          <button
            onClick={() => setSelectedStudentTab('assignments')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              selectedStudentTab === 'assignments'
                ? 'bg-[#082592] text-white shadow-xs'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <FileCheck2 className="w-4 h-4 text-amber-400" />
              <span>Assignments</span>
            </div>
            {myRelevantAssignments.length > 0 && (
              <span className="px-1.5 py-0.2 rounded bg-[#F28C18] text-white text-[10px] font-bold">
                {myRelevantAssignments.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setSelectedStudentTab('results')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              selectedStudentTab === 'results'
                ? 'bg-[#082592] text-white shadow-xs'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Award className="w-4 h-4 text-purple-400" />
              <span>My Results</span>
            </div>
            {gradedSubmissions.length > 0 && (
              <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                {gradedSubmissions.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setSelectedStudentTab('profile')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              selectedStudentTab === 'profile'
                ? 'bg-[#082592] text-white shadow-xs'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <UserIcon className="w-4 h-4 text-teal-400" />
            <span>My Profile</span>
          </button>
        </nav>

        {/* Shared Hosting Shortcut & Logout */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <button
            onClick={() => setIsCpanelModalOpen(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-blue-200 transition-colors"
          >
            <FolderDown className="w-3.5 h-3.5 text-[#F28C18]" />
            <span>cPanel Source & SQL</span>
          </button>

          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-300 hover:bg-red-500/10 text-xs font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 max-w-6xl overflow-y-auto">
        {/* TAB 1: OVERVIEW */}
        {selectedStudentTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* Header Greeting */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#082592] to-[#1746C5] rounded-3xl p-6 sm:p-8 text-white shadow-lg">
              <div className="space-y-1">
                <span className="text-xs uppercase font-extrabold tracking-widest text-[#F28C18]">
                  Student Academic Portal
                </span>
                <h1 className="text-2xl sm:text-3xl font-black">
                  Welcome back, {currentUser.fullName}!
                </h1>
                <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
                  Track your learning milestones, download course materials, and submit project assignments for grading.
                </p>
              </div>
              <button
                onClick={() => setSelectedStudentTab('browse')}
                className="px-5 py-2.5 rounded-xl bg-[#F28C18] hover:bg-[#d97706] text-white text-xs font-bold shadow transition-all self-start sm:self-auto cursor-pointer"
              >
                Browse New Courses
              </button>
            </div>

            {/* KPI Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-500">Enrolled Courses</p>
                  <GraduationCap className="w-4 h-4 text-[#082592]" />
                </div>
                <p className="text-2xl font-black text-[#061A3A] mt-2 tabular-nums">
                  {myEnrolledCourses.length}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">Active skill tracks</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-500">Course Assignments</p>
                  <FileCheck2 className="w-4 h-4 text-amber-500" />
                </div>
                <p className="text-2xl font-black text-[#061A3A] mt-2 tabular-nums">
                  {myRelevantAssignments.length}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">Available for submission</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-500">Pending Review</p>
                  <Clock className="w-4 h-4 text-blue-500" />
                </div>
                <p className="text-2xl font-black text-[#082592] mt-2 tabular-nums">
                  {pendingSubmissions.length}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">Awaiting instructor score</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-500">Graded & Completed</p>
                  <Award className="w-4 h-4 text-emerald-500" />
                </div>
                <p className="text-2xl font-black text-emerald-600 mt-2 tabular-nums">
                  {gradedSubmissions.length}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">Finalized with feedback</p>
              </div>
            </div>

            {/* Enrolled Courses Summary */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-extrabold text-[#061A3A]">
                  My Active Courses
                </h2>
                <button
                  onClick={() => setSelectedStudentTab('my-courses')}
                  className="text-xs font-bold text-[#082592] hover:underline"
                >
                  View All ({myEnrolledCourses.length})
                </button>
              </div>

              {myEnrolledCourses.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <GraduationCap className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-700">You have not enrolled in any courses yet</p>
                  <p className="text-xs text-slate-500 mt-1">Explore our featured curriculum and enrol in seconds.</p>
                  <button
                    onClick={() => setSelectedStudentTab('browse')}
                    className="mt-3 px-4 py-2 rounded-lg bg-[#082592] text-white text-xs font-bold hover:bg-[#1746C5]"
                  >
                    Browse Available Courses
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myEnrolledCourses.map((c) => {
                    const enrolment = myEnrolments.find((e) => e.courseId === c.id);
                    return (
                      <div
                        key={c.id}
                        className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-colors flex items-center justify-between gap-4"
                      >
                        <div className="space-y-1 overflow-hidden">
                          <span className="text-[10px] font-bold text-[#082592] uppercase">
                            {c.category}
                          </span>
                          <h4 className="text-sm font-bold text-[#061A3A] truncate">{c.title}</h4>
                          <p className="text-[11px] text-slate-500">Instructor: {c.instructorName}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="w-32 bg-slate-200 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-[#082592] h-full rounded-full"
                                style={{ width: `${enrolment?.progressPercentage || 10}%` }}
                              />
                            </div>
                            <span className="text-[11px] font-bold text-slate-600 tabular-nums">
                              {enrolment?.progressPercentage || 10}%
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setSelectedStudentTab('my-courses');
                          }}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 hover:border-[#082592] text-xs font-bold text-slate-700 shrink-0"
                        >
                          Open Course
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Recent Submissions Status */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-extrabold text-[#061A3A]">
                  Recent Assignment Status
                </h2>
                <button
                  onClick={() => setSelectedStudentTab('assignments')}
                  className="text-xs font-bold text-[#082592] hover:underline"
                >
                  Manage Assignments
                </button>
              </div>

              {mySubmissions.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">
                  No assignments submitted yet. Go to the Assignments tab to submit your coursework.
                </p>
              ) : (
                <div className="space-y-3">
                  {mySubmissions.slice(0, 3).map((sub) => (
                    <div
                      key={sub.id}
                      className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between gap-4"
                    >
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-[#061A3A] truncate">{sub.assignmentTitle}</p>
                        <p className="text-[11px] text-slate-500">
                          {sub.courseTitle} · Submitted on {sub.submittedAt}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {sub.status === 'graded' ? (
                          <div className="text-right">
                            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              Score: {sub.score}/100
                            </span>
                            <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                              Graded
                            </p>
                          </div>
                        ) : (
                          <span className="px-2.5 py-1 rounded bg-blue-100 text-[#082592] text-xs font-bold">
                            Pending Review
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: BROWSE COURSES */}
        {selectedStudentTab === 'browse' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h1 className="text-2xl font-black text-[#061A3A]">Browse Available Courses</h1>
              <p className="text-xs text-slate-500 mt-1">
                Explore our courses and enrol directly into your student account.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.filter((c) => c.isActive).map((c) => {
                const isEnrolled = myEnrolledCourseIds.includes(c.id);
                return (
                  <div
                    key={c.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="aspect-16/9 w-full bg-slate-100 relative">
                      <img
                        src={c.thumbnail}
                        alt={c.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-[#061A3A]/90 text-white text-[10px] font-bold">
                        {c.category}
                      </span>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                          <span>{c.durationWeeks} Weeks</span>
                          <span className="font-bold text-[#082592]">{c.level}</span>
                        </div>
                        <h3 className="text-base font-bold text-[#061A3A] line-clamp-1">{c.title}</h3>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{c.shortDescription}</p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs text-slate-600 font-medium">
                          By {c.instructorName}
                        </span>

                        {isEnrolled ? (
                          <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Enrolled</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => enrollCourse(c.id)}
                            className="px-4 py-2 rounded-lg bg-[#F28C18] hover:bg-[#d97706] text-white text-xs font-bold transition-colors cursor-pointer"
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
          </div>
        )}

        {/* TAB 3: MY COURSES */}
        {selectedStudentTab === 'my-courses' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h1 className="text-2xl font-black text-[#061A3A]">My Enrolled Courses</h1>
              <p className="text-xs text-slate-500 mt-1">
                Access your active learning materials, weekly syllabi, and lecture resources.
              </p>
            </div>

            {myEnrolledCourses.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
                <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-700">No courses enrolled</h3>
                <p className="text-xs text-slate-500">
                  Head to the Browse Courses tab to pick your first digital skill track!
                </p>
                <button
                  onClick={() => setSelectedStudentTab('browse')}
                  className="px-4 py-2 rounded-lg bg-[#082592] text-white text-xs font-bold"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {myEnrolledCourses.map((course) => {
                  const enrolment = myEnrolments.find((e) => e.courseId === course.id);
                  return (
                    <div
                      key={course.id}
                      className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#F28C18]">
                            {course.category} · {course.level}
                          </span>
                          <h2 className="text-lg font-black text-[#061A3A] mt-0.5">{course.title}</h2>
                          <p className="text-xs text-slate-500">Lead Instructor: {course.instructorName}</p>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setSelectedStudentTab('assignments')}
                            className="px-4 py-2 rounded-lg bg-[#082592] hover:bg-[#1746C5] text-white text-xs font-bold transition-colors"
                          >
                            View Assignments
                          </button>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-600">Course Progress</span>
                          <span className="text-[#082592] tabular-nums">{enrolment?.progressPercentage || 15}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                          <div
                            className="bg-[#082592] h-full rounded-full transition-all"
                            style={{ width: `${enrolment?.progressPercentage || 15}%` }}
                          />
                        </div>
                      </div>

                      {/* Syllabus Breakdown */}
                      <div>
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
                          Weekly Modules & Lesson Topics
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {course.syllabus.map((syl) => (
                            <div
                              key={syl.week}
                              className="p-3 rounded-xl border border-slate-100 bg-slate-50/70"
                            >
                              <p className="text-xs font-bold text-[#061A3A]">
                                Week {syl.week}: {syl.title}
                              </p>
                              <ul className="mt-1 space-y-0.5">
                                {syl.topics.map((top, ti) => (
                                  <li key={ti} className="text-[11px] text-slate-500 flex items-center gap-1.5">
                                    <span className="w-1 h-1 rounded-full bg-[#F28C18]" />
                                    <span>{top}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: ASSIGNMENTS */}
        {selectedStudentTab === 'assignments' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h1 className="text-2xl font-black text-[#061A3A]">Course Assignments</h1>
              <p className="text-xs text-slate-500 mt-1">
                Complete homework projects and upload project files for instructor assessment.
              </p>
            </div>

            {myRelevantAssignments.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
                <FileCheck2 className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-700">No active assignments</h3>
                <p className="text-xs text-slate-500">
                  You must be enrolled in a course to view and submit assignments.
                </p>
                <button
                  onClick={() => setSelectedStudentTab('browse')}
                  className="px-4 py-2 rounded-lg bg-[#082592] text-white text-xs font-bold"
                >
                  Enrol in a Course
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {myRelevantAssignments.map((asg) => {
                  const submission = mySubmissions.find((s) => s.assignmentId === asg.id);
                  const course = courses.find((c) => c.id === asg.courseId);

                  return (
                    <div
                      key={asg.id}
                      className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
                    >
                      <div className="space-y-2 max-w-xl">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#082592] px-2 py-0.5 rounded bg-blue-50">
                            {course?.title || 'Course'}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">
                            Max Score: {asg.maxScore} pts
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-[#061A3A]">{asg.title}</h3>
                        <p className="text-xs text-slate-600 leading-relaxed">{asg.description}</p>
                        <div className="flex items-center gap-4 text-[11px] text-slate-400 font-medium pt-1">
                          <span className="flex items-center gap-1 text-red-500">
                            <Clock className="w-3.5 h-3.5" />
                            Deadline: {asg.deadline}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
                        {submission ? (
                          <div className="space-y-2 text-left md:text-right">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                                submission.status === 'graded'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {submission.status === 'graded'
                                ? `Graded: ${submission.score}/100`
                                : 'Submitted · Awaiting Grade'}
                            </span>
                            <p className="text-[11px] text-slate-500">
                              File: {submission.fileName} ({submission.fileSize})
                            </p>
                            <button
                              onClick={() => handleOpenSubmission(asg)}
                              className="text-xs font-bold text-[#082592] hover:underline block"
                            >
                              Re-upload / Edit Submission
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleOpenSubmission(asg)}
                            className="px-5 py-2.5 rounded-xl bg-[#F28C18] hover:bg-[#d97706] text-white text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center gap-2 cursor-pointer"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Submit Assignment</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: MY RESULTS */}
        {selectedStudentTab === 'results' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h1 className="text-2xl font-black text-[#061A3A]">My Academic Results</h1>
              <p className="text-xs text-slate-500 mt-1">
                View your graded assignments, numerical marks, letter grade, and constructive instructor critique.
              </p>
            </div>

            {gradedSubmissions.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
                <Award className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-700">No graded results yet</h3>
                <p className="text-xs text-slate-500">
                  {pendingSubmissions.length > 0
                    ? `You have ${pendingSubmissions.length} submission(s) currently being evaluated by instructors.`
                    : 'Submit assignments to have them graded by instructors.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {gradedSubmissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                      <div>
                        <span className="text-[10px] font-bold text-[#082592] uppercase">
                          {sub.courseTitle}
                        </span>
                        <h3 className="text-base font-bold text-[#061A3A] mt-0.5">
                          {sub.assignmentTitle}
                        </h3>
                        <p className="text-xs text-slate-400">
                          Submitted: {sub.submittedAt} · Evaluated: {sub.gradedAt || 'Recently'}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-2xl font-black text-emerald-600 tabular-nums">
                            {sub.score}/100
                          </p>
                          <span className="text-xs font-bold text-emerald-800">
                            {calculateGradeLetter(sub.score)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Instructor Written Feedback */}
                    <div className="bg-blue-50/60 rounded-xl p-4 border border-blue-100">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#082592] mb-1">
                        <MessageSquare className="w-4 h-4 text-[#F28C18]" />
                        <span>Instructor Critique & Feedback ({sub.gradedBy || 'Faculty'})</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed italic">
                        &ldquo;{sub.feedback || 'Well executed submission demonstrating understanding of core requirements.'}&rdquo;
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: PROFILE */}
        {selectedStudentTab === 'profile' && (
          <div className="max-w-2xl bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 animate-fade-in">
            <div>
              <h1 className="text-2xl font-black text-[#061A3A]">Student Profile & Security</h1>
              <p className="text-xs text-slate-500 mt-1">
                Manage your contact details and view authentication role permissions.
              </p>
            </div>

            {profileSaved && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Profile details saved successfully!</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  disabled
                  value={currentUser.fullName}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-600 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={currentUser.email}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-600 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  placeholder="+234 812 345 6789"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#082592]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Student Bio</label>
                <textarea
                  rows={3}
                  value={profileBio}
                  onChange={(e) => setProfileBio(e.target.value)}
                  placeholder="Tell us about your learning goals and tech interests..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#082592]"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setProfileSaved(true);
                    setTimeout(() => setProfileSaved(false), 3000);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#082592] hover:bg-[#1746C5] text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Save Profile
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Assignment Submission Modal */}
      {activeSubmitAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#061A3A]/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-fade-in space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-[#082592] uppercase">
                  Assignment Submission
                </span>
                <h3 className="text-base font-black text-[#061A3A] mt-0.5">
                  {activeSubmitAssignment.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveSubmitAssignment(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitAssignmentForm} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Upload Submission File (ZIP, PDF, DOCX, PY, JS)
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-5 text-center hover:border-[#082592] transition-colors bg-slate-50 cursor-pointer relative">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-1" />
                  <p className="text-xs font-bold text-slate-700">
                    {mockFileName ? mockFileName : 'Click or drag file here to attach'}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Allowed formats: .zip, .pdf, .docx, .py (Max 25MB)
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Student Comments / Notes for Instructor
                </label>
                <textarea
                  required
                  rows={3}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Explain your technical implementation, test scenarios, or challenges faced..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#082592]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveSubmitAssignment(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 rounded-xl bg-[#F28C18] hover:bg-[#d97706] text-white text-xs font-bold transition-all shadow-sm active:scale-95"
                >
                  {submitting ? 'Submitting...' : 'Confirm Submission'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
