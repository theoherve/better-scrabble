import { Toast } from "./Toast";

interface ToastContainerProps {
  toasts: Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
    position?: 'left' | 'right';
  }>;
  onRemove: (id: string) => void;
}

export const ToastContainer = ({ toasts, onRemove }: ToastContainerProps) => {
  const leftToasts = toasts.filter(toast => toast.position === 'left');
  const rightToasts = toasts.filter(toast => toast.position !== 'left');

  return (
    <>
      {/* Toasts à gauche */}
      <div className="fixed top-4 left-4 z-50 space-y-2">
        {leftToasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            position="left"
            onClose={() => onRemove(toast.id)}
          />
        ))}
      </div>
      
      {/* Toasts à droite */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {rightToasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            position="right"
            onClose={() => onRemove(toast.id)}
          />
        ))}
      </div>
    </>
  );
}; 