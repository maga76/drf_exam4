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
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.97]";

  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2.5 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5",
    icon: "p-2.5 text-sm justify-center w-10 h-10"
  };

  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-500",
    vibrant: "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/30 focus:ring-indigo-500 hover:shadow-indigo-500/40",
    amber: "bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold shadow-md shadow-amber-400/25 focus:ring-amber-400",
    secondary: "bg-slate-100/90 text-slate-700 hover:bg-slate-200 active:bg-slate-300 focus:ring-slate-400 dark:bg-slate-800/90 dark:text-slate-200 dark:hover:bg-slate-700",
    outline: "border border-slate-300/80 bg-white/80 backdrop-blur-sm text-slate-700 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/50 active:bg-slate-100 focus:ring-indigo-500 dark:bg-slate-900/50 dark:border-white/15 dark:text-slate-200 dark:hover:bg-white/10 dark:hover:border-indigo-400",
    ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-300 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100",
    danger: "bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 shadow-md shadow-rose-500/20 focus:ring-rose-500 dark:bg-rose-600 dark:hover:bg-rose-500",
    accent: "bg-teal-600 text-white hover:bg-teal-700 active:bg-teal-800 shadow-md shadow-teal-500/20 focus:ring-teal-500 dark:bg-teal-600 dark:hover:bg-teal-500"
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
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
        </>
      )}
    </button>
  );
};
