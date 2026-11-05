import React from 'react';

interface LogoProps {
  variant?: 'light' | 'dark';
  className?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({ variant = 'dark', className = '', onClick }) => {
  const isLight = variant === 'light';

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-2.5 cursor-pointer select-none group ${className}`}
    >
      {/* Insignia Icon */}
      <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-[#082592] text-white shadow-sm transition-transform group-hover:scale-105">
        <svg
          className="w-5 h-5 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Academic Graduation Cap & Tech Node Symbol */}
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
        <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#F28C18] border-2 border-white flex items-center justify-center text-[7px] font-extrabold text-white">
          G
        </span>
      </div>

      {/* Brand Wordmark */}
      <div className="flex flex-col">
        <span
          className={`text-lg font-extrabold tracking-tight leading-tight transition-colors ${
            isLight ? 'text-white' : 'text-[#061A3A]'
          }`}
        >
          DEVGENIUS
        </span>
        <span
          className={`text-[9px] font-bold tracking-[0.2em] -mt-0.5 uppercase ${
            isLight ? 'text-blue-200' : 'text-[#F28C18]'
          }`}
        >
          ACADEMY
        </span>
      </div>
    </div>
  );
};
