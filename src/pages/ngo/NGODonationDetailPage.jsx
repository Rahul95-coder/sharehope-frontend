import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, CheckCircle2 } from 'lucide-react';
import { StatusBadge, UrgencyBadge, FoodTypeBadge } from '../../components/common/Badge';
import { CountdownTimer } from '../../components/common/CountdownTimer';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../api/client';
import { assetUrl } from '../../utils/assetUrl';
export const NGODonationDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { success, error: toastError } = useToast();
    const [donation, setDonation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isClaiming, setIsClaiming] = useState(false);
    const [claimedCode, setClaimedCode] = useState(null);
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
    const handleClaim = async () => {
        if (user?.status !== 'VERIFIED') {
            toastError('Your NGO must be VERIFIED to claim donations.');
            return;
        }
        try {
            setIsClaiming(true);
            const res = await api.post(`/donations/${id}/claim`);
            if (res.data?.success) {
                const code = res.data.data.claim?.pickupCode || res.data.data.donation?.pickupCode;
                setClaimedCode(code);
                success('Batch claimed! Save the pickup verification code.');
                fetchDonation();
            }
        }
        catch (err) {
            toastError(err.response?.data?.message || 'Could not claim donation.');
        }
        finally {
            setIsClaiming(false);
        }
    };
    if (loading) {
        return (<div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>);
    }
    if (!donation) {
        return (<div className="bg-white rounded-3xl p-8 border border-surface-border text-center space-y-4">
        <p className="text-slate-600">Surplus batch not found.</p>
        <button onClick={() => navigate('/ngo/donations')} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-800 font-semibold text-sm">
          Return to Surplus Catalog
        </button>
      </div>);
    }
    return (<div className="max-w-4xl mx-auto space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition">
          <ArrowLeft className="w-4 h-4"/>
          <span>Back to Catalog</span>
        </button>
        <div className="flex items-center gap-2">
          <UrgencyBadge urgency={donation.urgency}/>
          <StatusBadge status={donation.status}/>
        </div>
      </div>

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
            <span className="text-slate-500">Pickup Expiry Window:</span>
            <CountdownTimer targetDate={donation.expiryDateTime}/>
          </div>
        </div>

        {/* Gallery */}
        {donation.images && donation.images.length > 0 && (<div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Photographs</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {donation.images.map((img) => (<div key={img._id} className="h-36 rounded-2xl overflow-hidden border border-slate-200">
                  <img src={assetUrl(img.url)} alt={donation.title} className="w-full h-full object-cover"/>
                </div>))}
            </div>
          </div>)}

        {/* Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Available Quantity</span>
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
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Storage Requirement</span>
            <p className="text-xs font-bold text-slate-800 mt-1">
              {donation.storageCondition?.replace('_', ' ') || 'Room Temp'}
            </p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Handling Notes</span>
            <p className="text-xs text-slate-700 mt-1 truncate">
              {donation.temperatureGuideline || 'Standard Food Safety'}
            </p>
          </div>
        </div>

        {/* Description */}
        {donation.description && (<div className="space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Meal Description & Notes</h4>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{donation.description}</p>
          </div>)}

        {/* Pickup Location & Donor Info */}
        <div className="space-y-3 border-t border-slate-100 pt-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-primary"/>
            <span>Pickup Location & Establishment</span>
          </h4>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm space-y-1">
            <p className="font-bold text-slate-900">
              {typeof donation.donor === 'object' ? donation.donor.name : 'Donor Establishment'}
            </p>
            <p className="text-slate-600 text-xs">{donation.pickupAddress?.addressLine || 'Address on file'}</p>
            <p className="text-slate-600 text-xs">
              {donation.pickupAddress?.city}, {donation.pickupAddress?.state} - {donation.pickupAddress?.pincode}
            </p>
          </div>
        </div>

        {/* Claim or Status Box */}
        <div className="border-t border-slate-100 pt-6">
          {donation.status === 'AVAILABLE' ? (<button onClick={handleClaim} disabled={isClaiming || user?.status !== 'VERIFIED'} className="w-full py-4 rounded-2xl bg-primary hover:bg-primary-dark text-white font-extrabold text-base shadow-lg shadow-primary/20 transition flex items-center justify-center gap-2 disabled:opacity-50">
              <CheckCircle2 className="w-5 h-5"/>
              <span>{isClaiming ? 'Reserving Batch...' : 'Claim This Surplus Batch Now'}</span>
            </button>) : (<div className="p-4 rounded-2xl bg-slate-100 text-center text-sm font-semibold text-slate-600">
              This surplus batch is currently <strong className="text-slate-900">{donation.status}</strong> and cannot be claimed.
            </div>)}
        </div>
      </div>

      {/* Claimed Code Modal */}
      {claimedCode && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 border border-surface-border shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-primary flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8"/>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900">Batch Reserved!</h3>
              <p className="text-xs text-slate-600">
                Your organization has claimed <strong className="text-slate-900">"{donation.title}"</strong>.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-200 space-y-1">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">
                Digital Pickup Code
              </span>
              <p className="text-4xl font-mono font-black text-primary tracking-widest">
                {claimedCode}
              </p>
              <p className="text-[11px] text-emerald-700 mt-2">
                Present this code to the donor at handoff to complete transfer.
              </p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setClaimedCode(null)} className="flex-1 py-3 rounded-xl border border-slate-200 font-bold text-xs text-slate-700 hover:bg-slate-50">
                Close
              </button>
              <Link to="/ngo/claims" className="flex-1 py-3 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-dark shadow-sm flex items-center justify-center">
                Go to Active Claims
              </Link>
            </div>
          </div>
        </div>)}
    </div>);
};
