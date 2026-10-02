import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary', // primary | secondary | outline | ghost | danger | accent | vibrant | amber
  size = 'md', // sm | md | lg | icon
  isLoading = false,
  disabled = false,
  className = '',
  icon: Icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-95 cursor-pointer";

  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-5 py-2.5 text-base gap-2.5",
    icon: "p-2 text-sm justify-center w-8 h-8 rounded-lg"
  };

  const variants = {
    primary: "bg-slate-900 hover:bg-slate-800 text-white shadow-sm shadow-slate-900/20 focus:ring-slate-400 dark:bg-indigo-600 dark:hover:bg-indigo-500 dark:text-white dark:shadow-indigo-500/25",
    vibrant: "bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/40 border border-white/15",
    amber: "bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-semibold focus:ring-amber-400 dark:bg-amber-950/70 dark:text-amber-200 dark:border-amber-800",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 active:bg-slate-200/80 focus:ring-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700/60",
    outline: "border border-slate-200/90 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-700 hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 focus:ring-slate-300 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
    ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-300 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100",
    danger: "bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white shadow-md shadow-rose-500/25 hover:shadow-rose-500/40 focus:ring-rose-500",
    accent: "bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-md shadow-teal-500/25 focus:ring-teal-500"
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${sizes[size]} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin text-current" />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-3.5 h-3.5 shrink-0" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="w-3.5 h-3.5 shrink-0" />}
        </>
      )}
    </button>
  );
};
