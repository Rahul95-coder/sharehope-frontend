import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { HeartHandshake, Lock, Mail, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../api/client';
export const LoginPage = () => {
    const { login } = useAuth();
    const { success, error: toastError } = useToast();
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const searchParams = new URLSearchParams(location.search);
    const isSessionExpired = searchParams.get('expired') === 'true';
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setIsLoading(true);
        try {
            const response = await api.post('/auth/login', { email, password });
            if (response.data?.success) {
                const { token, user } = response.data.data;
                login(token, user);
                success(`Welcome back, ${user.name}!`);
                // Route to role-specific dashboard
                const dashboardMap = {
                    ADMIN: '/admin/dashboard',
                    DONOR: '/donor/dashboard',
                    NGO: '/ngo/dashboard',
                    VOLUNTEER: '/',
                };
                navigate(dashboardMap[user.role] || '/');
            }
        }
        catch (err) {
            const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
            setErrorMessage(msg);
            toastError(msg);
        }
        finally {
            setIsLoading(false);
        }
    };
    // Demo credentials quick filler
    const fillDemo = (demoEmail, demoPass) => {
        setEmail(demoEmail);
        setPassword(demoPass);
        setErrorMessage('');
    };
    return (<div className="min-h-screen bg-[#FCF9F8] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <HeartHandshake className="w-7 h-7"/>
          </div>
          <span className="text-3xl font-extrabold tracking-tight text-slate-900">
            Share<span className="text-primary">Hope</span>
          </span>
        </Link>
        <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Or{' '}
          <Link to="/register" className="font-semibold text-primary hover:text-primary-dark transition">
            create a new account for free
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        {isSessionExpired && (<div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0"/>
            <span>Your session has expired. Please sign in again.</span>
          </div>)}

        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-surface-border shadow-xl shadow-slate-200/50">
          {errorMessage && (<div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600 mt-0.5"/>
              <span>{errorMessage}</span>
            </div>)}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-3"/>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@organization.com" className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition"/>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Password
                </label>
                <span className="text-xs text-slate-400">Min 6 characters</span>
              </div>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3"/>
                <input type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full pl-11 pr-11 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition"/>
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 transition" aria-label="Toggle password visibility">
                  {showPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-md shadow-primary/20 transition disabled:opacity-50">
              {isLoading ? ('Signing in...') : (<>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4"/>
                </>)}
            </button>
          </form>

          {/* Quick Demo Access Bar */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 text-center">
              Quick Test Accounts
            </p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button type="button" onClick={() => fillDemo('admin@sharehope.org', 'Admin@123456')} className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left font-medium text-slate-800 transition">
                <span className="block font-bold text-rose-700">Admin</span>
                <span className="text-[10px] text-slate-500">Full system control</span>
              </button>
              <button type="button" onClick={() => fillDemo('rajhans@example.com', 'Donor@123')} className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left font-medium text-slate-800 transition">
                <span className="block font-bold text-emerald-700">Donor (Hotel)</span>
                <span className="text-[10px] text-slate-500">Post surplus food</span>
              </button>
              <button type="button" onClick={() => fillDemo('annapurna@example.com', 'NGO@123')} className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left font-medium text-slate-800 transition">
                <span className="block font-bold text-amber-700">NGO (Annapurna)</span>
                <span className="text-[10px] text-slate-500">Claim donations</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>);
};
