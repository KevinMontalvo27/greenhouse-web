import { type InputHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

export type InputSize = 'xs' | 'sm' | 'md' | 'lg';
export type InputVariant = 'bordered' | 'ghost' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: InputVariant;
  inputSize?: InputSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      variant = 'bordered',
      inputSize = 'md',
      leftIcon,
      rightIcon,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputClasses = clsx(
      'input',
      {
        [`input-${variant}`]: variant,
        [`input-${inputSize}`]: inputSize,
        'input-error': error,
      },
      className
    );

    return (
      <div className="form-control w-full">
        {label && (
          <label className="label">
            <span className="label-text">{label}</span>
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            className={clsx(inputClasses, {
              'pl-10': leftIcon,
              'pr-10': rightIcon,
            })}
            disabled={disabled}
            {...props}
          />

          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>

        {(error || helperText) && (
          <label className="label">
            {error ? (
              <span className="label-text-alt text-error">{error}</span>
            ) : (
              <span className="label-text-alt">{helperText}</span>
            )}
          </label>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';