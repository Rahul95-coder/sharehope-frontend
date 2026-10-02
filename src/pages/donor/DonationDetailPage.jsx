import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Building, KeyRound } from 'lucide-react';
import { StatusBadge, UrgencyBadge, FoodTypeBadge } from '../../components/common/Badge';
import { CountdownTimer } from '../../components/common/CountdownTimer';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import { assetUrl } from '../../utils/assetUrl';
export const DonationDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { success, error: toastError } = useToast();
    const [donation, setDonation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [verifyModalOpen, setVerifyModalOpen] = useState(false);
    const [pickupCodeInput, setPickupCodeInput] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const fetchDonation = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/donations/${id}`);
            if (res.data?.success) {
                setDonation(res.data.data.donation);
            }
        }
        catch (err) {
            console.error('Failed to load donation details', err);
            toastError('Donation not found.');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchDonation();
    }, [id]);
    const handleVerifyHandoff = async (e) => {
        e.preventDefault();
        if (!id || !pickupCodeInput)
            return;
        try {
            setIsVerifying(true);
            const res = await api.post(`/donations/${id}/verify-pickup`, {
                code: pickupCodeInput.trim().toUpperCase(),
            });
            if (res.data?.success) {
                success('Handoff verified successfully! Donation marked COMPLETED.');
                setVerifyModalOpen(false);
                setPickupCodeInput('');
                fetchDonation();
            }
        }
        catch (err) {
            toastError(err.response?.data?.message || 'Invalid verification code.');
        }
        finally {
            setIsVerifying(false);
        }
    };
    if (loading) {
        return (<div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>);
    }
    if (!donation) {
        return (<div className="bg-white rounded-3xl p-8 border border-surface-border text-center space-y-4">
        <p className="text-slate-600">Donation not found or removed.</p>
        <button onClick={() => navigate(-1)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-800 font-semibold text-sm">
          Go Back
        </button>
      </div>);
    }
    return (<div className="max-w-4xl mx-auto space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition">
          <ArrowLeft className="w-4 h-4"/>
          <span>Back to List</span>
        </button>
        <div className="flex items-center gap-2">
          <UrgencyBadge urgency={donation.urgency}/>
          <StatusBadge status={donation.status}/>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl border border-surface-border p-6 sm:p-10 shadow-sm space-y-8">
        <div className="border-b border-slate-100 pb-6 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <FoodTypeBadge type={donation.foodType}/>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider">
              {donation.category.replace('_', ' ')}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{donation.title}</h1>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Expiry Timer:</span>
            <CountdownTimer targetDate={donation.expiryDateTime}/>
          </div>
        </div>

        {/* Gallery if present */}
        {donation.images && donation.images.length > 0 && (<div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Photographs</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {donation.images.map((img) => (<div key={img._id} className="h-36 rounded-2xl overflow-hidden border border-slate-200">
                  <img src={assetUrl(img.url)} alt={donation.title} className="w-full h-full object-cover"/>
                </div>))}
            </div>
          </div>)}

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quantity</span>
            <p className="text-xl font-black text-slate-900 mt-0.5">
              {donation.quantity} {donation.unit}
            </p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estimated Meals</span>
            <p className="text-xl font-black text-primary mt-0.5">
              ~{donation.estimatedMeals || Math.round(donation.quantity * 3)}
            </p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Storage Condition</span>
            <p className="text-xs font-bold text-slate-800 mt-1">
              {donation.storageCondition?.replace('_', ' ') || 'Normal'}
            </p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Temperature Note</span>
            <p className="text-xs text-slate-700 mt-1 truncate">
              {donation.temperatureGuideline || 'Standard'}
            </p>
          </div>
        </div>

        {/* Description */}
        {donation.description && (<div className="space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Details & Notes</h4>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{donation.description}</p>
          </div>)}

        {/* Pickup Location */}
        <div className="space-y-2 border-t border-slate-100 pt-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-primary"/>
            <span>Pickup Address</span>
          </h4>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm">
            <p className="font-semibold text-slate-800">{donation.pickupAddress?.addressLine || 'Address on file'}</p>
            <p className="text-slate-600 text-xs">
              {donation.pickupAddress?.city}, {donation.pickupAddress?.state} - {donation.pickupAddress?.pincode}
            </p>
          </div>
        </div>

        {/* Recipient NGO Details if claimed */}
        {donation.claimedBy && typeof donation.claimedBy === 'object' && (<div className="border-t border-slate-100 pt-6 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-primary"/>
              <span>Claimed by NGO Partner</span>
            </h4>
            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h5 className="font-bold text-slate-900 text-base">{donation.claimedBy.name}</h5>
                <p className="text-xs text-slate-600 mt-0.5">
                  Contact: {donation.claimedBy.phone || 'N/A'} • {donation.claimedBy.email}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <StatusBadge status={donation.status}/>
                  <span className="text-xs text-slate-500">
                    Claimed on {donation.claimedAt ? new Date(donation.claimedAt).toLocaleString('en-IN') : 'Recently'}
                  </span>
                </div>
              </div>

              {/* Action button to verify pickup */}
              {['CLAIMED', 'DISPATCHED', 'IN_TRANSIT'].includes(donation.status) && (<button onClick={() => {
                    setPickupCodeInput('');
                    setVerifyModalOpen(true);
                }} className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs shadow-sm transition flex items-center gap-2">
                  <KeyRound className="w-4 h-4"/>
                  <span>Verify Handoff Code</span>
                </button>)}
            </div>
          </div>)}
      </div>

      {/* Pickup Verification Modal */}
      {verifyModalOpen && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-surface-border shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary flex items-center justify-center mx-auto">
              <KeyRound className="w-6 h-6"/>
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Verify Pickup Code</h3>
              <p className="text-xs text-slate-500">
                Enter the code provided by {donation.claimedBy && typeof donation.claimedBy === 'object' ? donation.claimedBy.name : 'the NGO'}.
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
