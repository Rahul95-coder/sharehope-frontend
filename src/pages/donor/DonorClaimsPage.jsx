import React, { useState, useEffect } from 'react';
import { CheckCircle2, KeyRound, Building, Phone } from 'lucide-react';
import { StatusBadge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { useToast } from '../../context/ToastContext';
import api from '../../api/client';
export const DonorClaimsPage = () => {
    const { success, error: toastError } = useToast();
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');
    // Verification modal state
    const [verifyModalOpen, setVerifyModalOpen] = useState(false);
    const [selectedDonationId, setSelectedDonationId] = useState(null);
    const [pickupCodeInput, setPickupCodeInput] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const fetchClaims = async () => {
        try {
            setLoading(true);
            const url = statusFilter ? `/claims/donor?status=${statusFilter}` : '/claims/donor';
            const res = await api.get(url);
            if (res.data?.success) {
                setClaims(res.data.data.claims || []);
            }
        }
        catch (err) {
            console.error('Failed to load donor claims', err);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchClaims();
    }, [statusFilter]);
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
                success('Pickup verified! Status is now COMPLETED.');
                setVerifyModalOpen(false);
                setPickupCodeInput('');
                setSelectedDonationId(null);
                fetchClaims();
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
      <div className="bg-white p-6 rounded-3xl border border-surface-border shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">NGO Claims & Handoffs</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Review non-profit organizations collecting your food donations and verify physical handovers
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 bg-white p-2 rounded-2xl border border-surface-border w-fit shadow-sm">
        {[
            { label: 'All Handoffs', value: '' },
            { label: 'Active', value: 'CLAIMED' },
            { label: 'Completed', value: 'COMPLETED' },
        ].map((tab) => (<button key={tab.value} onClick={() => setStatusFilter(tab.value)} className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${statusFilter === tab.value
                ? 'bg-primary text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'}`}>
            {tab.label}
          </button>))}
      </div>

      {/* Claims List */}
      <div className="space-y-4">
        {claims.length === 0 ? (<EmptyState title="No NGO claims found" description="When an NGO claims your surplus batches, they will appear here with pickup contact details."/>) : (claims.map((claim) => (<div key={claim._id} className="bg-white rounded-3xl border border-surface-border p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <StatusBadge status={claim.status}/>
                  <span className="text-xs text-slate-400">
                    Claimed on {new Date(claim.claimedAt).toLocaleString('en-IN')}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">{claim.donation?.title}</h3>
                <p className="text-xs text-slate-500">
                  Quantity: <strong className="text-slate-800">{claim.donation?.quantity} {claim.donation?.unit}</strong> • Category: {claim.donation?.category?.replace('_', ' ')}
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <span className="flex items-center gap-1 font-semibold text-slate-900">
                    <Building className="w-3.5 h-3.5 text-primary"/>
                    {claim.ngo?.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400"/>
                    {claim.ngo?.phone || 'N/A'}
                  </span>
                </div>
              </div>

              {/* Action */}
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                {['CLAIMED', 'DISPATCHED', 'IN_TRANSIT'].includes(claim.status) ? (<button onClick={() => {
                    setSelectedDonationId(claim.donation?._id);
                    setPickupCodeInput('');
                    setVerifyModalOpen(true);
                }} className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs shadow-md shadow-primary/20 transition flex items-center justify-center gap-2">
                    <KeyRound className="w-4 h-4"/>
                    <span>Verify Pickup Code</span>
                  </button>) : (<div className="text-right">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600"/>
                      Handoff Complete
                    </span>
                    {claim.completedAt && (<p className="text-[10px] text-slate-400 mt-1">
                        {new Date(claim.completedAt).toLocaleDateString('en-IN')}
                      </p>)}
                  </div>)}
              </div>
            </div>)))}
      </div>

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
