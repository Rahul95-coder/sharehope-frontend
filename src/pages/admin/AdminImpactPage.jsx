import React, { useState, useEffect } from 'react';
import api from '../../api/client';
export const AdminImpactPage = () => {
    const [impactData, setImpactData] = useState({
        stats: {},
        byCategory: [],
        recentRecords: [],
    });
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchImpact = async () => {
            try {
                setLoading(true);
                const res = await api.get('/admin/impact');
                if (res.data?.success) {
                    setImpactData(res.data.data);
                }
            }
            catch (err) {
                console.error('Failed to load admin impact data', err);
            }
            finally {
                setLoading(false);
            }
        };
        fetchImpact();
    }, []);
    const stats = impactData.stats || {};
    const byCategory = impactData.byCategory || [];
    const recentRecords = impactData.recentRecords || [];
    const co2Diverted = Math.round((stats.totalKg || 0) * 2.5);
    const waterSaved = Math.round((stats.totalKg || 0) * 100);
    return (<div className="space-y-8">
      <div className="bg-white p-6 rounded-3xl border border-surface-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Impact & Diversion Analytics</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time calculations of food rescued, beneficiaries served, and environmental greenhouse gas diversion
          </p>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Rescued</span>
          <p className="text-3xl font-black text-primary mt-1">{stats.totalKg || 0} kg</p>
          <p className="text-[11px] text-slate-500 mt-1">Surplus food diverted</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Meals Served</span>
          <p className="text-3xl font-black text-slate-900 mt-1">{stats.totalMeals || 0}</p>
          <p className="text-[11px] text-slate-500 mt-1">Calculated @ 4 meals/kg</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">CO₂ Diverted</span>
          <p className="text-3xl font-black text-emerald-700 mt-1">{co2Diverted} kg</p>
          <p className="text-[11px] text-slate-500 mt-1">Landfill methane avoided</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Water Conserved</span>
          <p className="text-3xl font-black text-sky-700 mt-1">{waterSaved} L</p>
          <p className="text-[11px] text-slate-500 mt-1">Agricultural water footprint</p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-3xl border border-surface-border p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Food Rescues by Category</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {byCategory.length === 0 ? (<p className="text-xs text-slate-500">No categorised records yet.</p>) : (byCategory.map((cat) => (<div key={cat._id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">{cat._id?.replace('_', ' ') || 'Other'}</span>
                  <span className="text-[11px] text-slate-500">{cat.count} batches</span>
                </div>
                <div className="text-right">
                  <span className="text-base font-black text-primary block">{cat.totalKg} kg</span>
                  <span className="text-[10px] text-slate-400">{cat.totalMeals} meals</span>
                </div>
              </div>)))}
        </div>
      </div>

      {/* Recent Rescues Ledger */}
      <div className="bg-white rounded-3xl border border-surface-border p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Recent Completed Rescues Ledger</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-[11px] uppercase tracking-wider font-bold">
                <th className="pb-3">Date</th>
                <th className="pb-3">Donor</th>
                <th className="pb-3">NGO Recipient</th>
                <th className="pb-3">Category</th>
                <th className="pb-3 text-right">Quantity Rescued</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {recentRecords.map((r) => (<tr key={r._id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 text-slate-500">
                    {new Date(r.recordDate).toLocaleDateString('en-IN')}
                  </td>
                  <td className="py-3 font-semibold text-slate-800">
                    {r.donor?.name || 'Donor'}
                  </td>
                  <td className="py-3 font-semibold text-slate-800">
                    {r.ngo?.name || 'NGO'}
                  </td>
                  <td className="py-3 text-slate-600">
                    {r.category?.replace('_', ' ') || 'Food'}
                  </td>
                  <td className="py-3 text-right font-black text-primary">
                    {r.quantityKg} kg (~{r.estimatedMeals} meals)
                  </td>
                </tr>))}
            </tbody>
          </table>
        </div>
      </div>
    </div>);
};
