import React, { useState } from 'react';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
export const ContactPage = () => {
    const { success } = useToast();
    const [submitted, setSubmitted] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        success('Your message has been received! Our support coordinator will get in touch shortly.');
    };
    return (<div className="min-h-screen bg-[#FCF9F8] flex flex-col font-sans">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Get in Touch</span>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Contact the ShareHope Team
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            Have questions about donor onboarding, NGO trust verification, or corporate cafeteria integrations? We are here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-5xl mx-auto">
          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-surface-border shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-slate-900">Headquarters</h3>
              
              <div className="flex items-start gap-4 text-sm text-slate-600">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"/>
                <div>
                  <p className="font-semibold text-slate-900">ShareHope Network</p>
                  <p>SG Highway, Sola Cross Road</p>
                  <p>Ahmedabad, Gujarat 380054</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-slate-600">
                <Phone className="w-5 h-5 text-primary flex-shrink-0"/>
                <div>
                  <p className="font-semibold text-slate-900">Emergency Rescue Line</p>
                  <p>+91 (079) 4900-HOPE</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-slate-600">
                <Mail className="w-5 h-5 text-primary flex-shrink-0"/>
                <div>
                  <p className="font-semibold text-slate-900">Support Desk</p>
                  <p>support@sharehope.org</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-900 leading-relaxed">
              <span className="font-bold block mb-1">Commercial Donors Note:</span>
              For immediate surplus pickups with less than 2 hours before expiry, please mark your donation as <strong className="text-rose-700">CRITICAL</strong> directly in the donor portal for priority NGO notification and expedited pickup.
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-surface-border shadow-sm">
              {submitted ? (<div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-primary flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8"/>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900">Message Received!</h4>
                  <p className="text-sm text-slate-600 max-w-md mx-auto">
                    Thank you, {name}. A ShareHope operations lead will review your message and reply via {email}.
                  </p>
                  <button onClick={() => {
                setSubmitted(false);
                setName('');
                setEmail('');
                setSubject('');
                setMessage('');
            }} className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition">
                    Send Another Inquiry
                  </button>
                </div>) : (<form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Your Name *
                      </label>
                      <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Rajesh Patel" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"/>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Email Address *
                      </label>
                      <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="rajesh@hotel.com" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"/>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Subject *
                    </label>
                    <input type="text" required value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Surplus pickup inquiry / Partnership" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"/>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Message *
                    </label>
                    <textarea rows={4} required value={message} onChange={(e) => setMessage(e.target.value)} placeholder="How can our network support your surplus food rescue?" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"/>
                  </div>

                  <button type="submit" className="w-full py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-md shadow-primary/20 transition flex items-center justify-center gap-2">
                    <Send className="w-4 h-4"/>
                    <span>Send Inquiry</span>
                  </button>
                </form>)}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>);
};
