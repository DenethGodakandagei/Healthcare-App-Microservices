import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, NavLink, Link, Outlet, useLocation } from 'react-router-dom';
import { doctorAPI, notificationAPI } from '../../services/api';

/* ─── Icon helper ─────────────────────────────────────────────── */
const Icon = ({ path, size = 20, className = '', strokeWidth = '1.8' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    {path}
  </svg>
);

const icons = {
  home: <><rect x="3" y="11" width="18" height="11" rx="1" /><path d="M3 11L12 3l9 8" /></>,
  calendar: <><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>,
  user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
  bell: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></>,
  logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>,
  sessions: <><path d="M12 2v20M17 5H7M17 19H7M21 12H15M9 12H3" /></>,
  plus: <><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></>,
  shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></>,
  menu: <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>,
  x: <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>,
};

const DoctorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [appointments, setAppointments] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const [aptR, profR] = await Promise.allSettled([doctorAPI.getAppointments(), doctorAPI.getProfile()]);
        if (aptR.status === 'fulfilled') setAppointments(aptR.value.data?.data || aptR.value.data || []);
        if (profR.status === 'fulfilled') setProfile(profR.value.data?.data || profR.value.data);

        // Fetch Notifications
        try {
          if (user?.id || user?._id) {
            const userId = user.id || user._id;
            const notifsRes = await notificationAPI.getNotifications(userId);
            const notifs = notifsRes.data?.notifications || [];
            setNotifications(notifs);
            setUnreadCount(notifs.filter(n => n.status === 'PENDING').length);
          }
        } catch (err) {
          console.error('Failed to fetch notifications:', err);
        }
      } catch (_) { }
      setLoading(false);
    };
    load();
  }, [user]);

  const pending = appointments.filter(a => a.status === 'pending' || (a.appointmentType === 'online' && a.onlineStatus === 'pending'));
  const confirmed = appointments.filter(a => 
    a.status === 'confirmed' || 
    (a.appointmentType === 'online' && (a.onlineStatus === 'approved' || !a.onlineStatus) && a.status === 'scheduled') ||
    (a.status === 'scheduled' && a.appointmentType !== 'online')
  );

  const navItems = [
    { id: 'overview', label: 'Overview', icon: 'home', path: '/doctor/dashboard' },
    { id: 'appointments', label: 'Video Consultations', icon: 'calendar', path: '/doctor/dashboard/appointments' },
    { id: 'notifications', label: 'Notifications', icon: 'bell', path: '/doctor/dashboard/notifications' },
    { id: 'physical', label: 'Physical Consultations', icon: 'user', path: '/doctor/dashboard/physical' },

    { id: 'sessions', label: 'Clinic Availability', icon: 'sessions', path: '/doctor/dashboard/availability' },
    { id: 'profile', label: 'Professional Profile', icon: 'shield', path: '/doctor/dashboard/credentials' },
  ];

  const isPathActive = (path) => {
    if (path === '/doctor/dashboard') return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const getPageTitle = () => {
    const item = navItems.find(n => isPathActive(n.path));
    return item ? item.label : 'Doctor Portal';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const Sidebar = () => (
    <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full border-4 border-[#0EA5E9] flex items-center justify-center p-0.5">
            <div className="w-full h-full bg-[#0EA5E9] rounded-full flex items-center justify-center text-white">
              <Icon path={icons.plus} size={14} strokeWidth={4} />
            </div>
          </div>
          <span className="font-black text-xl tracking-tighter text-[#0EA5E9]">BioGrid</span>
        </Link>
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-gray-700">
          <Icon path={icons.x} size={18} />
        </button>
      </div>

      {/* Doctor Info */}
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gray-900 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-gray-200">
            {(profile?.firstName || user?.username || 'D')[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-gray-900 text-sm font-semibold truncate leading-none mb-1">Dr. {profile?.lastName || user?.username}</p>
            <p className="text-[#0EA5E9] font-black text-[10px] uppercase tracking-wider">{profile?.specialty || 'Medical Specialist'}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(item => (
          <NavLink
            key={item.id}
            to={item.path}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isPathActive(item.path)
                ? 'bg-[#2299C9] text-white shadow-md shadow-sky-500/20'
                : 'text-gray-600 hover:text-[#0EA5E9] hover:bg-gray-100'
              }`
            }
          >
            <Icon path={icons[item.icon]} size={17} />
            <span className="flex-1 text-left">{item.label}</span>
            {item.id === 'appointments' && pending.length > 0 && (
              <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] text-white font-bold">{pending.length}</span>
            )}
            {item.id === 'notifications' && unreadCount > 0 && (
              <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] text-white font-bold">{unreadCount}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-5 border-t border-gray-100 pt-3">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all"
        >
          <Icon path={icons.logout} size={17} />
          Sign Out Portal
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/20 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="flex items-center gap-4 px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-20">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-gray-900">
            <Icon path={icons.menu} size={22} />
          </button>
          <div className="flex-1">
            <h1 className="text-gray-900 font-bold text-lg leading-none">
              {getPageTitle()}
            </h1>
            <p className="text-[#0EA5E9] text-[10px] font-black uppercase tracking-widest mt-0.5">Doctor Console</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">On Duty</span>
            </div>
            <button 
              onClick={() => navigate('/doctor/dashboard/notifications')}
              className={`relative text-gray-500 hover:text-[#0EA5E9] transition-colors p-1.5 rounded-lg hover:bg-gray-100 ${isPathActive('/doctor/dashboard/notifications') ? 'bg-sky-50 text-[#0EA5E9]' : ''}`}
            >
              <Icon path={icons.bell} size={20} />
              {(unreadCount > 0 || pending.length > 0) && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#2299C9] rounded-full" />
              )}
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3 animate-pulse">
              <div className="w-10 h-10 border-2 border-gray-300 border-t-[#2299C9] rounded-full animate-spin" />
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Updating Clinical Feed...</p>
            </div>
          ) : (
            <div className="animate-in fade-in duration-500">
              <Outlet context={{ user, appointments, setAppointments, profile, pending, confirmed }} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DoctorDashboard;
