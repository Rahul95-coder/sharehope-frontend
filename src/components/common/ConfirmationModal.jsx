import React from 'react';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { Modal } from './Modal';
export const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', variant = 'danger', isLoading = false, }) => {
    const Icon = {
        danger: AlertCircle,
        warning: AlertTriangle,
        info: Info,
    }[variant];
    const iconColors = {
        danger: 'bg-rose-100 text-rose-600',
        warning: 'bg-amber-100 text-amber-600',
        info: 'bg-blue-100 text-blue-600',
    }[variant];
    const buttonColors = {
        danger: 'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-300',
        warning: 'bg-amber-600 hover:bg-amber-700 text-white focus:ring-amber-300',
        info: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-300',
    }[variant];
    return (<Modal isOpen={isOpen} onClose={onClose} maxWidth="sm">
      <div className="flex flex-col items-center text-center">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${iconColors}`}>
          <Icon className="w-6 h-6"/>
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-sm text-slate-600 mb-6 leading-relaxed whitespace-pre-line">{message}</p>
        <div className="flex gap-3 w-full">
          <button type="button" onClick={onClose} disabled={isLoading} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition text-sm disabled:opacity-50">
            {cancelText}
          </button>
          <button type="button" onClick={onConfirm} disabled={isLoading} className={`flex-1 px-4 py-2.5 rounded-xl font-medium transition text-sm shadow-sm focus:outline-none focus:ring-2 disabled:opacity-50 ${buttonColors}`}>
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </Modal>);
};
