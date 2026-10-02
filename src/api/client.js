import axios from 'axios';
const getBaseURL = () => {
    const envUrl = import.meta.env.VITE_API_URL;
    if (!envUrl) return '/api';
    const trimmed = envUrl.trim().replace(/\/$/, '');
    return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};

const api = axios.create({
    baseURL: getBaseURL(),
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});
// Request interceptor to attach JWT token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('sharehope_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));
// Response interceptor to handle session expiration or standard errors
api.interceptors.response.use((response) => response, (error) => {
    if (error.response?.status === 401) {
        // Don't auto-redirect if checking auth or on login page
        const isAuthCheck = error.config?.url?.includes('/auth/me');
        const isLoginPage = window.location.pathname === '/login';
        if (!isAuthCheck && !isLoginPage) {
            localStorage.removeItem('sharehope_token');
            localStorage.removeItem('sharehope_user');
            window.location.href = '/login?expired=true';
        }
    }
    return Promise.reject(error);
});
export default api;
