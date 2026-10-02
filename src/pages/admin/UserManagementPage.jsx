import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { StatusBadge, Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { useToast } from '../../context/ToastContext';
import api from '../../api/client';
export const UserManagementPage = () => {
    const { success, error: toastError } = useToast();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    // Status update modal
    const [selectedUser, setSelectedUser] = useState(null);
    const [newStatus, setNewStatus] = useState('VERIFIED');
    const [adminNotes, setAdminNotes] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (searchTerm)
                params.append('search', searchTerm);
            if (roleFilter)
                params.append('role', roleFilter);
            if (statusFilter)
                params.append('status', statusFilter);
            params.append('page', String(page));
            params.append('limit', '15');
            const res = await api.get(`/admin/users?${params.toString()}`);
            if (res.data?.success) {
                setUsers(res.data.data.users || []);
                setTotalPages(res.data.data.pagination?.pages || 1);
            }
        }
        catch (err) {
            console.error('Failed to load users', err);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchUsers();
    }, [searchTerm, roleFilter, statusFilter, page]);
    const handleUpdateStatus = async (e) => {
        e.preventDefault();
        if (!selectedUser)
            return;
        try {
            setIsUpdating(true);
            const res = await api.patch(`/admin/users/${selectedUser._id}/status`, {
                status: newStatus,
                adminNotes,
            });
            if (res.data?.success) {
                success(`User status updated to ${newStatus}`);
                setSelectedUser(null);
                setAdminNotes('');
                fetchUsers();
            }
        }
        catch (err) {
            toastError(err.response?.data?.message || 'Failed to update user.');
        }
        finally {
            setIsUpdating(false);
        }
    };
    return (<div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-surface-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">User & Partner Directory</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Comprehensive registry of donors, verified non-profits, and platform administrators
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-surface-border shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5"/>
          <input type="text" placeholder="Search by name, email..." value={searchTerm} onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
        }} className="w-full pl-10 pr-4 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-primary"/>
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <select value={roleFilter} onChange={(e) => {
            setRoleFilter(e.target.value);
            setPage(1);
        }} className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white text-slate-700 font-medium">
            <option value="">All Roles</option>
            <option value="ADMIN">Admins</option>
            <option value="DONOR">Donors</option>
            <option value="NGO">NGOs</option>
          </select>

          <select value={statusFilter} onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
        }} className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white text-slate-700 font-medium">
            <option value="">All Statuses</option>
            <option value="VERIFIED">Verified</option>
            <option value="PENDING">Pending</option>
            <option value="REJECTED">Rejected</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-surface-border shadow-sm p-6 space-y-4">
        {users.length === 0 ? (<EmptyState title="No users match search" description="Try changing your search term or clearing the role/status filter."/>) : (<div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-[11px] uppercase tracking-wider font-bold">
                  <th className="pb-3">User / Organization</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">City</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Joined Date</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (<tr key={u._id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4">
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{u.name}</p>
                        <span className="text-xs text-slate-500">{u.email}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <Badge size="sm" variant={u.role === 'ADMIN' ? 'danger' : 'default'}>
                        {u.role}
                      </Badge>
                    </td>
                    <td className="py-4 text-xs text-slate-600 font-medium">
                      {u.address?.city || 'Gujarat'}
                    </td>
                    <td className="py-4">
                      <StatusBadge status={u.status}/>
                    </td>
                    <td className="py-4 text-xs text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-4 text-right">
                      {u.role !== 'ADMIN' && (<button onClick={() => {
                        setSelectedUser(u);
                        setNewStatus(u.status);
                        setAdminNotes(u.adminNotes || '');
                    }} className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold">
                          Modify Status
                        </button>)}
                    </td>
                  </tr>))}
              </tbody>
            </table>
          </div>)}

        {/* Pagination */}
        {totalPages > 1 && (<div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs">
            <span className="text-slate-500">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40">
                Previous
              </button>
              <button disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40">
                Next
              </button>
            </div>
          </div>)}
      </div>

      {/* Modify Status Modal */}
      {selectedUser && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-surface-border shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">
              Manage Status for {selectedUser.name}
            </h3>
            <p className="text-xs text-slate-500">
              Current Role: <strong>{selectedUser.role}</strong> • Current Status: <strong>{selectedUser.status}</strong>
            </p>

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Change Status To
                </label>
                <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-800 font-semibold">
                  <option value="VERIFIED">VERIFIED (Full access)</option>
                  <option value="PENDING">PENDING (Restricted features)</option>
                  <option value="REJECTED">REJECTED (Access blocked)</option>
                  <option value="SUSPENDED">SUSPENDED (Temporarily disabled)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Internal Administrative Notes
                </label>
                <textarea rows={2} value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} placeholder="Reason for status adjustment..." className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"/>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setSelectedUser(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-700 text-xs hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit" disabled={isUpdating} className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs shadow-sm disabled:opacity-50">
                  {isUpdating ? 'Saving...' : 'Update Status'}
                </button>
              </div>
            </form>
          </div>
        </div>)}
    </div>);
};
