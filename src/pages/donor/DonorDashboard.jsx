import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, PlusCircle, CheckCircle2, Clock, Utensils, ArrowRight, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StatusBadge, UrgencyBadge, FoodTypeBadge } from '../../components/common/Badge';
import { CountdownTimer } from '../../components/common/CountdownTimer';
import { EmptyState } from '../../components/common/EmptyState';
import api from '../../api/client';
export const DonorDashboard = () => {
    const { user } = useAuth();
    const { success, error: toastError } = useToast();
    const [stats, setStats] = useState({
        active: 0,
        claimed: 0,
        completed: 0,
        expired: 0,
        totalKg: 0,
        mealsRescued: 0,
    });
    const [activeDonations, setActiveDonations] = useState([]);
    const [claimedHandoffs, setClaimedHandoffs] = useState([]);
    const [loading, setLoading] = useState(true);
    // Pickup code verification modal state
    const [verifyModalOpen, setVerifyModalOpen] = useState(false);
    const [selectedDonationId, setSelectedDonationId] = useState(null);
    const [pickupCodeInput, setPickupCodeInput] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [donationsRes, claimsRes, impactRes] = await Promise.all([
                api.get('/donations/my?limit=5'),
                api.get('/claims/donor?limit=5'),
                api.get('/impact/donor'),
            ]);
            if (donationsRes.data?.success) {
                setActiveDonations(donationsRes.data.data.donations || []);
            }
            if (claimsRes.data?.success) {
                setClaimedHandoffs(claimsRes.data.data.claims || []);
            }
            if (impactRes.data?.success) {
                const dStats = impactRes.data.data.donationStats || {};
                setStats({
                    active: dStats['AVAILABLE'] || 0,
                    claimed: (dStats['CLAIMED'] || 0) + (dStats['DISPATCHED'] || 0) + (dStats['IN_TRANSIT'] || 0),
                    completed: dStats['COMPLETED'] || 0,
                    expired: dStats['EXPIRED'] || 0,
                    totalKg: impactRes.data.data.totalKg || 0,
                    mealsRescued: impactRes.data.data.totalMeals || 0,
                });
            }
        }
        catch (err) {
            console.error('Failed to load donor dashboard data', err);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchDashboardData();
    }, []);
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
                success('Pickup code verified! The rescue has been recorded as COMPLETED.');
                setVerifyModalOpen(false);
                setPickupCodeInput('');
                setSelectedDonationId(null);
                fetchDashboardData();
            }
        }
        catch (err) {
            toastError(err.response?.data?.message || 'Invalid pickup code. Please check with the NGO receiver.');
        }
        finally {
            setIsVerifying(false);
        }
    };
    return (<div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-surface-border shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black text-slate-900">{user?.name}</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              {user?.donorType?.replace('_', ' ') || 'Donor'}
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Commercial Surplus Rescue Management Portal • {user?.address?.city || 'Gujarat'}
          </p>
        </div>

        <Link to="/donor/donations/create" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-md shadow-primary/20 transition">
          <PlusCircle className="w-4 h-4"/>
          <span>Publish Surplus Food</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Available Batches</span>
            <Package className="w-4 h-4 text-emerald-600"/>
          </div>
          <p className="text-3xl font-black text-slate-900">{stats.active}</p>
          <p className="text-[11px] text-slate-500 mt-1">Awaiting NGO claims</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Claims</span>
            <Clock className="w-4 h-4 text-amber-600"/>
          </div>
          <p className="text-3xl font-black text-amber-600">{stats.claimed}</p>
          <p className="text-[11px] text-slate-500 mt-1">Pending pickup handoff</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Completed Rescues</span>
            <CheckCircle2 className="w-4 h-4 text-primary"/>
          </div>
          <p className="text-3xl font-black text-slate-900">{stats.completed}</p>
          <p className="text-[11px] text-slate-500 mt-1">Safely handed over</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Estimated Meals</span>
            <Utensils className="w-4 h-4 text-ochre"/>
          </div>
          <p className="text-3xl font-black text-primary">{stats.mealsRescued}</p>
          <p className="text-[11px] text-slate-500 mt-1">Served to beneficiaries</p>
        </div>
      </div>

      {/* Pending Handoff Section */}
      {claimedHandoffs.some((c) => ['CLAIMED', 'DISPATCHED', 'IN_TRANSIT'].includes(c.status)) && (<div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-amber-700"/>
              <h3 className="font-bold text-slate-900 text-base">Claimed Batches Awaiting Pickup Verification</h3>
            </div>
            <span className="text-xs text-amber-800 font-semibold">Enter code to complete handoff</span>
          </div>

          <div className="space-y-3">
            {claimedHandoffs
                .filter((c) => ['CLAIMED', 'DISPATCHED', 'IN_TRANSIT'].includes(c.status))
                .map((claim) => (<div key={claim._id} className="bg-white p-4 rounded-2xl border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-slate-900 text-sm">{claim.donation?.title}</h4>
                      <StatusBadge status={claim.status}/>
                    </div>
                    <p className="text-xs text-slate-600">
                      Claimed by <strong className="text-slate-800">{claim.ngo?.name}</strong> • Contact: {claim.ngo?.phone || 'N/A'}
                    </p>
                  </div>

                  <button onClick={() => {
                    setSelectedDonationId(claim.donation?._id);
                    setPickupCodeInput('');
                    setVerifyModalOpen(true);
                }} className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5"/>
                    <span>Verify Pickup Code</span>
                  </button>
                </div>))}
          </div>
        </div>)}

      {/* Active Surplus Listings Table / Feed */}
      <div className="bg-white rounded-3xl border border-surface-border shadow-sm p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Recent Surplus Postings</h3>
            <p className="text-xs text-slate-500">Real-time status of your surplus listings</p>
          </div>
          <Link to="/donor/donations" className="text-xs font-bold text-primary hover:text-primary-dark flex items-center gap-1">
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5"/>
          </Link>
        </div>

        {activeDonations.length === 0 ? (<EmptyState title="No surplus food batches listed" description="Whenever you have excess food from buffets, banquets, or bakeries, list it here for instant NGO rescue." actionText="Publish First Surplus Batch" onAction={() => window.location.href = '/donor/donations/create'}/>) : (<div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-[11px] uppercase tracking-wider font-bold">
                  <th className="pb-3">Title & Category</th>
                  <th className="pb-3">Quantity</th>
                  <th className="pb-3">Urgency & Expiry</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeDonations.map((donation) => (<tr key={donation._id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4">
                      <div className="flex items-center gap-2.5">
                        <FoodTypeBadge type={donation.foodType}/>
                        <div>
                          <p className="font-bold text-slate-900 text-sm leading-tight">{donation.title}</p>
                          <span className="text-[11px] text-slate-500">{donation.category.replace('_', ' ')}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 font-semibold text-slate-800">
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
                    <td className="py-4 text-right">
                      <Link to={`/donor/donations/${donation._id}`} className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-xs transition">
                        Inspect
                      </Link>
                    </td>
                  </tr>))}
              </tbody>
            </table>
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
                Ask the NGO collection team for the 6-character pickup code displayed on their app.
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
