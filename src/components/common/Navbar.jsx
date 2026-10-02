import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { HeartHandshake, Menu, X, Bell, LogOut, ShieldAlert, LayoutDashboard, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from './Badge';
import api from '../../api/client';
export const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    useEffect(() => {
        if (isAuthenticated) {
            const fetchUnread = async () => {
                try {
                    const res = await api.get('/notifications/unread-count');
                    if (res.data?.success) {
                        setUnreadCount(res.data.data.count);
                    }
                }
                catch (_) { }
            };
            fetchUnread();
            const interval = setInterval(fetchUnread, 30000);
            return () => clearInterval(interval);
        }
    }, [isAuthenticated, location.pathname]);
    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    const getDashboardLink = () => {
        if (!user)
            return '/login';
        switch (user.role) {
            case 'ADMIN': return '/admin/dashboard';
            case 'DONOR': return '/donor/dashboard';
            case 'NGO': return '/ngo/dashboard';
            case 'VOLUNTEER': return '/';
            default: return '/';
        }
    };
    return (<>
      {/* Verification notice bar for pending accounts */}
      {isAuthenticated && user?.status === 'PENDING' && (<div className="bg-amber-500 text-white px-4 py-2 text-xs md:text-sm font-medium flex items-center justify-center gap-2 shadow-inner">
          <AlertCircle className="w-4 h-4 flex-shrink-0"/>
          <span>Your account is currently under review by our administration. Some features are restricted until verified.</span>
        </div>)}
      {isAuthenticated && user?.status === 'REJECTED' && (<div className="bg-rose-600 text-white px-4 py-2 text-xs md:text-sm font-medium flex items-center justify-center gap-2 shadow-inner">
          <ShieldAlert className="w-4 h-4 flex-shrink-0"/>
          <span>Your organization verification was rejected. Reason: {user.rejectionReason || 'Please contact support.'}</span>
        </div>)}

      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-surface-border transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20 group-hover:scale-105 transition">
                <HeartHandshake className="w-6 h-6"/>
              </div>
              <div>
                <span className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 group-hover:text-primary transition font-sans">
                  Share<span className="text-primary">Hope</span>
                </span>
                <span className="hidden sm:block text-[10px] uppercase tracking-wider font-bold text-ochre -mt-1">
                  Surplus Rescue
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className={`text-sm font-medium transition ${location.pathname === '/' ? 'text-primary font-bold' : 'text-slate-600 hover:text-primary'}`}>
                Home
              </Link>
              <Link to="/how-it-works" className={`text-sm font-medium transition ${location.pathname === '/how-it-works' ? 'text-primary font-bold' : 'text-slate-600 hover:text-primary'}`}>
                How It Works
              </Link>
              <Link to="/impact" className={`text-sm font-medium transition ${location.pathname === '/impact' ? 'text-primary font-bold' : 'text-slate-600 hover:text-primary'}`}>
                Impact
              </Link>
              <Link to="/about" className={`text-sm font-medium transition ${location.pathname === '/about' ? 'text-primary font-bold' : 'text-slate-600 hover:text-primary'}`}>
                About
              </Link>
              <Link to="/contact" className={`text-sm font-medium transition ${location.pathname === '/contact' ? 'text-primary font-bold' : 'text-slate-600 hover:text-primary'}`}>
                Contact
              </Link>
            </nav>

            {/* Auth Buttons / Profile */}
            <div className="hidden md:flex items-center gap-4">
              {isAuthenticated && user ? (<div className="flex items-center gap-3">
                  {/* Notification Bell */}
                  <Link to="/notifications" className="relative p-2 rounded-xl text-slate-500 hover:text-primary hover:bg-primary-50 transition" title="Notifications">
                    <Bell className="w-5 h-5"/>
                    {unreadCount > 0 && (<span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-rose-500 rounded-full animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>)}
                  </Link>

                  {/* Dashboard link */}
                  <Link to={getDashboardLink()} className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-primary-50 hover:bg-primary-100 text-primary font-semibold text-sm transition">
                    <LayoutDashboard className="w-4 h-4"/>
                    Dashboard
                  </Link>

                  {/* Role indicator & Logout */}
                  <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-800 leading-tight">{user.name}</p>
                      <Badge size="sm" variant={user.role === 'ADMIN' ? 'danger' : 'default'}>
                        {user.role}
                      </Badge>
                    </div>
                    <button onClick={handleLogout} className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition" title="Sign Out">
                      <LogOut className="w-4 h-4"/>
                    </button>
                  </div>
                </div>) : (<div className="flex items-center gap-3">
                  <Link to="/login" className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-primary transition">
                    Sign In
                  </Link>
                  <Link to="/register" className="px-5 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-xl shadow-sm transition">
                    Join ShareHope
                  </Link>
                </div>)}
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex items-center gap-2 md:hidden">
              {isAuthenticated && (<Link to="/notifications" className="relative p-2 rounded-lg text-slate-600 hover:text-primary">
                  <Bell className="w-5 h-5"/>
                  {unreadCount > 0 && (<span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full"></span>)}
                </Link>)}
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-lg text-slate-600 hover:text-primary hover:bg-slate-100 transition" aria-label="Toggle menu">
                {mobileMenuOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (<div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-4">
            <nav className="flex flex-col space-y-2">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg font-medium text-slate-700 hover:bg-primary-50 hover:text-primary transition">
                Home
              </Link>
              <Link to="/how-it-works" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg font-medium text-slate-700 hover:bg-primary-50 hover:text-primary transition">
                How It Works
              </Link>
              <Link to="/impact" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg font-medium text-slate-700 hover:bg-primary-50 hover:text-primary transition">
                Impact
              </Link>
              <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg font-medium text-slate-700 hover:bg-primary-50 hover:text-primary transition">
                About Us
              </Link>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg font-medium text-slate-700 hover:bg-primary-50 hover:text-primary transition">
                Contact
              </Link>
            </nav>

            <div className="pt-3 border-t border-slate-100">
              {isAuthenticated && user ? (<div className="space-y-2">
                  <div className="px-3 py-2 bg-slate-50 rounded-xl mb-2 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                    <Badge variant="default">{user.role}</Badge>
                  </div>
                  <Link to={getDashboardLink()} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm justify-center">
                    <LayoutDashboard className="w-4 h-4"/>
                    Go to Dashboard
                  </Link>
                  <button onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                }} className="flex items-center gap-2 w-full px-4 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-medium text-sm justify-center transition">
                    <LogOut className="w-4 h-4"/>
                    Sign Out
                  </button>
                </div>) : (<div className="flex flex-col gap-2">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-2.5 font-semibold text-slate-700 border border-slate-200 rounded-xl">
                    Sign In
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-2.5 font-semibold text-white bg-primary rounded-xl">
                    Join ShareHope
                  </Link>
                </div>)}
            </div>
          </div>)}
      </header>
    </>);
};
