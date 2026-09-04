import React from 'react';

export const FloatingFilamentStream: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {/* Wave Curve 1: Blue to Cyan to Pink */}
      <svg
        className="absolute w-full h-[600px] -top-20 left-0 opacity-40 mix-blend-screen"
        viewBox="0 0 1440 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="filamentGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.8" />
            <stop offset="35%" stopColor="#00F0FF" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#EC4899" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#FFD600" stopOpacity="0.7" />
          </linearGradient>
          <filter id="glow1" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <path
          d="M-100 200 C 300 50, 600 450, 1000 150 C 1250 -30, 1400 350, 1600 220"
          stroke="url(#filamentGrad1)"
          strokeWidth="6"
          strokeLinecap="round"
          filter="url(#glow1)"
          className="animate-pulse-glow"
        />
        <path
          d="M-100 220 C 320 70, 580 470, 980 170 C 1230 -10, 1380 370, 1600 240"
          stroke="#00F0FF"
          strokeWidth="2"
          strokeDasharray="12 16"
          className="opacity-70 animate-float-slow"
        />
      </svg>

      {/* Wave Curve 2: Purple to Orange */}
      <svg
        className="absolute w-full h-[500px] top-[40%] right-0 opacity-30 mix-blend-screen"
        viewBox="0 0 1440 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="filamentGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#F43F5E" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#F97316" stopOpacity="0.7" />
          </linearGradient>
        </defs>
        <path
          d="M1600 100 C 1200 400, 800 50, 400 350 C 150 500, -50 200, -200 300"
          stroke="url(#filamentGrad2)"
          strokeWidth="5"
          strokeLinecap="round"
          className="animate-float-reverse"
        />
      </svg>
    </div>
  );
};
