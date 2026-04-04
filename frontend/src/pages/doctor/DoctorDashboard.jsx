import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, NavLink, Link, Outlet, useLocation } from 'react-router-dom';
import { doctorAPI, appointmentAPI } from '../../services/api';

/* ─── Icon helper ─────────────────────────────────────────────── */
const Icon = ({ path, size = 20, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {path}
  </svg>
);

const icons = {
  home: <><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></>,
  calendar: <><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>,
  sessions: <><path d="M12 20h.01" /><path d="M12 16h.01" /><path d="M12 12h.01" /><path d="M12 8h.01" /><path d="M12 4h.01" /><path d="M16 20h.01" /><path d="M16 16h.01" /><path d="M16 12h.01" /><path d="M16 8h.01" /><path d="M16 4h.01" /><path d="M20 20h.01" /><path d="M20 16h.01" /><path d="M20 12h.01" /><path d="M20 8h.01" /><path d="M20 4h.01" /><path d="M8 20h.01" /><path d="M8 16h.01" /><path d="M8 12h.01" /><path d="M8 8h.01" /><path d="M8 4h.01" /><path d="M4 20h.01" /><path d="M4 16h.01" /><path d="M4 12h.01" /><path d="M4 8h.01" /><path d="M4 4h.01" /></>,
  logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>,
  plus: <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>,
  shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></>,
  bell: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></>,
};

const DoctorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [appointments, setAppointments] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [aptR, profR] = await Promise.allSettled([doctorAPI.getAppointments(), doctorAPI.getProfile()]);
        if (aptR.status === 'fulfilled') setAppointments(aptR.value.data?.data || aptR.value.data || []);
        if (profR.status === 'fulfilled') setProfile(profR.value.data?.data || profR.value.data);
      } catch (_) { }
      setLoading(false);
    };
    load();
  }, []);

  const pending = appointments.filter(a => a.status === 'pending');
  const confirmed = appointments.filter(a => a.status === 'confirmed');

  const navItems = [
    { id: 'overview', label: 'Overview', icon: 'home', path: '/doctor/dashboard' },
    { id: 'appointments', label: 'Online Consultation', icon: 'calendar', path: '/doctor/dashboard/appointments' },
    { id: 'sessions', label: 'Availability', icon: 'sessions', path: '/doctor/dashboard/availability' },
    { id: 'profile', label: 'Credentials', icon: 'shield', path: '/doctor/dashboard/credentials' },
  ];

  // Helper to see if a path is active (considering nested routes)
  const isPathActive = (path) => {
    if (path === '/doctor/dashboard') return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const getPageTitle = () => {
    const item = navItems.find(n => isPathActive(n.path));
    return item ? item.label : 'Doctor Portal';
  };

  return (
    <div className="min-h-screen bg-[#FBFBFF] flex font-sans">

      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-gray-50 flex flex-col p-8 fixed h-screen z-50">
        <Link to="/" className="flex items-center gap-3 mb-16 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-[#427CFF] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200">
            <Icon path={icons.plus} size={20} />
          </div>
          <span className="font-extrabold text-2xl tracking-tighter uppercase text-[#111]">BioGrid</span>
        </Link>

        <nav className="flex-1 space-y-3">
          {navItems.map(item => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `w-full flex items-center gap-4 px-6 py-4.5 rounded-[1.5rem] transition-all duration-500 font-black text-xs uppercase tracking-widest ${isPathActive(item.path) ? 'bg-[#427CFF] text-white shadow-2xl shadow-blue-100 scale-[1.02]' : 'text-gray-400 hover:text-[#111] hover:bg-gray-50'
                }`
              }
            >
              <Icon path={icons[item.icon]} size={18} />
              {item.label}
              {item.id === 'appointments' && pending.length > 0 && <div className="ml-auto w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-[10px]">{pending.length}</div>}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto space-y-6">
          <div className="p-6 bg-gray-50 rounded-[2rem] flex items-center gap-4 border border-gray-100">
            <div className="w-12 h-12 bg-[#111] rounded-2xl flex items-center justify-center text-white font-black text-xl">
              {(profile?.firstName || user?.username || 'D')[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-[#111] font-black text-sm truncate leading-none mb-1">Dr. {profile?.lastName || user?.username}</p>
              <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">{profile?.specialty || 'Surgeon'}</p>
            </div>
          </div>
          <button onClick={() => { logout(); navigate('/login'); }} className="w-full h-16 border border-red-50 text-red-500 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-red-50 transition-all flex items-center justify-center gap-3">
            <Icon path={icons.logout} size={18} /> Exit Portal
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-80 p-12 overflow-y-auto">
        <header className="mb-14 flex justify-between items-end">
          <div>
            <p className="text-[#427CFF] font-black uppercase tracking-[0.3em] text-[10px] mb-3 ml-1">Live Clinical Feed</p>
            <h1 className="text-slate-950 text-4xl font-black tracking-tighter leading-none uppercase font-sans antialiased">
              {getPageTitle()}
            </h1>
          </div>
          <div className="flex gap-4">
            <div className="h-16 px-6 bg-white border border-gray-50 rounded-[1.5rem] flex items-center gap-3 shadow-xl shadow-gray-50">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
              <span className="text-[#111] font-black text-xs uppercase tracking-widest">Active Shift</span>
            </div>
            <button className="w-16 h-16 bg-white border border-gray-50 rounded-[1.5rem] flex items-center justify-center text-gray-400 hover:text-[#111] transition-all shadow-xl shadow-gray-50">
              <Icon path={icons.bell} size={22} />
            </button>
          </div>
        </header>

        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center gap-6 animate-in fade-in duration-1000">
            <div className="w-24 h-1 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#427CFF] w-1/2 animate-infinite-slide" />
            </div>
            <p className="text-gray-300 font-black text-[10px] uppercase tracking-[0.4em]">Initializing BioGrid Intelligence...</p>
          </div>
        ) : (
          <Outlet context={{ user, appointments, profile, pending, confirmed }} />
        )}
      </main>
    </div>
  );
};

export default DoctorDashboard;
