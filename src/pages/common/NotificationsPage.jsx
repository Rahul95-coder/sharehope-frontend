import React, { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck } from 'lucide-react';
import { EmptyState } from '../../components/common/EmptyState';
import { useToast } from '../../context/ToastContext';
import api from '../../api/client';
export const NotificationsPage = () => {
    const { success } = useToast();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [unreadOnly, setUnreadOnly] = useState(false);
    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const url = unreadOnly ? '/notifications?unreadOnly=true' : '/notifications';
            const res = await api.get(url);
            if (res.data?.success) {
                setNotifications(res.data.data.notifications || []);
                setUnreadCount(res.data.data.unreadCount || 0);
            }
        }
        catch (err) {
            console.error('Failed to load notifications', err);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchNotifications();
    }, [unreadOnly]);
    const handleMarkAsRead = async (id) => {
        try {
            await api.patch(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        }
        catch (_) { }
    };
    const handleMarkAllRead = async () => {
        try {
            await api.patch('/notifications/mark-all-read');
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
            success('All notifications marked as read.');
        }
        catch (_) { }
    };
    return (<div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-surface-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900">Notifications</h1>
            {unreadCount > 0 && (<span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                {unreadCount} unread
              </span>)}
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time updates regarding surplus claims, handoffs, and verification status
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setUnreadOnly(!unreadOnly)} className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition ${unreadOnly
            ? 'bg-slate-900 text-white border-slate-900'
            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
            {unreadOnly ? 'Showing Unread' : 'Filter Unread'}
          </button>

          {unreadCount > 0 && (<button onClick={handleMarkAllRead} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary-50 text-primary hover:bg-primary-100 font-bold text-xs transition">
              <CheckCheck className="w-4 h-4"/>
              <span>Mark all read</span>
            </button>)}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (<EmptyState icon={Bell} title="No notifications" description="You are all caught up! Updates regarding claims, shifts, and verification will appear here."/>) : (notifications.map((n) => (<div key={n._id} className={`p-5 rounded-3xl border transition shadow-sm flex items-start justify-between gap-4 ${n.isRead
                ? 'bg-white border-surface-border'
                : 'bg-emerald-50/40 border-primary/30 ring-1 ring-primary/10'}`}>
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5 ${n.isRead
                ? 'bg-slate-100 text-slate-500'
                : 'bg-primary text-white shadow-sm'}`}>
                  <Bell className="w-5 h-5"/>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm">{n.title}</h4>
                    {!n.isRead && (<span className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></span>)}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-xl">{n.message}</p>
                  <span className="text-[10px] text-slate-400 block pt-1">
                    {new Date(n.createdAt).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {!n.isRead && (<button onClick={() => handleMarkAsRead(n._id)} className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-primary-50 transition" title="Mark as read">
                  <Check className="w-4 h-4"/>
                </button>)}
            </div>)))}
      </div>
    </div>);
};
