import React from 'react';
import { Link } from 'react-router-dom';
import { HeartHandshake, Mail, Phone, MapPin, ShieldCheck, Heart } from 'lucide-react';
export const Footer = () => {
    return (<footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-md">
                <HeartHandshake className="w-6 h-6"/>
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white">
                Share<span className="text-emerald-400">Hope</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              India's premier digital surplus food and essentials rescue network. Connecting commercial donors with verified NGOs to eradicate food waste and hunger in our communities.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold pt-2">
              <ShieldCheck className="w-4 h-4"/>
              <span>100% Verified NGOs & Donors Platform</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/how-it-works" className="hover:text-emerald-400 transition">How It Works</Link>
              </li>
              <li>
                <Link to="/impact" className="hover:text-emerald-400 transition">Impact & Analytics</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-emerald-400 transition">Our Mission</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-emerald-400 transition">Become a Donor</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-emerald-400 transition">Register as NGO</Link>
              </li>
            </ul>
          </div>

          {/* Legal / Roles */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Resources</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/login" className="hover:text-emerald-400 transition">Sign In</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-emerald-400 transition">Help & Support</Link>
              </li>
              <li>
                <span className="text-slate-400 text-xs">FSSAI Safety Compliance</span>
              </li>
              <li>
                <span className="text-slate-400 text-xs">Cold Chain Guidelines</span>
              </li>
              <li>
                <span className="text-slate-400 text-xs">NGO Collection Guidelines</span>
              </li>
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Headquarters</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-1"/>
                <span>SG Highway, Ahmedabad, Gujarat 380054, India</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0"/>
                <span>support@sharehope.org</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0"/>
                <span>+91 (079) 4900-HOPE</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} ShareHope Rescue Network. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500"/> for Zero Hunger & Zero Waste
          </p>
        </div>
      </div>
    </footer>);
};
