import React, { useState } from 'react';
import { Upload, ShieldCheck, FileText, Lock, Save, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StatusBadge } from '../../components/common/Badge';
import api from '../../api/client';
import { documentUrl } from '../../utils/assetUrl';
export const NGOProfilePage = () => {
    const { user, refreshUser } = useAuth();
    const { success, error: toastError } = useToast();
    const [name, setName] = useState(user?.name || '');
    const [contactPersonName, setContactPersonName] = useState(user?.contactPersonName || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [mission, setMission] = useState(user?.mission || '');
    const [addressLine, setAddressLine] = useState(user?.address?.addressLine || '');
    const [city, setCity] = useState(user?.address?.city || 'Ahmedabad');
    const [state, setState] = useState(user?.address?.state || 'Gujarat');
    const [pincode, setPincode] = useState(user?.address?.pincode || '');
    const [isUpdating, setIsUpdating] = useState(false);
    const [isUploadingDoc, setIsUploadingDoc] = useState(false);
    // Password
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isChangingPass, setIsChangingPass] = useState(false);
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            setIsUpdating(true);
            const res = await api.patch('/auth/profile', {
                name,
                contactPersonName,
                phone,
                mission,
                address: { addressLine, city, state, pincode },
            });
            if (res.data?.success) {
                success('NGO Profile updated successfully.');
                refreshUser();
            }
        }
        catch (err) {
            toastError(err.response?.data?.message || 'Failed to update profile.');
        }
        finally {
            setIsUpdating(false);
        }
    };
    const handleDocumentUpload = async (e) => {
        if (!e.target.files || e.target.files.length === 0)
            return;
        try {
            setIsUploadingDoc(true);
            const formData = new FormData();
            Array.from(e.target.files).forEach((file) => {
                formData.append('documents', file);
            });
            const res = await api.post('/users/documents', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (res.data?.success) {
                success('NGO registration certificate uploaded for admin review.');
                refreshUser();
            }
        }
        catch (err) {
            toastError(err.response?.data?.message || 'Document upload failed.');
        }
        finally {
            setIsUploadingDoc(false);
        }
    };
    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toastError('New passwords do not match.');
            return;
        }
        if (newPassword.length < 8 || !/[A-Za-z]/.test(newPassword) || !/\d/.test(newPassword)) {
            toastError('Password must be at least 8 characters and include a letter and a number.');
            return;
        }
        try {
            setIsChangingPass(true);
            const res = await api.patch('/auth/change-password', {
                currentPassword,
                newPassword,
            });
            if (res.data?.success) {
                success('Password changed successfully.');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            }
        }
        catch (err) {
            toastError(err.response?.data?.message || 'Failed to change password.');
        }
        finally {
            setIsChangingPass(false);
        }
    };
    return (<div className="max-w-4xl mx-auto space-y-8">
      {/* Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-surface-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-ochre font-bold text-2xl flex items-center justify-center">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">{user?.name}</h1>
            <p className="text-xs text-slate-500">{user?.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <StatusBadge status={user?.status || 'PENDING'}/>
              <span className="text-xs font-semibold text-slate-600">Non-Profit Organization</span>
            </div>
          </div>
        </div>

        {user?.status === 'VERIFIED' ? (<div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600"/>
            <span>Verified NGO Partner</span>
          </div>) : (<div className="text-right">
            <span className="text-xs font-bold text-amber-700">Pending Trust Verification</span>
            <p className="text-[11px] text-slate-500">Upload 12A / 80G / Trust deed below</p>
          </div>)}
      </div>

      {/* Main Profile Form */}
      <div className="bg-white rounded-3xl border border-surface-border p-6 sm:p-10 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
          NGO Trust Profile
        </h3>

        <form onSubmit={handleUpdateProfile} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Trust / Organization Name
              </label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"/>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Secretary / Lead Contact
              </label>
              <input type="text" required value={contactPersonName} onChange={(e) => setContactPersonName(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"/>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Contact Phone
              </label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"/>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                NGO Registration #
              </label>
              <input type="text" disabled value={user?.registrationNumber || 'GUJ-NGO-XXXX'} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-sm"/>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Mission Statement & Community Focus
            </label>
            <textarea rows={3} value={mission} onChange={(e) => setMission(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"/>
          </div>

          {/* Location */}
          <div className="border-t border-slate-100 pt-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-primary"/>
              <span>Distribution Center Address</span>
            </h4>
            <input type="text" value={addressLine} onChange={(e) => setAddressLine(e.target.value)} placeholder="Address" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"/>
            <div className="grid grid-cols-3 gap-3">
              <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"/>
              <input type="text" value={state} onChange={(e) => setState(e.target.value)} placeholder="State" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"/>
              <input type="text" value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="Pincode" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"/>
            </div>
          </div>

          <button type="submit" disabled={isUpdating} className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-sm transition flex items-center gap-2 disabled:opacity-50">
            <Save className="w-4 h-4"/>
            <span>{isUpdating ? 'Saving Changes...' : 'Save Profile Changes'}</span>
          </button>
        </form>
      </div>

      {/* Verification Documents */}
      <div className="bg-white rounded-3xl border border-surface-border p-6 sm:p-10 shadow-sm space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Trust Certificates & Verification Documents</h3>
          <p className="text-xs text-slate-500">
            Upload Society Registration Certificate, 12A/80G, or Darpan portal ID for admin verification.
          </p>
        </div>

        <div className="space-y-2">
          {user?.verificationDocuments && user.verificationDocuments.length > 0 ? (user.verificationDocuments.map((doc) => (<div key={doc._id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-ochre"/>
                  <div>
                    <span className="font-bold text-slate-900 block">{doc.name}</span>
                    <span className="text-slate-500">
                      Uploaded on {new Date(doc.uploadedAt).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                </div>
                <a href={documentUrl(doc.url)} target="_blank" rel="noreferrer" className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 font-semibold hover:bg-slate-100">
                  View Document
                </a>
              </div>))) : (<div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
              No registration documents uploaded yet.
            </div>)}
        </div>

        <div>
          <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-dashed border-ochre text-ochre hover:bg-amber-50 cursor-pointer font-bold text-xs transition">
            <Upload className="w-4 h-4"/>
            <span>{isUploadingDoc ? 'Uploading...' : 'Upload Trust Document (PDF / Image)'}</span>
            <input type="file" accept="application/pdf,image/jpeg,image/png" onChange={handleDocumentUpload} disabled={isUploadingDoc} className="hidden"/>
          </label>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-3xl border border-surface-border p-6 sm:p-10 shadow-sm space-y-5">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Lock className="w-5 h-5 text-slate-400"/>
          <span>Security & Password</span>
        </h3>

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Current Password
            </label>
            <input type="password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"/>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              New Password
            </label>
            <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"/>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Confirm New Password
            </label>
            <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"/>
          </div>

          <button type="submit" disabled={isChangingPass} className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition disabled:opacity-50">
            {isChangingPass ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>);
};
