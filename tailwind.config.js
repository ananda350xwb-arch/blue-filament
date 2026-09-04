/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: {
            DEFAULT: '#2563EB',
            50: '#EFF6FF',
            100: '#DBEAFE',
            200: '#BFDBFE',
            300: '#93C5FD',
            400: '#60A5FA',
            500: '#3B82F6',
            600: '#2563EB',
            700: '#1D4ED8',
            800: '#1E40AF',
            900: '#1E3A8A',
            dark: '#0B1938',
          },
          cyan: {
            DEFAULT: '#00F0FF',
            400: '#22D3EE',
            500: '#06B6D4',
            600: '#0891B2',
          },
          purple: {
            DEFAULT: '#8B5CF6',
            400: '#A855F7',
            500: '#8B5CF6',
            600: '#7C3AED',
            700: '#6D28D9',
          },
          pink: {
            DEFAULT: '#EC4899',
            400: '#F472B6',
            500: '#EC4899',
            600: '#DB2777',
          },
          yellow: {
            DEFAULT: '#FFD600',
            400: '#FDE047',
            500: '#FACC15',
            600: '#EAB308',
          },
          orange: {
            DEFAULT: '#FF6B00',
            400: '#FB923C',
            500: '#F97316',
            600: '#EA580C',
          },
          green: {
            DEFAULT: '#00DF89',
            400: '#4ADE80',
            500: '#10B981',
            600: '#059669',
          },
        },
      },
      fontFamily: {
        sans: ['Prompt', 'Outfit', 'sans-serif'],
        display: ['Fredoka', 'Prompt', 'sans-serif'],
      },
      boxShadow: {
        '3d-blue': '0 8px 0 #1d4ed8, 0 16px 25px rgba(37, 99, 235, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.5)',
        '3d-blue-sm': '0 4px 0 #1d4ed8, 0 8px 15px rgba(37, 99, 235, 0.35), inset 0 2px 3px rgba(255, 255, 255, 0.5)',
        '3d-purple': '0 8px 0 #6d28d9, 0 16px 25px rgba(139, 92, 246, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.5)',
        '3d-pink': '0 8px 0 #be185d, 0 16px 25px rgba(236, 72, 153, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.5)',
        '3d-yellow': '0 8px 0 #ca8a04, 0 16px 25px rgba(250, 204, 21, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.8)',
        '3d-card': '0 20px 40px -15px rgba(15, 23, 42, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.8), inset 0 2px 4px rgba(255, 255, 255, 0.95)',
        '3d-card-hover': '0 30px 60px -12px rgba(37, 99, 235, 0.25), 0 0 0 2px rgba(59, 130, 246, 0.4), inset 0 2px 6px rgba(255, 255, 255, 0.95)',
        '3d-card-dark': '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.15), inset 0 2px 4px rgba(255, 255, 255, 0.2)',
        'plastic-badge': '0 6px 16px -2px rgba(0, 0, 0, 0.12), inset 0 2px 3px rgba(255, 255, 255, 0.8)',
        'glow-cyan': '0 0 35px rgba(6, 182, 212, 0.55)',
        'glow-blue': '0 0 35px rgba(37, 99, 235, 0.55)',
        'glow-pink': '0 0 35px rgba(236, 72, 153, 0.55)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-reverse': 'float-reverse 7s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 18s linear infinite',
        'wiggle': 'wiggle 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-14px) rotate(2deg)' },
        },
        'float-reverse': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(14px) rotate(-2deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
    },
  },
  plugins: [],
};
