import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        // A corrupted value in localStorage used to crash the whole app on load (blank page).
        try {
            const saved = localStorage.getItem('sharehope_user');
            return saved ? JSON.parse(saved) : null;
        }
        catch {
            localStorage.removeItem('sharehope_user');
            return null;
        }
    });
    const [token, setToken] = useState(() => {
        return localStorage.getItem('sharehope_token');
    });
    const [isLoading, setIsLoading] = useState(true);
    const refreshUser = async () => {
        const storedToken = localStorage.getItem('sharehope_token');
        if (!storedToken) {
            setUser(null);
            setIsLoading(false);
            return;
        }
        try {
            const response = await api.get('/auth/me');
            if (response.data?.success && response.data?.data?.user) {
                const freshUser = response.data.data.user;
                setUser(freshUser);
                localStorage.setItem('sharehope_user', JSON.stringify(freshUser));
            }
        }
        catch (error) {
            console.error('Failed to verify token', error);
            // Only end the session when the server says the token is bad. A network error, a
            // sleeping free-tier server or a 5xx must NOT log the user out.
            const status = error.response?.status;
            if (status === 401 || status === 403) {
                logout();
            }
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        refreshUser();
    }, []);
    const login = (newToken, newUser) => {
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('sharehope_token', newToken);
        localStorage.setItem('sharehope_user', JSON.stringify(newUser));
    };
    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('sharehope_token');
        localStorage.removeItem('sharehope_user');
    };
    const updateUser = (updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem('sharehope_user', JSON.stringify(updatedUser));
    };
    const isAuthenticated = !!token && !!user;
    const isVerified = user?.status === 'VERIFIED';
    return (<AuthContext.Provider value={{
            user,
            token,
            isLoading,
            isAuthenticated,
            isVerified,
            login,
            logout,
            updateUser,
            refreshUser,
        }}>
      {children}
    </AuthContext.Provider>);
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
