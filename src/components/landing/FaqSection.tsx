import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      question: 'How do I register as a student?',
      answer:
        'Click on the "Get Started" or "Create Free Account" button at the top of the page. Enter your Full Name, Email Address, Phone Number, and choose a secure password. Once submitted, your student account is instantly created and you will be directed straight to your personalized student dashboard.',
    },
    {
      question: 'How do I enrol in a course?',
      answer:
        'Once registered and logged into your student account, browse the course catalog from the homepage or within your student dashboard. Click the "Enrol Now" button on any active course. The course is immediately linked to your account, and its curriculum, assignments, and resources will appear in your "My Courses" tab.',
    },
    {
      question: 'Can I take multiple courses at the same time?',
      answer:
        'Yes! You can enrol in multiple courses concurrently. Each course has its own independent syllabus, assignment submission pipeline, and grading ledger. You can monitor your overall academic progress across all enrolled tracks from your Student Overview.',
    },
    {
      question: 'How do I submit assignments for my courses?',
      answer:
        'Navigate to the "Assignments" tab in your Student Dashboard. Here you will see all active assignments with their deadlines, maximum scores, and instructions. Click "Submit Assignment", attach your project file (e.g., PDF, ZIP, code archive), write your submission notes, and submit. You can even update your submission prior to grading.',
    },
    {
      question: 'How do I view my grades and instructor feedback?',
      answer:
        'When an instructor reviews your work, your submission status changes from "Pending" to "Graded". Head over to the "My Results" tab in your Student Dashboard to view your exact numerical score (0-100), letter grade, grading date, and personal written critique from the course instructor.',
    },
    {
      question: 'Can this entire system run on shared cPanel hosting?',
      answer:
        'Absolutely! DevGenius Academy was architected specifically for Apache shared hosting with PHP 8.1+ and MySQL PDO. You can download the complete database.sql, .htaccess, and PHP files from our cPanel Deployment Hub and upload them directly via cPanel File Manager or FTP without requiring Node.js on the production server.',
    },
  ];

  return (
    <section id="faq-section" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#082592] text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-[#F28C18]" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#061A3A] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-500">
            Everything you need to know about enrollment, assignments, grading, and shared hosting.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 bg-white hover:bg-slate-50 transition-colors"
                >
                  <span className="text-base font-bold text-[#061A3A]">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-[#082592]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-[#F2F6FF]/30">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
