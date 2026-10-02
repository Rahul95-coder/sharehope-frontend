import React, { useState, useEffect } from 'react';
import { CheckCircle2, Search } from 'lucide-react';
import { EmptyState } from '../../components/common/EmptyState';
import api from '../../api/client';
export const NGOHistoryPage = () => {
    const [completedClaims, setCompletedClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const fetchHistory = async () => {
        try {
            setLoading(true);
            const res = await api.get('/claims?status=COMPLETED&limit=50');
            if (res.data?.success) {
                setCompletedClaims(res.data.data.claims || []);
            }
        }
        catch (err) {
            console.error('Failed to load rescue history', err);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchHistory();
    }, []);
    const totalKg = completedClaims.reduce((acc, c) => acc + (c.donation?.quantity || 0), 0);
    const totalMeals = completedClaims.reduce((acc, c) => acc + (c.donation?.estimatedMeals || 0), 0);
    const filtered = completedClaims.filter(c => c.donation?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.donation?.donor?.name?.toLowerCase().includes(searchTerm.toLowerCase()));
    return (<div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-surface-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Food Rescue History & Completed Pickups</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Verified records of all completed surplus food handoffs collected by your organization
          </p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Completed Batches</span>
          <p className="text-3xl font-black text-slate-900 mt-1">{completedClaims.length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Food Rescued</span>
          <p className="text-3xl font-black text-primary mt-1">{totalKg} kg</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Estimated Meals Served</span>
          <p className="text-3xl font-black text-ochre mt-1">{totalMeals}</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-surface-border shadow-sm max-w-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5"/>
          <input type="text" placeholder="Search completed rescues..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-primary"/>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-3xl border border-surface-border shadow-sm p-6">
        {filtered.length === 0 ? (<EmptyState title="No completed rescues recorded" description="When you collect surplus food and complete handoff verification with the donor, the permanent record appears here."/>) : (<div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-[11px] uppercase tracking-wider font-bold">
                  <th className="pb-3">Rescue Date</th>
                  <th className="pb-3">Surplus Food Item</th>
                  <th className="pb-3">Quantity</th>
                  <th className="pb-3">Donor Partner</th>
                  <th className="pb-3">Handoff Code</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((claim) => (<tr key={claim._id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 text-xs text-slate-500">
                      {claim.completedAt ? new Date(claim.completedAt).toLocaleDateString('en-IN') : 'Completed'}
                    </td>
                    <td className="py-4">
                      <p className="font-bold text-slate-900 text-sm">{claim.donation?.title}</p>
                      <span className="text-[11px] text-slate-500">{claim.donation?.category?.replace('_', ' ')}</span>
                    </td>
                    <td className="py-4 font-bold text-slate-800">
                      {claim.donation?.quantity} {claim.donation?.unit}
                    </td>
                    <td className="py-4 text-xs font-semibold text-slate-700">
                      {claim.donation?.donor?.name}
                    </td>
                    <td className="py-4 font-mono font-bold text-xs text-emerald-800">
                      {claim.pickupCode}
                    </td>
                    <td className="py-4 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5"/>
                        Completed
                      </span>
                    </td>
                  </tr>))}
              </tbody>
            </table>
          </div>)}
      </div>
    </div>);
};
