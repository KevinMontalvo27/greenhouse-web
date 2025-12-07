// src/components/common/Loader/Loader.tsx
import clsx from 'clsx';

export type LoaderType = 'spinner' | 'dots' | 'ring' | 'ball' | 'bars' | 'infinity';
export type LoaderSize = 'xs' | 'sm' | 'md' | 'lg';
export type LoaderVariant = 'primary' | 'secondary' | 'accent' | 'neutral' | 'info' | 'success' | 'warning' | 'error';

interface LoaderProps {
  type?: LoaderType;
  size?: LoaderSize;
  variant?: LoaderVariant;
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

export const Loader = ({
  type = 'spinner',
  size = 'md',
  variant,
  text,
  fullScreen = false,
  className,
}: LoaderProps) => {
  const loaderClasses = clsx(
    'loading',
    `loading-${type}`,
    `loading-${size}`,
    {
      [`text-${variant}`]: variant,
    },
    className
  );

  const loader = (
    <div className={clsx('flex flex-col items-center justify-center gap-4', {
      'min-h-screen': fullScreen,
    })}>
      <span className={loaderClasses}></span>
      {text && <p className="text-base-content/70">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-base-300/50 backdrop-blur-sm z-50 flex items-center justify-center">
        {loader}
      </div>
    );
  }

  return loader;
};

// Componente para estados de carga en secciones
interface LoadingSectionProps {
  isLoading: boolean;
  children: React.ReactNode;
  loader?: React.ReactNode;
}

export const LoadingSection = ({ isLoading, children, loader }: LoadingSectionProps) => {
  if (isLoading) {
    return loader || <Loader />;
  }

  return <>{children}</>;
};