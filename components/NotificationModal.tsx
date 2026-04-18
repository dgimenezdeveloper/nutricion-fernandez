import React from 'react';
import { CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';

type NotificationType = 'success' | 'warning' | 'info' | 'error';

interface NotificationModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: NotificationType;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  showCancel?: boolean;
}

const typeConfig: Record<NotificationType, { icon: React.ElementType; color: string; bgColor: string; borderColor: string }> = {
  success: { icon: CheckCircle, color: 'text-emerald-600', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-500' },
  warning: { icon: AlertTriangle, color: 'text-brand-orange', bgColor: 'bg-orange-50', borderColor: 'border-brand-orange' },
  info: { icon: Info, color: 'text-brand-purple', bgColor: 'bg-brand-light', borderColor: 'border-brand-purple' },
  error: { icon: XCircle, color: 'text-red-500', bgColor: 'bg-red-50', borderColor: 'border-red-500' },
};

const NotificationModal: React.FC<NotificationModalProps> = ({
  open,
  onClose,
  title,
  message,
  type = 'info',
  confirmLabel = 'Aceptar',
  cancelLabel = 'Cancelar',
  onConfirm,
  showCancel = false,
}) => {
  if (!open) return null;

  const config = typeConfig[type];
  const IconComponent = config.icon;

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60] p-4" onClick={onClose}>
      <div className={`bg-white rounded-2xl shadow-2xl w-full max-w-sm relative animate-fade-in border-t-4 ${config.borderColor}`} onClick={e => e.stopPropagation()}>
        <div className={`flex flex-col items-center p-6 pb-4 ${config.bgColor} rounded-t-2xl`}>
          <IconComponent size={48} className={config.color} />
          <h3 className={`text-lg font-bold mt-3 ${config.color}`}>{title}</h3>
        </div>
        <div className="p-6 pt-4">
          <p className="text-gray-600 text-center text-sm leading-relaxed">{message}</p>
          <div className={`flex gap-3 mt-6 ${showCancel ? 'justify-between' : 'justify-center'}`}>
            {showCancel && (
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold transition-colors"
              >
                {cancelLabel}
              </button>
            )}
            <button
              onClick={handleConfirm}
              className={`flex-1 px-4 py-2.5 rounded-lg text-white font-semibold transition-colors shadow-md ${
                type === 'error' ? 'bg-red-500 hover:bg-red-600' :
                type === 'warning' ? 'bg-brand-orange hover:bg-orange-500' :
                type === 'success' ? 'bg-emerald-500 hover:bg-emerald-600' :
                'bg-brand-purple hover:bg-brand-darkPurple'
              }`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
