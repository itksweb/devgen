import React, { useState } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: 'Emmanuel Eze',
      role: 'Full-Stack Web Development Graduate',
      location: 'Lagos, Nigeria',
      quote:
        'DevGenius Academy transformed my coding journey. Before joining, I struggled with CSS layouts and connecting databases. The hands-on assignments and direct instructor grading pushed me to build complete deployable applications. I recently landed my first junior developer role!',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
      rating: 5,
      course: 'Web Development Bootcamp',
      verified: true,
    },
    {
      id: 2,
      name: 'Fatima Al-Mansur',
      role: 'UI/UX Product Designer',
      location: 'Abuja, Nigeria',
      quote:
        'The structured curriculum and Figma design challenges gave me the portfolio depth I needed. The feedback from Chioma on accessibility and wireframe flows was pure gold. Highly recommend to anyone serious about digital design.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      rating: 5,
      course: 'UI/UX Design Fundamentals',
      verified: true,
    },
    {
      id: 3,
      name: 'Kwame Mensah',
      role: 'Junior Data Analyst',
      location: 'Accra, Ghana',
      quote:
        'Dr. Michael Adeyemi explains Python concepts with crystalline clarity. From basic loops to Pandas data frames, every module had practical CSV datasets to analyze. Submitting assignments through the student portal was seamless.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      rating: 5,
      course: 'Python Programming & Data',
      verified: true,
    },
  ];

  const current = testimonials[activeIdx];

  return (
    <section className="py-20 bg-slate-50 border-y border-slate-200/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-8">
        <div className="text-center space-y-2 mb-12">
          <p className="text-xs font-bold uppercase tracking-wider text-[#F28C18]">
            Sample Student Feedback
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#061A3A] tracking-tight">
            What Our Students Say
          </h2>
          <p className="text-xs text-slate-400">
            *Representative sample testimonials from recent cohort participants
          </p>
        </div>

        {/* Featured Testimonial Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-md border border-slate-200/80 relative">
          <Quote className="w-12 h-12 text-blue-100 absolute top-8 right-8 pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
            {/* Avatar */}
            <div className="relative shrink-0">
              <img
                src={current.avatar}
                alt={current.name}
                referrerPolicy="no-referrer"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shadow-sm border-2 border-white ring-2 ring-blue-100"
              />
              <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-500 text-white">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Testimonial Content */}
            <div className="space-y-4 flex-1 text-center sm:text-left">
              {/* Star Rating */}
              <div className="flex items-center justify-center sm:justify-start gap-1">
                {[...Array(current.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-xs font-bold text-slate-500 ml-2">
                  {current.course}
                </span>
              </div>

              {/* Quote */}
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed italic">
                &ldquo;{current.quote}&rdquo;
              </p>

              {/* Author Info */}
              <div>
                <h4 className="text-base font-extrabold text-[#061A3A]">{current.name}</h4>
                <p className="text-xs font-semibold text-[#082592]">{current.role}</p>
                <p className="text-[11px] text-slate-400">{current.location}</p>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIdx(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    activeIdx === idx ? 'w-8 bg-[#082592]' : 'bg-slate-200 hover:bg-slate-300'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setActiveIdx((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
                }
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
                aria-label="Previous Testimonial"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  setActiveIdx((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
                }
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
                aria-label="Next Testimonial"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
