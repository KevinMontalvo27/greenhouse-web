// src/components/common/Modal/Modal.tsx
import { type ReactNode, useEffect } from 'react';
import clsx from 'clsx';
import { Button } from './Button';

export type ModalPosition = 'top' | 'middle' | 'bottom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
  position?: ModalPosition;
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  className?: string;
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  position = 'middle',
  showCloseButton = true,
  closeOnBackdrop = true,
  className,
}: ModalProps) => {
  // Cerrar modal con tecla ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = () => {
    if (closeOnBackdrop) {
      onClose();
    }
  };

  const modalBoxClasses = clsx(
    'modal-box',
    {
      'w-11/12 max-w-sm': size === 'sm',
      'w-11/12 max-w-2xl': size === 'md',
      'w-11/12 max-w-5xl': size === 'lg',
      'w-11/12 max-w-full h-full': size === 'full',
    },
    className
  );

  return (
    <dialog className={clsx('modal', `modal-${position}`, { 'modal-open': isOpen })}>
      <div className={modalBoxClasses}>
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between mb-4">
            {title && <h3 className="font-bold text-lg">{title}</h3>}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              >
                ✕
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="py-4">{children}</div>

        {/* Footer */}
        {footer && <div className="modal-action">{footer}</div>}
      </div>

      {/* Backdrop */}
      <div className="modal-backdrop" onClick={handleBackdropClick}>
        <button className="cursor-default">close</button>
      </div>
    </dialog>
  );
};

// Componente auxiliar para footer común
interface ModalFooterProps {
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
  isLoading?: boolean;
}

export const ModalFooter = ({
  onConfirm,
  onCancel,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmVariant = 'primary',
  isLoading = false,
}: ModalFooterProps) => {
  return (
    <div className="flex gap-2 justify-end">
      {onCancel && (
        <Button variant="ghost" onClick={onCancel} disabled={isLoading}>
          {cancelText}
        </Button>
      )}
      {onConfirm && (
        <Button 
          variant={confirmVariant} 
          onClick={onConfirm} 
          loading={isLoading}
          disabled={isLoading}
        >
          {confirmText}
        </Button>
      )}
    </div>
  );
};