import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  BookOpen,
  GraduationCap,
  FileCheck2,
  Clock,
  Award,
  Search,
  Plus,
  Edit,
  Power,
  CheckCircle2,
  MessageSquare,
  ShieldAlert,
  ArrowRight,
  Filter,
  FolderDown,
  LogOut,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { Course, CourseLevel, AssignmentSubmission } from '../../types';

export const AdminPortal: React.FC = () => {
  const {
    currentUser,
    users,
    courses,
    enrolments,
    submissions,
    instructors,
    addCourse,
    editCourse,
    toggleCourseStatus,
    gradeSubmission,
    selectedAdminTab,
    setSelectedAdminTab,
    logout,
    setIsCpanelModalOpen
  } = useApp();

  // Search & filter states
  const [studentSearch, setStudentSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('All');
  const [gradingFilter, setGradingFilter] = useState<'all' | 'pending' | 'graded'>('pending');

  // Selected student for detail view modal
  const [inspectedStudentId, setInspectedStudentId] = useState<string | null>(null);

  // Grading modal state
  const [gradingSubmission, setGradingSubmission] = useState<AssignmentSubmission | null>(null);
  const [scoreInput, setScoreInput] = useState<number>(90);
  const [feedbackInput, setFeedbackInput] = useState<string>('');

  // Course Add/Edit modal state
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseCategory, setCourseCategory] = useState('Web Development');
  const [courseShortDesc, setCourseShortDesc] = useState('');
  const [courseFullDesc, setCourseFullDesc] = useState('');
  const [courseInstructor, setCourseInstructor] = useState('Engr. Sarah Johnson');
  const [courseDurationWeeks, setCourseDurationWeeks] = useState(12);
  const [courseDurationHours, setCourseDurationHours] = useState(72);
  const [courseLevel, setCourseLevel] = useState<CourseLevel>('Beginner');
  const [courseThumbnail, setCourseThumbnail] = useState('/src/assets/images/course_web_dev_1793883780818.jpg');
  const [coursePrice, setCoursePrice] = useState(49);

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center border border-slate-200 shadow-xl space-y-4">
          <ShieldAlert className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-800">Admin Access Required</h2>
          <p className="text-xs text-slate-500">
            This dashboard is restricted to academy administrators. Please log in with admin privileges.
          </p>
        </div>
      </div>
    );
  }

  // CRITICAL REQUIREMENT: Total Registered Students counts strictly student-role accounts!
  const studentAccounts = users.filter((u) => u.role === 'student');
  const totalStudents = studentAccounts.length;
  const availableCourses = courses.filter((c) => c.isActive).length;
  const totalEnrolments = enrolments.length;
  const totalSubmissions = submissions.length;
  const pendingSubmissions = submissions.filter((s) => s.status === 'pending');
  const gradedSubmissions = submissions.filter((s) => s.status === 'graded');

  // Filtered students for management
  const filteredStudents = studentAccounts.filter(
    (s) =>
      s.fullName.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.email.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.phone.includes(studentSearch)
  );

  // Filtered submissions for grading
  const filteredSubmissions = submissions.filter((sub) => {
    const matchesStatus =
      gradingFilter === 'all' ? true : sub.status === gradingFilter;
    const matchesCourse =
      courseFilter === 'All' ? true : sub.courseId === courseFilter;
    return matchesStatus && matchesCourse;
  });

  const handleOpenGrading = (sub: AssignmentSubmission) => {
    setGradingSubmission(sub);
    setScoreInput(sub.score ?? 85);
    setFeedbackInput(sub.feedback || 'Excellent implementation with clean structure.');
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSubmission) return;
    gradeSubmission(gradingSubmission.id, Number(scoreInput), feedbackInput);
    setGradingSubmission(null);
  };

  const handleOpenAddCourse = () => {
    setEditingCourseId(null);
    setCourseTitle('');
    setCourseCategory('Web Development');
    setCourseShortDesc('');
    setCourseFullDesc('');
    setCourseInstructor(instructors[0]?.name || 'Engr. Sarah Johnson');
    setCourseDurationWeeks(10);
    setCourseDurationHours(60);
    setCourseLevel('Beginner');
    setCourseThumbnail('/src/assets/images/course_web_dev_1793883780818.jpg');
    setCoursePrice(49);
    setCourseModalOpen(true);
  };

  const handleOpenEditCourse = (course: Course) => {
    setEditingCourseId(course.id);
    setCourseTitle(course.title);
    setCourseCategory(course.category);
    setCourseShortDesc(course.shortDescription);
    setCourseFullDesc(course.fullDescription);
    setCourseInstructor(course.instructorName);
    setCourseDurationWeeks(course.durationWeeks);
    setCourseDurationHours(course.durationHours);
    setCourseLevel(course.level);
    setCourseThumbnail(course.thumbnail);
    setCoursePrice(course.price);
    setCourseModalOpen(true);
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCourseId) {
      editCourse(editingCourseId, {
        title: courseTitle,
        category: courseCategory,
        shortDescription: courseShortDesc,
        fullDescription: courseFullDesc,
        instructorName: courseInstructor,
        durationWeeks: courseDurationWeeks,
        durationHours: courseDurationHours,
        level: courseLevel,
        thumbnail: courseThumbnail,
        price: coursePrice,
      });
    } else {
      addCourse({
        title: courseTitle,
        category: courseCategory,
        shortDescription: courseShortDesc,
        fullDescription: courseFullDesc,
        instructorName: courseInstructor,
        instructorTitle: 'Academy Faculty Lead',
        durationWeeks: courseDurationWeeks,
        durationHours: courseDurationHours,
        level: courseLevel,
        thumbnail: courseThumbnail,
        price: coursePrice,
        isActive: true,
        requirements: ['Laptop with internet access', 'Commitment to study hours'],
        syllabus: [
          { week: 1, title: 'Foundations & Architecture', topics: ['Core Concepts', 'Tooling Setup'] },
          { week: 2, title: 'Hands-On Projects', topics: ['Practical Application', 'Testing'] }
        ]
      });
    }
    setCourseModalOpen(false);
  };

  const inspectedStudent = inspectedStudentId
    ? users.find((u) => u.id === inspectedStudentId)
    : null;
  const inspectedEnrolments = inspectedStudentId
    ? enrolments.filter((e) => e.userId === inspectedStudentId)
    : [];
  const inspectedSubmissions = inspectedStudentId
    ? submissions.filter((s) => s.userId === inspectedStudentId)
    : [];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-[#061A3A] text-white flex flex-col shrink-0 border-r border-white/10">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F28C18] text-[#061A3A] flex items-center justify-center font-black text-base shadow-sm">
              AD
            </div>
            <div className="overflow-hidden">
              <h3 className="text-sm font-extrabold text-white truncate">{currentUser.fullName}</h3>
              <span className="inline-block px-2 py-0.5 rounded bg-amber-500/20 text-[#F28C18] text-[9px] font-bold uppercase tracking-wider">
                Administrator
              </span>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1.5 flex-1">
          <button
            onClick={() => setSelectedAdminTab('overview')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              selectedAdminTab === 'overview'
                ? 'bg-[#082592] text-white shadow-xs'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-[#F28C18]" />
            <span>Overview & Stats</span>
          </button>

          <button
            onClick={() => setSelectedAdminTab('students')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              selectedAdminTab === 'students'
                ? 'bg-[#082592] text-white shadow-xs'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4 text-blue-400" />
              <span>Registered Students</span>
            </div>
            <span className="px-1.5 py-0.2 rounded bg-white/10 text-[10px] font-bold tabular-nums">
              {totalStudents}
            </span>
          </button>

          <button
            onClick={() => setSelectedAdminTab('courses')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              selectedAdminTab === 'courses'
                ? 'bg-[#082592] text-white shadow-xs'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Manage Courses</span>
            </div>
            <span className="px-1.5 py-0.2 rounded bg-white/10 text-[10px] font-bold tabular-nums">
              {courses.length}
            </span>
          </button>

          <button
            onClick={() => setSelectedAdminTab('assignments')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              selectedAdminTab === 'assignments'
                ? 'bg-[#082592] text-white shadow-xs'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <FileCheck2 className="w-4 h-4 text-amber-400" />
              <span>Grade Assignments</span>
            </div>
            {pendingSubmissions.length > 0 && (
              <span className="px-1.5 py-0.2 rounded bg-[#F28C18] text-white text-[10px] font-bold tabular-nums">
                {pendingSubmissions.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setSelectedAdminTab('instructors')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              selectedAdminTab === 'instructors'
                ? 'bg-[#082592] text-white shadow-xs'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-purple-400" />
            <span>Instructors</span>
          </button>
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <button
            onClick={() => setIsCpanelModalOpen(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-blue-200 transition-colors"
          >
            <FolderDown className="w-3.5 h-3.5 text-[#F28C18]" />
            <span>cPanel Deployment Hub</span>
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-300 hover:bg-red-500/10 text-xs font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit Admin</span>
          </button>
        </div>
      </aside>

      {/* Admin Main Body */}
      <main className="flex-1 p-6 sm:p-10 max-w-7xl overflow-y-auto">
        {/* TAB 1: OVERVIEW & STATS */}
        {selectedAdminTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* Top Admin Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#061A3A] rounded-3xl p-6 sm:p-8 text-white shadow-xl">
              <div className="space-y-1">
                <span className="text-xs uppercase font-extrabold tracking-widest text-[#F28C18]">
                  Administrator Console
                </span>
                <h1 className="text-2xl sm:text-3xl font-black">
                  Academic Operations & Registry
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                  Real-time database analytics. All figures derived dynamically from registered students, active tracks, and assignment submissions.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleOpenAddCourse}
                  className="px-4 py-2.5 rounded-xl bg-[#F28C18] hover:bg-[#d97706] text-white text-xs font-bold shadow flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Course</span>
                </button>
              </div>
            </div>

            {/* CRITICAL 6-METRIC KPI GRID */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {/* Metric 1: Total Registered Students (student-role only!) */}
              <div className="bg-white p-5 rounded-2xl border-2 border-[#082592]/20 shadow-xs">
                <p className="text-xs font-bold text-slate-500">Registered Students</p>
                <p className="text-3xl font-black text-[#082592] mt-2 tabular-nums">
                  {totalStudents}
                </p>
                <p className="text-[10px] text-emerald-600 font-semibold mt-1">
                  Excludes Admins
                </p>
              </div>

              {/* Metric 2: Available Courses */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                <p className="text-xs font-bold text-slate-500">Active Courses</p>
                <p className="text-3xl font-black text-[#061A3A] mt-2 tabular-nums">
                  {availableCourses}
                </p>
                <p className="text-[10px] text-slate-400 mt-1">
                  Of {courses.length} total
                </p>
              </div>

              {/* Metric 3: Total Enrolments */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                <p className="text-xs font-bold text-slate-500">Total Enrolments</p>
                <p className="text-3xl font-black text-[#061A3A] mt-2 tabular-nums">
                  {totalEnrolments}
                </p>
                <p className="text-[10px] text-slate-400 mt-1">Student enrollments</p>
              </div>

              {/* Metric 4: Total Submissions */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                <p className="text-xs font-bold text-slate-500">Total Submissions</p>
                <p className="text-3xl font-black text-[#061A3A] mt-2 tabular-nums">
                  {totalSubmissions}
                </p>
                <p className="text-[10px] text-slate-400 mt-1">Received archives</p>
              </div>

              {/* Metric 5: Pending Assignments */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                <p className="text-xs font-bold text-slate-500">Pending Grading</p>
                <p className="text-3xl font-black text-[#F28C18] mt-2 tabular-nums">
                  {pendingSubmissions.length}
                </p>
                <p className="text-[10px] text-amber-600 font-semibold mt-1">Needs review</p>
              </div>

              {/* Metric 6: Graded Assignments */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                <p className="text-xs font-bold text-slate-500">Graded & Scored</p>
                <p className="text-3xl font-black text-emerald-600 mt-2 tabular-nums">
                  {gradedSubmissions.length}
                </p>
                <p className="text-[10px] text-emerald-600 font-semibold mt-1">Evaluated</p>
              </div>
            </div>

            {/* Quick Actions & Recent Activity Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Pending Grading Queue */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-extrabold text-[#061A3A]">
                    Assignments Awaiting Grading
                  </h3>
                  <button
                    onClick={() => setSelectedAdminTab('assignments')}
                    className="text-xs font-bold text-[#082592] hover:underline"
                  >
                    View All ({pendingSubmissions.length})
                  </button>
                </div>

                {pendingSubmissions.length === 0 ? (
                  <p className="text-xs text-slate-500 py-6 text-center">
                    All submitted assignments have been reviewed!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {pendingSubmissions.slice(0, 4).map((sub) => (
                      <div
                        key={sub.id}
                        className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between gap-3"
                      >
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold text-[#061A3A] truncate">{sub.studentName}</p>
                          <p className="text-[11px] text-slate-500 truncate">{sub.assignmentTitle}</p>
                        </div>
                        <button
                          onClick={() => handleOpenGrading(sub)}
                          className="px-3 py-1.5 rounded-lg bg-[#082592] text-white text-xs font-bold hover:bg-[#1746C5] shrink-0"
                        >
                          Grade Now
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recently Registered Students */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-extrabold text-[#061A3A]">
                    Registered Students Registry
                  </h3>
                  <button
                    onClick={() => setSelectedAdminTab('students')}
                    className="text-xs font-bold text-[#082592] hover:underline"
                  >
                    Manage Students ({totalStudents})
                  </button>
                </div>

                <div className="space-y-3">
                  {studentAccounts.slice(0, 4).map((student) => {
                    const studentEnrols = enrolments.filter((e) => e.userId === student.id).length;
                    return (
                      <div
                        key={student.id}
                        className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#082592] font-bold text-xs flex items-center justify-center shrink-0">
                            {student.fullName.charAt(0)}
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-xs font-bold text-[#061A3A] truncate">{student.fullName}</p>
                            <p className="text-[11px] text-slate-500 truncate">{student.email}</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[11px] font-bold text-slate-600">
                            {studentEnrols} {studentEnrols === 1 ? 'Course' : 'Courses'}
                          </span>
                          <p className="text-[10px] text-slate-400">Joined {student.enrolledAt}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MANAGE STUDENTS */}
        {selectedAdminTab === 'students' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-[#061A3A]">Registered Students</h1>
                <p className="text-xs text-slate-500 mt-1">
                  Total student accounts: <strong>{totalStudents}</strong> (excluding administrators).
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="Search students by name, email..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-hidden focus:ring-2 focus:ring-[#082592]"
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4">Student Name</th>
                      <th className="py-3.5 px-4">Email Address</th>
                      <th className="py-3.5 px-4">Phone</th>
                      <th className="py-3.5 px-4">Enrolled Courses</th>
                      <th className="py-3.5 px-4">Submissions</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStudents.map((st) => {
                      const studentEnrols = enrolments.filter((e) => e.userId === st.id);
                      const studentSubs = submissions.filter((s) => s.userId === st.id);
                      return (
                        <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-[#061A3A]">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-md bg-blue-100 text-[#082592] flex items-center justify-center font-bold">
                                {st.fullName.charAt(0)}
                              </div>
                              <span>{st.fullName}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600">{st.email}</td>
                          <td className="py-3.5 px-4 text-slate-500">{st.phone}</td>
                          <td className="py-3.5 px-4 font-semibold text-[#082592]">
                            {studentEnrols.length} {studentEnrols.length === 1 ? 'course' : 'courses'}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600">
                            {studentSubs.length} submitted
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => setInspectedStudentId(st.id)}
                              className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-[#082592] hover:text-white font-bold text-slate-700 transition-colors"
                            >
                              View Dossier
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MANAGE COURSES */}
        {selectedAdminTab === 'courses' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-[#061A3A]">Manage Courses</h1>
                <p className="text-xs text-slate-500 mt-1">
                  Add new courses, configure syllabi, assign instructors, and activate/deactivate tracks.
                </p>
              </div>
              <button
                onClick={handleOpenAddCourse}
                className="px-5 py-2.5 rounded-xl bg-[#082592] hover:bg-[#1746C5] text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Course</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => {
                const courseEnrolments = enrolments.filter((e) => e.courseId === course.id);
                return (
                  <div
                    key={course.id}
                    className={`bg-white rounded-2xl border ${
                      course.isActive ? 'border-slate-200' : 'border-red-200 bg-red-50/20'
                    } p-5 shadow-xs flex flex-col justify-between space-y-4`}
                  >
                    <div className="space-y-3">
                      <div className="aspect-16/9 rounded-xl overflow-hidden bg-slate-100 relative">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <span
                          className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold ${
                            course.isActive
                              ? 'bg-emerald-600 text-white'
                              : 'bg-red-600 text-white'
                          }`}
                        >
                          {course.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-[#082592] uppercase">
                          {course.category} · {course.level}
                        </span>
                        <h3 className="text-base font-bold text-[#061A3A] mt-0.5 line-clamp-1">
                          {course.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                          {course.shortDescription}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                        <span>Instructor: {course.instructorName}</span>
                        <span className="font-bold text-[#082592] tabular-nums">
                          {courseEnrolments.length} Students
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditCourse(course)}
                        className="flex-1 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => toggleCourseStatus(course.id)}
                        className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                          course.isActive
                            ? 'bg-red-50 text-red-600 hover:bg-red-100'
                            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                        }`}
                        title={course.isActive ? 'Deactivate course' : 'Activate course'}
                      >
                        <Power className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: GRADE ASSIGNMENTS */}
        {selectedAdminTab === 'assignments' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-[#061A3A]">Assignment Grading Center</h1>
                <p className="text-xs text-slate-500 mt-1">
                  Inspect student code submissions, enter numerical scores, and publish qualitative feedback.
                </p>
              </div>

              {/* Status Segmented Control */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setGradingFilter('pending')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    gradingFilter === 'pending'
                      ? 'bg-[#F28C18] text-white'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  Pending ({pendingSubmissions.length})
                </button>
                <button
                  onClick={() => setGradingFilter('graded')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    gradingFilter === 'graded'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  Graded ({gradedSubmissions.length})
                </button>
                <button
                  onClick={() => setGradingFilter('all')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    gradingFilter === 'all'
                      ? 'bg-[#082592] text-white'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  All ({submissions.length})
                </button>
              </div>
            </div>

            {filteredSubmissions.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
                <FileCheck2 className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-700">No submissions found</h3>
                <p className="text-xs text-slate-500">
                  There are no student submissions matching the selected filter.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredSubmissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="space-y-2 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-[#082592] uppercase px-2 py-0.5 rounded bg-blue-50">
                          {sub.courseTitle}
                        </span>
                        <span className="text-xs text-slate-400">
                          Submitted on {sub.submittedAt}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-[#061A3A]">{sub.assignmentTitle}</h3>
                      <p className="text-xs text-slate-700">
                        <strong>Student:</strong> {sub.studentName} ({sub.studentEmail})
                      </p>
                      <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100 italic">
                        &ldquo;{sub.comments}&rdquo;
                      </p>
                      <div className="text-[11px] text-slate-400 font-medium">
                        Attached Archive: <span className="text-[#082592] font-bold">{sub.fileName}</span> ({sub.fileSize})
                      </div>
                    </div>

                    <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
                      {sub.status === 'graded' ? (
                        <div className="text-left md:text-right space-y-1">
                          <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                            Score: {sub.score}/100
                          </span>
                          <p className="text-[11px] text-slate-500">Graded by {sub.gradedBy}</p>
                          <button
                            onClick={() => handleOpenGrading(sub)}
                            className="text-xs font-bold text-[#082592] hover:underline block"
                          >
                            Update Grade & Critique
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleOpenGrading(sub)}
                          className="px-5 py-2.5 rounded-xl bg-[#082592] hover:bg-[#1746C5] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>Enter Grade & Feedback</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: INSTRUCTORS */}
        {selectedAdminTab === 'instructors' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h1 className="text-2xl font-black text-[#061A3A]">Academy Faculty & Instructors</h1>
              <p className="text-xs text-slate-500 mt-1">
                Active instructors, course assignments, and bios.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {instructors.map((inst) => (
                <div
                  key={inst.id}
                  className="bg-white p-6 rounded-2xl border border-slate-200 flex items-start gap-4 shadow-xs"
                >
                  <img
                    src={inst.image}
                    alt={inst.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-xl object-cover object-top border border-slate-200 shrink-0"
                  />
                  <div className="space-y-1 overflow-hidden">
                    <h3 className="text-base font-bold text-[#061A3A]">{inst.name}</h3>
                    <p className="text-xs font-semibold text-[#082592]">{inst.specialization}</p>
                    <p className="text-xs text-slate-500 line-clamp-3 mt-1">{inst.bio}</p>
                    <span className="inline-block text-[11px] font-bold text-slate-400 mt-2">
                      Assigned to {inst.courseCount} Courses
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Grade Entry Modal */}
      {gradingSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#061A3A]/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-[#082592] uppercase">
                  Grade Submission
                </span>
                <h3 className="text-base font-black text-[#061A3A] mt-0.5">
                  {gradingSubmission.studentName}
                </h3>
              </div>
              <button
                onClick={() => setGradingSubmission(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveGrade} className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 border border-slate-100">
                <p><strong>Assignment:</strong> {gradingSubmission.assignmentTitle}</p>
                <p><strong>Course:</strong> {gradingSubmission.courseTitle}</p>
                <p><strong>Submitted File:</strong> {gradingSubmission.fileName} ({gradingSubmission.fileSize})</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Numerical Score (0 - 100) *
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={scoreInput}
                  onChange={(e) => setScoreInput(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-[#061A3A] focus:outline-hidden focus:ring-2 focus:ring-[#082592]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Instructor Critique & Feedback *
                </label>
                <textarea
                  required
                  rows={4}
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  placeholder="Provide constructive feedback on code quality, design adherence, and future improvements..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#082592]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setGradingSubmission(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm cursor-pointer"
                >
                  Publish Grade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Course Add / Edit Modal */}
      {courseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#061A3A]/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 my-8 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-[#061A3A]">
                {editingCourseId ? 'Edit Course Program' : 'Create New Course'}
              </h3>
              <button
                onClick={() => setCourseModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Course Title *</label>
                <input
                  type="text"
                  required
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  placeholder="e.g. Advanced Cloud Computing with Docker & Kubernetes"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-[#082592]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={courseCategory}
                    onChange={(e) => setCourseCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
                  >
                    <option value="Web Development">Web Development</option>
                    <option value="Programming">Programming</option>
                    <option value="Design">Design</option>
                    <option value="Database Management">Database Management</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Skill Level *</label>
                  <select
                    value={courseLevel}
                    onChange={(e) => setCourseLevel(e.target.value as CourseLevel)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="All Levels">All Levels</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Lead Instructor *</label>
                <select
                  value={courseInstructor}
                  onChange={(e) => setCourseInstructor(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
                >
                  {instructors.map((inst) => (
                    <option key={inst.id} value={inst.name}>
                      {inst.name} ({inst.specialization})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Duration (Wks)</label>
                  <input
                    type="number"
                    min="1"
                    value={courseDurationWeeks}
                    onChange={(e) => setCourseDurationWeeks(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hours</label>
                  <input
                    type="number"
                    min="1"
                    value={courseDurationHours}
                    onChange={(e) => setCourseDurationHours(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tuition ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={coursePrice}
                    onChange={(e) => setCoursePrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Short Description *</label>
                <input
                  type="text"
                  required
                  value={courseShortDesc}
                  onChange={(e) => setCourseShortDesc(e.target.value)}
                  placeholder="1-2 sentences for card previews"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Curriculum Description *</label>
                <textarea
                  rows={3}
                  required
                  value={courseFullDesc}
                  onChange={(e) => setCourseFullDesc(e.target.value)}
                  placeholder="Detailed syllabus overview and learning outcomes"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCourseModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#082592] hover:bg-[#1746C5] text-white text-xs font-bold shadow-sm"
                >
                  {editingCourseId ? 'Save Changes' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Dossier Inspection Modal */}
      {inspectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#061A3A]/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#082592] flex items-center justify-center font-bold">
                  {inspectedStudent.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-black text-[#061A3A]">{inspectedStudent.fullName}</h3>
                  <p className="text-xs text-slate-500">{inspectedStudent.email}</p>
                </div>
              </div>
              <button
                onClick={() => setInspectedStudentId(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl">
                <div>
                  <span className="text-slate-400">Phone:</span>
                  <p className="font-bold text-slate-700">{inspectedStudent.phone}</p>
                </div>
                <div>
                  <span className="text-slate-400">Registered:</span>
                  <p className="font-bold text-slate-700">{inspectedStudent.enrolledAt}</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-[#061A3A] mb-2">
                  Enrolled Tracks ({inspectedEnrolments.length})
                </h4>
                {inspectedEnrolments.length === 0 ? (
                  <p className="text-slate-400 italic">No courses enrolled yet.</p>
                ) : (
                  <div className="space-y-1.5">
                    {inspectedEnrolments.map((enr) => {
                      const course = courses.find((c) => c.id === enr.courseId);
                      return (
                        <div
                          key={enr.id}
                          className="p-2.5 rounded-lg border border-slate-100 bg-white flex items-center justify-between"
                        >
                          <span className="font-semibold text-slate-800">{course?.title}</span>
                          <span className="text-[10px] font-bold text-[#082592]">
                            {enr.progressPercentage}% progress
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-bold text-[#061A3A] mb-2">
                  Submission History ({inspectedSubmissions.length})
                </h4>
                {inspectedSubmissions.length === 0 ? (
                  <p className="text-slate-400 italic">No assignments submitted yet.</p>
                ) : (
                  <div className="space-y-1.5">
                    {inspectedSubmissions.map((sub) => (
                      <div
                        key={sub.id}
                        className="p-2.5 rounded-lg border border-slate-100 bg-white flex items-center justify-between"
                      >
                        <div>
                          <p className="font-semibold text-slate-800">{sub.assignmentTitle}</p>
                          <p className="text-[10px] text-slate-400">{sub.submittedAt}</p>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            sub.status === 'graded'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {sub.status === 'graded' ? `${sub.score}/100` : 'Pending'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setInspectedStudentId(null)}
                className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
