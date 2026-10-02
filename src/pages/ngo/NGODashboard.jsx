import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle2, Utensils, ArrowRight, KeyRound, ShieldAlert, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StatusBadge, UrgencyBadge, FoodTypeBadge } from '../../components/common/Badge';
import { CountdownTimer } from '../../components/common/CountdownTimer';
import { EmptyState } from '../../components/common/EmptyState';
import api from '../../api/client';
export const NGODashboard = () => {
    const { user } = useAuth();
    const { success, error: toastError } = useToast();
    const [availableDonations, setAvailableDonations] = useState([]);
    const [activeClaims, setActiveClaims] = useState([]);
    const [stats, setStats] = useState({
        availableCount: 0,
        activeClaimsCount: 0,
        completedRescuesCount: 0,
        totalKgRescued: 0,
        mealsDistributed: 0,
    });
    const [loading, setLoading] = useState(true);
    // Quick claim state
    const [isClaiming, setIsClaiming] = useState(null);
    const fetchNGOData = async () => {
        try {
            setLoading(true);
            const [donationsRes, claimsRes, impactRes] = await Promise.all([
                api.get('/donations?status=AVAILABLE&limit=4'),
                api.get('/claims?limit=4'),
                api.get('/impact/ngo'),
            ]);
            if (donationsRes.data?.success) {
                setAvailableDonations(donationsRes.data.data.donations || []);
                setStats((prev) => ({ ...prev, availableCount: donationsRes.data.data.pagination?.total || 0 }));
            }
            if (claimsRes.data?.success) {
                setActiveClaims(claimsRes.data.data.claims || []);
            }
            if (impactRes.data?.success) {
                const cStats = impactRes.data.data.claimStats || {};
                setStats((prev) => ({
                    ...prev,
                    activeClaimsCount: (cStats['CLAIMED'] || 0) + (cStats['DISPATCHED'] || 0) + (cStats['IN_TRANSIT'] || 0),
                    completedRescuesCount: cStats['COMPLETED'] || 0,
                    totalKgRescued: impactRes.data.data.totalKg || 0,
                    mealsDistributed: impactRes.data.data.totalMeals || 0,
                }));
            }
        }
        catch (err) {
            console.error('Failed to load NGO dashboard', err);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchNGOData();
    }, []);
    const handleClaim = async (donationId) => {
        if (user?.status !== 'VERIFIED') {
            toastError('Only verified NGOs can claim surplus food batches.');
            return;
        }
        try {
            setIsClaiming(donationId);
            const res = await api.post(`/donations/${donationId}/claim`);
            if (res.data?.success) {
                const code = res.data.data.claim?.pickupCode || res.data.data.donation?.pickupCode;
                success(`Donation claimed! Your pickup verification code is: ${code}`);
                fetchNGOData();
            }
        }
        catch (err) {
            toastError(err.response?.data?.message || 'Could not claim donation.');
        }
        finally {
            setIsClaiming(null);
        }
    };
    return (<div className="space-y-8">
      {/* Top Welcome Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-surface-border shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black text-slate-900">{user?.name}</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
              Verified NGO Partner
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Surplus Food Rescue & Community Distribution Hub • {user?.address?.city || 'Gujarat'}
          </p>
        </div>

        <Link to="/ngo/donations" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-md shadow-primary/20 transition">
          <Search className="w-4 h-4"/>
          <span>Browse Available Surplus</span>
        </Link>
      </div>

      {/* Verification Warning if Pending */}
      {user?.status !== 'VERIFIED' && (<div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 flex items-start gap-4">
          <ShieldAlert className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5"/>
          <div className="space-y-1">
            <h4 className="font-bold text-amber-900 text-sm">Account Verification In Progress</h4>
            <p className="text-xs text-amber-800 leading-relaxed">
              Your NGO trust registration documents are under review by our team. While pending, you can browse surplus batches, but claiming will be unlocked once approved.
            </p>
          </div>
        </div>)}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Available Surplus</span>
            <Package className="w-4 h-4 text-emerald-600"/>
          </div>
          <p className="text-3xl font-black text-slate-900">{stats.availableCount}</p>
          <p className="text-[11px] text-slate-500 mt-1">Ready for pickup claim</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Pickups</span>
            <Clock className="w-4 h-4 text-amber-600"/>
          </div>
          <p className="text-3xl font-black text-amber-600">{stats.activeClaimsCount}</p>
          <p className="text-[11px] text-slate-500 mt-1">Vehicles dispatched</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Rescued Food</span>
            <CheckCircle2 className="w-4 h-4 text-primary"/>
          </div>
          <p className="text-3xl font-black text-slate-900">{stats.totalKgRescued} kg</p>
          <p className="text-[11px] text-slate-500 mt-1">Diverted to beneficiaries</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Meals Provided</span>
            <Utensils className="w-4 h-4 text-ochre"/>
          </div>
          <p className="text-3xl font-black text-primary">{stats.mealsDistributed}</p>
          <p className="text-[11px] text-slate-500 mt-1">Nourished individuals</p>
        </div>
      </div>

      {/* Active Claims Requiring Action / Handoff */}
      {activeClaims.some((c) => ['CLAIMED', 'DISPATCHED', 'IN_TRANSIT'].includes(c.status)) && (<div className="bg-white rounded-3xl border border-surface-border p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-primary"/>
              <h3 className="font-bold text-slate-900 text-base">Your Active Claimed Batches</h3>
            </div>
            <Link to="/ngo/claims" className="text-xs font-bold text-primary hover:underline">
              Manage All Claims
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeClaims
                .filter((c) => ['CLAIMED', 'DISPATCHED', 'IN_TRANSIT'].includes(c.status))
                .map((claim) => (<div key={claim._id} className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <StatusBadge status={claim.status}/>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white border border-emerald-300 text-emerald-900">
                      Code: {claim.pickupCode || claim.donation?.pickupCode}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{claim.donation?.title}</h4>
                    <p className="text-xs text-slate-600">
                      Quantity: <strong className="text-slate-800">{claim.donation?.quantity} {claim.donation?.unit}</strong>
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Donor: <strong className="text-slate-700">{claim.donation?.donor?.name}</strong> • Phone: {claim.donation?.donor?.phone || 'N/A'}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      Show pickup code to donor at handoff
                    </span>
                    <Link to="/ngo/claims" className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold shadow-sm">
                      Update Status
                    </Link>
                  </div>
                </div>))}
          </div>
        </div>)}

      {/* Available Surplus Feed */}
      <div className="bg-white rounded-3xl border border-surface-border shadow-sm p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Available Surplus Batches</h3>
            <p className="text-xs text-slate-500">Ready for claiming right now across Gujarat</p>
          </div>
          <Link to="/ngo/donations" className="text-xs font-bold text-primary hover:text-primary-dark flex items-center gap-1">
            <span>Browse Full Catalog</span>
            <ArrowRight className="w-3.5 h-3.5"/>
          </Link>
        </div>

        {availableDonations.length === 0 ? (<EmptyState title="No surplus food currently listed" description="Our partner hotels and caterers list surplus regularly after meal services. Check back in a few moments."/>) : (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {availableDonations.map((donation) => (<div key={donation._id} className="p-5 rounded-2xl border border-surface-border hover:border-primary/50 transition bg-white shadow-sm flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <FoodTypeBadge type={donation.foodType}/>
                    <UrgencyBadge urgency={donation.urgency}/>
                  </div>

                  <h4 className="font-bold text-slate-900 text-base leading-snug">{donation.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {donation.category.replace('_', ' ')} • <strong className="text-slate-800">{donation.quantity} {donation.unit}</strong> (~{donation.estimatedMeals || Math.round(donation.quantity * 3)} meals)
                  </p>

                  <div className="mt-3 p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Donor:</span>
                      <span className="font-semibold text-slate-800">{donation.donor?.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">City:</span>
                      <span className="font-semibold text-slate-800">{donation.pickupAddress?.city || 'Ahmedabad'}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                      <span className="text-slate-500">Expiry Timer:</span>
                      <CountdownTimer targetDate={donation.expiryDateTime}/>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Link to={`/ngo/donations/${donation._id}`} className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold text-center transition">
                    Inspect Batch
                  </Link>
                  <button onClick={() => handleClaim(donation._id)} disabled={isClaiming === donation._id || user?.status !== 'VERIFIED'} className="flex-1 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-bold transition shadow-sm disabled:opacity-50">
                    {isClaiming === donation._id ? 'Reserving...' : 'Claim Batch'}
                  </button>
                </div>
              </div>))}
          </div>)}
      </div>
    </div>);
};
