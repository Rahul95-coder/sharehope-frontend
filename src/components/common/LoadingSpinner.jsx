import React from 'react';
export const LoadingSpinner = ({ size = 'md', className = '', }) => {
    const sizeClasses = {
        sm: 'w-4 h-4 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-4',
    }[size];
    return (<div className={`rounded-full border-primary border-t-transparent animate-spin ${sizeClasses} ${className}`} role="status">
      <span className="sr-only">Loading...</span>
    </div>);
};
export const CardSkeleton = ({ count = 3 }) => {
    return (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (<div key={i} className="bg-white rounded-2xl border border-surface-border p-5 space-y-4 animate-pulse">
          <div className="h-44 bg-slate-100 rounded-xl w-full"></div>
          <div className="space-y-2">
            <div className="h-4 bg-slate-100 rounded w-3/4"></div>
            <div className="h-3 bg-slate-100 rounded w-1/2"></div>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-slate-100">
            <div className="h-6 bg-slate-100 rounded-full w-20"></div>
            <div className="h-8 bg-slate-100 rounded-xl w-24"></div>
          </div>
        </div>))}
    </div>);
};
