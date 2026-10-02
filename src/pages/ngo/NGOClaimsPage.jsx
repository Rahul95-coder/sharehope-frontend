import React, { useState, useEffect } from 'react';
import { CheckCircle2, Truck, Building2, Phone, MapPin } from 'lucide-react';
import { StatusBadge } from '../../components/common/Badge';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { EmptyState } from '../../components/common/EmptyState';
import { useToast } from '../../context/ToastContext';
import api from '../../api/client';
export const NGOClaimsPage = () => {
    const { success, error: toastError } = useToast();
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');
    // Cancel claim modal
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [cancellingClaimId, setCancellingClaimId] = useState(null);
    const [cancelReason, setCancelReason] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const fetchClaims = async () => {
        try {
            setLoading(true);
            const url = statusFilter ? `/claims?status=${statusFilter}` : '/claims';
            const res = await api.get(url);
            if (res.data?.success) {
                setClaims(res.data.data.claims || []);
            }
        }
        catch (err) {
            console.error('Failed to load NGO claims', err);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchClaims();
    }, [statusFilter]);
    const handleUpdateStatus = async (claimId, newStatus) => {
        try {
            setIsProcessing(true);
            const res = await api.patch(`/claims/${claimId}/status`, { status: newStatus });
            if (res.data?.success) {
                success(`Status updated to ${newStatus}`);
                fetchClaims();
            }
        }
        catch (err) {
            toastError(err.response?.data?.message || 'Failed to update claim status.');
        }
        finally {
            setIsProcessing(false);
        }
    };
    const handleCancelClaim = async () => {
        if (!cancellingClaimId)
            return;
        try {
            setIsProcessing(true);
            const res = await api.patch(`/claims/${cancellingClaimId}/status`, {
                status: 'CANCELLED',
                cancelReason: cancelReason || 'NGO was unable to dispatch vehicle in time',
            });
            if (res.data?.success) {
                success('Claim cancelled. The donation is now available for other NGOs.');
                setCancelModalOpen(false);
                setCancellingClaimId(null);
                setCancelReason('');
                fetchClaims();
            }
        }
        catch (err) {
            toastError(err.response?.data?.message || 'Could not cancel claim.');
        }
        finally {
            setIsProcessing(false);
        }
    };
    return (<div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-surface-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Active Claims & Rescues</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Track claimed surplus batches, dispatch your collection team, and present pickup codes at handoff
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white p-2 rounded-2xl border border-surface-border w-fit shadow-sm">
        {[
            { label: 'All My Claims', value: '' },
            { label: 'In Progress', value: 'CLAIMED' },
            { label: 'Dispatched', value: 'DISPATCHED' },
            { label: 'In Transit', value: 'IN_TRANSIT' },
            { label: 'Completed', value: 'COMPLETED' },
        ].map((tab) => (<button key={tab.value} onClick={() => setStatusFilter(tab.value)} className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${statusFilter === tab.value
                ? 'bg-primary text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'}`}>
            {tab.label}
          </button>))}
      </div>

      {/* Claims List */}
      <div className="space-y-4">
        {claims.length === 0 ? (<EmptyState title="No claims matching filter" description="You have not claimed any surplus batches under this filter." actionText="Browse Available Surplus" onAction={() => window.location.href = '/ngo/donations'}/>) : (claims.map((claim) => (<div key={claim._id} className="bg-white rounded-3xl border border-surface-border p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <StatusBadge status={claim.status}/>
                  <span className="text-xs text-slate-400">
                    Claimed on {new Date(claim.claimedAt).toLocaleString('en-IN')}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900">{claim.donation?.title}</h3>
                
                <p className="text-xs text-slate-600">
                  Quantity: <strong className="text-slate-800">{claim.donation?.quantity} {claim.donation?.unit}</strong> (~{claim.donation?.estimatedMeals} meals)
                </p>

                {/* Donor Contact Card */}
                <div className="p-3.5 bg-slate-50 rounded-2xl text-xs space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <Building2 className="w-4 h-4 text-primary"/>
                    <span>{claim.donation?.donor?.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="w-3.5 h-3.5 text-slate-400"/>
                    <span>{claim.donation?.donor?.phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5"/>
                    <span>
                      {claim.donation?.pickupAddress?.addressLine}, {claim.donation?.pickupAddress?.city} - {claim.donation?.pickupAddress?.pincode}
                    </span>
                  </div>
                </div>
              </div>

              {/* Handoff Code Box & Status Controller */}
              <div className="flex flex-col items-center sm:items-end gap-4 min-w-[260px]">
                {/* Pickup Code display */}
                <div className="w-full text-center p-3.5 bg-emerald-50 rounded-2xl border-2 border-dashed border-emerald-300">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest block">
                    Digital Pickup Code
                  </span>
                  <span className="text-2xl font-mono font-black text-primary tracking-widest">
                    {claim.pickupCode || claim.donation?.pickupCode || 'Unavailable'}
                  </span>
                  <span className="text-[10px] text-emerald-600 block mt-1">
                    Present to donor at pickup
                  </span>
                </div>

                {/* Step transition buttons */}
                <div className="w-full space-y-2">
                  {claim.status === 'CLAIMED' && (<button onClick={() => handleUpdateStatus(claim._id, 'DISPATCHED')} disabled={isProcessing} className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2">
                      <Truck className="w-3.5 h-3.5"/>
                      <span>Mark Vehicle Dispatched</span>
                    </button>)}

                  {claim.status === 'DISPATCHED' && (<button onClick={() => handleUpdateStatus(claim._id, 'IN_TRANSIT')} disabled={isProcessing} className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2">
                      <Truck className="w-3.5 h-3.5"/>
                      <span>Mark In-Transit to Center</span>
                    </button>)}

                  {['CLAIMED', 'DISPATCHED'].includes(claim.status) && (<button onClick={() => {
                    setCancellingClaimId(claim._id);
                    setCancelModalOpen(true);
                }} className="w-full py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-semibold">
                      Cancel Claim Reservation
                    </button>)}

                  {claim.status === 'COMPLETED' && (<div className="text-center py-2 text-xs font-bold text-emerald-800 flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600"/>
                      <span>Handoff Completed & Logged</span>
                    </div>)}
                </div>
              </div>
            </div>)))}
      </div>

      {/* Confirmation Modal for Cancellation */}
      <ConfirmationModal isOpen={cancelModalOpen} onClose={() => setCancelModalOpen(false)} onConfirm={handleCancelClaim} title="Release This Claim?" message="Releasing this claim will make the surplus batch available immediately for other non-profit organizations in Gujarat." confirmText="Release Claim" variant="warning" isLoading={isProcessing}/>
    </div>);
};
