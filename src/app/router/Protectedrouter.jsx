import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../../features/auth/authStore";
import { Loader } from "lucide-react";


export const Protectedrouter = () => {
    const location = useLocation();

    const user = useAuthStore((state) => state.user);
    const isInitializing = useAuthStore(
        (state) => state.isInitializing
    );
    // Don't decide anything while checking the session
    if (isInitializing) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader className="h-6 w-6 animate-spin text-primary" />
            </div>
        );
    }

    // Initialization finished and no user
    if (!user) {
        return (
            <Navigate
                to="/auth"
                state={{ from: location }}
                replace
            />
        );
    }
    return <Outlet />;
};