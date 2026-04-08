import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { notificationAPI } from '../../services/api';

const Icon = ({ path, size = 18, className = '' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
        {path}
    </svg>
);

const icons = {
    bell: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></>,
    message: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></>,
    check: <><polyline points="20 6 9 17 4 12" /></>,
    clock: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></>,
};

const Notifications = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            if (!user) return;
            try {
                const userId = user.id || user._id;
                const res = await notificationAPI.getNotifications(userId);
                setNotifications(res.data?.notifications || []);
            } catch (error) {
                console.error('Failed to fetch doctor notifications:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchNotifications();
    }, [user]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-3 animate-pulse">
                <div className="w-10 h-10 border-2 border-gray-300 border-t-[#2299C9] rounded-full animate-spin" />
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest text-center">Fetching Latest Notifications...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-gray-900 text-xl font-bold">Clinical Feed & Alerts</h2>
                    <p className="text-gray-500 text-sm mt-0.5">Real-time updates from patients and system notifications</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-sky-50 border border-sky-100 rounded-lg">
                    <span className="text-sky-600 font-bold text-xs">{notifications.length} Total</span>
                </div>
            </div>

            {notifications.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-gray-100 rounded-[2.5rem] p-16 text-center flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-300 mb-6 group hover:scale-105 transition-transform duration-500 shadow-sm">
                        <Icon path={icons.bell} size={36} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Workspace Clear</h3>
                    <p className="text-gray-500 max-w-sm mx-auto text-sm font-medium leading-relaxed">
                        No new messages or alerts at the moment. You'll see new patient activities here as they arrive.
                    </p>
                </div>
            ) : (
                <div className="grid gap-3">
                    {notifications.map((notif) => (
                        <div 
                            key={notif._id} 
                            className={`bg-white border border-gray-100 rounded-3xl p-5 flex gap-5 hover:shadow-xl hover:shadow-gray-100/40 transition-all group relative overflow-hidden ${notif.status === 'PENDING' ? 'border-sky-100 bg-sky-50/20' : ''}`}
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50/50 rounded-bl-[4rem] -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-700" />
                            
                            <div className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center relative z-10 shadow-sm ${
                                notif.type === 'chat' ? 'bg-sky-500 text-white shadow-sky-500/20' : 
                                notif.type === 'security' ? 'bg-red-500 text-white shadow-red-500/20' :
                                notif.type === 'email' ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 
                                'bg-purple-500 text-white shadow-purple-500/20'
                            }`}>
                                <Icon path={notif.type === 'chat' ? icons.message : notif.type === 'security' ? icons.shield : icons.bell} size={24} />
                            </div>

                            <div className="flex-1 min-w-0 relative z-10 py-1">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-md ${
                                            notif.type === 'chat' ? 'bg-sky-50 text-sky-600' : 'bg-gray-100 text-gray-500'
                                        }`}>
                                            {notif.type}
                                        </span>
                                        <div className="flex items-center gap-1 text-gray-400">
                                            <Icon path={icons.clock} size={10} />
                                            <span className="text-[10px] font-medium uppercase tracking-wider">
                                                {new Date(notif.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                    {notif.status === 'PENDING' && (
                                        <span className="flex items-center gap-1 text-[#2299C9] text-[10px] font-black uppercase tracking-widest bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">
                                            <span className="w-1.5 h-1.5 bg-[#2299C9] rounded-full animate-pulse" />
                                            New Alert
                                        </span>
                                    )}
                                </div>
                                <p className="text-gray-800 text-base font-semibold leading-relaxed group-hover:text-gray-900 transition-colors">
                                    {notif.message}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Notifications;
