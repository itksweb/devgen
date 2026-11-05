import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from './Logo';
import {
  Mail,
  Phone,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  FolderDown,
  LayoutDashboard,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentUser,
    activeView,
    setActiveView,
    openAuthModal,
    logout,
    setIsCpanelModalOpen,
    quickSwitchUser,
    users
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);

  const studentCount = users.filter((u) => u.role === 'student').length;

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-xs">
      {/* 1. Top Information Bar */}
      <div className="bg-[#061A3A] text-slate-300 text-xs py-2 px-4 sm:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* Contact Details */}
          <div className="flex items-center gap-6">
            <a
              href="mailto:admissions@devgenius.ac"
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#F28C18]" />
              <span>admissions@devgenius.ac</span>
            </a>
            <span className="hidden md:inline text-white/30">|</span>
            <a
              href="tel:+2348123456789"
              className="hidden md:flex items-center gap-2 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#F28C18]" />
              <span>+234 812 345 6789</span>
            </a>
          </div>

          {/* Quick Demo Switcher & cPanel package shortcut */}
          <div className="flex items-center gap-4 text-[11px]">
            <div className="relative">
              <button
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
              >
                <span>Role Switcher:</span>
                <span className="text-[#F28C18] font-bold">
                  {currentUser ? (currentUser.role === 'admin' ? 'Admin' : 'Student') : 'Guest'}
                </span>
                <span className="text-[10px] opacity-70">▼</span>
              </button>

              {demoMenuOpen && (
                <div
                  className="absolute right-0 mt-1.5 w-60 bg-[#061A3A] border border-white/20 rounded-lg shadow-xl p-2 z-50 text-slate-200"
                  onMouseLeave={() => setDemoMenuOpen(false)}
                >
                  <p className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1">Quick Switch Session</p>
                  <button
                    onClick={() => {
                      quickSwitchUser('student');
                      setDemoMenuOpen(false);
                    }}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-white/10 flex items-center justify-between text-xs"
                  >
                    <span className="flex items-center gap-2">
                      <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
                      Student Demo (Emmanuel)
                    </span>
                    <span className="text-[10px] text-emerald-400">Student</span>
                  </button>

                  <button
                    onClick={() => {
                      quickSwitchUser('admin');
                      setDemoMenuOpen(false);
                    }}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-white/10 flex items-center justify-between text-xs"
                  >
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#F28C18]" />
                      Administrator Demo
                    </span>
                    <span className="text-[10px] text-[#F28C18]">Admin</span>
                  </button>

                  {currentUser && (
                    <button
                      onClick={() => {
                        logout();
                        setDemoMenuOpen(false);
                      }}
                      className="w-full text-left px-2 py-1.5 rounded hover:bg-red-500/20 text-red-300 text-xs mt-1 border-t border-white/10"
                    >
                      Log Out to Guest
                    </button>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={() => setIsCpanelModalOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#082592] hover:bg-[#1746C5] text-white font-medium transition-colors"
              title="Download database.sql, .htaccess & full PHP source for cPanel"
            >
              <FolderDown className="w-3.5 h-3.5 text-[#F28C18]" />
              <span>cPanel Deployment Hub</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <Logo
          onClick={() => {
            setActiveView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />

        {/* Zone 2: Navigation Links (single-line, clean) */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-[#17233C]">
          <button
            onClick={() => {
              setActiveView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`transition-colors hover:text-[#082592] ${
              activeView === 'home' ? 'text-[#082592] font-bold' : ''
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setActiveView('courses')}
            className={`transition-colors hover:text-[#082592] ${
              activeView === 'courses' ? 'text-[#082592] font-bold' : ''
            }`}
          >
            Courses
          </button>
          <button
            onClick={() => {
              setActiveView('home');
              setTimeout(() => {
                const el = document.getElementById('why-choose-us');
                el?.scrollIntoView({ behavior: 'smooth' });
              }, 50);
            }}
            className="transition-colors hover:text-[#082592]"
          >
            About Us
          </button>
          <button
            onClick={() => {
              setActiveView('home');
              setTimeout(() => {
                const el = document.getElementById('instructors-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }, 50);
            }}
            className="transition-colors hover:text-[#082592]"
          >
            Our Instructors
          </button>
          <button
            onClick={() => {
              setActiveView('home');
              setTimeout(() => {
                const el = document.getElementById('faq-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }, 50);
            }}
            className="transition-colors hover:text-[#082592]"
          >
            FAQ
          </button>
          <button
            onClick={() => setIsCpanelModalOpen(true)}
            className="text-slate-600 hover:text-[#082592] flex items-center gap-1.5"
          >
            <span>cPanel Files</span>
            <span className="text-[10px] font-bold text-white bg-[#082592] px-1.5 py-0.2 rounded">PHP</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action / User Session */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  setActiveView(currentUser.role === 'admin' ? 'admin-portal' : 'student-portal')
                }
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg text-white transition-all shadow-xs ${
                  currentUser.role === 'admin'
                    ? 'bg-[#061A3A] hover:bg-[#082592]'
                    : 'bg-[#082592] hover:bg-[#1746C5]'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-[#F28C18]" />
                <span className="hidden sm:inline">
                  {currentUser.role === 'admin' ? 'Admin Portal' : 'Student Portal'}
                </span>
                <span className="sm:hidden">Portal</span>
              </button>

              <button
                onClick={logout}
                title="Log Out"
                className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => openAuthModal('login')}
                className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-[#17233C] hover:text-[#082592] transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => openAuthModal('register')}
                className="px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold text-white bg-[#F28C18] hover:bg-[#d97706] rounded-lg shadow-sm transition-all hover:shadow active:scale-95"
              >
                Get Started
              </button>
            </div>
          )}

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-4 shadow-lg space-y-3">
          <div className="flex flex-col space-y-2 text-sm font-semibold text-slate-700">
            <button
              onClick={() => {
                setActiveView('home');
                setMobileMenuOpen(false);
              }}
              className="text-left py-1.5 hover:text-[#082592]"
            >
              Home
            </button>
            <button
              onClick={() => {
                setActiveView('courses');
                setMobileMenuOpen(false);
              }}
              className="text-left py-1.5 hover:text-[#082592]"
            >
              Courses
            </button>
            <button
              onClick={() => {
                setActiveView('home');
                setMobileMenuOpen(false);
                setTimeout(() => {
                  document.getElementById('why-choose-us')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="text-left py-1.5 hover:text-[#082592]"
            >
              About Us
            </button>
            <button
              onClick={() => {
                setActiveView('home');
                setMobileMenuOpen(false);
                setTimeout(() => {
                  document.getElementById('instructors-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="text-left py-1.5 hover:text-[#082592]"
            >
              Our Instructors
            </button>
            <button
              onClick={() => {
                setIsCpanelModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="text-left py-1.5 flex items-center justify-between text-[#082592]"
            >
              <span>cPanel Deployment Hub</span>
              <span className="text-[10px] bg-blue-100 text-[#082592] px-2 py-0.5 rounded font-bold">
                PHP + SQL
              </span>
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {currentUser ? (
              <>
                <button
                  onClick={() => {
                    setActiveView(currentUser.role === 'admin' ? 'admin-portal' : 'student-portal');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-lg text-white font-bold bg-[#082592] text-center text-sm"
                >
                  Enter {currentUser.role === 'admin' ? 'Administrator Portal' : 'Student Portal'}
                </button>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 rounded-lg text-red-600 bg-red-50 text-center text-xs font-semibold"
                >
                  Log Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    openAuthModal('login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 border border-slate-300 text-slate-800 rounded-lg text-center text-xs font-bold"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    openAuthModal('register');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 bg-[#F28C18] text-white rounded-lg text-center text-xs font-bold"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
