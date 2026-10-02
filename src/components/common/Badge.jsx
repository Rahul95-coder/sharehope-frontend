import React from 'react';
export const Badge = ({ children, variant = 'default', size = 'md', className = '' }) => {
    const sizeClasses = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-xs font-semibold',
    }[size];
    const variantClasses = {
        default: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        success: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        warning: 'bg-amber-100 text-amber-900 border-amber-300',
        danger: 'bg-rose-100 text-rose-800 border-rose-300',
        info: 'bg-sky-100 text-sky-800 border-sky-300',
        neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    }[variant];
    return (<span className={`inline-flex items-center gap-1 rounded-full border ${sizeClasses} ${variantClasses} ${className}`}>
      {children}
    </span>);
};
export const StatusBadge = ({ status }) => {
    switch (status) {
        case 'VERIFIED':
        case 'AVAILABLE':
        case 'COMPLETED':
            return <Badge variant="success">{status.replace('_', ' ')}</Badge>;
        case 'PENDING':
        case 'CLAIMED':
        case 'DISPATCHED':
        case 'IN_TRANSIT':
            return <Badge variant="warning">{status.replace('_', ' ')}</Badge>;
        case 'REJECTED':
        case 'SUSPENDED':
        case 'EXPIRED':
        case 'CANCELLED':
            return <Badge variant="danger">{status.replace('_', ' ')}</Badge>;
        default:
            return <Badge variant="neutral">{status}</Badge>;
    }
};
export const UrgencyBadge = ({ urgency }) => {
    switch (urgency) {
        case 'CRITICAL':
            return (<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-600 text-white animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
          CRITICAL
        </span>);
        case 'URGENT':
            return (<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500 text-white">
          URGENT
        </span>);
        case 'EXPIRED':
            return (<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-500 text-white">
          EXPIRED
        </span>);
        default:
            return (<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          NORMAL
        </span>);
    }
};
export const FoodTypeBadge = ({ type }) => {
    if (type === 'VEG') {
        return (<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-emerald-600 text-emerald-800 text-xs font-semibold bg-emerald-50">
        <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
        VEG
      </span>);
    }
    if (type === 'NONVEG') {
        return (<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-rose-600 text-rose-800 text-xs font-semibold bg-rose-50">
        <span className="w-2 h-2 rounded-full bg-rose-600"></span>
        NON-VEG
      </span>);
    }
    return null;
};
