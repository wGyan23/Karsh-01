import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 shadow-xs focus-visible:ring-indigo-500',
  secondary:
    'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200/70 focus-visible:ring-indigo-500',
  outline:
    'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 focus-visible:ring-indigo-500',
  ghost:
    'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-indigo-500',
  danger:
    'bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-500',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'min-h-[40px] px-3.5 py-2 text-xs font-medium rounded-lg gap-1.5',
  md: 'min-h-[42px] px-4 py-2 text-sm font-medium rounded-lg gap-2',
  lg: 'min-h-[46px] px-5 py-2.5 text-sm font-semibold rounded-xl gap-2',
};

export function Button({
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  loading = false,
  disabled,
  className = '',
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
      {...rest}
    >
      {loading ? (
        <span
          aria-hidden="true"
          className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin"
        />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!loading && rightIcon}
    </button>
  );
}
