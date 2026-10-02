import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, PlusCircle, Trash2, KeyRound, Eye } from 'lucide-react';
import { StatusBadge, UrgencyBadge, FoodTypeBadge } from '../../components/common/Badge';
import { CountdownTimer } from '../../components/common/CountdownTimer';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { EmptyState } from '../../components/common/EmptyState';
import { useToast } from '../../context/ToastContext';
import api from '../../api/client';
export const MyDonationsPage = () => {
    const { success, error: toastError } = useToast();
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    // Cancellation modal
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [cancellingDonationId, setCancellingDonationId] = useState(null);
    const [isCancelling, setIsCancelling] = useState(false);
    // Pickup verify modal
    const [verifyModalOpen, setVerifyModalOpen] = useState(false);
    const [selectedDonationId, setSelectedDonationId] = useState(null);
    const [pickupCodeInput, setPickupCodeInput] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const fetchDonations = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (statusFilter)
                params.append('status', statusFilter);
            if (searchTerm)
                params.append('search', searchTerm);
            params.append('page', String(page));
            params.append('limit', '10');
            const res = await api.get(`/donations/my?${params.toString()}`);
            if (res.data?.success) {
                setDonations(res.data.data.donations || []);
                setTotalPages(res.data.data.pagination?.pages || 1);
            }
        }
        catch (err) {
            console.error('Failed to load donations', err);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchDonations();
    }, [statusFilter, searchTerm, page]);
    const handleCancelDonation = async () => {
        if (!cancellingDonationId)
            return;
        try {
            setIsCancelling(true);
            const res = await api.patch(`/donations/${cancellingDonationId}/cancel`, {
                reason: 'Cancelled by donor',
            });
            if (res.data?.success) {
                success('Donation marked as cancelled.');
                setCancelModalOpen(false);
                setCancellingDonationId(null);
                fetchDonations();
            }
        }
        catch (err) {
            toastError(err.response?.data?.message || 'Could not cancel donation.');
        }
        finally {
            setIsCancelling(false);
        }
    };
    const handleVerifyHandoff = async (e) => {
        e.preventDefault();
        if (!selectedDonationId || !pickupCodeInput)
            return;
        try {
            setIsVerifying(true);
            const res = await api.post(`/donations/${selectedDonationId}/verify-pickup`, {
                code: pickupCodeInput.trim().toUpperCase(),
            });
            if (res.data?.success) {
                success('Handoff verified! Donation completed.');
                setVerifyModalOpen(false);
                setPickupCodeInput('');
                setSelectedDonationId(null);
                fetchDonations();
            }
        }
        catch (err) {
            toastError(err.response?.data?.message || 'Invalid pickup code.');
        }
        finally {
            setIsVerifying(false);
        }
    };
    return (<div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-surface-border shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900">My Surplus Food Postings</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Track, edit, or verify pickup of all surplus batches published by your organization
          </p>
        </div>
        <Link to="/donor/donations/create" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-sm transition">
          <PlusCircle className="w-4 h-4"/>
          <span>Publish Surplus</span>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-surface-border flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        {/* Status Tabs */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {[
            { label: 'All', value: '' },
            { label: 'Available', value: 'AVAILABLE' },
            { label: 'Claimed', value: 'CLAIMED' },
            { label: 'Completed', value: 'COMPLETED' },
            { label: 'Expired', value: 'EXPIRED' },
            { label: 'Cancelled', value: 'CANCELLED' },
        ].map((tab) => (<button key={tab.value} onClick={() => {
                setStatusFilter(tab.value);
                setPage(1);
            }} className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${statusFilter === tab.value
                ? 'bg-primary text-white'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}>
              {tab.label}
            </button>))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5"/>
          <input type="text" placeholder="Search by title..." value={searchTerm} onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
        }} className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-primary"/>
        </div>
      </div>

      {/* Donations List / Table */}
      <div className="bg-white rounded-3xl border border-surface-border shadow-sm p-6 space-y-4">
        {donations.length === 0 ? (<EmptyState title="No food batches found" description="No surplus batches match your current filter settings." actionText="Publish Surplus Food" onAction={() => window.location.href = '/donor/donations/create'}/>) : (<div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-[11px] uppercase tracking-wider font-bold">
                  <th className="pb-3">Title & Category</th>
                  <th className="pb-3">Quantity</th>
                  <th className="pb-3">Expiry Deadline</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Claimed By</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {donations.map((donation) => (<tr key={donation._id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <FoodTypeBadge type={donation.foodType}/>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{donation.title}</p>
                          <span className="text-[11px] text-slate-500">{donation.category.replace('_', ' ')}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 font-bold text-slate-800">
                      {donation.quantity} {donation.unit}
                    </td>
                    <td className="py-4">
                      <div className="space-y-1">
                        <UrgencyBadge urgency={donation.urgency}/>
                        <div>
                          <CountdownTimer targetDate={donation.expiryDateTime}/>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <StatusBadge status={donation.status}/>
                    </td>
                    <td className="py-4 text-xs font-medium text-slate-600">
                      {donation.claimedBy ? (<span className="font-semibold text-slate-900">{donation.claimedBy.name}</span>) : (<span className="text-slate-400">None yet</span>)}
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Verify Pickup Button if claimed */}
                        {['CLAIMED', 'DISPATCHED', 'IN_TRANSIT'].includes(donation.status) && (<button onClick={() => {
                        setSelectedDonationId(donation._id);
                        setPickupCodeInput('');
                        setVerifyModalOpen(true);
                    }} className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs font-bold border border-emerald-200 transition flex items-center gap-1" title="Verify Pickup Code">
                            <KeyRound className="w-3.5 h-3.5"/>
                            <span>Verify Code</span>
                          </button>)}

                        {/* View link */}
                        <Link to={`/donor/donations/${donation._id}`} className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition" title="View Details">
                          <Eye className="w-4 h-4"/>
                        </Link>

                        {/* Cancel if available */}
                        {donation.status === 'AVAILABLE' && (<button onClick={() => {
                        setCancellingDonationId(donation._id);
                        setCancelModalOpen(true);
                    }} className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition" title="Cancel Posting">
                            <Trash2 className="w-4 h-4"/>
                          </button>)}
                      </div>
                    </td>
                  </tr>))}
              </tbody>
            </table>
          </div>)}

        {/* Pagination */}
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

      {/* Confirmation Modal for Cancellation */}
      <ConfirmationModal isOpen={cancelModalOpen} onClose={() => setCancelModalOpen(false)} onConfirm={handleCancelDonation} title="Cancel Surplus Batch?" message="Are you sure you want to cancel this surplus food listing? NGOs will no longer be able to claim it." confirmText="Cancel Batch" variant="danger" isLoading={isCancelling}/>

      {/* Pickup Code Verification Modal */}
      {verifyModalOpen && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-surface-border shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary flex items-center justify-center mx-auto">
              <KeyRound className="w-6 h-6"/>
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Verify Pickup Code</h3>
              <p className="text-xs text-slate-500">
                Enter the 6-character handoff code presented by the recipient NGO receiver.
              </p>
            </div>

            <form onSubmit={handleVerifyHandoff} className="space-y-4">
              <div>
                <input type="text" required maxLength={10} value={pickupCodeInput} onChange={(e) => setPickupCodeInput(e.target.value.toUpperCase())} placeholder="e.g. A1B2C3" className="w-full text-center text-2xl font-mono font-bold tracking-widest px-4 py-3 rounded-2xl border-2 border-primary/30 focus:border-primary focus:outline-none" autoFocus/>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setVerifyModalOpen(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-700 text-sm hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit" disabled={isVerifying || !pickupCodeInput} className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-sm disabled:opacity-50">
                  {isVerifying ? 'Verifying...' : 'Confirm Handoff'}
                </button>
              </div>
            </form>
          </div>
        </div>)}
    </div>);
};
