// src/components/common/Badge/Badge.tsx
import { type ReactNode } from 'react';
import clsx from 'clsx';

export type BadgeVariant = 'neutral' | 'primary' | 'secondary' | 'accent' | 'ghost' | 'info' | 'success' | 'warning' | 'error';
export type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  outline?: boolean;
  className?: string;
}

export const Badge = ({
  children,
  variant = 'neutral',
  size = 'md',
  outline = false,
  className,
}: BadgeProps) => {
  const badgeClasses = clsx(
    'badge',
    {
      [`badge-${variant}`]: variant,
      [`badge-${size}`]: size,
      'badge-outline': outline,
    },
    className
  );

  return <div className={badgeClasses}>{children}</div>;
};