import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, CheckCircle2, Eye } from 'lucide-react';
import { UrgencyBadge, FoodTypeBadge } from '../../components/common/Badge';
import { CountdownTimer } from '../../components/common/CountdownTimer';
import { EmptyState } from '../../components/common/EmptyState';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../api/client';
export const BrowseDonationsPage = () => {
    const { user } = useAuth();
    const { success, error: toastError } = useToast();
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [foodTypeFilter, setFoodTypeFilter] = useState('');
    const [cityFilter, setCityFilter] = useState('');
    const [urgencyFilter, setUrgencyFilter] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    // Claim modal state
    const [claimedCode, setClaimedCode] = useState(null);
    const [claimedDonationTitle, setClaimedDonationTitle] = useState('');
    const [isClaiming, setIsClaiming] = useState(null);
    const fetchDonations = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            params.append('status', 'AVAILABLE');
            if (searchTerm)
                params.append('search', searchTerm);
            if (categoryFilter)
                params.append('category', categoryFilter);
            if (foodTypeFilter)
                params.append('foodType', foodTypeFilter);
            if (cityFilter)
                params.append('city', cityFilter);
            if (urgencyFilter)
                params.append('urgency', urgencyFilter);
            params.append('page', String(page));
            params.append('limit', '9');
            const res = await api.get(`/donations?${params.toString()}`);
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
    }, [searchTerm, categoryFilter, foodTypeFilter, cityFilter, urgencyFilter, page]);
    const handleClaim = async (donation) => {
        if (user?.status !== 'VERIFIED') {
            toastError('Your NGO account must be VERIFIED before you can claim surplus food.');
            return;
        }
        try {
            setIsClaiming(donation._id);
            const res = await api.post(`/donations/${donation._id}/claim`);
            if (res.data?.success) {
                const code = res.data.data.claim?.pickupCode || res.data.data.donation?.pickupCode;
                setClaimedCode(code);
                setClaimedDonationTitle(donation.title);
                success('Surplus batch claimed successfully!');
                fetchDonations();
            }
        }
        catch (err) {
            toastError(err.response?.data?.message || 'Could not claim this donation. It may have expired or been claimed.');
        }
        finally {
            setIsClaiming(null);
        }
    };
    return (<div className="space-y-6">
      {/* Page Title */}
      <div className="bg-white p-6 rounded-3xl border border-surface-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Browse Available Food Surplus</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time feed of commercial kitchen buffets, bakeries, and packaged surplus available for pickup
          </p>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-5 rounded-3xl border border-surface-border shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3"/>
            <input type="text" placeholder="Search by title, description..." value={searchTerm} onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
        }} className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-primary"/>
          </div>

          {/* Category */}
          <div>
            <select value={categoryFilter} onChange={(e) => {
            setCategoryFilter(e.target.value);
            setPage(1);
        }} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-700">
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

          {/* Food Type */}
          <div>
            <select value={foodTypeFilter} onChange={(e) => {
            setFoodTypeFilter(e.target.value);
            setPage(1);
        }} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-700">
              <option value="">All Types (Veg/Non-Veg)</option>
              <option value="VEG">Vegetarian Only</option>
              <option value="NONVEG">Non-Vegetarian</option>
            </select>
          </div>

          {/* City */}
          <div>
            <select value={cityFilter} onChange={(e) => {
            setCityFilter(e.target.value);
            setPage(1);
        }} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-700">
              <option value="">All Gujarat Hubs</option>
              <option value="Ahmedabad">Ahmedabad</option>
              <option value="Surat">Surat</option>
              <option value="Gandhinagar">Gandhinagar</option>
            </select>
          </div>
        </div>

        {/* Urgency quick pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="font-bold text-slate-400 uppercase text-[10px]">Filter Urgency:</span>
          {['', 'CRITICAL', 'URGENT', 'NORMAL'].map((u) => (<button key={u} onClick={() => {
                setUrgencyFilter(u);
                setPage(1);
            }} className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${urgencyFilter === u
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {u || 'Any Urgency'}
            </button>))}
        </div>
      </div>

      {/* Grid of Donations */}
      {donations.length === 0 ? (<EmptyState title="No surplus food available" description="There are currently no active surplus batches matching your filters. Try clearing some search criteria." actionText="Clear All Filters" onAction={() => {
                setSearchTerm('');
                setCategoryFilter('');
                setFoodTypeFilter('');
                setCityFilter('');
                setUrgencyFilter('');
                setPage(1);
            }}/>) : (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {donations.map((donation) => (<div key={donation._id} className="bg-white rounded-3xl border border-surface-border hover:border-primary/50 transition p-6 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                {/* Header tags */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5">
                    <FoodTypeBadge type={donation.foodType}/>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      {donation.category.replace('_', ' ')}
                    </span>
                  </div>
                  <UrgencyBadge urgency={donation.urgency}/>
                </div>

                {/* Title */}
                <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2">
                  {donation.title}
                </h3>

                {/* Quantity */}
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-900">
                    {donation.quantity} {donation.unit}
                  </span>
                  <span className="text-xs font-semibold text-primary">
                    (~{donation.estimatedMeals || Math.round(donation.quantity * 3)} meals)
                  </span>
                </div>

                {/* Donor & Location Card */}
                <div className="mt-4 p-3.5 bg-slate-50 rounded-2xl text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Donor:</span>
                    <span className="font-bold text-slate-800">
                      {typeof donation.donor === 'object' ? donation.donor.name : 'Verified Donor'}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-slate-500">Location:</span>
                    <span className="font-medium text-slate-700 text-right">
                      {donation.pickupAddress?.addressLine ? `${donation.pickupAddress.addressLine}, ` : ''}
                      {donation.pickupAddress?.city || 'Ahmedabad'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/60">
                    <span className="text-slate-500">Expiry Timer:</span>
                    <CountdownTimer targetDate={donation.expiryDateTime}/>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <Link to={`/ngo/donations/${donation._id}`} className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs text-center transition">
                  <Eye className="w-4 h-4"/>
                </Link>
                <button onClick={() => handleClaim(donation)} disabled={isClaiming === donation._id || user?.status !== 'VERIFIED'} className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs shadow-md shadow-primary/20 transition flex items-center justify-center gap-2 disabled:opacity-50">
                  <CheckCircle2 className="w-4 h-4"/>
                  <span>{isClaiming === donation._id ? 'Reserving Batch...' : 'Claim Surplus Batch'}</span>
                </button>
              </div>
            </div>))}
        </div>)}

      {/* Pagination */}
      {totalPages > 1 && (<div className="flex items-center justify-between pt-4 bg-white p-4 rounded-2xl border border-surface-border text-xs">
          <span className="text-slate-500 font-medium">Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="px-3.5 py-1.5 rounded-xl border border-slate-200 disabled:opacity-40 font-semibold">
              Previous
            </button>
            <button disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="px-3.5 py-1.5 rounded-xl border border-slate-200 disabled:opacity-40 font-semibold">
              Next
            </button>
          </div>
        </div>)}

      {/* Claim Success Modal showing Pickup Code */}
      {claimedCode && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 border border-surface-border shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-primary flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8"/>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900">Donation Claimed!</h3>
              <p className="text-xs text-slate-600">
                You have successfully reserved <strong className="text-slate-900">"{claimedDonationTitle}"</strong>.
              </p>
            </div>

            {/* Code Box */}
            <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-200 space-y-1">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">
                Digital Pickup Verification Code
              </span>
              <p className="text-4xl font-mono font-black text-primary tracking-widest">
                {claimedCode}
              </p>
              <p className="text-[11px] text-emerald-700 mt-2">
                Present this code to the donor upon collection to verify physical handoff.
              </p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setClaimedCode(null)} className="flex-1 py-3 rounded-xl border border-slate-200 font-bold text-xs text-slate-700 hover:bg-slate-50">
                Close
              </button>
              <Link to="/ngo/claims" className="flex-1 py-3 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-dark shadow-sm flex items-center justify-center">
                View in Active Claims
              </Link>
            </div>
          </div>
        </div>)}
    </div>);
};
