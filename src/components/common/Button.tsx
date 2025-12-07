import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import clsx from 'clsx';

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'neutral' | 'ghost' | 'link' | 'info' | 'success' | 'warning' | 'error';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  outline?: boolean;
  loading?: boolean;
  disabled?: boolean;
  wide?: boolean;
  block?: boolean;
  circle?: boolean;
  square?: boolean;
  glass?: boolean;
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  outline = false,
  loading = false,
  disabled = false,
  wide = false,
  block = false,
  circle = false,
  square = false,
  glass = false,
  className,
  ...props
}: ButtonProps) => {
  const buttonClasses = clsx(
    'btn',
    {
      [`btn-${variant}`]: variant,
      [`btn-${size}`]: size,
      'btn-outline': outline,
      'btn-wide': wide,
      'btn-block': block,
      'btn-circle': circle,
      'btn-square': square,
      'glass': glass,
      'loading': loading,
    },
    className
  );

  return (
    <button 
      className={buttonClasses} 
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="loading loading-spinner"></span>
          {children}
        </>
      ) : (
        children
      )}
    </button>
  );
};