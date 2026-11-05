import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Course, CourseEnrolment, Assignment, AssignmentSubmission, Instructor } from '../types';
import {
  INITIAL_USERS,
  INITIAL_COURSES,
  INITIAL_ENROLMENTS,
  INITIAL_ASSIGNMENTS,
  INITIAL_SUBMISSIONS,
  INITIAL_INSTRUCTORS,
} from '../data/initialData';

export type AppView = 'home' | 'courses' | 'course-details' | 'student-portal' | 'admin-portal' | 'cpanel-hub' | 'contact' | 'about';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  courses: Course[];
  enrolments: CourseEnrolment[];
  assignments: Assignment[];
  submissions: AssignmentSubmission[];
  instructors: Instructor[];
  subscribers: string[];
  activeView: AppView;
  selectedCourseId: string | null;
  selectedStudentTab: 'overview' | 'browse' | 'my-courses' | 'assignments' | 'results' | 'profile';
  selectedAdminTab: 'overview' | 'students' | 'courses' | 'assignments' | 'instructors';
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
  isCpanelModalOpen: boolean;
  notification: { message: string; type: 'success' | 'error' | 'info' } | null;

  // Actions
  setActiveView: (view: AppView) => void;
  setSelectedCourseId: (id: string | null) => void;
  setSelectedStudentTab: (tab: 'overview' | 'browse' | 'my-courses' | 'assignments' | 'results' | 'profile') => void;
  setSelectedAdminTab: (tab: 'overview' | 'students' | 'courses' | 'assignments' | 'instructors') => void;
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  setIsCpanelModalOpen: (open: boolean) => void;
  showNotification: (message: string, type?: 'success' | 'error' | 'info') => void;

  login: (email: string, password?: string) => { success: boolean; message: string };
  registerStudent: (data: { fullName: string; email: string; phone: string; password: string }) => { success: boolean; message: string };
  logout: () => void;
  quickSwitchUser: (role: 'student' | 'admin', userId?: string) => void;

  enrollCourse: (courseId: string) => { success: boolean; message: string };
  submitAssignment: (assignmentId: string, fileName: string, fileSize: string, comments: string) => { success: boolean; message: string };
  gradeSubmission: (submissionId: string, score: number, feedback: string) => { success: boolean; message: string };
  addCourse: (course: Omit<Course, 'id' | 'rating' | 'reviewCount'>) => void;
  editCourse: (courseId: string, updated: Partial<Course>) => void;
  toggleCourseStatus: (courseId: string) => void;
  subscribeNewsletter: (email: string) => { success: boolean; message: string };
  resetToDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'devgenius_users_v2',
  COURSES: 'devgenius_courses_v2',
  ENROLMENTS: 'devgenius_enrolments_v2',
  ASSIGNMENTS: 'devgenius_assignments_v2',
  SUBMISSIONS: 'devgenius_submissions_v2',
  INSTRUCTORS: 'devgenius_instructors_v2',
  CURRENT_USER: 'devgenius_current_user_v2',
  SUBSCRIBERS: 'devgenius_subscribers_v2',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COURSES);
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  const [enrolments, setEnrolments] = useState<CourseEnrolment[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ENROLMENTS);
    return saved ? JSON.parse(saved) : INITIAL_ENROLMENTS;
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
    return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
  });

  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
    return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
  });

  const [instructors, setInstructors] = useState<Instructor[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INSTRUCTORS);
    return saved ? JSON.parse(saved) : INITIAL_INSTRUCTORS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return saved ? JSON.parse(saved) : null;
  });

  const [subscribers, setSubscribers] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SUBSCRIBERS);
    return saved ? JSON.parse(saved) : ['alex@example.com', 'mary.student@gmail.com'];
  });

  const [activeView, setActiveView] = useState<AppView>('home');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedStudentTab, setSelectedStudentTab] = useState<'overview' | 'browse' | 'my-courses' | 'assignments' | 'results' | 'profile'>('overview');
  const [selectedAdminTab, setSelectedAdminTab] = useState<'overview' | 'students' | 'courses' | 'assignments' | 'instructors'>('overview');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [isCpanelModalOpen, setIsCpanelModalOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ENROLMENTS, JSON.stringify(enrolments));
  }, [enrolments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INSTRUCTORS, JSON.stringify(instructors));
  }, [instructors]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUBSCRIBERS, JSON.stringify(subscribers));
  }, [subscribers]);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  };

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = (email: string): { success: boolean; message: string } => {
    const trimmed = email.trim().toLowerCase();
    const user = users.find((u) => u.email.toLowerCase() === trimmed);
    if (!user) {
      return { success: false, message: 'Invalid credentials. User with this email address does not exist.' };
    }
    setCurrentUser(user);
    closeAuthModal();
    showNotification(`Welcome back, ${user.fullName}!`, 'success');
    if (user.role === 'admin') {
      setActiveView('admin-portal');
    } else {
      setActiveView('student-portal');
      setSelectedStudentTab('overview');
    }
    return { success: true, message: 'Login successful' };
  };

  const registerStudent = (data: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
  }): { success: boolean; message: string } => {
    const trimmedEmail = data.email.trim().toLowerCase();
    if (!data.fullName.trim()) {
      return { success: false, message: 'Please enter your full name.' };
    }
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      return { success: false, message: 'Please enter a valid email address.' };
    }
    if (data.password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters long.' };
    }

    const exists = users.some((u) => u.email.toLowerCase() === trimmedEmail);
    if (exists) {
      return { success: false, message: 'An account with this email already exists. Please log in instead.' };
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      fullName: data.fullName.trim(),
      email: trimmedEmail,
      phone: data.phone.trim() || '+234 800 000 0000',
      role: 'student', // Students strictly assigned student role
      enrolledAt: new Date().toISOString().split('T')[0],
      bio: 'Enthusiastic DevGenius Academy student.',
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    closeAuthModal();
    setActiveView('student-portal');
    setSelectedStudentTab('overview');
    showNotification(`Congratulations ${newUser.fullName}! Your student registration is complete.`, 'success');

    return { success: true, message: 'Registration successful' };
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveView('home');
    showNotification('You have been logged out successfully.', 'info');
  };

  const quickSwitchUser = (role: 'student' | 'admin', userId?: string) => {
    if (role === 'admin') {
      const admin = users.find((u) => u.role === 'admin') || INITIAL_USERS[0];
      setCurrentUser(admin);
      setActiveView('admin-portal');
      showNotification('Switched to Administrator session.', 'info');
    } else {
      const targetUser = userId
        ? users.find((u) => u.id === userId && u.role === 'student')
        : users.find((u) => u.role === 'student') || INITIAL_USERS[1];
      if (targetUser) {
        setCurrentUser(targetUser);
        setActiveView('student-portal');
        setSelectedStudentTab('overview');
        showNotification(`Switched to student session: ${targetUser.fullName}`, 'info');
      }
    }
  };

  const enrollCourse = (courseId: string): { success: boolean; message: string } => {
    if (!currentUser) {
      openAuthModal('login');
      return { success: false, message: 'Please log in to enrol in this course.' };
    }

    if (currentUser.role !== 'student') {
      return { success: false, message: 'Administrators cannot enrol in courses. Use a student account.' };
    }

    const alreadyEnrolled = enrolments.some(
      (e) => e.userId === currentUser.id && e.courseId === courseId
    );

    if (alreadyEnrolled) {
      return { success: false, message: 'You are already enrolled in this course! Check "My Courses" in your dashboard.' };
    }

    const course = courses.find((c) => c.id === courseId);
    if (!course || !course.isActive) {
      return { success: false, message: 'This course is currently not open for enrolment.' };
    }

    const newEnrolment: CourseEnrolment = {
      id: `enr_${Date.now()}`,
      userId: currentUser.id,
      courseId: courseId,
      enrolledDate: new Date().toISOString().split('T')[0],
      progressPercentage: 5,
      status: 'active',
    };

    setEnrolments((prev) => [...prev, newEnrolment]);
    showNotification(`Enrolled in "${course.title}" successfully!`, 'success');
    return { success: true, message: 'Successfully enrolled' };
  };

  const submitAssignment = (
    assignmentId: string,
    fileName: string,
    fileSize: string,
    comments: string
  ): { success: boolean; message: string } => {
    if (!currentUser) {
      return { success: false, message: 'Session expired. Please log in again.' };
    }

    const assignment = assignments.find((a) => a.id === assignmentId);
    if (!assignment) {
      return { success: false, message: 'Assignment not found.' };
    }

    const course = courses.find((c) => c.id === assignment.courseId);

    // Check if already submitted
    const existingIndex = submissions.findIndex(
      (s) => s.assignmentId === assignmentId && s.userId === currentUser.id
    );

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    if (existingIndex >= 0) {
      // Re-submit
      const updatedList = [...submissions];
      updatedList[existingIndex] = {
        ...updatedList[existingIndex],
        fileName,
        fileSize,
        comments,
        submittedAt: formattedDate,
        status: 'pending',
      };
      setSubmissions(updatedList);
      showNotification('Assignment re-submitted successfully and queued for grading!', 'success');
      return { success: true, message: 'Re-submitted successfully' };
    }

    const newSub: AssignmentSubmission = {
      id: `sub_${Date.now()}`,
      assignmentId,
      userId: currentUser.id,
      studentName: currentUser.fullName,
      studentEmail: currentUser.email,
      courseId: assignment.courseId,
      courseTitle: course ? course.title : 'Course Assignment',
      assignmentTitle: assignment.title,
      fileName,
      fileSize,
      comments,
      submittedAt: formattedDate,
      status: 'pending',
    };

    setSubmissions((prev) => [newSub, ...prev]);
    showNotification('Assignment submitted successfully! Your instructor will review and grade it.', 'success');
    return { success: true, message: 'Submitted successfully' };
  };

  const gradeSubmission = (
    submissionId: string,
    score: number,
    feedback: string
  ): { success: boolean; message: string } => {
    if (!currentUser || currentUser.role !== 'admin') {
      return { success: false, message: 'Unauthorized. Only administrators can grade assignments.' };
    }

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === submissionId
          ? {
              ...sub,
              score,
              feedback,
              gradedAt: formattedDate,
              gradedBy: currentUser.fullName,
              status: 'graded' as const,
            }
          : sub
      )
    );

    showNotification(`Grade of ${score}/100 and instructor feedback recorded successfully!`, 'success');
    return { success: true, message: 'Graded successfully' };
  };

  const addCourse = (courseData: Omit<Course, 'id' | 'rating' | 'reviewCount'>) => {
    const newCourse: Course = {
      ...courseData,
      id: `crs_${Date.now()}`,
      rating: 5.0,
      reviewCount: 0,
    };
    setCourses((prev) => [newCourse, ...prev]);
    showNotification(`New course "${newCourse.title}" created successfully!`, 'success');
  };

  const editCourse = (courseId: string, updated: Partial<Course>) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, ...updated } : c))
    );
    showNotification('Course updated successfully!', 'success');
  };

  const toggleCourseStatus = (courseId: string) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          const nextStatus = !c.isActive;
          showNotification(
            `Course "${c.title}" is now ${nextStatus ? 'Active & Published' : 'Deactivated'}.`,
            'info'
          );
          return { ...c, isActive: nextStatus };
        }
        return c;
      })
    );
  };

  const subscribeNewsletter = (email: string): { success: boolean; message: string } => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes('@')) {
      return { success: false, message: 'Please enter a valid email address.' };
    }
    if (subscribers.includes(trimmed)) {
      return { success: false, message: 'This email is already subscribed to DevGenius Academy updates.' };
    }
    setSubscribers((prev) => [...prev, trimmed]);
    showNotification('Thank you for subscribing to DevGenius Academy newsletter!', 'success');
    return { success: true, message: 'Subscribed successfully' };
  };

  const resetToDemoData = () => {
    setUsers(INITIAL_USERS);
    setCourses(INITIAL_COURSES);
    setEnrolments(INITIAL_ENROLMENTS);
    setAssignments(INITIAL_ASSIGNMENTS);
    setSubmissions(INITIAL_SUBMISSIONS);
    setInstructors(INITIAL_INSTRUCTORS);
    setSubscribers(['alex@example.com', 'mary.student@gmail.com']);
    setCurrentUser(null);
    setActiveView('home');
    localStorage.clear();
    showNotification('Platform reset to clean initial demonstration dataset.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        courses,
        enrolments,
        assignments,
        submissions,
        instructors,
        subscribers,
        activeView,
        selectedCourseId,
        selectedStudentTab,
        selectedAdminTab,
        isAuthModalOpen,
        authModalMode,
        isCpanelModalOpen,
        notification,

        setActiveView,
        setSelectedCourseId,
        setSelectedStudentTab,
        setSelectedAdminTab,
        openAuthModal,
        closeAuthModal,
        setIsCpanelModalOpen,
        showNotification,

        login,
        registerStudent,
        logout,
        quickSwitchUser,
        enrollCourse,
        submitAssignment,
        gradeSubmission,
        addCourse,
        editCourse,
        toggleCourseStatus,
        subscribeNewsletter,
        resetToDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
