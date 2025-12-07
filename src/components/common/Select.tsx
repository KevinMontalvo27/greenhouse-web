// src/components/common/Select/Select.tsx
import { type SelectHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

export type SelectSize = 'xs' | 'sm' | 'md' | 'lg';
export type SelectVariant = 'bordered' | 'ghost' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: SelectVariant;
  selectSize?: SelectSize;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      variant = 'bordered',
      selectSize = 'md',
      options,
      placeholder = 'Selecciona una opción',
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const selectClasses = clsx(
      'select',
      {
        [`select-${variant}`]: variant,
        [`select-${selectSize}`]: selectSize,
        'select-error': error,
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

        <select
          ref={ref}
          className={selectClasses}
          disabled={disabled}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

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

Select.displayName = 'Select';