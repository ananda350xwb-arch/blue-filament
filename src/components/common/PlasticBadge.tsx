import React from 'react';

interface PlasticBadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'cyan' | 'pink' | 'yellow' | 'purple' | 'green' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export const PlasticBadge: React.FC<PlasticBadgeProps> = ({
  children,
  variant = 'blue',
  size = 'md',
  icon,
  className = '',
  glow = false,
}) => {
  const variantStyles = {
    blue: 'bg-gradient-to-r from-blue-600 to-blue-500 text-white border-blue-400/50 shadow-[0_4px_12px_rgba(37,99,235,0.35)]',
    cyan: 'bg-gradient-to-r from-cyan-500 to-cyan-400 text-cyan-950 font-bold border-cyan-200/60 shadow-[0_4px_12px_rgba(6,182,212,0.4)]',
    pink: 'bg-gradient-to-r from-pink-500 to-rose-400 text-white border-pink-300/50 shadow-[0_4px_12px_rgba(236,72,153,0.35)]',
    yellow: 'bg-gradient-to-r from-yellow-400 to-amber-300 text-amber-950 font-bold border-yellow-100 shadow-[0_4px_12px_rgba(250,204,21,0.4)]',
    purple: 'bg-gradient-to-r from-purple-600 to-violet-500 text-white border-purple-300/50 shadow-[0_4px_12px_rgba(139,92,246,0.35)]',
    green: 'bg-gradient-to-r from-emerald-500 to-teal-400 text-emerald-950 font-bold border-emerald-200 shadow-[0_4px_12px_rgba(16,185,129,0.35)]',
    glass: 'bg-white/15 backdrop-blur-md text-white border-white/30 shadow-[0_4px_15px_rgba(0,0,0,0.2)]',
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1 gap-1 rounded-full',
    md: 'text-sm px-3.5 py-1.5 gap-1.5 rounded-full',
    lg: 'text-base px-4 py-2 gap-2 rounded-full',
  };

  const glowStyle = glow ? 'ring-2 ring-white/40 animate-pulse' : '';

  return (
    <span
      className={`inline-flex items-center font-medium border transition-all duration-300 select-none shadow-plastic-badge ${variantStyles[variant]} ${sizeStyles[size]} ${glowStyle} ${className}`}
      style={{
        boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.6), 0 4px 10px rgba(0, 0, 0, 0.2)'
      }}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
