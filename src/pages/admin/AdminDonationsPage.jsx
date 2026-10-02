import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { StatusBadge, FoodTypeBadge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import api from '../../api/client';
export const AdminDonationsPage = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const fetchDonations = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (searchTerm)
                params.append('search', searchTerm);
            if (statusFilter)
                params.append('status', statusFilter);
            if (categoryFilter)
                params.append('category', categoryFilter);
            params.append('page', String(page));
            params.append('limit', '15');
            const res = await api.get(`/admin/donations?${params.toString()}`);
            if (res.data?.success) {
                setDonations(res.data.data.donations || []);
                setTotalPages(res.data.data.pagination?.pages || 1);
            }
        }
        catch (err) {
            console.error('Failed to load admin donations', err);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchDonations();
    }, [searchTerm, statusFilter, categoryFilter, page]);
    return (<div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-surface-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">All Surplus Food Postings</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time administrative ledger of all listed surplus batches across Gujarat
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-surface-border shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5"/>
          <input type="text" placeholder="Search by title..." value={searchTerm} onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
        }} className="w-full pl-10 pr-4 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-primary"/>
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <select value={statusFilter} onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
        }} className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white text-slate-700 font-medium">
            <option value="">All Statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="CLAIMED">Claimed</option>
            <option value="DISPATCHED">Dispatched</option>
            <option value="IN_TRANSIT">In Transit</option>
            <option value="COMPLETED">Completed</option>
            <option value="EXPIRED">Expired</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <select value={categoryFilter} onChange={(e) => {
            setCategoryFilter(e.target.value);
            setPage(1);
        }} className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white text-slate-700 font-medium">
            <option value="">All Categories</option>
            <option value="COOKED_FOOD">Cooked Food</option>
            <option value="PACKAGED_FOOD">Packaged Food</option>
            <option value="BAKERY">Bakery</option>
            <option value="GROCERIES">Groceries</option>
            <option value="FRUITS">Fruits</option>
            <option value="VEGETABLES">Vegetables</option>
            <option value="DAIRY">Dairy</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-surface-border shadow-sm p-6 space-y-4">
        {donations.length === 0 ? (<EmptyState title="No donations found" description="No surplus postings match your current filter parameters."/>) : (<div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-[11px] uppercase tracking-wider font-bold">
                  <th className="pb-3">Title & Category</th>
                  <th className="pb-3">Quantity</th>
                  <th className="pb-3">Donor</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Expiry</th>
                  <th className="pb-3 text-right">Recipient NGO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {donations.map((d) => (<tr key={d._id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4">
                      <div className="flex items-center gap-2.5">
                        <FoodTypeBadge type={d.foodType}/>
                        <div>
                          <p className="font-bold text-slate-900 text-sm leading-tight">{d.title}</p>
                          <span className="text-[11px] text-slate-500">{d.category.replace('_', ' ')}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 font-bold text-slate-800">
                      {d.quantity} {d.unit}
                    </td>
                    <td className="py-4 text-xs font-semibold text-slate-700">
                      {d.donor?.name || 'Unknown'}
                    </td>
                    <td className="py-4">
                      <StatusBadge status={d.status}/>
                    </td>
                    <td className="py-4 text-xs text-slate-500 font-mono">
                      {new Date(d.expiryDateTime).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-4 text-right text-xs font-bold text-slate-800">
                      {d.claimedBy?.name || <span className="text-slate-400 font-normal">Unclaimed</span>}
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
