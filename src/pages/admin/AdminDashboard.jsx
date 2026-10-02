import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, ShieldCheck, Package, CheckCircle2, Utensils, AlertTriangle, Building2, Building } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
export const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        userStats: {},
        donationStats: {},
        claimStats: {},
        impact: {},
    });
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchAdminStats = async () => {
            try {
                setLoading(true);
                const res = await api.get('/admin/dashboard');
                if (res.data?.success) {
                    setStats(res.data.data);
                }
            }
            catch (err) {
                console.error('Failed to load admin dashboard stats', err);
            }
            finally {
                setLoading(false);
            }
        };
        fetchAdminStats();
    }, []);
    const u = stats.userStats || {};
    const d = stats.donationStats || {};
    const c = stats.claimStats || {};
    const imp = stats.impact || {};
    const pendingDonors = u['DONOR_PENDING'] || 0;
    const pendingNGOs = u['NGO_PENDING'] || 0;
    const totalPending = pendingDonors + pendingNGOs;
    return (<div className="space-y-8">
      {/* Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-surface-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black text-slate-900">Admin Command Center</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200">
              System Administrator
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Platform governance, verification approvals, and rescue monitoring
          </p>
        </div>

        {totalPending > 0 && (<Link to="/admin/verification" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/20 transition">
            <AlertTriangle className="w-4 h-4"/>
            <span>{totalPending} Pending Verifications</span>
          </Link>)}
      </div>

      {/* Main KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Verified Donors</span>
            <Building2 className="w-4 h-4 text-emerald-600"/>
          </div>
          <p className="text-3xl font-black text-slate-900">{u['DONOR_VERIFIED'] || 0}</p>
          <p className="text-[11px] text-amber-600 mt-1">{pendingDonors} pending review</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Verified NGOs</span>
            <Building className="w-4 h-4 text-ochre"/>
          </div>
          <p className="text-3xl font-black text-slate-900">{u['NGO_VERIFIED'] || 0}</p>
          <p className="text-[11px] text-amber-600 mt-1">{pendingNGOs} pending review</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Food Rescued</span>
            <Utensils className="w-4 h-4 text-primary"/>
          </div>
          <p className="text-3xl font-black text-primary">{imp.totalKg ? `${imp.totalKg} kg` : '0 kg'}</p>
          <p className="text-[11px] text-slate-500 mt-1">Diverted from landfills</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Estimated Meals</span>
            <CheckCircle2 className="w-4 h-4 text-sky-600"/>
          </div>
          <p className="text-3xl font-black text-slate-900">{imp.totalMeals || 0}</p>
          <p className="text-[11px] text-slate-500 mt-1">Served to communities</p>
        </div>
      </div>

      {/* Donation & Claim Status Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Donation Lifecycle Breakdown */}
        <div className="bg-white rounded-3xl border border-surface-border p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-base">Donation Status Pipeline</h3>
            <Link to="/admin/donations" className="text-xs font-bold text-primary hover:underline">
              Inspect All
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-100">
              <span className="text-slate-500 font-semibold block">Available</span>
              <span className="text-2xl font-black text-emerald-800">{d['AVAILABLE'] || 0}</span>
            </div>
            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-100">
              <span className="text-slate-500 font-semibold block">Claimed / In-Transit</span>
              <span className="text-2xl font-black text-amber-800">
                {(d['CLAIMED'] || 0) + (d['DISPATCHED'] || 0) + (d['IN_TRANSIT'] || 0)}
              </span>
            </div>
            <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-100">
              <span className="text-slate-500 font-semibold block">Completed</span>
              <span className="text-2xl font-black text-sky-800">{d['COMPLETED'] || 0}</span>
            </div>
            <div className="p-3.5 bg-rose-50 rounded-2xl border border-rose-100">
              <span className="text-slate-500 font-semibold block">Expired / Cancelled</span>
              <span className="text-2xl font-black text-rose-800">
                {(d['EXPIRED'] || 0) + (d['CANCELLED'] || 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Management Links */}
        <div className="bg-white rounded-3xl border border-surface-border p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">
            Administrative Operations
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs font-bold">
            <Link to="/admin/verification" className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 transition flex items-center justify-between">
              <span>Verify Partners</span>
              <ShieldCheck className="w-4 h-4 text-primary"/>
            </Link>
            <Link to="/admin/users" className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 transition flex items-center justify-between">
              <span>User Directory</span>
              <Users className="w-4 h-4 text-primary"/>
            </Link>
            <Link to="/admin/donations" className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 transition flex items-center justify-between">
              <span>Manage Donations</span>
              <Package className="w-4 h-4 text-primary"/>
            </Link>
            <Link to="/admin/claims" className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 transition flex items-center justify-between">
              <span>Claims Monitor</span>
              <CheckCircle2 className="w-4 h-4 text-primary"/>
            </Link>
          </div>
        </div>
      </div>
    </div>);
};
