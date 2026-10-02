import React from 'react';
import { Inbox } from 'lucide-react';
export const EmptyState = ({ icon: Icon = Inbox, title, description, actionText, onAction, className = '', }) => {
    return (<div className={`flex flex-col items-center justify-center p-8 text-center bg-white rounded-2xl border border-surface-border my-4 ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-primary-50 text-primary flex items-center justify-center mb-4">
        <Icon className="w-8 h-8"/>
      </div>
      <h3 className="text-base font-bold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionText && onAction && (<button onClick={onAction} className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-medium text-sm transition shadow-sm">
          {actionText}
        </button>)}
    </div>);
};
