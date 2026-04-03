import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { patientAPI, appointmentAPI, doctorAPI } from '../../services/api';
import doc1 from '../../assets/doc1.png';
import doc2 from '../../assets/doc2.png';
import doc3 from '../../assets/doc3.png';
import doc4 from '../../assets/doc4.png';
import AppointmentBookingWizard from '../../components/AppointmentBookingWizard';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';

const doctorImages = [doc1, doc2, doc3, doc4];

const getDoctorImage = (id) => {
  if (!id) return doc1;
  const index = Math.abs(id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % doctorImages.length;
  return doctorImages[index];
};

const Icon = ({ path, size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {path}
  </svg>
);

const icons = {
  home: <><rect x="3" y="11" width="18" height="11" rx="1"/><path d="M3 11L12 3l9 8"/></>,
  calendar: <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
  user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
  bell: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
  logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
  heart: <><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></>,
  activity: <><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></>,
  clock: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
  pill: <><path d="M10.5 20H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.5"/><path d="M21 6a2 2 0 0 0-2-2h-5.5"/><line x1="12" y1="12" x2="21" y2="12"/><rect x="12" y="4" width="9" height="16" rx="2"/></>,
  menu: <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>,
  x: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
  plus: <><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></>,
  shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>,
};

const StatCard = ({ label, value, sub, icon }) => (
  <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-sm transition-shadow">
    <div className="flex items-start justify-between mb-4">
      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600">
        <Icon path={icons[icon]} size={18} />
      </div>
    </div>
    <p className="text-gray-900 text-2xl font-bold mb-0.5">{value}</p>
    <p className="text-gray-500 text-sm">{label}</p>
    {sub && <p className="text-gray-400 text-xs mt-1">{sub}</p>}
  </div>
);



const AppointmentCard = ({ apt, doctors, onCancel, onEdit }) => {
  const appointmentDate = new Date(apt.date || apt.sessionId?.date);
  const sessionStart = apt.sessionId?.startTime || apt.startTime;
  const sessionEnd = apt.sessionId?.endTime || apt.endTime;

  // Get doctorId from appointment or session
  const doctorId = apt.doctorId || apt.sessionId?.doctorId;
  const doctor = doctors.find(d => d.userId === doctorId || String(d._id) === String(doctorId));
  const doctorName = doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : 'Unknown';
  const doctorSpecialty = doctor?.specialty || 'General';

  const statusConfig = {
    scheduled: 'bg-blue-50 text-blue-700 border-blue-200',
    completed: 'bg-green-50 text-green-700 border-green-200',
    cancelled: 'bg-red-50 text-red-600 border-red-200',
  };
  const status = apt.status || 'scheduled';

  const formatDate = (date) => {
    if (isNaN(date)) return 'TBD';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const sessionTime = sessionStart && sessionEnd ? `${sessionStart}-${sessionEnd}` : '';

  return (
    <div className="flex items-center px-3 py-2 bg-white border border-gray-200 rounded hover:shadow-sm transition-shadow text-sm">
      <div className="w-48 shrink-0 font-medium text-gray-900 truncate">{doctorName}</div>
      <div className="w-24 shrink-0 text-gray-500 truncate mx-8">{doctorSpecialty}</div>
      <div className="w-24 shrink-0 text-gray-600">{formatDate(appointmentDate)}</div>
      <div className="w-24 shrink-0 text-gray-500">{sessionTime}</div>
      <div className="flex-1 text-gray-400 truncate">{apt.reasonForVisit || ''}</div>
      <div className="shrink-0">
        <span className={`inline-flex px-2 py-0.5 text-xs font-medium border rounded ${statusConfig[status]}`}>{status}</span>
      </div>
      <div className="flex gap-2 shrink-0 ml-4">
        <button onClick={() => onEdit(apt)} className="text-xs px-2 py-1 border border-gray-200 text-gray-600 rounded hover:bg-gray-50 transition-colors">
          Edit
        </button>
        <button onClick={() => onCancel(apt._id)} className="text-xs px-2 py-1 border border-red-200 text-red-600 rounded hover:bg-red-50 transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
};

const PatientDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [profile, setProfile] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [editAppointment, setEditAppointment] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [aptsRes, profileRes, doctorsRes] = await Promise.allSettled([
          patientAPI.getAppointments(),
          patientAPI.getProfile(),
          doctorAPI.getAll(),
        ]);

        // Get patient's appointments
        let patientAppointments = [];
        if (aptsRes.status === 'fulfilled') {
          const response = aptsRes.value?.data;
          patientAppointments = response?.data || [];
        }

        // Load profile (optional)
        if (profileRes.status === 'fulfilled') {
          const profileResponse = profileRes.value?.data;
          const profileData = profileResponse?.data || profileResponse;
          setProfile(profileData);
        }

        // Load doctors
        if (doctorsRes.status === 'fulfilled') {
          const doctorsResponse = doctorsRes.value?.data;
          const doctorsList = doctorsResponse?.data || doctorsResponse || [];
          setDoctors(doctorsList);
        }

        setAppointments(patientAppointments);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoadingData(false);
      }
    };
    load();
  }, []);

  const handleCancel = (id) => {
    setDeleteConfirmId(id);
  };

  const confirmCancel = async () => {
    if (!deleteConfirmId) return;
    try {
      await appointmentAPI.cancel(deleteConfirmId);
      setAppointments((prev) => prev.map((a) => a._id === deleteConfirmId ? { ...a, status: 'cancelled' } : a));
    } catch (error) {
      console.error('Cancel failed:', error);
    }
    setDeleteConfirmId(null);
  };

  const handleEdit = (apt) => {
    setEditAppointment({ ...apt });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editAppointment) return;
    try {
      await appointmentAPI.updateStatus(editAppointment._id, {
        status: editAppointment.status,
        reasonForVisit: editAppointment.reasonForVisit
      });
      setAppointments((prev) => prev.map((a) =>
        a._id === editAppointment._id ? { ...a, ...editAppointment } : a
      ));
      setShowEditModal(false);
      setEditAppointment(null);
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: 'home' },
    { id: 'appointments', label: 'Appointments', icon: 'calendar' },
    { id: 'profile', label: 'My Profile', icon: 'user' },
  ];

  const upcoming = appointments.filter((a) => a.status !== 'cancelled' && a.status !== 'completed');
  const completed = appointments.filter((a) => a.status === 'completed');

  const Sidebar = () => (
    <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-gray-900 rounded-lg flex items-center justify-center text-white">
            <Icon path={icons.plus} size={14} />
          </div>
          <span className="text-gray-900 font-bold text-sm">HealthConnect</span>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-gray-700 transition-colors">
          <Icon path={icons.x} size={18} />
        </button>
      </div>

      {/* User info */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gray-900 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {(user?.username || user?.name || 'P')[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-gray-900 text-sm font-semibold truncate">{user?.username || user?.name}</p>
            <p className="text-gray-400 text-xs capitalize">{user?.role || 'patient'}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => (
          <button
            key={item.id}
            id={`nav-${item.id}`}
            onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === item.id
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Icon path={icons[item.icon]} size={17} />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-5 border-t border-gray-100 pt-3">
        <button
          id="patient-logout"
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
            <p className="text-gray-400 text-xs mt-0.5">Patient Portal</p>
          </div>
          <button className="relative text-gray-500 hover:text-gray-900 transition-colors p-1.5 rounded-lg hover:bg-gray-100">
            <Icon path={icons.bell} size={20} />
            {upcoming.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-gray-900 rounded-full" />
            )}
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {loadingData ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* ---- OVERVIEW ---- */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-gray-900 text-xl font-bold flex items-center gap-2">
                       <div className="text-emerald-500"><Icon path={<><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/><path d="M12 7a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 0-2h-3V8a1 1 0 0 0-1-1z"/></>} size={20} /></div>
                       Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user?.username || 'Patient'}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Here&apos;s your health summary for today.</p>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard label="Upcoming" value={upcoming.length} icon="calendar" sub="appointments" />
                    <StatCard label="Completed" value={completed.length} icon="activity" sub="visits" />
                    <StatCard label="Prescriptions" value="—" icon="pill" sub="active" />
                    <StatCard label="Health Score" value="—" icon="heart" sub="pending" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-gray-900 font-semibold">Upcoming Appointments</h3>
                      <button onClick={() => setActiveTab('appointments')} className="text-gray-400 text-xs hover:text-gray-700 font-medium transition-colors">View all →</button>
                    </div>
                    {upcoming.length === 0 ? (
                      <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
                        <div className="text-gray-300 flex justify-center mb-3"><Icon path={icons.calendar} size={36} /></div>
                        <p className="text-gray-600 text-sm font-medium">No upcoming appointments</p>
                        <p className="text-gray-400 text-xs mt-1">Book an appointment with a doctor</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {upcoming.slice(0, 3).map((apt) => (
                          <AppointmentCard key={apt._id} apt={apt} doctors={doctors} onCancel={handleCancel} onEdit={handleEdit} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ---- APPOINTMENTS ---- */}
              {activeTab === 'appointments' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-gray-900 text-xl font-bold">Appointments</h2>
                      <p className="text-gray-500 text-sm mt-0.5">{appointments.length} total appointments</p>
                    </div>
                    <button
                      onClick={() => setShowBookingModal(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors text-sm font-medium"
                    >
                      <Icon path={icons.plus} size={16} />
                      New Appointment
                    </button>
                  </div>
                  {appointments.length === 0 ? (
                    <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
                      <div className="text-gray-300 flex justify-center mb-4"><Icon path={icons.calendar} size={40} /></div>
                      <p className="text-gray-600 text-sm font-medium">No appointments found</p>
                      <p className="text-gray-400 text-xs mt-1">Your appointment history will appear here</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {appointments.map((apt) => (
                        <AppointmentCard key={apt._id} apt={apt} doctors={doctors} onCancel={handleCancel} onEdit={handleEdit} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ---- PROFILE ---- */}
              {activeTab === 'profile' && (
                <div className="max-w-lg space-y-5">
                  <div>
                    <h2 className="text-gray-900 text-xl font-bold">My Profile</h2>
                    <p className="text-gray-500 text-sm mt-0.5">Manage your personal information</p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                        {(user?.username || 'P')[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-gray-900 font-bold">{user?.username || user?.name}</p>
                        <p className="text-gray-500 text-sm">{user?.email}</p>
                        <span className="inline-block mt-1.5 text-xs px-2.5 py-0.5 bg-gray-100 rounded-full text-gray-600 capitalize font-medium">{user?.role}</span>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-5 space-y-4">
                      {[
                        { label: 'Full Name', value: user?.username || user?.name || '—' },
                        { label: 'Email Address', value: user?.email || '—' },
                        { label: 'Account Type', value: 'Patient' },
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
                      <h3 className="text-gray-900 font-semibold text-sm">Account Security</h3>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-700 text-sm font-medium">Password</p>
                        <p className="text-gray-400 text-xs mt-0.5">Last changed — never</p>
                      </div>
                      <button className="text-xs px-3 py-1.5 border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-400 rounded-lg transition-all font-medium">
                        Change
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Modals */}
      <AppointmentBookingWizard open={showBookingModal} onClose={() => setShowBookingModal(false)} />
      <ConfirmDeleteModal open={!!deleteConfirmId} onConfirm={confirmCancel} onCancel={() => setDeleteConfirmId(null)} />

      {/* Edit Appointment Modal */}
      {showEditModal && editAppointment && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Edit Appointment</h3>
              <button onClick={() => { setShowEditModal(false); setEditAppointment(null); }} className="text-gray-400 hover:text-gray-600">
                <Icon path={<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>} size={18} />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Reason for Visit</label>
                <textarea
                  value={editAppointment.reasonForVisit || ''}
                  onChange={(e) => setEditAppointment(prev => ({ ...prev, reasonForVisit: e.target.value }))}
                  className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                <select
                  value={editAppointment.status || 'scheduled'}
                  onChange={(e) => setEditAppointment(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => { setShowEditModal(false); setEditAppointment(null); }}
                className="flex-1 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
