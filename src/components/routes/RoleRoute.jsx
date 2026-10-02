import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
export const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();
    if (isLoading) {
        return (<div className="min-h-screen flex items-center justify-center bg-surface-bg">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 text-sm font-medium">Checking authorization...</p>
        </div>
      </div>);
    }
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace/>;
    }
    return children ? <>{children}</> : <Outlet />;
};
export const RoleRoute = ({ allowedRoles, children }) => {
    const { user, isAuthenticated, isLoading } = useAuth();
    if (isLoading) {
        return (<div className="min-h-screen flex items-center justify-center bg-surface-bg">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 text-sm font-medium">Verifying role permissions...</p>
        </div>
      </div>);
    }
    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace/>;
    }
    if (!allowedRoles.includes(user.role)) {
        // Redirect to their own dashboard
        const dashboardMap = {
            ADMIN: '/admin/dashboard',
            DONOR: '/donor/dashboard',
            NGO: '/ngo/dashboard',
            VOLUNTEER: '/',
        };
        return <Navigate to={dashboardMap[user.role] || '/'} replace/>;
    }
    return children ? <>{children}</> : <Outlet />;
};
export const PublicOnlyRoute = ({ children }) => {
    const { user, isAuthenticated, isLoading } = useAuth();
    if (isLoading) {
        return null;
    }
    if (isAuthenticated && user) {
        const dashboardMap = {
            ADMIN: '/admin/dashboard',
            DONOR: '/donor/dashboard',
            NGO: '/ngo/dashboard',
            VOLUNTEER: '/',
        };
        return <Navigate to={dashboardMap[user.role] || '/'} replace/>;
    }
    return children ? <>{children}</> : <Outlet />;
};
