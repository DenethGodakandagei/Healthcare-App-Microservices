import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { doctorAPI, appointmentAPI, sessionAPI } from '../../services/api';

/* ─── Icon helper ─────────────────────────────────────────────── */
const Icon = ({ path, size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {path}
  </svg>
);

const icons = {
  home: <><rect x="3" y="11" width="18" height="11" rx="1"/><path d="M3 11L12 3l9 8"/></>,
  calendar: <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
  sessions: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
  user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
  users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
  bell: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
  logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
  check: <><polyline points="20 6 9 17 4 12"/></>,
  shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>,
  menu: <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>,
  x: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
  plus: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
  edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
  trash: <><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></>,
  clock: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
  alert: <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>,
  trending: <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>,
  activity: <><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></>,
};

/* ─── Reusable components ─────────────────────────────────────── */
const StatCard = ({ label, value, sub, icon, highlight }) => (
  <div className={`border rounded-2xl p-5 hover:shadow-sm transition-shadow ${highlight ? 'bg-gray-900 border-gray-900' : 'bg-white border-gray-200'}`}>
    <div className="flex items-start justify-between mb-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${highlight ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-600'}`}>
        <Icon path={icons[icon]} size={18} />
      </div>
    </div>
    <p className={`text-2xl font-bold mb-0.5 ${highlight ? 'text-white' : 'text-gray-900'}`}>{value}</p>
    <p className={`text-sm ${highlight ? 'text-white/70' : 'text-gray-500'}`}>{label}</p>
    {sub && <p className={`text-xs mt-1 ${highlight ? 'text-white/50' : 'text-gray-400'}`}>{sub}</p>}
  </div>
);

const AppointmentRow = ({ apt, onAccept, onComplete }) => {
  const date = new Date(apt.date || apt.scheduledAt || apt.createdAt);
  const statusConfig = {
    confirmed: 'bg-green-50 text-green-700 border-green-200',
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    cancelled: 'bg-red-50 text-red-600 border-red-200',
    completed: 'bg-blue-50 text-blue-700 border-blue-200',
  };
  const status = apt.status || 'pending';
  return (
    <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-4">
        <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 text-sm font-bold">
          {(apt.patientName || apt.patient?.username || 'P')[0].toUpperCase()}
        </div>
        <div>
          <p className="text-gray-900 text-sm font-semibold">{apt.patientName || apt.patient?.username || 'Unknown Patient'}</p>
          <div className="flex gap-2 mt-0.5 mt-1">
            <span className="text-gray-400 text-[10px] uppercase font-bold tracking-tighter bg-gray-100 px-1.5 py-0.5 rounded">NIC: {apt.patientNIC || '—'}</span>
            <span className="text-gray-400 text-[10px] uppercase font-bold tracking-tighter bg-gray-100 px-1.5 py-0.5 rounded">TEL: {apt.patientPhone || '—'}</span>
          </div>
          <p className="text-gray-400 text-xs mt-1">
            {isNaN(date) ? 'TBD' : date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            {!isNaN(date) && ` · ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`}
          </p>
          {apt.reasonForVisit && <p className="text-gray-500 text-[11px] italic mt-1.5 border-l-2 border-gray-100 pl-2">"{apt.reasonForVisit}"</p>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-xs px-2.5 py-1 rounded-full border capitalize font-medium ${statusConfig[status] || statusConfig.pending}`}>{status}</span>
        {status === 'pending' && (
          <button onClick={() => onAccept(apt._id)} className="text-xs px-3 py-1.5 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors">Accept</button>
        )}
        {status === 'confirmed' && (
          <button onClick={() => onComplete(apt._id)} className="text-xs px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg font-medium hover:border-gray-400 hover:text-gray-900 transition-all">Complete</button>
        )}
      </div>
    </div>
  );
};

/* ─── Session status badge ────────────────────────────────────── */
const statusBadge = {
  active: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-600 border-red-200',
  completed: 'bg-blue-50 text-blue-700 border-blue-200',
};

/* ─── Session Form Modal ──────────────────────────────────────── */
const SessionModal = ({ session, onClose, onSave }) => {
  const today = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({
    date: session?.date ? new Date(session.date).toISOString().split('T')[0] : today,
    startTime: session?.startTime || '08:00',
    endTime: session?.endTime || '10:00',
    maxAppointments: session?.maxAppointments ?? 20,
    status: session?.status || 'active',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handle = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (form.startTime >= form.endTime) { setError('Start time must be before end time.'); return; }
    setSaving(true);
    setError('');
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save session.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-gray-900 font-bold text-lg">{session ? 'Edit Session' : 'New Session'}</h2>
            <p className="text-gray-400 text-xs mt-0.5">Set your availability block</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors p-1.5 rounded-lg hover:bg-gray-100">
            <Icon path={icons.x} size={18} />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {/* Date */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1.5">Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              min={today}
              onChange={handle}
              required
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
            />
          </div>

          {/* Time range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1.5">Start Time</label>
              <input
                type="time"
                name="startTime"
                value={form.startTime}
                onChange={handle}
                required
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1.5">End Time</label>
              <input
                type="time"
                name="endTime"
                value={form.endTime}
                onChange={handle}
                required
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Max appointments */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1.5">Max Appointments</label>
            <input
              type="number"
              name="maxAppointments"
              value={form.maxAppointments}
              min={1}
              max={100}
              onChange={handle}
              required
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
            />
          </div>

          {/* Status (only when editing) */}
          {session && (
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1.5">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handle}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all bg-white"
              >
                <option value="active">Active</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
              <Icon path={icons.alert} size={15} />
              <p className="text-red-600 text-xs font-medium">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:border-gray-400 hover:text-gray-900 transition-all">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
              {saving ? 'Saving…' : session ? 'Save Changes' : 'Create Session'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ─── Delete Confirm Modal ────────────────────────────────────── */
const DeleteModal = ({ session, onClose, onConfirm }) => {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const confirm = async () => {
    setDeleting(true);
    setError('');
    try {
      await onConfirm(session._id);
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || 'Delete failed.');
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
        <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mx-auto">
          <Icon path={icons.trash} size={22} />
        </div>
        <div className="text-center">
          <h2 className="text-gray-900 font-bold text-lg">Delete Session?</h2>
          <p className="text-gray-500 text-sm mt-1">
            {new Date(session.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}<br />
            {session.startTime} – {session.endTime}
          </p>
          <p className="text-gray-400 text-xs mt-2">This action cannot be undone.</p>
        </div>
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
            <Icon path={icons.alert} size={15} />
            <p className="text-red-600 text-xs font-medium">{error}</p>
          </div>
        )}
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:border-gray-400 transition-all">Keep</button>
          <button onClick={confirm} disabled={deleting} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
            {deleting ? 'Deleting…' : 'Yes, Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Sessions Tab Content ────────────────────────────────────── */
const SessionsTab = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | { type:'create'|'edit'|'delete', session? }

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await sessionAPI.getAll();
      setSessions(res.data?.data || []);
    } catch (_) {}
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async (form) => {
    await sessionAPI.create(form);
    await load();
  };

  const handleUpdate = async (form) => {
    await sessionAPI.update(modal.session._id, form);
    await load();
  };

  const handleDelete = async (id) => {
    await sessionAPI.delete(id);
    setSessions((prev) => prev.filter((s) => s._id !== id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 text-xl font-bold">My Sessions</h2>
          <p className="text-gray-500 text-sm mt-0.5">{sessions.length} availability block{sessions.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          id="session-create-btn"
          onClick={() => setModal({ type: 'create' })}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors"
        >
          <Icon path={icons.plus} size={16} />
          New Session
        </button>
      </div>

      {/* Empty state */}
      {sessions.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
          <div className="text-gray-200 flex justify-center mb-4"><Icon path={icons.sessions} size={44} /></div>
          <p className="text-gray-600 text-sm font-semibold">No sessions yet</p>
          <p className="text-gray-400 text-xs mt-1">Create your first availability block so patients can book appointments</p>
          <button
            onClick={() => setModal({ type: 'create' })}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors"
          >
            <Icon path={icons.plus} size={15} />
            Create Session
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((s) => {
            const dateLabel = new Date(s.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
            const filled = s.currentAppointmentsCount || 0;
            const max = s.maxAppointments || 1;
            const pct = Math.min(100, Math.round((filled / max) * 100));

            return (
              <div key={s._id} className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between gap-3">
                  {/* Left */}
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 shrink-0">
                      <Icon path={icons.clock} size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-gray-900 text-sm font-semibold">{dateLabel}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{s.startTime} – {s.endTime}</p>
                    </div>
                  </div>

                  {/* Badge + actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs px-2.5 py-1 rounded-full border capitalize font-medium ${statusBadge[s.status] || statusBadge.active}`}>
                      {s.status}
                    </span>
                    <button
                      id={`session-edit-${s._id}`}
                      onClick={() => setModal({ type: 'edit', session: s })}
                      className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
                      title="Edit session"
                    >
                      <Icon path={icons.edit} size={15} />
                    </button>
                    <button
                      id={`session-delete-${s._id}`}
                      onClick={() => setModal({ type: 'delete', session: s })}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Delete session"
                    >
                      <Icon path={icons.trash} size={15} />
                    </button>
                  </div>
                </div>

                {/* Capacity bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
                    <span>Capacity</span>
                    <span className="font-medium text-gray-600">{filled} / {max} booked</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${pct >= 90 ? 'bg-red-500' : pct >= 60 ? 'bg-yellow-400' : 'bg-green-500'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      {modal?.type === 'create' && (
        <SessionModal onClose={() => setModal(null)} onSave={handleCreate} />
      )}
      {modal?.type === 'edit' && (
        <SessionModal session={modal.session} onClose={() => setModal(null)} onSave={handleUpdate} />
      )}
      {modal?.type === 'delete' && (
        <DeleteModal session={modal.session} onClose={() => setModal(null)} onConfirm={handleDelete} />
      )}
    </div>
  );
};

/* ─── Main Dashboard ─────────────────────────────────────────── */
const DoctorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [aptsRes, profileRes] = await Promise.allSettled([
          appointmentAPI.getAll(),
          doctorAPI.getProfile(),
        ]);
        if (aptsRes.status === 'fulfilled') setAppointments(aptsRes.value.data?.data || aptsRes.value.data || []);
        if (profileRes.status === 'fulfilled') setProfile(profileRes.value.data);
      } catch (_) {}
      setLoadingData(false);
    };
    load();
  }, []);

  const handleAccept = (id) => setAppointments((p) => p.map((a) => a._id === id ? { ...a, status: 'confirmed' } : a));
  const handleComplete = (id) => setAppointments((p) => p.map((a) => a._id === id ? { ...a, status: 'completed' } : a));
  const handleLogout = () => { logout(); navigate('/login'); };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: 'home' },
    { id: 'appointments', label: 'Appointments', icon: 'calendar' },
    { id: 'sessions', label: 'Sessions', icon: 'sessions' },
    { id: 'patients', label: 'Patients', icon: 'users' },
    { id: 'profile', label: 'My Profile', icon: 'user' },
  ];

  const pending = appointments.filter((a) => a.status === 'pending');
  const confirmed = appointments.filter((a) => a.status === 'confirmed');
  const completed = appointments.filter((a) => a.status === 'completed');
  const uniquePatients = [...new Set(appointments.map((a) => a.patientId || a.patient?._id).filter(Boolean))];

  const Sidebar = () => (
    <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-gray-900 rounded-lg flex items-center justify-center text-white">
            <Icon path={icons.plus} size={14} />
          </div>
          <span className="text-gray-900 font-bold text-sm">Doctor Portal</span>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-gray-700 transition-colors">
          <Icon path={icons.x} size={18} />
        </button>
      </div>

      {/* User info */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gray-900 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {(user?.username || user?.name || 'D')[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-gray-900 text-sm font-semibold truncate">Dr. {user?.username || user?.name}</p>
            <p className="text-gray-400 text-xs">{profile?.specialty || 'General Physician'}</p>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="px-6 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span className="text-green-700 text-xs font-semibold">Available</span>
          {pending.length > 0 && <span className="text-gray-400 text-xs">· {pending.length} pending</span>}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => (
          <button
            key={item.id}
            id={`doctor-nav-${item.id}`}
            onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === item.id
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Icon path={icons[item.icon]} size={17} />
            {item.label}
            {item.id === 'appointments' && pending.length > 0 && (
              <span className={`ml-auto text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold ${activeTab === item.id ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'}`}>
                {pending.length}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-5 border-t border-gray-100 pt-3">
        <button
          id="doctor-logout"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all"
        >
          <Icon path={icons.logout} size={17} />
          Sign Out
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
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-gray-900 transition-colors">
            <Icon path={icons.menu} size={22} />
          </button>
          <div className="flex-1">
            <h1 className="text-gray-900 font-bold text-lg leading-none">
              {navItems.find((n) => n.id === activeTab)?.label}
            </h1>
            <p className="text-gray-400 text-xs mt-0.5">Doctor Portal</p>
          </div>
          <button className="relative text-gray-500 hover:text-gray-900 transition-colors p-1.5 rounded-lg hover:bg-gray-100">
            <Icon path={icons.bell} size={20} />
            {pending.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-gray-900 rounded-full" />}
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {loadingData && activeTab !== 'sessions' ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* ── OVERVIEW ── */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-gray-900 text-xl font-bold flex items-center gap-2">
                       <div className="text-indigo-500"><Icon path={<><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/><path d="M12 7a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 0-2h-3V8a1 1 0 0 0-1-1z"/></>} size={20} /></div>
                       Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, Dr. {user?.username || 'Doctor'}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Here&apos;s your practice summary for today.</p>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard label="Pending" value={pending.length} icon="clock" sub="requests" />
                    <StatCard label="Confirmed" value={confirmed.length} icon="calendar" sub="today" highlight />
                    <StatCard label="Completed" value={completed.length} icon="check" sub="all time" />
                    <StatCard label="Patients" value={uniquePatients.length || '—'} icon="users" sub="total" />
                  </div>

                  <div className="bg-white border border-gray-200 rounded-2xl p-5">
                    <h3 className="text-gray-900 font-semibold text-sm mb-4">Quick Summary</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: 'Total Appointments', value: appointments.length },
                        { label: 'Acceptance Rate', value: appointments.length ? `${Math.round(((confirmed.length + completed.length) / appointments.length) * 100)}%` : '—' },
                        { label: 'Avg. per Day', value: '—' },
                      ].map((s) => (
                        <div key={s.label} className="text-center p-3 bg-gray-50 border border-gray-100 rounded-xl">
                          <p className="text-gray-900 font-bold text-lg">{s.value}</p>
                          <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-gray-900 font-semibold">Pending Requests</h3>
                      {pending.length > 0 && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">{pending.length} new</span>}
                    </div>
                    {pending.length === 0 ? (
                      <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
                        <div className="text-gray-300 flex justify-center mb-3"><Icon path={icons.check} size={32} /></div>
                        <p className="text-gray-600 text-sm font-medium">All caught up!</p>
                        <p className="text-gray-400 text-xs mt-1">No pending appointment requests</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {pending.slice(0, 3).map((apt) => (
                          <AppointmentRow key={apt._id} apt={apt} onAccept={handleAccept} onComplete={handleComplete} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── APPOINTMENTS ── */}
              {activeTab === 'appointments' && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-gray-900 text-xl font-bold">Appointments</h2>
                    <p className="text-gray-500 text-sm mt-0.5">{appointments.length} total</p>
                  </div>
                  {appointments.length === 0 ? (
                    <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
                      <div className="text-gray-300 flex justify-center mb-4"><Icon path={icons.calendar} size={40} /></div>
                      <p className="text-gray-600 text-sm font-medium">No appointments yet</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {appointments.map((apt) => (
                        <AppointmentRow key={apt._id} apt={apt} onAccept={handleAccept} onComplete={handleComplete} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── SESSIONS ── */}
              {activeTab === 'sessions' && <SessionsTab />}

              {/* ── PATIENTS ── */}
              {activeTab === 'patients' && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-gray-900 text-xl font-bold">Patients</h2>
                    <p className="text-gray-500 text-sm mt-0.5">{uniquePatients.length} unique patients</p>
                  </div>
                  {appointments.length === 0 ? (
                    <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
                      <div className="text-gray-300 flex justify-center mb-4"><Icon path={icons.users} size={40} /></div>
                      <p className="text-gray-600 text-sm font-medium">No patients yet</p>
                      <p className="text-gray-400 text-xs mt-1">Patients will appear once they book with you</p>
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {appointments.reduce((acc, apt) => {
                        const pid = apt.patientId || apt.patient?._id || apt._id;
                        if (!acc.seen.has(pid)) { acc.seen.add(pid); acc.items.push(apt); }
                        return acc;
                      }, { seen: new Set(), items: [] }).items.map((apt) => (
                        <div key={apt._id} className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:shadow-sm transition-shadow">
                          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-700 font-bold text-sm">
                            {(apt.patientName || apt.patient?.username || 'P')[0].toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-900 text-sm font-semibold">{apt.patientName || apt.patient?.username || 'Unknown Patient'}</p>
                            <p className="text-gray-400 text-xs mt-0.5">
                              {appointments.filter((a) => (a.patientId || a.patient?._id) === (apt.patientId || apt.patient?._id)).length} appointment(s)
                            </p>
                          </div>
                          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Patient</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── PROFILE ── */}
              {activeTab === 'profile' && (
                <div className="max-w-lg space-y-5">
                  <div>
                    <h2 className="text-gray-900 text-xl font-bold">My Profile</h2>
                    <p className="text-gray-500 text-sm mt-0.5">Your professional information</p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                        {(user?.username || 'D')[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-gray-900 font-bold">Dr. {user?.username || user?.name}</p>
                        <p className="text-gray-500 text-sm">{user?.email}</p>
                        <div className="flex gap-2 mt-1.5">
                          <span className="inline-block text-xs px-2.5 py-0.5 bg-gray-900 text-white rounded-full font-semibold">Doctor</span>
                          <span className="inline-block text-xs px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded-full font-medium">{profile?.specialty || 'General'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-5 space-y-4">
                      {[
                        { label: 'Full Name', value: `Dr. ${user?.username || user?.name || '—'}` },
                        { label: 'Email Address', value: user?.email || '—' },
                        { label: 'Specialty', value: profile?.specialty || 'General Physician' },
                        { label: 'License No.', value: profile?.licenseNumber || '—' },
                        { label: 'Member Since', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—' },
                      ].map((field) => (
                        <div key={field.label} className="flex justify-between items-center">
                          <span className="text-gray-500 text-sm">{field.label}</span>
                          <span className="text-gray-900 text-sm font-semibold">{field.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="text-gray-500"><Icon path={icons.shield} size={16} /></div>
                      <h3 className="text-gray-900 font-semibold text-sm">Security</h3>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-700 text-sm font-medium">Password</p>
                        <p className="text-gray-400 text-xs mt-0.5">Keep your account secure</p>
                      </div>
                      <button className="text-xs px-3 py-1.5 border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-400 rounded-lg transition-all font-medium">Change</button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default DoctorDashboard;
