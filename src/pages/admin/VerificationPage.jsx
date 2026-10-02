import React, { useState, useEffect } from 'react';
import { FileText, Check, X, Building2, Building, ExternalLink } from 'lucide-react';
import { EmptyState } from '../../components/common/EmptyState';
import { useToast } from '../../context/ToastContext';
import api from '../../api/client';
import { documentUrl } from '../../utils/assetUrl';
export const VerificationPage = () => {
    const { success, error: toastError } = useToast();
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [roleFilter, setRoleFilter] = useState('');
    // Reject modal
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const fetchPending = async () => {
        try {
            setLoading(true);
            const url = roleFilter
                ? `/admin/users?status=PENDING&role=${roleFilter}`
                : '/admin/users?status=PENDING';
            const res = await api.get(url);
            if (res.data?.success) {
                setPendingUsers(res.data.data.users || []);
            }
        }
        catch (err) {
            console.error('Failed to load pending verifications', err);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchPending();
    }, [roleFilter]);
    const handleApprove = async (user) => {
        try {
            setIsProcessing(true);
            const res = await api.patch(`/admin/users/${user._id}/status`, {
                status: 'VERIFIED',
                adminNotes: 'Verified by system administrator after document inspection',
            });
            if (res.data?.success) {
                success(`${user.name} has been VERIFIED. They can now actively use the platform.`);
                fetchPending();
            }
        }
        catch (err) {
            toastError(err.response?.data?.message || 'Approval failed.');
        }
        finally {
            setIsProcessing(false);
        }
    };
    const handleConfirmReject = async () => {
        if (!selectedUser)
            return;
        try {
            setIsProcessing(true);
            const res = await api.patch(`/admin/users/${selectedUser._id}/status`, {
                status: 'REJECTED',
                rejectionReason: rejectionReason || 'Incomplete registration documents',
            });
            if (res.data?.success) {
                success(`${selectedUser.name} was rejected.`);
                setRejectModalOpen(false);
                setSelectedUser(null);
                setRejectionReason('');
                fetchPending();
            }
        }
        catch (err) {
            toastError(err.response?.data?.message || 'Rejection failed.');
        }
        finally {
            setIsProcessing(false);
        }
    };
    return (<div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-surface-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Partner Verification Queue</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Review food donor establishments and charitable non-profits requesting platform verification
          </p>
        </div>

        {/* Role Filter */}
        <div className="flex gap-2">
          {['', 'DONOR', 'NGO'].map((r) => (<button key={r} onClick={() => setRoleFilter(r)} className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${roleFilter === r
                ? 'bg-primary text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {r ? `${r}s Only` : 'All Pending'}
            </button>))}
        </div>
      </div>

      {/* Cards list */}
      <div className="space-y-4">
        {pendingUsers.length === 0 ? (<EmptyState title="Verification queue is clear" description="There are no pending donor or NGO accounts awaiting verification review."/>) : (pendingUsers.map((u) => (<div key={u._id} className="bg-white rounded-3xl border border-surface-border p-6 shadow-sm flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    {u.role}
                  </span>
                  <span className="text-xs text-slate-400">
                    Registered on {new Date(u.createdAt).toLocaleDateString('en-IN')}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 font-bold flex items-center justify-center">
                    {u.role === 'DONOR' ? <Building2 className="w-6 h-6 text-primary"/> : <Building className="w-6 h-6 text-ochre"/>}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{u.name}</h3>
                    <p className="text-xs text-slate-500">
                      Contact: {u.contactPersonName || 'N/A'} • {u.email} • {u.phone || 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-2xl text-xs">
                  <div>
                    <span className="text-slate-400 font-bold uppercase text-[10px]">Registration / FSSAI #</span>
                    <p className="font-semibold text-slate-800 mt-0.5">{u.registrationNumber || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold uppercase text-[10px]">Location</span>
                    <p className="font-semibold text-slate-800 mt-0.5">
                      {u.address?.city || 'Ahmedabad'}, {u.address?.state || 'Gujarat'} ({u.address?.pincode || '380001'})
                    </p>
                  </div>
                  {u.mission && (<div className="sm:col-span-2">
                      <span className="text-slate-400 font-bold uppercase text-[10px]">Mission Statement</span>
                      <p className="text-slate-700 mt-0.5 leading-relaxed">{u.mission}</p>
                    </div>)}
                  {u.organizationDescription && (<div className="sm:col-span-2">
                      <span className="text-slate-400 font-bold uppercase text-[10px]">Description</span>
                      <p className="text-slate-700 mt-0.5 leading-relaxed">{u.organizationDescription}</p>
                    </div>)}
                </div>

                {/* Uploaded Documents */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Uploaded Verification Certificates
                  </span>
                  {u.verificationDocuments && u.verificationDocuments.length > 0 ? (<div className="flex flex-wrap gap-2">
                      {u.verificationDocuments.map((doc) => (<a key={doc._id} href={documentUrl(doc.url)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-sm">
                          <FileText className="w-3.5 h-3.5 text-primary"/>
                          <span>{doc.name}</span>
                          <ExternalLink className="w-3 h-3 text-slate-400"/>
                        </a>))}
                    </div>) : (<p className="text-xs text-amber-700 italic">No verification documents attached.</p>)}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-row lg:flex-col gap-2 min-w-[140px]">
                <button onClick={() => handleApprove(u)} disabled={isProcessing} className="flex-1 lg:flex-none py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5 disabled:opacity-50">
                  <Check className="w-4 h-4"/>
                  <span>Approve & Verify</span>
                </button>

                <button onClick={() => {
                setSelectedUser(u);
                setRejectionReason('');
                setRejectModalOpen(true);
            }} disabled={isProcessing} className="flex-1 lg:flex-none py-2.5 px-4 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs transition flex items-center justify-center gap-1.5 disabled:opacity-50">
                  <X className="w-4 h-4"/>
                  <span>Reject</span>
                </button>
              </div>
            </div>)))}
      </div>

      {/* Reject Modal */}
      {rejectModalOpen && selectedUser && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-surface-border shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">
              Reject Verification for {selectedUser.name}
            </h3>
            <p className="text-xs text-slate-500">
              Please enter the specific reason for rejection. This will be transmitted to the organization's dashboard.
            </p>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Rejection Reason *
              </label>
              <textarea rows={3} required value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} placeholder="e.g. FSSAI license certificate expired or not matching registered establishment name." className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-primary"/>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setRejectModalOpen(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-700 text-xs hover:bg-slate-50">
                Cancel
              </button>
              <button type="button" onClick={handleConfirmReject} disabled={isProcessing || !rejectionReason.trim()} className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm disabled:opacity-50">
                {isProcessing ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>)}
    </div>);
};
