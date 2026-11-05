export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  passwordHash?: string;
  avatar?: string;
  bio?: string;
  enrolledAt: string;
}

export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';

export interface Course {
  id: string;
  title: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  instructorName: string;
  instructorTitle: string;
  instructorImage?: string;
  durationWeeks: number;
  durationHours: number;
  level: CourseLevel;
  thumbnail: string;
  rating: number;
  reviewCount: number;
  price: number; // 0 for free / scholarship
  isActive: boolean;
  syllabus: {
    week: number;
    title: string;
    topics: string[];
  }[];
  requirements: string[];
}

export interface CourseEnrolment {
  id: string;
  userId: string;
  courseId: string;
  enrolledDate: string;
  progressPercentage: number;
  status: 'active' | 'completed' | 'dropped';
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  deadline: string;
  maxScore: number;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  userId: string;
  studentName: string;
  studentEmail: string;
  courseId: string;
  courseTitle: string;
  assignmentTitle: string;
  fileName: string;
  fileSize: string;
  comments: string;
  submittedAt: string;
  score?: number;
  feedback?: string;
  gradedAt?: string;
  gradedBy?: string;
  status: 'pending' | 'graded';
}

export interface Instructor {
  id: string;
  name: string;
  specialization: string;
  bio: string;
  image: string;
  courseCount: number;
  social: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
}
