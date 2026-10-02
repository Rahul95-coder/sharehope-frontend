import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HeartHandshake, Building2, Building, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../api/client';
export const RegisterPage = () => {
    const { login } = useAuth();
    const { success, error: toastError } = useToast();
    const navigate = useNavigate();
    const [role, setRole] = useState('DONOR');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    // Form states
    const [name, setName] = useState('');
    const [contactPersonName, setContactPersonName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    // Address
    const [addressLine, setAddressLine] = useState('');
    const [city, setCity] = useState('Ahmedabad');
    const [state, setState] = useState('Gujarat');
    const [pincode, setPincode] = useState('');
    // Donor-specific
    const [donorType, setDonorType] = useState('RESTAURANT');
    const [registrationNumber, setRegistrationNumber] = useState('');
    const [organizationDescription, setOrganizationDescription] = useState('');
    // NGO-specific
    const [mission, setMission] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
            return;
        }
        if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
            setErrorMessage('Password must be at least 8 characters and include a letter and a number.');
            return;
        }
        setIsLoading(true);
        try {
            const payload = {
                name,
                contactPersonName,
                email,
                phone,
                password,
                role,
                address: {
                    addressLine,
                    city,
                    state,
                    pincode,
                },
            };
            if (role === 'DONOR') {
                payload.donorType = donorType;
                payload.registrationNumber = registrationNumber;
                payload.organizationDescription = organizationDescription;
            }
            else if (role === 'NGO') {
                payload.registrationNumber = registrationNumber;
                payload.organizationDescription = organizationDescription;
                payload.mission = mission;
            }
            const response = await api.post('/auth/register', payload);
            if (response.data?.success) {
                const { token, user } = response.data.data;
                login(token, user);
                success('Account created successfully! Welcome to ShareHope.');
                const dashboardMap = {
                    DONOR: '/donor/dashboard',
                    NGO: '/ngo/dashboard',
                };
                navigate(dashboardMap[role] || '/');
            }
        }
        catch (err) {
            const msg = err.response?.data?.message || 'Registration failed. Please check the entered data.';
            setErrorMessage(msg);
            toastError(msg);
        }
        finally {
            setIsLoading(false);
        }
    };
    return (<div className="min-h-screen bg-[#FCF9F8] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <HeartHandshake className="w-7 h-7"/>
            </div>
            <span className="text-3xl font-extrabold tracking-tight text-slate-900">
              Share<span className="text-primary">Hope</span>
            </span>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Join the Surplus Rescue Network
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Already registered?{' '}
            <Link to="/login" className="font-semibold text-primary hover:text-primary-dark">
              Sign in to your account
            </Link>
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-3 mb-8 bg-slate-100 p-1.5 rounded-2xl">
          <button type="button" onClick={() => setRole('DONOR')} className={`flex flex-col items-center gap-1.5 py-3 rounded-xl font-bold text-xs sm:text-sm transition ${role === 'DONOR'
            ? 'bg-white text-primary shadow-sm'
            : 'text-slate-600 hover:text-slate-900'}`}>
            <Building2 className="w-5 h-5"/>
            <span>Food Donor</span>
          </button>
          <button type="button" onClick={() => setRole('NGO')} className={`flex flex-col items-center gap-1.5 py-3 rounded-xl font-bold text-xs sm:text-sm transition ${role === 'NGO'
            ? 'bg-white text-primary shadow-sm'
            : 'text-slate-600 hover:text-slate-900'}`}>
            <Building className="w-5 h-5"/>
            <span>NGO / Charity</span>
          </button>
        </div>

        {/* Form Card */}
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-surface-border shadow-xl shadow-slate-200/50">
          {errorMessage && (<div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600 mt-0.5"/>
              <span>{errorMessage}</span>
            </div>)}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Organization Name *
                </label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Grand Heritage Hotel / Annapurna Trust" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"/>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Contact Person Name *
                </label>
                <input type="text" required value={contactPersonName} onChange={(e) => setContactPersonName(e.target.value)} placeholder="Rajesh Patel" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"/>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Email Address *
                </label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="contact@domain.com" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"/>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Phone Number *
                </label>
                <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="9876543210" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"/>
              </div>
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Password *
                </label>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"/>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Confirm Password *
                </label>
                <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"/>
              </div>
            </div>

            {/* Address */}
            <div className="border-t border-slate-100 pt-5 space-y-4">
              <h4 className="text-sm font-bold text-slate-800">Location & Address</h4>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Street Address / Area
                </label>
                <input type="text" value={addressLine} onChange={(e) => setAddressLine(e.target.value)} placeholder="SG Highway, Near Iscon Cross Road" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"/>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">City</label>
                  <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Ahmedabad" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"/>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">State</label>
                  <input type="text" value={state} onChange={(e) => setState(e.target.value)} placeholder="Gujarat" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"/>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Pincode</label>
                  <input type="text" value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="380015" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"/>
                </div>
              </div>
            </div>

            {/* Role specific inputs */}
            {role === 'DONOR' && (<div className="border-t border-slate-100 pt-5 space-y-4">
                <h4 className="text-sm font-bold text-slate-800">Donor Profile</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Establishment Type
                    </label>
                    <select value={donorType} onChange={(e) => setDonorType(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white">
                      <option value="RESTAURANT">Restaurant</option>
                      <option value="HOTEL">Hotel</option>
                      <option value="BAKERY">Bakery</option>
                      <option value="CLOUD_KITCHEN">Cloud Kitchen</option>
                      <option value="EVENT_ORGANIZER">Event / Wedding Caterer</option>
                      <option value="CANTEEN">Corporate / College Canteen</option>
                      <option value="OTHER">Other Surplus Provider</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      FSSAI / Registration #
                    </label>
                    <input type="text" value={registrationNumber} onChange={(e) => setRegistrationNumber(e.target.value)} placeholder="GJ-FSSAI-2024-XXXX" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"/>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    About your establishment
                  </label>
                  <textarea rows={2} value={organizationDescription} onChange={(e) => setOrganizationDescription(e.target.value)} placeholder="Daily buffet capacity, food preparation guidelines..." className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"/>
                </div>
              </div>)}

            {role === 'NGO' && (<div className="border-t border-slate-100 pt-5 space-y-4">
                <h4 className="text-sm font-bold text-slate-800">NGO Verification Details</h4>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    NGO Trust / Society Registration Number *
                  </label>
                  <input type="text" required value={registrationNumber} onChange={(e) => setRegistrationNumber(e.target.value)} placeholder="GUJ-NGO-2020-XXXX" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"/>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Mission Statement *
                  </label>
                  <textarea rows={2} required value={mission} onChange={(e) => setMission(e.target.value)} placeholder="E.g., Feeding 500 vulnerable families daily across East Ahmedabad." className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"/>
                </div>
              </div>)}


            <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-md shadow-primary/20 transition disabled:opacity-50">
              {isLoading ? ('Creating your account...') : (<>
                  <span>Create {role.toLowerCase()} account</span>
                  <ArrowRight className="w-4 h-4"/>
                </>)}
            </button>
          </form>
        </div>
      </div>
    </div>);
};
