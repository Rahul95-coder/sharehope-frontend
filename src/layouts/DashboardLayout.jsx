import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Package, CheckCircle2, Users, ShieldCheck, Activity, User as UserIcon, LogOut, Bell, Menu, X, ChevronRight, HeartHandshake, ClipboardList } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/common/Badge';
export const DashboardLayout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    if (!user)
        return null;
    // Define navigation links based on user role
    const getNavItems = () => {
        switch (user.role) {
            case 'DONOR':
                return [
                    { label: 'Dashboard', path: '/donor/dashboard', icon: LayoutDashboard },
                    { label: 'Publish Donation', path: '/donor/donations/create', icon: PlusCircle },
                    { label: 'My Donations', path: '/donor/donations', icon: Package },
                    { label: 'Claimed / Handoffs', path: '/donor/claims', icon: CheckCircle2 },
                    { label: 'My Impact', path: '/donor/impact', icon: Activity },
                    { label: 'Organization Profile', path: '/donor/profile', icon: UserIcon },
                ];
            case 'NGO':
                return [
                    { label: 'NGO Dashboard', path: '/ngo/dashboard', icon: LayoutDashboard },
                    { label: 'Browse Surplus', path: '/ngo/donations', icon: Package },
                    { label: 'Active Claims & Pickups', path: '/ngo/claims', icon: CheckCircle2 },
                    { label: 'Rescue History', path: '/ngo/history', icon: ClipboardList },
                    { label: 'Impact Analytics', path: '/ngo/impact', icon: Activity },
                    { label: 'NGO Profile', path: '/ngo/profile', icon: UserIcon },
                ];
            case 'ADMIN':
                return [
                    { label: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
                    { label: 'Pending Verifications', path: '/admin/verification', icon: ShieldCheck },
                    { label: 'All Users', path: '/admin/users', icon: Users },
                    { label: 'All Donations', path: '/admin/donations', icon: Package },
                    { label: 'Claims Monitor', path: '/admin/claims', icon: CheckCircle2 },
                    { label: 'Impact Analytics', path: '/admin/impact', icon: Activity },
                ];
            default:
                return [];
        }
    };
    const navItems = getNavItems();
    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    return (<div className="min-h-screen bg-[#FCF9F8] flex">
      {/* Mobile backdrop */}
      {sidebarOpen && (<div className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)}/>)}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-surface-border flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div>
          {/* Logo Header */}
          <div className="h-20 flex items-center justify-between px-6 border-b border-surface-border">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-md">
                <HeartHandshake className="w-6 h-6"/>
              </div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 font-sans">
                Share<span className="text-primary">Hope</span>
              </span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 lg:hidden">
              <X className="w-5 h-5"/>
            </button>
          </div>

          {/* User Role Card */}
          <div className="p-4 mx-4 my-4 bg-slate-50 border border-slate-100 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 text-primary font-bold flex items-center justify-center text-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Badge size="sm" variant={user.role === 'ADMIN' ? 'danger' : 'default'}>
                    {user.role}
                  </Badge>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {user.status === 'VERIFIED' ? 'Verified' : user.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="px-4 space-y-1">
            {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (<Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)} className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition ${isActive
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-slate-600 hover:text-primary hover:bg-primary-50'}`}>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`}/>
                  <span>{item.label}</span>
                </Link>);
        })}
          </nav>
        </div>

        {/* Bottom Options */}
        <div className="p-4 border-t border-surface-border space-y-2">
          <Link to="/notifications" className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-600 hover:text-primary hover:bg-slate-50 text-sm font-medium transition">
            <span className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-slate-500"/>
              Notifications
            </span>
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-rose-600 hover:bg-rose-50 text-sm font-medium transition">
            <LogOut className="w-4 h-4"/>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-surface-border flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden">
              <Menu className="w-5 h-5"/>
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
              <Link to="/" className="hover:text-primary">Home</Link>
              <ChevronRight className="w-3.5 h-3.5"/>
              <span className="font-semibold text-slate-800 capitalize">
                {user.role.toLowerCase()} Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/notifications" className="p-2 rounded-xl text-slate-500 hover:text-primary hover:bg-primary-50 transition" title="Notifications">
              <Bell className="w-5 h-5"/>
            </Link>
            <div className="h-6 w-px bg-slate-200"></div>
            <span className="text-xs font-bold text-slate-700 hidden sm:inline">
              {user.address?.city || 'Gujarat, India'}
            </span>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>);
};
