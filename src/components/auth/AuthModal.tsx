import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Lock, Mail, User as UserIcon, Phone, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Logo } from '../common/Logo';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    openAuthModal,
    login,
    registerStudent,
    quickSwitchUser,
    showNotification
  } = useApp();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  if (!isAuthModalOpen) return null;

  const isLogin = authModalMode === 'login';

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    const res = login(email, password);
    setIsSubmitting(false);
    if (!res.success) {
      setErrorMsg(res.message);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    setIsSubmitting(true);
    const res = registerStudent({
      fullName,
      email,
      phone,
      password,
    });
    setIsSubmitting(false);

    if (!res.success) {
      setErrorMsg(res.message);
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    showNotification(`Password reset link sent to ${resetEmail}. Check your inbox.`, 'info');
    setForgotPasswordOpen(false);
    setResetEmail('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#061A3A]/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden relative animate-fade-in my-6">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-slate-100 bg-[#F2F6FF]/60 text-center">
          <div className="flex justify-center mb-2">
            <Logo />
          </div>
          <h2 className="text-xl font-black text-[#061A3A]">
            {forgotPasswordOpen
              ? 'Reset Your Password'
              : isLogin
              ? 'Welcome to Student Portal'
              : 'Create Free Student Account'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {forgotPasswordOpen
              ? 'Enter your registered email to receive recovery instructions.'
              : isLogin
              ? 'Enter your credentials to access your courses and submissions.'
              : 'Join thousands of learners building their tech future.'}
          </p>

          {/* Mode Switch Tabs (unless in forgot password view) */}
          {!forgotPasswordOpen && (
            <div className="grid grid-cols-2 p-1 bg-slate-200/80 rounded-xl mt-4">
              <button
                type="button"
                onClick={() => {
                  setErrorMsg('');
                  openAuthModal('login');
                }}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                  isLogin ? 'bg-white text-[#082592] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setErrorMsg('');
                  openAuthModal('register');
                }}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                  !isLogin ? 'bg-white text-[#082592] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Student Registration
              </button>
            </div>
          )}
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {forgotPasswordOpen ? (
            /* Forgot Password Form */
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Registered Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="student@devgenius.ac"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#082592]"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setForgotPasswordOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Back to Login
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-[#082592] hover:bg-[#1746C5] text-white text-xs font-bold"
                >
                  Send Reset Link
                </button>
              </div>
            </form>
          ) : isLogin ? (
            /* Student & Admin Login Form */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@devgenius.ac"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#082592]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => setForgotPasswordOpen(true)}
                    className="text-[11px] font-semibold text-[#082592] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#082592]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-[#082592] focus:ring-[#082592]"
                  />
                  <span>Remember my session</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-[#082592] hover:bg-[#1746C5] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm hover:shadow"
              >
                {isSubmitting ? 'Verifying...' : 'Sign In to Portal'}
              </button>

              {/* Quick 1-click Demo Fillers */}
              <div className="pt-4 border-t border-slate-100">
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-2 text-center tracking-wider">
                  Instant Demo Credentials
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('emmanuel@student.devgenius.ac');
                      setPassword('password123');
                    }}
                    className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#082592] text-[11px] font-bold text-left transition-colors"
                  >
                    <p className="truncate">Student Account</p>
                    <p className="text-[9px] font-normal text-slate-500">emmanuel@student...</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEmail('admin@devgenius.ac');
                      setPassword('admin2026');
                    }}
                    className="p-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-[#d97706] text-[11px] font-bold text-left transition-colors"
                  >
                    <p className="truncate">Admin Account</p>
                    <p className="text-[9px] font-normal text-slate-500">admin@devgenius.ac</p>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* Student Registration Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Samuel Adekunle"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#082592]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="samuel@student.com"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#082592]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234 812 345 6789"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#082592]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 chars"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#082592]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Confirm *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#082592]"
                    />
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-blue-50/70 border border-blue-100 text-[11px] text-blue-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#082592] shrink-0" />
                <span>
                  Accounts are automatically assigned <strong>Student Role</strong>. Administrator privileges cannot be registered here.
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-[#F28C18] hover:bg-[#d97706] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm hover:shadow cursor-pointer"
              >
                {isSubmitting ? 'Creating Student Account...' : 'Complete Registration'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
