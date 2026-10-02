import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
const ToastContext = createContext(undefined);
export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);
    const showToast = useCallback((message, type = 'info', title) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, type, title, message }]);
        setTimeout(() => {
            removeToast(id);
        }, 5000);
    }, [removeToast]);
    const success = useCallback((msg, title = 'Success') => showToast(msg, 'success', title), [showToast]);
    const error = useCallback((msg, title = 'Error') => showToast(msg, 'error', title), [showToast]);
    const warning = useCallback((msg, title = 'Warning') => showToast(msg, 'warning', title), [showToast]);
    const info = useCallback((msg, title = 'Notice') => showToast(msg, 'info', title), [showToast]);
    return (<ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full px-4 pointer-events-none">
        {toasts.map((toast) => {
            const styles = {
                success: 'bg-emerald-50 border-emerald-500 text-emerald-900',
                error: 'bg-rose-50 border-rose-500 text-rose-900',
                warning: 'bg-amber-50 border-amber-500 text-amber-900',
                info: 'bg-blue-50 border-blue-500 text-blue-900',
            }[toast.type];
            const Icon = {
                success: CheckCircle2,
                error: AlertCircle,
                warning: AlertTriangle,
                info: Info,
            }[toast.type];
            return (<div key={toast.id} className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg transition-all animate-in slide-in-from-bottom-2 ${styles}`}>
              <Icon className="w-5 h-5 flex-shrink-0 mt-0.5"/>
              <div className="flex-1">
                {toast.title && <h4 className="font-semibold text-sm">{toast.title}</h4>}
                <p className="text-xs md:text-sm leading-relaxed">{toast.message}</p>
              </div>
              <button onClick={() => removeToast(toast.id)} className="text-slate-400 hover:text-slate-600 transition p-1" aria-label="Dismiss toast">
                <X className="w-4 h-4"/>
              </button>
            </div>);
        })}
      </div>
    </ToastContext.Provider>);
};
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};
