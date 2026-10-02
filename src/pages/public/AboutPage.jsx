import React from 'react';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { ShieldCheck, Target, Award, MapPin } from 'lucide-react';
export const AboutPage = () => {
    return (<div className="min-h-screen bg-[#FCF9F8] flex flex-col font-sans">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">About ShareHope</span>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Building India's Most Reliable Food Rescue Network
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            Founded with a vision to eradicate edible surplus food waste in Gujarat, ShareHope harnesses real-time technology to feed vulnerable communities with dignity and safety.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-3xl border border-surface-border shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-primary flex items-center justify-center">
              <Target className="w-6 h-6"/>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Our Mission</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              To rescue every edible kilogram of commercial food surplus before it spoils, ensuring timely redistribution to verified NGOs and community kitchens.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-surface-border shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-ochre flex items-center justify-center">
              <ShieldCheck className="w-6 h-6"/>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Safety & Compliance</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              We adhere strictly to FSSAI food safety guidelines. Temperature monitoring, secure digital handoff codes, and mandatory organization verification guarantee trust.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-surface-border shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center">
              <Award className="w-6 h-6"/>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Verified NGO Network</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              We empower verified charitable trusts and NGOs to collect surplus directly from local kitchens, tracking verified meals distributed and community impact transparently.
            </p>
          </div>
        </div>

        {/* Operating Hubs */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-surface-border shadow-sm mb-16">
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="w-6 h-6 text-primary"/>
            <h3 className="text-2xl font-bold text-slate-900">Our Gujarat Operating Hubs</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <h4 className="font-bold text-slate-900 text-base">Ahmedabad Central</h4>
              <p className="text-xs text-slate-500 mt-1">Covering SG Highway, Maninagar, Vastrapur, Ashram Road</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <h4 className="font-bold text-slate-900 text-base">Surat Industrial & Food Hub</h4>
              <p className="text-xs text-slate-500 mt-1">Covering Adajan, Ring Road, Varachha, Piplod</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <h4 className="font-bold text-slate-900 text-base">Gandhinagar Region</h4>
              <p className="text-xs text-slate-500 mt-1">Covering Sector 1-28, Infocity, Kudasan</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>);
};
