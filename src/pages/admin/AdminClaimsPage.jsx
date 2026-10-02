import React, { useState, useEffect } from 'react';
import { StatusBadge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import api from '../../api/client';
export const AdminClaimsPage = () => {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const fetchClaims = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (statusFilter)
                params.append('status', statusFilter);
            params.append('page', String(page));
            params.append('limit', '15');
            const res = await api.get(`/admin/claims?${params.toString()}`);
            if (res.data?.success) {
                setClaims(res.data.data.claims || []);
                setTotalPages(res.data.data.pagination?.pages || 1);
            }
        }
        catch (err) {
            console.error('Failed to load admin claims', err);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchClaims();
    }, [statusFilter, page]);
    return (<div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-surface-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Surplus Claims & Logistics Monitor</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time tracking of food batch claims, handoffs, and completion verification
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white p-2 rounded-2xl border border-surface-border w-fit shadow-sm">
        {[
            { label: 'All Claims', value: '' },
            { label: 'Claimed', value: 'CLAIMED' },
            { label: 'Dispatched', value: 'DISPATCHED' },
            { label: 'In Transit', value: 'IN_TRANSIT' },
            { label: 'Completed', value: 'COMPLETED' },
        ].map((tab) => (<button key={tab.value} onClick={() => {
                setStatusFilter(tab.value);
                setPage(1);
            }} className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${statusFilter === tab.value
                ? 'bg-primary text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'}`}>
            {tab.label}
          </button>))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-surface-border shadow-sm p-6 space-y-4">
        {claims.length === 0 ? (<EmptyState title="No claims matching filter" description="No surplus claims currently match your selection."/>) : (<div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-[11px] uppercase tracking-wider font-bold">
                  <th className="pb-3">Surplus Food Batch</th>
                  <th className="pb-3">Donor</th>
                  <th className="pb-3">Recipient NGO</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Pickup Code</th>
                  <th className="pb-3 text-right">Claim Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {claims.map((c) => (<tr key={c._id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4">
                      <p className="font-bold text-slate-900 text-sm leading-tight">{c.donation?.title}</p>
                      <span className="text-[11px] text-slate-500">
                        {c.donation?.quantity} {c.donation?.unit}
                      </span>
                    </td>
                    <td className="py-4 text-xs font-semibold text-slate-700">
                      {c.donation?.donor?.name || 'N/A'}
                    </td>
                    <td className="py-4 text-xs font-bold text-slate-900">
                      {c.ngo?.name || 'N/A'}
                    </td>
                    <td className="py-4">
                      <StatusBadge status={c.status}/>
                    </td>
                    <td className="py-4 font-mono font-bold text-xs text-emerald-800">
                      {c.pickupCode || '—'}
                    </td>
                    <td className="py-4 text-right text-xs text-slate-500">
                      {new Date(c.claimedAt).toLocaleDateString('en-IN')}
                    </td>
                  </tr>))}
              </tbody>
            </table>
          </div>)}

        {totalPages > 1 && (<div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs">
            <span className="text-slate-500">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40">
                Previous
              </button>
              <button disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40">
                Next
              </button>
            </div>
          </div>)}
      </div>
    </div>);
};
