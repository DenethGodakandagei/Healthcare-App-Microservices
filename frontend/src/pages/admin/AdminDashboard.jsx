import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { doctorAPI, appointmentAPI, sessionAPI, patientAPI } from '../../services/api';
import DoctorsManagement from './DoctorsManagement';
import PatientsManagement from './PatientsManagement';

const Icon = ({ path, size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {path}
  </svg>
);

const icons = {
  home: <><rect x="3" y="11" width="18" height="11" rx="1"/><path d="M3 11L12 3l9 8"/></>,
  users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
  user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
  calendar: <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
  appointments: <><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18"/><path d="M8 14h3"/><path d="M8 18h3"/><path d="M14 14h4"/><path d="M14 18h4"/></>,
  file: <><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></>,
  dollar: <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>,
  menu: <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>,
  x: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
  logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
  activity: <><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></>,
  clock: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
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

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [patients, setPatients] = useState([]);

  // CSV Export functions
  const exportToCSV = (data, filename, headers) => {
    if (!data || data.length === 0) {
      alert('No data to export');
      return;
    }
    const csvHeaders = headers.map(h => h.key).join(',');
    const csvRows = data.map(row => {
      return headers.map(header => {
        const value = row[header.key] ?? '';
        // Escape quotes and wrap in quotes if contains comma or newline
        const str = String(value).replace(/"/g, '""');
        return str.includes(',') || str.includes('\n') ? `"${str}"` : str;
      }).join(',');
    });
    const csvContent = [csvHeaders, ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const exportAppointmentsReport = () => {
    const headers = [
      { key: 'appointmentNumber', label: 'Appointment Number' },
      { key: 'patientName', label: 'Patient Name' },
      { key: 'patientNIC', label: 'Patient NIC' },
      { key: 'patientPhone', label: 'Patient Phone' },
      { key: 'date', label: 'Date' },
      { key: 'startTime', label: 'Start Time' },
      { key: 'endTime', label: 'End Time' },
      { key: 'status', label: 'Status' },
      { key: 'paymentStatus', label: 'Payment Status' },
      { key: 'reasonForVisit', label: 'Reason for Visit' },
    ];
    exportToCSV(appointments, 'appointments_report', headers);
  };

  const exportDoctorsReport = () => {
    const headers = [
      { key: 'firstName', label: 'First Name' },
      { key: 'lastName', label: 'Last Name' },
      { key: 'specialty', label: 'Specialty' },
      { key: 'experienceYears', label: 'Experience (Years)' },
      { key: 'contactNumber', label: 'Contact Number' },
      { key: 'consultationFee', label: 'Consultation Fee' },
    ];
    exportToCSV(doctors, 'doctors_report', headers);
  };

  const exportFinancialReport = () => {
    const paidAppts = appointments.filter(apt => apt.paymentStatus === 'paid');
    const headers = [
      { key: 'appointmentNumber', label: 'Appointment Number' },
      { key: 'patientName', label: 'Patient Name' },
      { key: 'doctorName', label: 'Doctor Name' },
      { key: 'date', label: 'Date' },
      { key: 'fee', label: 'Fee' },
      { key: 'paymentStatus', label: 'Payment Status' },
    ];
    const dataWithFees = paidAppts.map(apt => {
      const doctor = doctors.find(d => String(d.userId) === String(apt.doctorId));
      return {
        ...apt,
        doctorName: doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : 'Unknown',
        fee: doctor?.consultationFee || 0,
      };
    });
    exportToCSV(dataWithFees, 'financial_report', headers);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Admin Dashboard loading data. User role:', user?.role);
        const [doctorsRes, appointmentsRes, sessionsRes, patientsRes] = await Promise.allSettled([
          doctorAPI.getAll(),
          appointmentAPI.getAll(),
          sessionAPI.getAll(),
          patientAPI.getAll(),
        ]);

        let errorMessages = [];
        if (doctorsRes.status === 'fulfilled') {
          const rawData = doctorsRes.value?.data;
          console.log('Doctors API raw response:', rawData);
          const data = rawData?.data || rawData || [];
          console.log('Doctors extracted:', data);
          setDoctors(Array.isArray(data) ? data : []);
        } else {
          errorMessages.push('Failed to load doctors');
          console.error('Doctors API error:', doctorsRes.reason);
        }

        if (appointmentsRes.status === 'fulfilled') {
          const rawData = appointmentsRes.value?.data;
          console.log('Appointments API raw response:', rawData);
          const data = rawData?.data || rawData || [];
          console.log('Appointments extracted:', data);
          setAppointments(Array.isArray(data) ? data : []);
        } else {
          errorMessages.push('Failed to load appointments');
          console.error('Appointments API error:', appointmentsRes.reason);
        }

        if (sessionsRes.status === 'fulfilled') {
          const rawData = sessionsRes.value?.data;
          console.log('Sessions API raw response:', rawData);
          const data = rawData?.data || rawData || [];
          console.log('Sessions extracted:', data);
          setSessions(Array.isArray(data) ? data : []);
        } else {
          errorMessages.push('Failed to load sessions');
          console.error('Sessions API error:', sessionsRes.reason);
        }

        if (patientsRes.status === 'fulfilled') {
          const rawData = patientsRes.value?.data;
          console.log('Patients API raw response:', rawData);
          const data = rawData?.data || rawData || [];
          console.log('Patients extracted:', data);
          setPatients(Array.isArray(data) ? data : []);
        } else {
          errorMessages.push('Failed to load patients');
          console.error('Patients API error:', patientsRes.reason);
        }

        if (errorMessages.length > 0) {
          console.warn('Some APIs failed:', errorMessages);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: 'home' },
    { id: 'doctors', label: 'Doctors', icon: 'user' },
    { id: 'patients', label: 'Patients', icon: 'users' },
    { id: 'appointments', label: 'Appointments', icon: 'calendar' },
    { id: 'sessions', label: 'Sessions', icon: 'clock' },
    { id: 'reports', label: 'Reports', icon: 'file' },
    { id: 'income', label: 'Income', icon: 'dollar' },
  ];

  const totalRevenue = useMemo(() => {
    if (!Array.isArray(appointments) || !Array.isArray(doctors)) return 0;
    return appointments.reduce((sum, apt) => {
      if (apt.paymentStatus === 'paid') {
        // Find doctor's consultation fee
        const doctor = doctors.find(d => String(d.userId) === String(apt.doctorId));
        const fee = doctor?.consultationFee || 0;
        return sum + fee;
      }
      return sum;
    }, 0);
  }, [appointments, doctors]);

  const paidAppointments = useMemo(() => {
    if (!Array.isArray(appointments)) return [];
    return appointments.filter(apt => apt.paymentStatus === 'paid');
  }, [appointments]);

  // Additional stats
  const pendingPaymentsCount = useMemo(() => {
    if (!Array.isArray(appointments)) return 0;
    return appointments.filter(apt => apt.paymentStatus === 'pending').length;
  }, [appointments]);

  const completedAppointments = useMemo(() => {
    if (!Array.isArray(appointments)) return 0;
    return appointments.filter(apt => apt.status === 'completed').length;
  }, [appointments]);

  const todayAppointments = useMemo(() => {
    if (!Array.isArray(appointments)) return 0;
    const today = new Date().toISOString().split('T')[0];
    return appointments.filter(apt => {
      const aptDate = new Date(apt.date).toISOString().split('T')[0];
      return aptDate === today;
    }).length;
  }, [appointments]);

  const activeSessionsCount = useMemo(() => {
    if (!Array.isArray(sessions)) return 0;
    return sessions.filter(s => s.status === 'active').length;
  }, [sessions]);

  const stats = {
    doctors: doctors.length,
    patients: patients.length,
    appointments: appointments.length,
    revenue: totalRevenue
  };

  // Debug: log when stats change
  useEffect(() => {
    console.log('Stats updated:', stats);
    console.log('Raw arrays:', { doctors: doctors.length, patients: patients.length, appointments: appointments.length, sessions: sessions.length });
  }, [stats, doctors.length, patients.length, appointments.length, sessions.length]);

  const Sidebar = () => (
    <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-gray-900 rounded-lg flex items-center justify-center text-white">
            <Icon path={icons.home} size={14} />
          </div>
          <span className="text-gray-900 font-bold text-sm">Admin Panel</span>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-gray-700">
          <Icon path={icons.x} size={18} />
        </button>
      </div>

      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gray-900 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {(user?.username || 'A')[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-gray-900 text-sm font-semibold truncate">{user?.username}</p>
            <p className="text-gray-400 text-xs capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          let countBadge = null;
          switch (item.id) {
            case 'doctors':
              countBadge = doctors.length;
              break;
            case 'patients':
              countBadge = patients.length;
              break;
            case 'appointments':
              countBadge = appointments.length;
              break;
            case 'sessions':
              countBadge = sessions.length;
              break;
            default:
              break;
          }
          return (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.id
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Icon path={icons[item.icon]} size={17} />
              <span className="flex-1 text-left">{item.label}</span>
              {countBadge !== null && (
                <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                  activeTab === item.id ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-700'
                }`}>
                  {countBadge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="px-3 pb-5 border-t border-gray-100 pt-3">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all"
        >
          <Icon path={icons.logout} size={17} />
          Sign Out
        </button>
      </div>
    </aside>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/20 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center gap-4 px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-20">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-gray-900">
            <Icon path={icons.menu} size={22} />
          </button>
          <div className="flex-1">
            <h1 className="text-gray-900 font-bold text-lg leading-none">
              {navItems.find((n) => n.id === activeTab)?.label}
            </h1>
            <p className="text-gray-400 text-xs mt-0.5">Admin Portal</p>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-gray-900 text-xl font-bold flex items-center gap-2">
                  <div className="text-emerald-500"><Icon path={<><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/><path d="M12 7a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 0-2h-3V8a1 1 0 0 0-1-1z"/></>} size={20} /></div>
                  Welcome, Admin
                </h2>
                <p className="text-gray-500 text-sm mt-1">Platform overview and analytics.</p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Doctors" value={stats.doctors} icon="user" sub="registered" />
                <StatCard label="Patients" value={stats.patients} icon="users" sub="active" />
                <StatCard label="Appointments" value={stats.appointments} icon="appointments" sub="total" />
                <StatCard label="Revenue" value={`$${stats.revenue.toLocaleString()}`} icon="dollar" sub="collected" />
              </div>

              {/* Additional Stats Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Today's Appointments" value={todayAppointments} icon="calendar" sub="scheduled today" />
                <StatCard label="Completed" value={completedAppointments} icon="shield" sub="appointments done" />
                <StatCard label="Pending Payments" value={pendingPaymentsCount} icon="clock" sub="awaiting payment" />
                <StatCard label="Active Sessions" value={activeSessionsCount} icon="activity" sub="available slots" />
              </div>
            </div>
          )}

          {activeTab === 'doctors' && (
            <DoctorsManagement doctors={doctors} onDoctorsChange={setDoctors} />
          )}

          {activeTab === 'patients' && (
            <PatientsManagement patients={patients} onPatientsChange={setPatients} />
          )}

          {activeTab === 'appointments' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-gray-900 text-xl font-bold">All Appointments</h2>
                <p className="text-gray-500 text-sm mt-0.5">View all patient bookings and their status</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-gray-600 font-medium">Appointment #</th>
                        <th className="px-4 py-3 text-left text-gray-600 font-medium">Patient</th>
                        <th className="px-4 py-3 text-left text-gray-600 font-medium">Doctor</th>
                        <th className="px-4 py-3 text-left text-gray-600 font-medium">Date</th>
                        <th className="px-4 py-3 text-left text-gray-600 font-medium">Time</th>
                        <th className="px-4 py-3 text-left text-gray-600 font-medium">Type</th>
                        <th className="px-4 py-3 text-left text-gray-600 font-medium">Status</th>
                        <th className="px-4 py-3 text-left text-gray-600 font-medium">Payment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.length === 0 ? (
                        <tr><td colSpan="8" className="px-4 py-8 text-center text-gray-500">No appointments booked yet</td></tr>
                      ) : (
                        appointments.map(apt => {
                          const patient = patients.find(p => String(p.userId) === String(apt.patientId));
                          const doctor = doctors.find(d => String(d.userId) === String(apt.doctorId));
                          const patientName = apt.patientName || patient?.name || 'Unknown';
                          const doctorName = doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : 'Unknown';
                          const date = new Date(apt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                          return (
                            <tr key={apt._id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="px-4 py-3 font-medium text-gray-900">{apt.appointmentNumber}</td>
                              <td className="px-4 py-3 text-gray-600">{patientName}</td>
                              <td className="px-4 py-3 text-gray-600">{doctorName}</td>
                              <td className="px-4 py-3 text-gray-600">{date}</td>
                              <td className="px-4 py-3 text-gray-600">{apt.startTime} - {apt.endTime}</td>
                              <td className="px-4 py-3 text-gray-600 capitalize">{apt.appointmentType}</td>
                              <td className="px-4 py-3">
                                <span className={`inline-flex px-2 py-0.5 text-xs font-medium border rounded ${
                                  apt.status === 'confirmed' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                  apt.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                                  apt.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' :
                                  'bg-gray-50 text-gray-700 border-gray-200'
                                }`}>{apt.status || 'scheduled'}</span>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`inline-flex px-2 py-0.5 text-xs font-medium border rounded ${
                                  apt.paymentStatus === 'paid' ? 'bg-green-50 text-green-700 border-green-200' :
                                  apt.paymentStatus === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                  'bg-gray-50 text-gray-700 border-gray-200'
                                }`}>{apt.paymentStatus || 'pending'}</span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sessions' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-gray-900 text-xl font-bold">Sessions</h2>
                <p className="text-gray-500 text-sm mt-0.5">Manage appointment schedules</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-gray-600 font-medium">Doctor</th>
                        <th className="px-4 py-3 text-left text-gray-600 font-medium">Date</th>
                        <th className="px-4 py-3 text-left text-gray-600 font-medium">Time</th>
                        <th className="px-4 py-3 text-left text-gray-600 font-medium">Patients</th>
                        <th className="px-4 py-3 text-left text-gray-600 font-medium">Type</th>
                        <th className="px-4 py-3 text-left text-gray-600 font-medium">Status</th>
                        <th className="px-4 py-3 text-left text-gray-600 font-medium">Bookings</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sessions.length === 0 ? (
                        <tr><td colSpan="7" className="px-4 py-8 text-center text-gray-500">No sessions scheduled</td></tr>
                      ) : (
                        sessions.map(session => {
                          const doctor = doctors.find(d => String(d.userId) === String(session.doctorId));
                          const doctorName = doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : 'Unknown';
                          const date = new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                          // Get patient names for this session
                          const sessionAppointments = appointments.filter(apt => String(apt.sessionId) === String(session._id));
                          const patientNames = [...new Set(sessionAppointments.map(apt => apt.patientName).filter(Boolean))];
                          return (
                            <tr key={session._id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="px-4 py-3 font-medium text-gray-900">{doctorName}</td>
                              <td className="px-4 py-3 text-gray-600">{date}</td>
                              <td className="px-4 py-3 text-gray-600">{session.startTime} - {session.endTime}</td>
                              <td className="px-4 py-3 text-gray-600 max-w-xs truncate" title={patientNames.join(', ')}>
                                {patientNames.length > 0 ? patientNames.slice(0, 3).join(', ') + (patientNames.length > 3 ? '...' : '') : '—'}
                              </td>
                              <td className="px-4 py-3 text-gray-600 capitalize">{session.sessionType}</td>
                              <td className="px-4 py-3">
                                <span className={`inline-flex px-2 py-0.5 text-xs font-medium border rounded ${
                                  session.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' :
                                  session.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                                  'bg-gray-50 text-gray-700 border-gray-200'
                                }`}>{session.status}</span>
                              </td>
                              <td className="px-4 py-3 text-gray-600">{session.currentAppointmentsCount} / {session.maxAppointments}</td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-gray-900 text-xl font-bold">Reports</h2>
                <p className="text-gray-500 text-sm mt-0.5">Generate and download reports</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                      <Icon path={icons.file} size={18} />
                    </div>
                    <div><p className="font-semibold text-gray-900">Appointments Report</p><p className="text-xs text-gray-500">All appointment data</p></div>
                  </div>
                  <button
                    onClick={exportAppointmentsReport}
                    className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Export CSV
                  </button>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                      <Icon path={icons.user} size={18} />
                    </div>
                    <div><p className="font-semibold text-gray-900">Doctors Report</p><p className="text-xs text-gray-500">Doctor statistics</p></div>
                  </div>
                  <button
                    onClick={exportDoctorsReport}
                    className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                  >
                    Export CSV
                  </button>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                      <Icon path={icons.dollar} size={18} />
                    </div>
                    <div><p className="font-semibold text-gray-900">Financial Report</p><p className="text-xs text-gray-500">Revenue and payments</p></div>
                  </div>
                  <button
                    onClick={exportFinancialReport}
                    className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                  >
                    Export CSV
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'income' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-gray-900 text-xl font-bold">Income Calculator</h2>
                <p className="text-gray-500 text-sm mt-0.5">Track revenue and financial metrics</p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} icon="dollar" sub="from paid appointments" />
                <StatCard label="Paid Appointments" value={paidAppointments.length} icon="calendar" sub="completed" />
                <StatCard label="Avg. Fee" value={`$${paidAppointments.length ? Math.round(totalRevenue / paidAppointments.length) : 0}`} icon="activity" sub="per visit" />
                <StatCard label="Pending" value={appointments.filter(a => a.paymentStatus === 'pending').length} icon="clock" sub="payments" />
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">Recent Paid Appointments</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-gray-600 font-medium">Patient</th>
                        <th className="px-4 py-3 text-left text-gray-600 font-medium">Date</th>
                        <th className="px-4 py-3 text-left text-gray-600 font-medium">Doctor</th>
                        <th className="px-4 py-3 text-left text-gray-600 font-medium">Fee</th>
                        <th className="px-4 py-3 text-left text-gray-600 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paidAppointments.length === 0 ? (
                        <tr><td colSpan="5" className="px-4 py-8 text-center text-gray-500">No paid appointments yet</td></tr>
                      ) : (
                        paidAppointments.slice(0, 20).map(apt => {
                          const doctor = doctors.find(d => String(d.userId) === String(apt.doctorId));
                          const doctorName = doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : 'Unknown';
                          const date = new Date(apt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                          return (
                            <tr key={apt._id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="px-4 py-3 font-medium text-gray-900">{apt.patientName}</td>
                              <td className="px-4 py-3 text-gray-600">{date}</td>
                              <td className="px-4 py-3 text-gray-600">{doctorName}</td>
                              <td className="px-4 py-3 font-medium text-gray-900">
                              ${(() => {
                                const doctor = doctors.find(d => String(d.userId) === String(apt.doctorId));
                                return doctor?.consultationFee || 0;
                              })()}
                            </td>
                              <td className="px-4 py-3"><span className="inline-flex px-2 py-0.5 text-xs font-medium border rounded bg-green-50 text-green-700 border-green-200">paid</span></td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;