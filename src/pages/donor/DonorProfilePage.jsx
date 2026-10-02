import React, { useState } from 'react';
import { Upload, ShieldCheck, FileText, Lock, Save, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StatusBadge } from '../../components/common/Badge';
import api from '../../api/client';
import { documentUrl } from '../../utils/assetUrl';
export const DonorProfilePage = () => {
    const { user, refreshUser } = useAuth();
    const { success, error: toastError } = useToast();
    const [name, setName] = useState(user?.name || '');
    const [contactPersonName, setContactPersonName] = useState(user?.contactPersonName || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [addressLine, setAddressLine] = useState(user?.address?.addressLine || '');
    const [city, setCity] = useState(user?.address?.city || 'Ahmedabad');
    const [state, setState] = useState(user?.address?.state || 'Gujarat');
    const [pincode, setPincode] = useState(user?.address?.pincode || '');
    const [organizationDescription, setOrganizationDescription] = useState(user?.organizationDescription || '');
    const [isUpdating, setIsUpdating] = useState(false);
    const [isUploadingDoc, setIsUploadingDoc] = useState(false);
    // Password change
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
                organizationDescription,
                address: { addressLine, city, state, pincode },
            });
            if (res.data?.success) {
                success('Profile updated successfully.');
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
                success('Document uploaded for admin verification review.');
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
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-surface-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary-100 text-primary font-bold text-2xl flex items-center justify-center">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">{user?.name}</h1>
            <p className="text-xs text-slate-500">{user?.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <StatusBadge status={user?.status || 'PENDING'}/>
              <span className="text-xs font-semibold text-slate-600">
                {user?.donorType?.replace('_', ' ') || 'Commercial Donor'}
              </span>
            </div>
          </div>
        </div>

        {user?.status === 'VERIFIED' ? (<div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600"/>
            <span>Verified Donor Badge Active</span>
          </div>) : (<div className="text-right">
            <span className="text-xs font-bold text-amber-700">Account Pending Review</span>
            <p className="text-[11px] text-slate-500">Upload FSSAI or Trade license below</p>
          </div>)}
      </div>

      {/* Main Profile Form */}
      <div className="bg-white rounded-3xl border border-surface-border p-6 sm:p-10 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
          Organization Details
        </h3>

        <form onSubmit={handleUpdateProfile} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Establishment Name
              </label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"/>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Contact Person Name
              </label>
              <input type="text" required value={contactPersonName} onChange={(e) => setContactPersonName(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"/>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Phone Number
              </label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"/>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                FSSAI / Registration Number
              </label>
              <input type="text" disabled value={user?.registrationNumber || 'GJ-FSSAI-XXXX'} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-sm"/>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Establishment Description
            </label>
            <textarea rows={2} value={organizationDescription} onChange={(e) => setOrganizationDescription(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"/>
          </div>

          {/* Address */}
          <div className="border-t border-slate-100 pt-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-primary"/>
              <span>Registered Location</span>
            </h4>
            <div>
              <input type="text" value={addressLine} onChange={(e) => setAddressLine(e.target.value)} placeholder="Street address" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"/>
            </div>
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

      {/* Verification Documents Section */}
      <div className="bg-white rounded-3xl border border-surface-border p-6 sm:p-10 shadow-sm space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">FSSAI & Verification Documents</h3>
          <p className="text-xs text-slate-500">
            Upload FSSAI food license, GST certificate, or municipal health trade license for admin verification.
          </p>
        </div>

        {/* Existing Documents */}
        <div className="space-y-2">
          {user?.verificationDocuments && user.verificationDocuments.length > 0 ? (user.verificationDocuments.map((doc) => (<div key={doc._id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary"/>
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
              No verification documents uploaded yet. Upload a document below to expedite account verification.
            </div>)}
        </div>

        {/* Upload Box */}
        <div>
          <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-dashed border-primary text-primary hover:bg-primary-50 cursor-pointer font-bold text-xs transition">
            <Upload className="w-4 h-4"/>
            <span>{isUploadingDoc ? 'Uploading...' : 'Upload License Document (PDF / Image)'}</span>
            <input type="file" accept="application/pdf,image/jpeg,image/png" onChange={handleDocumentUpload} disabled={isUploadingDoc} className="hidden"/>
          </label>
        </div>
      </div>

      {/* Change Password Card */}
      <div className="bg-white rounded-3xl border border-surface-border p-6 sm:p-10 shadow-sm space-y-5">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Lock className="w-5 h-5 text-slate-400"/>
          <span>Change Password</span>
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
