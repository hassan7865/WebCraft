import React from 'react';
import { toast, Toast } from 'react-hot-toast';
import {
  FaTrash,
  FaExclamationTriangle,
  FaInfoCircle,
  FaQuestionCircle,
} from 'react-icons/fa';

type Variant = 'danger' | 'warning' | 'info' | 'default';

interface ConfirmationToastProps {
  t: Toast;
  title: string;
  message: string;
  type?: string;
  variant?: Variant;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const ConfirmationToast: React.FC<ConfirmationToastProps> = ({
  t,
  title,
  message,
  variant = 'danger',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}) => {
  const getIconAndColors = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: <FaTrash size={16} color="#dc2626" />,
          bgColor: '#fee2e2',
          confirmBg: '#dc2626',
          confirmHover: '#b91c1c',
          confirmShadow: 'rgba(220, 38, 38, 0.2)',
          confirmHoverShadow: 'rgba(220, 38, 38, 0.4)',
        };
      case 'warning':
        return {
          icon: <FaExclamationTriangle size={16} color="#d97706" />,
          bgColor: '#fef3c7',
          confirmBg: '#d97706',
          confirmHover: '#b45309',
          confirmShadow: 'rgba(217, 119, 6, 0.2)',
          confirmHoverShadow: 'rgba(217, 119, 6, 0.4)',
        };
      case 'info':
        return {
          icon: <FaInfoCircle size={16} color="#2563eb" />,
          bgColor: '#dbeafe',
          confirmBg: '#2563eb',
          confirmHover: '#1d4ed8',
          confirmShadow: 'rgba(37, 99, 235, 0.2)',
          confirmHoverShadow: 'rgba(37, 99, 235, 0.4)',
        };
      default:
        return {
          icon: <FaQuestionCircle size={16} color="#6b7280" />,
          bgColor: '#f3f4f6',
          confirmBg: '#6b7280',
          confirmHover: '#4b5563',
          confirmShadow: 'rgba(107, 114, 128, 0.2)',
          confirmHoverShadow: 'rgba(107, 114, 128, 0.4)',
        };
    }
  };

  const { icon, bgColor, confirmBg, confirmHover, confirmShadow, confirmHoverShadow } = getIconAndColors();

  const handleConfirm = () => {
    onConfirm?.();
    toast.dismiss(t.id);
  };

  const handleCancel = () => {
    onCancel?.();
    toast.dismiss(t.id);
  };

  return (
    <div
      style={{
        fontFamily: 'system-ui, sans-serif',
        fontSize: '14px',
        color: '#1f2937',
        maxWidth: '360px',
        padding: '20px',
        background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
        border: '1px solid rgba(229, 231, 235, 0.8)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: bgColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '12px',
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        <h4 style={{ fontSize: '15px', fontWeight: 600, margin: 0 }}>{title}</h4>
      </div>

      {/* Message */}
      <p style={{ marginBottom: '20px', color: '#6b7280' }}>{message}</p>

      {/* Buttons */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        <button
          onClick={handleCancel}
          style={{
            backgroundColor: '#ffffff',
            color: '#374151',
            border: '1px solid #d1d5db',
            padding: '8px 16px',
            borderRadius: '8px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            const target = e.currentTarget;
            target.style.backgroundColor = '#f3f4f6';
            target.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            const target = e.currentTarget;
            target.style.backgroundColor = '#ffffff';
            target.style.transform = 'translateY(0)';
          }}
        >
          {cancelText}
        </button>
        <button
          onClick={handleConfirm}
          style={{
            backgroundColor: confirmBg,
            color: '#fff',
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: `0 2px 4px ${confirmShadow}`,
          }}
          onMouseEnter={(e) => {
            const target = e.currentTarget;
            target.style.backgroundColor = confirmHover;
            target.style.boxShadow = `0 4px 12px ${confirmHoverShadow}`;
            target.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            const target = e.currentTarget;
            target.style.backgroundColor = confirmBg;
            target.style.boxShadow = `0 2px 4px ${confirmShadow}`;
            target.style.transform = 'translateY(0)';
          }}
        >
          {confirmText}
        </button>
      </div>
    </div>
  );
};

export default ConfirmationToast;
