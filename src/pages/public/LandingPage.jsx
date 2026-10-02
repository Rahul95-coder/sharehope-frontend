import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Utensils, ShieldCheck, Truck, ArrowRight, Sparkles, CheckCircle2, Clock, Building2, Building } from 'lucide-react';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import api from '../../api/client';
export const LandingPage = () => {
    const [stats, setStats] = useState({
        totalDonations: 120,
        completedDonations: 98,
        availableDonations: 6,
        verifiedDonors: 14,
        verifiedNGOs: 18,
        volunteers: 45,
        totalKgRescued: 4850,
        totalMealsProvided: 19400,
        familiesSupported: 4850,
        volunteerHours: 320,
    });
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/impact/public');
                if (res.data?.success) {
                    setStats(res.data.data);
                }
            }
            catch (_) { }
        };
        fetchStats();
    }, []);
    return (<div className="min-h-screen bg-[#FCF9F8] flex flex-col font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5 text-primary"/>
                <span>Food & Essential Surplus Rescue Network</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Turn Commercial Surplus into <span className="text-primary underline decoration-ochre/50 decoration-wavy">Hope & Nourishment</span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                ShareHope bridges commercial hotels, restaurants, bakeries, and cafeterias with verified NGOs across Gujarat. Real-time surplus dispatch before waste happens.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link to="/register" className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-base shadow-lg shadow-primary/25 transition flex items-center justify-center gap-2 group">
                  <span>Donate Surplus Food</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition"/>
                </Link>
                <Link to="/how-it-works" className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-base border border-slate-200 shadow-sm transition flex items-center justify-center">
                  How It Works
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-semibold text-slate-500 border-t border-slate-200/80">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600"/>
                  <span>Admin-Verified NGOs</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-600"/>
                  <span>Sub-2hr Expiry Alerting</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-primary"/>
                  <span>Secure Handoff Codes</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Card / Visual */}
            <div className="lg:col-span-5 relative">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-surface-border shadow-2xl shadow-slate-200 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                      <Utensils className="w-5 h-5"/>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Live Surplus Rescue Feed</h4>
                      <p className="text-xs text-slate-500">Ahmedabad & Surat Hubs</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
                    ACTIVE
                  </span>
                </div>

                {/* Sample items */}
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-emerald-800">Cooked Food • VEG</span>
                      <h5 className="font-bold text-slate-900 text-sm">Fresh Gujarati Thali (150 portions)</h5>
                      <p className="text-xs text-slate-500">Rajhans Hotel, SG Highway</p>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 bg-amber-500 text-white rounded text-[10px] font-bold">URGENT</span>
                      <p className="text-xs text-slate-600 font-semibold mt-1">2h left</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-600">Bakery Surplus</span>
                      <h5 className="font-bold text-slate-900 text-sm">Artisan Breads & Pav (25 kg)</h5>
                      <p className="text-xs text-slate-500">Roti Bakery, Surat</p>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[10px] font-bold">CLAIMED</span>
                      <p className="text-xs text-slate-600 font-semibold mt-1">Sahyog NGO</p>
                    </div>
                  </div>
                </div>

                {/* Quick Impact Highlight */}
                <div className="p-4 rounded-2xl bg-primary text-white flex items-center justify-between">
                  <div>
                    <p className="text-xs text-emerald-200">Total Rescued So Far</p>
                    <p className="text-2xl font-black">{stats.totalKgRescued.toLocaleString()} kg</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-emerald-200">Meals Distributed</p>
                    <p className="text-2xl font-black">{stats.totalMealsProvided.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Counter Section */}
      <section className="bg-white border-y border-surface-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <p className="text-3xl sm:text-4xl font-black text-primary">{stats.totalKgRescued.toLocaleString()} kg</p>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1 uppercase tracking-wider">Surplus Food Saved</p>
            </div>
            <div className="p-4">
              <p className="text-3xl sm:text-4xl font-black text-slate-900">{stats.totalMealsProvided.toLocaleString()}</p>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1 uppercase tracking-wider">Nutritious Meals Served</p>
            </div>
            <div className="p-4">
              <p className="text-3xl sm:text-4xl font-black text-ochre">{stats.verifiedNGOs}</p>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1 uppercase tracking-wider">Active NGOs</p>
            </div>
            <div className="p-4">
              <p className="text-3xl sm:text-4xl font-black text-emerald-700">{stats.verifiedDonors}</p>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1 uppercase tracking-wider">Donor Partners</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Transparent Handoff Workflow</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            How ShareHope Connects Surplus to Community Need
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            From kitchen surplus to community dinner table in under 3 hours with strict digital verification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-sm relative">
            <span className="w-8 h-8 rounded-full bg-primary text-white font-bold text-sm flex items-center justify-center mb-4">
              1
            </span>
            <h4 className="font-bold text-slate-900 mb-2">Donor Posts Surplus</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Verified hotels, caterers, or bakeries list excess quantity, temperature guidelines, and expiry deadline.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-sm relative">
            <span className="w-8 h-8 rounded-full bg-primary text-white font-bold text-sm flex items-center justify-center mb-4">
              2
            </span>
            <h4 className="font-bold text-slate-900 mb-2">NGO Claims Instantly</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Nearby verified NGOs claim the batch with atomic backend reservation preventing duplicate bookings.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-sm relative">
            <span className="w-8 h-8 rounded-full bg-primary text-white font-bold text-sm flex items-center justify-center mb-4">
              3
            </span>
            <h4 className="font-bold text-slate-900 mb-2">NGO Self-Collection</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Claiming NGOs dispatch their own collection teams and transport to collect surplus directly from the donor.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-sm relative">
            <span className="w-8 h-8 rounded-full bg-primary text-white font-bold text-sm flex items-center justify-center mb-4">
              4
            </span>
            <h4 className="font-bold text-slate-900 mb-2">Secure Pickup Code</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Donor verifies the 6-character digital handoff code upon pickup before marking the rescue completed.
            </p>
          </div>
        </div>
      </section>

      {/* For Donors & NGOs Cards */}
      <section className="bg-slate-100/60 py-20 border-y border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Donors Card */}
            <div className="bg-white rounded-3xl p-8 border border-surface-border shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-primary flex items-center justify-center mb-6">
                  <Building2 className="w-6 h-6"/>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">For Commercial Donors</h3>
                <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                  Hotels, restaurants, bakeries, and cloud kitchens eliminate disposal costs, receive tax documentation, and track quantifiable community impact.
                </p>
                <ul className="space-y-2 text-xs text-slate-600 mb-6 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary"/>
                    <span>Upload multiple photos of excess food</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary"/>
                    <span>Real-time claim notification on your phone</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary"/>
                    <span>Digital handoff code ensures secure transfer</span>
                  </li>
                </ul>
              </div>
              <Link to="/register" className="w-full py-2.5 text-center rounded-xl bg-primary-50 hover:bg-primary-100 text-primary font-bold text-sm transition">
                Register as Donor
              </Link>
            </div>

            {/* NGOs Card */}
            <div className="bg-white rounded-3xl p-8 border border-surface-border shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-ochre flex items-center justify-center mb-6">
                  <Building className="w-6 h-6"/>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">For Verified NGOs</h3>
                <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                  Access a verified stream of high-quality food, bakery goods, and groceries at zero cost to serve vulnerable shelters, children, and elderly centers.
                </p>
                <ul className="space-y-2 text-xs text-slate-600 mb-6 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-ochre"/>
                    <span>Search by city, category, and food type (Veg/Non-Veg)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-ochre"/>
                    <span>One-click claim with atomic lock</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-ochre"/>
                    <span>Log received quantities and photo proofs</span>
                  </li>
                </ul>
              </div>
              <Link to="/register" className="w-full py-2.5 text-center rounded-xl bg-amber-50 hover:bg-amber-100 text-ochre font-bold text-sm transition">
                Register as NGO
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-primary p-8 sm:p-14 text-white text-center relative overflow-hidden shadow-xl shadow-primary/20">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Join the Movement to Zero Food Waste?
            </h2>
            <p className="text-emerald-100 text-base leading-relaxed">
              Every meal rescued protects our environment, supports local shelters, and builds a stronger Gujarat community.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-primary font-bold text-base hover:bg-emerald-50 transition shadow">
                Create Free Account
              </Link>
              <Link to="/contact" className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-primary-dark/80 hover:bg-primary-dark text-white font-bold text-base transition border border-white/20">
                Contact Our Team
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>);
};
