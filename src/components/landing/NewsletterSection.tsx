import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Mail, Phone, MapPin, Send, Check } from 'lucide-react';

export const NewsletterSection: React.FC = () => {
  const { subscribeNewsletter } = useApp();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    const res = subscribeNewsletter(email);
    if (res.success) {
      setSubmitted(true);
      setEmail('');
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Navy Newsletter Box matching reference image */}
        <div className="relative rounded-3xl bg-[#082592] text-white p-8 sm:p-12 shadow-xl overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-2">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Stay Updated With DevGenius Academy
              </h3>
              <p className="text-sm text-blue-100 max-w-md">
                Subscribe to our newsletter and never miss course openings, scholarship opportunities, and free weekend workshops.
              </p>
            </div>

            <div className="lg:col-span-6">
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="flex-1 px-4 py-3.5 rounded-xl bg-white text-[#17233C] placeholder:text-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#F28C18] border-0"
                />
                <button
                  type="submit"
                  className="px-6 py-3.5 rounded-xl bg-[#F28C18] hover:bg-[#d97706] text-white font-bold text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  {submitted ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Subscribed!</span>
                    </>
                  ) : (
                    <>
                      <span>Subscribe</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
              <p className="text-[11px] text-blue-200/80 mt-2">
                We respect your privacy. Zero spam, unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>

        {/* 3 Contact Info Cards directly below banner, matching reference image */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#082592] flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5 text-[#082592]" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Call Us</p>
              <p className="text-sm font-bold text-[#061A3A] mt-0.5">+234 812 345 6789</p>
              <p className="text-[11px] text-slate-500">Mon - Fri (8AM - 6PM)</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-[#F28C18] flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-[#F28C18]" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Email Us</p>
              <p className="text-sm font-bold text-[#061A3A] mt-0.5">admissions@devgenius.ac</p>
              <p className="text-[11px] text-slate-500">24/7 Academic Support</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Campus Location</p>
              <p className="text-sm font-bold text-[#061A3A] mt-0.5">Victoria Island, Lagos</p>
              <p className="text-[11px] text-slate-500">Tech Campus & Online</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
