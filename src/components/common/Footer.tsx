import React from 'react';
import { Logo } from './Logo';
import { useApp } from '../../context/AppContext';
import { Mail, Phone, MapPin, ExternalLink, ArrowRight, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveView, setSelectedCourseId, setIsCpanelModalOpen, openAuthModal } = useApp();

  return (
    <footer className="bg-[#061A3A] text-slate-300 pt-16 pb-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Main 4-column footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Col 1 & 2: Brand Information */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="light" />
            <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
              DevGenius Academy is a forward-thinking e-learning institution empowering learners with
              high-impact, career-ready digital skills. Practical projects, expert mentorship, and
              accredited certification.
            </p>
            <div className="pt-2 flex flex-col gap-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[#F28C18] shrink-0" />
                <span>Tech Innovation Hub, Victoria Island, Lagos & Online Worldwide</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#F28C18] shrink-0" />
                <span>+234 812 345 6789 / +1 234 567 8900</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#F28C18] shrink-0" />
                <span>admissions@devgenius.ac</span>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F28C18]">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => {
                    setActiveView('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('courses')}
                  className="hover:text-white transition-colors"
                >
                  Browse Courses
                </button>
              </li>
              <li>
                <button
                  onClick={() => openAuthModal('register')}
                  className="hover:text-white transition-colors text-amber-300 font-medium"
                >
                  Student Registration
                </button>
              </li>
              <li>
                <button
                  onClick={() => openAuthModal('login')}
                  className="hover:text-white transition-colors"
                >
                  Student Login
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsCpanelModalOpen(true)}
                  className="hover:text-[#F28C18] transition-colors flex items-center gap-1.5 text-blue-200"
                >
                  <span>cPanel PHP Package</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Courses */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F28C18]">
              Popular Courses
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => {
                    setSelectedCourseId('crs_1');
                    setActiveView('course-details');
                  }}
                  className="hover:text-white transition-colors text-left"
                >
                  Web Development Bootcamp
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCourseId('crs_2');
                    setActiveView('course-details');
                  }}
                  className="hover:text-white transition-colors text-left"
                >
                  Python Programming & Data
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCourseId('crs_3');
                    setActiveView('course-details');
                  }}
                  className="hover:text-white transition-colors text-left"
                >
                  UI/UX Design Fundamentals
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCourseId('crs_4');
                    setActiveView('course-details');
                  }}
                  className="hover:text-white transition-colors text-left"
                >
                  Database Management & SQL
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCourseId('crs_5');
                    setActiveView('course-details');
                  }}
                  className="hover:text-white transition-colors text-left"
                >
                  Digital Marketing & Growth
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F28C18]">
              Deployment & Host
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Standard shared hosting compatible: PHP 8.1+, MySQL PDO, Apache .htaccess, and cPanel ready.
            </p>
            <div className="pt-1">
              <button
                onClick={() => setIsCpanelModalOpen(true)}
                className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group"
              >
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>cPanel Deployment Center</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#F28C18] group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  View database.sql schema, setup guide & PHP files
                </p>
              </button>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Role-Based Security & PDO Sanitized</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright and legal line */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} DevGenius Academy. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-white cursor-pointer transition-colors">Academic Integrity</span>
            <span className="text-slate-500 flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-[#F28C18] fill-current" /> for Education
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
