import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../features/auth/authStore";

export const AuthRouter = () => {
    const user = useAuthStore((state) => state.user);
    const isInitializing = useAuthStore(
        (state) => state.isInitializing
    );

    if (isInitializing) {
        return <div>Checking authentication...</div>;
    }

    // Already logged in
    if (user) {
        if (user.role === "ADMIN") {
            return <Navigate to="/dashboard-admin" replace />;
        }

        if (user.role === "NGO") {
            return <Navigate to="/dashboard-ngo" replace />;
        }

        if (user.role === "DONOR") {
            return <Navigate to="/dashboard-donor" replace />;
        }
    }

    return <Outlet />;
};