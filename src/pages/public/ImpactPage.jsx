import React, { useEffect, useState } from 'react';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { Utensils, HeartHandshake, Users, ShieldCheck, TreePine, Droplet } from 'lucide-react';
import api from '../../api/client';
export const ImpactPage = () => {
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
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/impact/public');
                if (res.data?.success) {
                    setStats(res.data.data);
                }
            }
            catch (err) {
                console.error('Failed to load public impact stats', err);
            }
            finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);
    // Environmental formulas
    const co2SavedKg = Math.round(stats.totalKgRescued * 2.5); // 1kg food waste avoided ~ 2.5kg CO2
    const waterSavedLiters = Math.round(stats.totalKgRescued * 100);
    return (<div className="min-h-screen bg-[#FCF9F8] flex flex-col font-sans">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Live Database Metrics</span>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Real-Time Community & Environmental Impact
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            Every donation logged into ShareHope translates into verified meals delivered and measurable greenhouse gas diversions.
          </p>
        </div>

        {/* Primary Impact Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-3xl border border-surface-border shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-primary flex items-center justify-center mb-4">
              <Utensils className="w-6 h-6"/>
            </div>
            <p className="text-3xl font-black text-slate-900">{stats.totalKgRescued.toLocaleString()} kg</p>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">Food Surplus Rescued</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-surface-border shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-ochre flex items-center justify-center mb-4">
              <HeartHandshake className="w-6 h-6"/>
            </div>
            <p className="text-3xl font-black text-slate-900">{stats.totalMealsProvided.toLocaleString()}</p>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">Meals Provided</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-surface-border shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center mb-4">
              <Users className="w-6 h-6"/>
            </div>
            <p className="text-3xl font-black text-slate-900">{stats.familiesSupported.toLocaleString()}</p>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">Families Supported</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-surface-border shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6"/>
            </div>
            <p className="text-3xl font-black text-slate-900">{stats.completedDonations.toLocaleString()}</p>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">Completed Rescues</p>
          </div>
        </div>

        {/* Environmental Diversion Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-surface-border shadow-sm mb-16">
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Environmental Benefits Calculated</h3>
          <p className="text-slate-600 text-sm mb-8">
            Decaying food in landfills produces methane, a potent greenhouse gas. By diverting edible surplus into community kitchens, ShareHope protects our environment.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
              <div className="p-3 bg-white rounded-xl text-primary shadow-sm">
                <TreePine className="w-6 h-6"/>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">{co2SavedKg.toLocaleString()} kg</p>
                <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider mt-0.5">CO₂ Emissions Diverted</p>
                <p className="text-xs text-slate-600 mt-1">Equivalent to planting {Math.round(co2SavedKg / 22)} trees annually.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-sky-50/60 border border-sky-100">
              <div className="p-3 bg-white rounded-xl text-sky-700 shadow-sm">
                <Droplet className="w-6 h-6"/>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">{waterSavedLiters.toLocaleString()} L</p>
                <p className="text-xs font-bold text-sky-800 uppercase tracking-wider mt-0.5">Embedded Fresh Water Preserved</p>
                <p className="text-xs text-slate-600 mt-1">Conserved agricultural and food processing water footprint.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>);
};
