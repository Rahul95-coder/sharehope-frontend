import React from 'react';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
export const HowItWorksPage = () => {
    return (<div className="min-h-screen bg-[#FCF9F8] flex flex-col font-sans">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Technical & Operational Architecture</span>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            How ShareHope Coordinates Surplus Rescues
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            Our end-to-end platform architecture connects donors and verified non-profits with atomic locking, real-time expiry tracking, and digital verification codes.
          </p>
        </div>

        {/* Deep Dive Steps */}
        <div className="space-y-12 max-w-4xl mx-auto mb-16">
          {/* Step 1 */}
          <div className="bg-white p-8 rounded-3xl border border-surface-border shadow-sm flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-primary font-black text-xl flex items-center justify-center flex-shrink-0">
              01
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900">Surplus Assessment & Listing</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                When an event, hotel buffet, or bakery finishes meal service with quality surplus, the authorized donor logs into ShareHope. They submit food category, quantity, Veg/Non-Veg tag, storage condition (Room Temperature / Refrigerated), and the exact pickup expiry deadline.
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-slate-500 font-medium pt-1">
                <span className="px-2.5 py-1 rounded-lg bg-slate-100">FSSAI Compliance</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100">Multi-image uploads</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100">Server-side expiry timers</span>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-8 rounded-3xl border border-surface-border shadow-sm flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-ochre font-black text-xl flex items-center justify-center flex-shrink-0">
              02
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900">Atomic NGO Claim System</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Only verified non-governmental organizations with approved trust certificates can view and claim surplus food. When an NGO clicks "Claim", our MongoDB backend issues an atomic update. This strictly prevents multiple NGOs from racing for the same food batch.
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-slate-500 font-medium pt-1">
                <span className="px-2.5 py-1 rounded-lg bg-slate-100">Atomic Reservation</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100">Duplicate Claim Prevention</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100">SMS / In-app Alerts</span>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-8 rounded-3xl border border-surface-border shadow-sm flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-700 font-black text-xl flex items-center justify-center flex-shrink-0">
              03
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900">NGO Self-Collection & Dispatch</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Claiming NGOs organize their own dedicated collection teams and transport vehicles. NGOs assign their drivers or staff to collect the surplus within the requested pickup window, keeping full accountability within the organization.
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-slate-500 font-medium pt-1">
                <span className="px-2.5 py-1 rounded-lg bg-slate-100">Self-Managed Transport</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100">Direct Route Planning</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100">On-Time Collection</span>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-8 rounded-3xl border border-surface-border shadow-sm flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-800 font-black text-xl flex items-center justify-center flex-shrink-0">
              04
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900">Digital Pickup Code Handoff</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                No donation can be marked completed merely by clicking a button. When the NGO collection team arrives at the donor's kitchen, they present their secure 6-character pickup verification code. The donor enters this code into their dashboard to validate handover.
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-slate-500 font-medium pt-1">
                <span className="px-2.5 py-1 rounded-lg bg-slate-100">Secure Cryptographic Token</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100">Received Quantity Logging</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100">Verified Timestamp Logging</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/register" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-base shadow-lg shadow-primary/20 transition">
            <span>Register Your Organization</span>
            <ArrowRight className="w-4 h-4"/>
          </Link>
        </div>
      </div>

      <Footer />
    </div>);
};
