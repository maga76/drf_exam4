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
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]";

  const sizes = {
    sm: "px-2.5 py-1.5 text-xs gap-1.5",
    md: "px-3.5 py-2 text-sm gap-2",
    lg: "px-5 py-2.5 text-base gap-2",
    icon: "p-2 text-sm justify-center w-8 h-8"
  };

  const variants = {
    primary: "bg-slate-900 hover:bg-slate-800 text-white shadow-xs focus:ring-slate-400 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white",
    vibrant: "bg-slate-900 hover:bg-slate-800 text-white shadow-xs focus:ring-slate-400 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white",
    amber: "bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-medium focus:ring-amber-400 dark:bg-amber-950/70 dark:text-amber-200 dark:border-amber-800",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 active:bg-slate-200/80 focus:ring-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700",
    outline: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 focus:ring-slate-300 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
    ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-300 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100",
    danger: "bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 shadow-xs focus:ring-rose-500",
    accent: "bg-teal-600 text-white hover:bg-teal-700 active:bg-teal-800 shadow-xs focus:ring-teal-500"
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
