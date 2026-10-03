"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastMessage {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, "id">) => void;
  removeToast: (id: string) => void;
  success: (message: string, title?: string, duration?: number) => void;
  error: (message: string, title?: string, duration?: number) => void;
  info: (message: string, title?: string, duration?: number) => void;
  warning: (message: string, title?: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Global trigger fallback for helper object
let globalAddToast: ((toast: Omit<ToastMessage, "id">) => void) | null = null;

export const toast = {
  success: (message: string, title?: string, duration?: number) => {
    if (globalAddToast) globalAddToast({ type: "success", message, title, duration });
  },
  error: (message: string, title?: string, duration?: number) => {
    if (globalAddToast) globalAddToast({ type: "error", message, title, duration });
  },
  info: (message: string, title?: string, duration?: number) => {
    if (globalAddToast) globalAddToast({ type: "info", message, title, duration });
  },
  warning: (message: string, title?: string, duration?: number) => {
    if (globalAddToast) globalAddToast({ type: "warning", message, title, duration });
  },
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    ({ type, message, title, duration = 4000 }: Omit<ToastMessage, "id">) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastMessage = { id, type, message, title, duration };

      setToasts((prev) => [...prev.slice(-4), newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  globalAddToast = addToast;

  const success = useCallback(
    (message: string, title?: string, duration?: number) => {
      addToast({ type: "success", message, title, duration });
    },
    [addToast]
  );

  const error = useCallback(
    (message: string, title?: string, duration?: number) => {
      addToast({ type: "error", message, title, duration });
    },
    [addToast]
  );

  const info = useCallback(
    (message: string, title?: string, duration?: number) => {
      addToast({ type: "info", message, title, duration });
    },
    [addToast]
  );

  const warning = useCallback(
    (message: string, title?: string, duration?: number) => {
      addToast({ type: "warning", message, title, duration });
    },
    [addToast]
  );

  return (
    <ToastContext.Provider
      value={{ toasts, addToast, removeToast, success, error, info, warning }}
    >
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      toasts: [],
      addToast: (t: any) => globalAddToast && globalAddToast(t),
      removeToast: () => {},
      success: toast.success,
      error: toast.error,
      info: toast.info,
      warning: toast.warning,
    };
  }
  return context;
};

const ToastContainer: React.FC<{
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}> = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="assertive"
      className="fixed top-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-md w-full pointer-events-none p-4 sm:p-0"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{
  toast: ToastMessage;
  onRemove: (id: string) => void;
}> = ({ toast, onRemove }) => {
  const getStyles = () => {
    switch (toast.type) {
      case "success":
        return {
          bg: "bg-white border-emerald-200 shadow-xl shadow-emerald-500/10",
          iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
          icon: CheckCircle2,
          titleColor: "text-emerald-900",
        };
      case "error":
        return {
          bg: "bg-white border-rose-200 shadow-xl shadow-rose-500/10",
          iconBg: "bg-rose-50 text-[#980e27] border-rose-100",
          icon: AlertCircle,
          titleColor: "text-rose-950",
        };
      case "warning":
        return {
          bg: "bg-white border-amber-200 shadow-xl shadow-amber-500/10",
          iconBg: "bg-amber-50 text-amber-600 border-amber-100",
          icon: AlertTriangle,
          titleColor: "text-amber-950",
        };
      case "info":
      default:
        return {
          bg: "bg-white border-blue-200 shadow-xl shadow-blue-500/10",
          iconBg: "bg-blue-50 text-blue-600 border-blue-100",
          icon: Info,
          titleColor: "text-blue-950",
        };
    }
  };

  const style = getStyles();
  const Icon = style.icon;

  return (
    <div
      className={`pointer-events-auto relative flex items-start gap-3 p-4 rounded-xl border ${style.bg} transition-all duration-300 animate-in fade-in slide-in-from-top-3 select-none`}
    >
      <div className={`p-2 rounded-lg border ${style.iconBg} shrink-0 mt-0.5`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 pr-6 min-w-0">
        {toast.title && (
          <h4 className={`text-xs font-bold ${style.titleColor} mb-0.5 uppercase tracking-wider`}>
            {toast.title}
          </h4>
        )}
        <p className="text-xs text-[#334155] font-medium leading-relaxed break-words">
          {toast.message}
        </p>
      </div>
      <button
        type="button"
        onClick={() => onRemove(toast.id)}
        className="absolute top-3 right-3 p-1 text-[#94A3B8] hover:text-[#172126] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default ToastProvider;