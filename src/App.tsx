import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { HeroSection } from './components/landing/HeroSection';
import { FeaturedCourses } from './components/landing/FeaturedCourses';
import { CourseCategories } from './components/landing/CourseCategories';
import { WhyChooseUs } from './components/landing/WhyChooseUs';
import { StatsBanner } from './components/landing/StatsBanner';
import { HowItWorks } from './components/landing/HowItWorks';
import { InstructorsSection } from './components/landing/InstructorsSection';
import { TestimonialsSection } from './components/landing/TestimonialsSection';
import { FaqSection } from './components/landing/FaqSection';
import { NewsletterSection } from './components/landing/NewsletterSection';
import { CoursesPage } from './components/courses/CoursesPage';
import { CourseDetailModal } from './components/courses/CourseDetailModal';
import { AuthModal } from './components/auth/AuthModal';
import { StudentPortal } from './components/student/StudentPortal';
import { AdminPortal } from './components/admin/AdminPortal';
import { CpanelPackageModal } from './components/cpanel/CpanelPackageModal';
import { CheckCircle2, AlertCircle, Info, Sparkles, FolderDown } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeView, notification, setIsCpanelModalOpen } = useApp();

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeView]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#17233C] selection:bg-[#F28C18] selection:text-white">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
          <div
            className={`px-4 py-3 rounded-2xl shadow-2xl border text-xs sm:text-sm font-semibold flex items-center gap-3 backdrop-blur-md ${
              notification.type === 'success'
                ? 'bg-emerald-900/90 text-emerald-100 border-emerald-500/50'
                : notification.type === 'error'
                ? 'bg-red-900/90 text-red-100 border-red-500/50'
                : 'bg-[#061A3A]/90 text-blue-100 border-blue-400/50'
            }`}
          >
            {notification.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
            {notification.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />}
            {notification.type === 'info' && <Info className="w-5 h-5 text-blue-300 shrink-0" />}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Main Header */}
      <Header />

      {/* View Switcher */}
      <main className="flex-1">
        {activeView === 'home' && (
          <>
            <HeroSection />
            <FeaturedCourses />
            <CourseCategories />
            <WhyChooseUs />
            <StatsBanner />
            <HowItWorks />
            <InstructorsSection />
            <TestimonialsSection />
            <FaqSection />
            <NewsletterSection />
          </>
        )}

        {activeView === 'courses' && <CoursesPage />}
        {activeView === 'student-portal' && <StudentPortal />}
        {activeView === 'admin-portal' && <AdminPortal />}
      </main>

      {/* Global Modals */}
      <CourseDetailModal />
      <AuthModal />
      <CpanelPackageModal />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
