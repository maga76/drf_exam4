import React from 'react';

export const Badge = ({
  children,
  variant = 'neutral', // primary | accent | success | warning | danger | neutral | purple
  size = 'md', // sm | md | lg
  dot = false,
  className = ''
}) => {
  const sizes = {
    sm: "px-2 py-0.5 text-xs font-medium rounded-md gap-1",
    md: "px-2.5 py-1 text-xs font-semibold rounded-lg gap-1.5",
    lg: "px-3 py-1.5 text-sm font-semibold rounded-lg gap-2"
  };

  const variants = {
    primary: "bg-indigo-50 text-indigo-700 border border-indigo-200/80 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800/60",
    accent: "bg-teal-50 text-teal-700 border border-teal-200/80 dark:bg-teal-950/50 dark:text-teal-300 dark:border-teal-800/60",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/60",
    warning: "bg-amber-50 text-amber-700 border border-amber-200/80 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800/60",
    danger: "bg-rose-50 text-rose-700 border border-rose-200/80 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800/60",
    purple: "bg-purple-50 text-purple-700 border border-purple-200/80 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800/60",
    neutral: "bg-slate-100 text-slate-700 border border-slate-200/80 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700"
  };

  const dotColors = {
    primary: "bg-indigo-500",
    accent: "bg-teal-500",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-rose-500",
    purple: "bg-purple-500",
    neutral: "bg-slate-400"
  };

  return (
    <span className={`inline-flex items-center tracking-tight transition-colors ${sizes[size]} ${variants[variant]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[variant] || 'bg-current'}`} />}
      {children}
    </span>
  );
};
