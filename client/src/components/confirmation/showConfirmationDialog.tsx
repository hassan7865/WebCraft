import toast from 'react-hot-toast';
import ConfirmationToast from './confirmationDialog';


interface ShowConfirmationToastProps {
  title?: string;
  message?: string;
  type?: string;
  variant?: 'danger' | 'warning' | 'info' | 'default';
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export const showConfirmationToast = ({
  title = 'Confirmation',
  message = 'Are you sure you want to proceed?',
  type = 'default',
  variant = 'danger',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}: ShowConfirmationToastProps): Promise<boolean> => {
  return new Promise((resolve) => {
    toast((t) => (
      <ConfirmationToast
        t={t}
        title={title}
        message={message}
        type={type}
        variant={variant}
        confirmText={confirmText}
        cancelText={cancelText}
        onConfirm={() => {
          onConfirm?.();
          resolve(true);
        }}
        onCancel={() => {
          onCancel?.();
          resolve(false);
        }}
      />
    ), {
      duration: Infinity,
      style: {
        background: 'transparent',
        boxShadow: 'none',
        padding: 0,
      },
    });
  });
};
