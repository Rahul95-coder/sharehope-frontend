import { useEffect } from "react";
import { api } from "../../lib/axios";
import { useAuthStore } from "../../features/auth/authStore";

export const AuthInitializer = ({ children }) => {
    const setUser = useAuthStore((state) => state.setUser);
    const setInitializing = useAuthStore(
        (state) => state.setInitializing
    );

    useEffect(() => {
        const initAuth = async () => {
            try {
                const res = await api.get("/auth/me", {
                    headers: {
                        "Cache-Control": "no-cache",
                    },
                });
                setUser(res.data.user);
            } catch (error) {
                setUser(null);
            } finally {
                setInitializing(false);
            }
        };

        initAuth();
    }, []);

    return children;
};