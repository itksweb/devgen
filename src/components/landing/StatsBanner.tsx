import React from 'react';
import { useApp } from '../../context/AppContext';
import { Users, GraduationCap, BookOpen, Award, CheckCircle } from 'lucide-react';

export const StatsBanner: React.FC = () => {
  const { users, courses, enrolments, submissions } = useApp();

  // STRICT REQUIREMENT: Count only student-role accounts, excluding administrator accounts.
  const totalStudents = users.filter((u) => u.role === 'student').length;
  const availableCourses = courses.filter((c) => c.isActive).length;
  const totalEnrolments = enrolments.length;
  const gradedAssignments = submissions.filter((s) => s.status === 'graded').length;

  const stats = [
    {
      label: 'Registered Students',
      value: totalStudents,
      display: totalStudents.toLocaleString(),
      icon: Users,
      subtext: 'Real registered accounts',
    },
    {
      label: 'Available Courses',
      value: availableCourses,
      display: availableCourses.toLocaleString(),
      icon: BookOpen,
      subtext: 'Active and published',
    },
    {
      label: 'Total Enrolments',
      value: totalEnrolments,
      display: totalEnrolments.toLocaleString(),
      icon: GraduationCap,
      subtext: 'Active learning journeys',
    },
    {
      label: 'Graded Assignments',
      value: gradedAssignments,
      display: gradedAssignments.toLocaleString(),
      icon: Award,
      subtext: 'Instructor reviewed',
    },
  ];

  return (
    <section className="bg-[#082592] text-white py-12 relative overflow-hidden">
      {/* Decorative background grid pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 hover:bg-white/15 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center shrink-0 text-[#F28C18]">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-white tabular-nums tracking-tight">
                    {stat.display}
                  </p>
                  <p className="text-xs sm:text-sm font-bold text-blue-100">{stat.label}</p>
                  <p className="text-[10px] text-blue-200/80 font-medium">{stat.subtext}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
