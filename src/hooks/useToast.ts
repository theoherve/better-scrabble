import { useState, useCallback } from "react";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
  position?: "left" | "right";
}

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (
      message: string,
      type: Toast["type"] = "info",
      duration = 3000,
      position: "left" | "right" = "right"
    ) => {
      const id = Math.random().toString(36).substr(2, 9);
      const newToast: Toast = { id, message, type, duration, position };

      setToasts((prev) => [...prev, newToast]);

      // Auto-remove after duration
      setTimeout(() => {
        removeToast(id);
      }, duration);
    },
    [removeToast]
  );

  const success = useCallback(
    (message: string, duration?: number, position?: "left" | "right") => {
      addToast(message, "success", duration, position);
    },
    [addToast]
  );

  const error = useCallback(
    (message: string, duration?: number, position?: "left" | "right") => {
      addToast(message, "error", duration, position);
    },
    [addToast]
  );

  const info = useCallback(
    (message: string, duration?: number, position?: "left" | "right") => {
      addToast(message, "info", duration, position);
    },
    [addToast]
  );

  const warning = useCallback(
    (message: string, duration?: number, position?: "left" | "right") => {
      addToast(message, "warning", duration, position);
    },
    [addToast]
  );

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
    warning,
  };
};
