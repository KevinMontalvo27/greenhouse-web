// src/components/common/Card/Card.tsx
import { type ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
  children: ReactNode;
  title?: string;
  image?: string;
  imageAlt?: string;
  actions?: ReactNode;
  compact?: boolean;
  bordered?: boolean;
  imageFull?: boolean;
  side?: boolean;
  glass?: boolean;
  className?: string;
}

export const Card = ({
  children,
  title,
  image,
  imageAlt = 'Image',
  actions,
  compact = false,
  bordered = false,
  imageFull = false,
  side = false,
  glass = false,
  className,
}: CardProps) => {
  const cardClasses = clsx(
    'card',
    'bg-base-100',
    'shadow-xl',
    {
      'card-compact': compact,
      'card-bordered': bordered,
      'image-full': imageFull,
      'card-side': side,
      'glass': glass,
    },
    className
  );

  return (
    <div className={cardClasses}>
      {image && (
        <figure>
          <img src={image} alt={imageAlt} className="object-cover" />
        </figure>
      )}

      <div className="card-body">
        {title && <h2 className="card-title">{title}</h2>}
        {children}
        {actions && <div className="card-actions justify-end mt-4">{actions}</div>}
      </div>
    </div>
  );
};

// Subcomponentes opcionales
export const CardTitle = ({ children, className }: { children: ReactNode; className?: string }) => (
  <h2 className={clsx('card-title', className)}>{children}</h2>
);

export const CardActions = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={clsx('card-actions', className)}>{children}</div>
);