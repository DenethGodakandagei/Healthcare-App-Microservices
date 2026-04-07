import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

import { useNavigate } from 'react-router-dom';
import { patientAPI, appointmentAPI, doctorAPI, sessionAPI, telemedicineAPI, notificationAPI } from '../../services/api';

import { useNavigate, Link } from 'react-router-dom';
import { patientAPI, appointmentAPI, doctorAPI, sessionAPI, telemedicineAPI, paymentAPI } from '../../services/api';
import doc1 from '../../assets/doc1.png';
import doc2 from '../../assets/doc2.png';
import doc3 from '../../assets/doc3.png';
import doc4 from '../../assets/doc4.png';
import AppointmentBookingWizard from '../../components/AppointmentBookingWizard';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';
import PaymentCheckout from '../../components/PaymentCheckout';

const doctorImages = [doc1, doc2, doc3, doc4];

const getDoctorImage = (id) => {
  if (!id) return doc1;
  const index = Math.abs(id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % doctorImages.length;
  return doctorImages[index];
};

const Icon = ({ path, size = 20, className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {path}
  </svg>
);

const icons = {
  home: <><rect x="3" y="11" width="18" height="11" rx="1" /><path d="M3 11L12 3l9 8" /></>,
  calendar: <><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>,
  user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
  bell: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></>,
  logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>,
  heart: <><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></>,
  activity: <><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></>,
  clock: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>,
  pill: <><path d="M10.5 20H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.5" /><path d="M21 6a2 2 0 0 0-2-2h-5.5" /><line x1="12" y1="12" x2="21" y2="12" /><rect x="12" y="4" width="9" height="16" rx="2" /></>,
  menu: <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>,
  x: <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>,
  plus: <><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></>,
  shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></>,
  video: <><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></>,
  check: <><polyline points="20 6 9 17 4 12" /></>,
  edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></>,
  chevronRight: <><polyline points="9 18 15 12 9 6" /></>,
  creditCard: <><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></>,
  download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></>,
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



const AppointmentCard = ({ apt, doctors, onCancel, onEdit, onDownload }) => {
  const appointmentDate = new Date(apt.date || apt.sessionId?.date);
  const sessionStart = apt.sessionId?.startTime || apt.startTime;
  const sessionEnd = apt.sessionId?.endTime || apt.endTime;

  // Get doctorId from appointment or session
  const doctorId = apt.doctorId || apt.sessionId?.doctorId;
  const doctor = doctors.find(d => d.userId === doctorId || String(d._id) === String(doctorId));
  const doctorName = doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : 'Unknown';
  const doctorSpecialty = doctor?.specialty || 'General';
  const isOnline = apt.appointmentType === 'online' || apt.sessionId?.sessionType === 'online';

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
    <div className={`flex items-center px-3 py-2 bg-white border rounded hover:shadow-sm transition-shadow text-sm ${isOnline ? 'border-purple-200' : 'border-gray-200'}`}>
      <div className="w-48 shrink-0 font-medium text-gray-900 truncate">{doctorName}</div>
      <div className="w-24 shrink-0 text-gray-500 truncate mx-8">{doctorSpecialty}</div>
      <div className="w-24 shrink-0 text-gray-600">{formatDate(appointmentDate)}</div>
      <div className="w-24 shrink-0 text-gray-500">{sessionTime}</div>
      <div className="flex-1 text-gray-400 truncate flex items-center gap-2">
        {isOnline && (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-purple-50 text-purple-600 text-[10px] font-bold rounded border border-purple-100">
            <Icon path={icons.video} size={10} />Online
          </span>
        )}
        {apt.reasonForVisit || ''}
      </div>
      <div className="shrink-0 flex items-center gap-2">
        {apt.paymentStatus === 'paid' ? (
          <div className="flex items-center gap-2">
            <span className="inline-flex px-2 py-0.5 text-[9px] font-black uppercase bg-green-50 text-green-600 border border-green-100 rounded">Paid</span>
            <button
              onClick={() => onDownload(apt)}
              className="p-1.5 text-gray-400 hover:text-[#0EA5E9] hover:bg-sky-50 rounded-lg transition-all title='Download Receipt'"
            >
              <Icon path={icons.download} size={14} />
            </button>
          </div>
        ) : (
          <span className="inline-flex px-2 py-0.5 text-[9px] font-black uppercase bg-amber-50 text-amber-600 border border-amber-100 rounded">Unpaid</span>
        )}
        <span className={`inline-flex px-2 py-0.5 text-xs font-medium border rounded ${statusConfig[status]}`}>{status}</span>
      </div>
      <div className="flex gap-2 shrink-0 ml-4">
        {isOnline && status !== 'cancelled' && status !== 'completed' && (
          <a href={`/video-call/${apt._id}?appointmentId=${apt._id}`} className="text-xs px-2 py-1 bg-[#2299C9] text-white rounded hover:bg-[#1C82AB] transition-colors flex items-center gap-1 font-medium">
            <Icon path={icons.video} size={10} />Join Call
          </a>
        )}
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

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [messageDoctor, setMessageDoctor] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  const [payments, setPayments] = useState([]);


  useEffect(() => {
    const load = async () => {
      try {
        const [aptsRes, profileRes, doctorsRes, paymentsRes] = await Promise.allSettled([
          patientAPI.getAppointments(),
          patientAPI.getProfile(),
          doctorAPI.getAll(),
          paymentAPI.getPatientPayments(),
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

        // Load doctors (filter out incomplete or obvious mock accounts)
        if (doctorsRes.status === 'fulfilled') {
          const doctorsResponse = doctorsRes.value?.data;
          const doctorsList = (doctorsResponse?.data || doctorsResponse || []).filter(d =>
            d.firstName && d.lastName &&
            !d.firstName.toLowerCase().includes('mock') &&
            !d.firstName.toLowerCase().includes('test')
          );
          setDoctors(doctorsList);
        }


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

        // Load payments
        if (paymentsRes.status === 'fulfilled') {
          setPayments(paymentsRes.value?.data?.data || []);

        }

        setAppointments(patientAppointments);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoadingData(false);
      }
    };
    load();
  }, [user]);

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
  
  const handleSendMessage = async () => {
    if (!messageDoctor || !messageText.trim()) return;
    setSendingMessage(true);
    try {
      // 1. Access/Create Chat
      const chatRes = await chatAPI.accessChat(messageDoctor.userId || messageDoctor._id);
      const chat = chatRes.data;

      // 2. Send the first message
      await messageAPI.sendMessage({
        chatId: chat._id,
        content: messageText
      });

      // 3. Clear and Navigate
      setMessageDoctor(null);
      setMessageText('');
      navigate(`/chat/${chat._id}`);
    } catch (error) {
      console.error('Failed to start chat:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const downloadReceipt = (apt) => {
    const doctorId = apt.doctorId || apt.sessionId?.doctorId;
    const doctor = doctors.find(d => d.userId === doctorId || String(d._id) === String(doctorId));
    const doctorName = doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : 'Medical Professional';
    const date = new Date(apt.date || apt.sessionId?.date || apt.createdAt).toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    const receiptHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>BioGrid - Receipt - ${apt._id.slice(-6)}</title>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'Inter', sans-serif; padding: 60px; color: #111827; background: #f9fafb; line-height: 1.5; }
            .receipt-container { max-width: 700px; margin: auto; background: white; padding: 50px; border-radius: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border: 1px solid #e5e7eb; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f3f4f6; padding-bottom: 30px; margin-bottom: 40px; }
            .brand { font-size: 28px; font-weight: 800; color: #0EA5E9; letter-spacing: -0.05em; }
            .receipt-title { text-align: right; }
            .receipt-title h1 { margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: #6b7280; }
            .receipt-title p { margin: 4px 0 0; font-size: 18px; font-weight: 800; }
            .grid { display: grid; grid-cols: 2; gap: 40px; margin-bottom: 40px; }
            .section-title { font-size: 12px; font-weight: 800; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; }
            .info-box { background: #f8fafc; padding: 20px; border-radius: 16px; border: 1px solid #f1f5f9; }
            .row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 15px; }
            .row:last-child { margin-bottom: 0; border-top: 1px dashed #e2e8f0; pt: 12px; mt: 12px; }
            .label { color: #64748b; font-weight: 500; }
            .value { font-weight: 600; color: #1e293b; }
            .amount-section { margin-top: 40px; text-align: right; border-top: 2px solid #f3f4f6; padding-top: 20px; }
            .total-label { font-size: 14px; font-weight: 600; color: #64748b; }
            .total-value { font-size: 32px; font-weight: 800; color: #0EA5E9; margin-top: 4px; }
            .status-badge { display: inline-block; padding: 6px 12px; background: #ecfdf5; color: #059669; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; }
            .footer { margin-top: 60px; text-align: center; border-top: 1px solid #f3f4f6; padding-top: 30px; font-size: 13px; color: #9ca3af; }
            .btn-print { position: fixed; bottom: 30px; right: 30px; padding: 12px 24px; background: #0EA5E9; color: white; border: none; border-radius: 12px; font-weight: 700; cursor: pointer; box-shadow: 0 10px 15px -3px rgba(14, 165, 233, 0.3); }
            @media print { .btn-print { display: none; } body { padding: 0; background: white; } .receipt-container { box-shadow: none; border: none; } }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            <div class="header">
              <div class="brand">BioGrid</div>
              <div class="receipt-title">
                <h1>Consultation Receipt</h1>
                <p>#REF-${apt._id.slice(-8).toUpperCase()}</p>
              </div>
            </div>
            
            <div style="display: flex; gap: 30px;">
              <div style="flex: 1;">
                <div class="section-title">Patient Details</div>
                <div class="info-box">
                  <p style="margin: 0; font-size: 18px; font-weight: 800;">${user?.username || user?.name}</p>
                  <p style="margin: 4px 0 0; color: #64748b; font-size: 14px;">${user?.email}</p>
                </div>
              </div>
              <div style="flex: 1;">
                <div class="section-title">Consultation info</div>
                <div class="info-box">
                  <p style="margin: 0; font-size: 16px; font-weight: 700;">${doctorName}</p>
                  <p style="margin: 4px 0 0; color: #0EA5E9; font-size: 12px; font-weight: 800; text-transform: uppercase;">${doctor?.specialty || 'General Practice'}</p>
                </div>
              </div>
            </div>

            <div style="margin-top: 40px;">
              <div class="section-title">Session Details</div>
              <div class="row"><span class="label">Consultation Date</span> <span class="value">${date}</span></div>
              <div class="row"><span class="label">Consultation Type</span> <span class="value" style="text-transform: capitalize;">${apt.appointmentType || 'Physical Clinic'} Session</span></div>
              <div class="row"><span class="label">Payment Method</span> <span class="value">Online (Stripe/Card)</span></div>
              <div class="row"><span class="label">Payment Status</span> <span class="status-badge">Payment Successful</span></div>
            </div>

            <div class="amount-section">
              <span class="total-label">Total Amount Paid</span>
              <div class="total-value">LKR ${(doctor?.consultationFee || 2500).toLocaleString()}.00</div>
            </div>

            <div class="footer">
              <p>This is a computer-generated confirmation of your healthcare consultation payment.</p>
              <p style="margin-top: 8px;">BioGrid Digital Health Network &copy; ${new Date().getFullYear()}</p>
            </div>
          </div>
          <button class="btn-print" onclick="window.print()">Print Receipt</button>
        </body>
      </html>
    `;
    const win = window.open('', '_blank');
    win.document.write(receiptHtml);
    win.document.close();
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: 'home' },
    { id: 'appointments', label: 'Appointments', icon: 'calendar' },
    { id: 'telemedicine', label: 'Telemedicine', icon: 'video' },

    { id: 'notifications', label: 'Notifications', icon: 'bell' },

    { id: 'payments', label: 'Payments', icon: 'creditCard' },

    { id: 'profile', label: 'My Profile', icon: 'user' },
  ];

  const upcoming = appointments.filter((a) => a.status !== 'cancelled' && a.status !== 'completed' && !(a.appointmentType === 'online' || a.sessionId?.sessionType === 'online'));
  const completed = appointments.filter((a) => a.status === 'completed');

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
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-gray-700 transition-colors">
          <Icon path={icons.x} size={18} />
        </button>
      </div>

      {/* User info */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#2299C9] rounded-full flex items-center justify-center text-white text-sm font-bold">
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
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === item.id
              ? 'bg-[#2299C9] text-white shadow-md shadow-sky-500/20'
              : 'text-gray-600 hover:text-[#0EA5E9] hover:bg-gray-100'
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
          <button 
            onClick={() => setActiveTab('notifications')}
            className={`relative text-gray-500 hover:text-[#0EA5E9] transition-colors p-1.5 rounded-lg hover:bg-gray-100 ${activeTab === 'notifications' ? 'bg-sky-50 text-[#0EA5E9]' : ''}`}
          >
            <Icon path={icons.bell} size={20} />
            {(unreadCount > 0 || upcoming.length > 0) && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#2299C9] rounded-full" />
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
                      <div className="text-emerald-500"><Icon path={<><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" /><path d="M12 7a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 0-2h-3V8a1 1 0 0 0-1-1z" /></>} size={20} /></div>
                      Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user?.username || 'Patient'}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Here&apos;s your health summary for today.</p>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard label="Upcoming" value={upcoming.length} icon="calendar" sub={`${upcoming.length > 0 ? 'Confirmed' : 'No'} appointments`} />
                    <StatCard label="Completed" value={completed.length} icon="activity" sub={`${completed.length} total visits`} />
                    <StatCard label="Telemedicine" value={appointments.filter(a => a.appointmentType === 'online' || a.sessionId?.sessionType === 'online').length} icon="video" sub="Online sessions" />
                    <StatCard label="Prescriptions" value="—" icon="pill" sub="Profile verified" />
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
                          <AppointmentCard key={apt._id} apt={apt} doctors={doctors} onCancel={handleCancel} onEdit={handleEdit} onDownload={downloadReceipt} />
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
                      <p className="text-gray-500 text-sm mt-0.5">{appointments.filter(a => !(a.appointmentType === 'online' || a.sessionId?.sessionType === 'online')).length} appointments</p>
                    </div>
                    <button
                      onClick={() => setShowBookingModal(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#2299C9] text-white rounded-xl hover:bg-[#1C82AB] transition-colors text-sm font-medium shadow-sm"
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
                      {appointments.filter(a => !(a.appointmentType === 'online' || a.sessionId?.sessionType === 'online')).map((apt) => (
                        <AppointmentCard key={apt._id} apt={apt} doctors={doctors} onCancel={handleCancel} onEdit={handleEdit} onDownload={downloadReceipt} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ---- TELEMEDICINE ---- */}
              {activeTab === 'telemedicine' && (
                <TelemedicineTab user={user} doctors={doctors} appointments={appointments} setAppointments={setAppointments} navigate={navigate} onEdit={handleEdit} onDownload={downloadReceipt} />
              )}

              {/* ---- PAYMENTS ---- */}
              {activeTab === 'payments' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-gray-900 text-xl font-bold">Payment History</h2>
                    <p className="text-gray-500 text-sm mt-0.5">Manage your consultation fees and receipts</p>
                  </div>

                  {payments.length === 0 ? (
                    <div className="bg-white border border-gray-200 rounded-[2rem] p-12 text-center">
                      <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-300">
                        <Icon path={icons.creditCard} size={28} />
                      </div>
                      <p className="text-gray-600 font-bold">No payments found</p>
                      <p className="text-gray-400 text-sm mt-1">Your transaction history will appear here once you book paid consultations.</p>
                    </div>
                  ) : (
                    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="px-6 py-4 text-[10px] font-black underline uppercase tracking-widest text-gray-400">Date</th>
                            <th className="px-6 py-4 text-[10px] font-black underline uppercase tracking-widest text-gray-400">Appointment ID</th>
                            <th className="px-6 py-4 text-[10px] font-black underline uppercase tracking-widest text-gray-400">Amount</th>
                            <th className="px-6 py-4 text-[10px] font-black underline uppercase tracking-widest text-gray-400">Status</th>
                            <th className="px-6 py-4 text-[10px] font-black underline uppercase tracking-widest text-gray-400">Method</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {payments.map((p) => (
                            <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                                {new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900 font-bold uppercase tracking-tight">
                                {p.appointmentId ? `#${p.appointmentId.slice(-6)}` : '—'}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900 font-black">
                                LKR {p.amount.toLocaleString()}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${p.status === 'completed' ? 'bg-green-50 text-green-600 border-green-100' :
                                  p.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                    'bg-red-50 text-red-600 border-red-100'
                                  }`}>
                                  {p.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500 font-medium capitalize">
                                {p.paymentMethod || 'Stripe'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* ---- NOTIFICATIONS ---- */}
              {activeTab === 'notifications' && (
                <NotificationsTab notifications={notifications} />
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
                      <div className="w-16 h-16 bg-[#2299C9] rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
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
      
      {/* Send Message Modal */}
      {messageDoctor && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="p-8 pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Message Specialist</h3>
                <p className="text-gray-400 text-xs font-medium uppercase tracking-widest mt-1">Direct communication channel</p>
              </div>
              <button onClick={() => setMessageDoctor(null)} className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
                <Icon path={icons.x} size={20} />
              </button>
            </div>
            
            <div className="p-8 pt-4 space-y-6">
              <div className="flex items-center gap-4 p-4 bg-sky-50/50 rounded-2xl border border-sky-100">
                <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm">
                  <img src={getDoctorImage(messageDoctor.userId || '')} alt="Doctor" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-gray-900 font-bold">Dr. {messageDoctor.firstName} {messageDoctor.lastName}</p>
                  <p className="text-[#0EA5E9] text-[10px] font-black uppercase tracking-wider">{messageDoctor.specialty}</p>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5 ml-1">Your Message</label>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Describe your symptoms or ask a question..."
                  className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-4 focus:ring-sky-500/10 focus:border-[#2299C9] outline-none transition-all resize-none font-medium text-gray-700 min-h-[160px]"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setMessageDoctor(null)}
                  className="flex-1 h-14 bg-gray-50 text-gray-500 rounded-2xl font-bold hover:bg-gray-100 transition-all active:scale-[0.98]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={sendingMessage || !messageText.trim()}
                  className="flex-1 h-14 bg-[#2299C9] text-white rounded-2xl font-bold hover:bg-[#1C82AB] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-2 shadow-xl shadow-sky-500/20"
                >
                  {sendingMessage ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Icon path={<><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></>} size={18} />
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Appointment Modal */}
      {showEditModal && editAppointment && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Edit Appointment</h3>
              <button onClick={() => { setShowEditModal(false); setEditAppointment(null); }} className="text-gray-400 hover:text-gray-600">
                <Icon path={<><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>} size={18} />
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


/* ─── Notifications Tab ────────────────────────────────────────── */
const NotificationsTab = ({ notifications }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'chat': return <Icon path={icons.menu} size={18} />; // Replace with a chat icon if available
      case 'email': return <Icon path={icons.pill} size={18} />; // Generic icon
      case 'sms': return <Icon path={icons.user} size={18} />; // Generic icon
      default: return <Icon path={icons.bell} size={18} />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900 text-xl font-bold">Notifications</h2>
        <p className="text-gray-500 text-sm mt-0.5">Stay updated with your healthcare activities</p>
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-100 rounded-[2rem] p-12 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 mb-4">
            <Icon path={icons.bell} size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No Notifications</h3>
          <p className="text-gray-400 text-sm max-w-xs mx-auto">
            You're all caught up! New updates about your appointments and health will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div 
              key={notif._id} 
              className={`bg-white border border-gray-100 rounded-2xl p-4 flex gap-4 hover:shadow-md transition-all group ${notif.status === 'PENDING' ? 'border-sky-100 bg-sky-50/10' : ''}`}
            >
              <div className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center ${
                notif.type === 'chat' ? 'bg-sky-50 text-sky-500' : 
                notif.type === 'email' ? 'bg-emerald-50 text-emerald-500' : 
                'bg-purple-50 text-purple-500'
              }`}>
                {getIcon(notif.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    {notif.type} • {new Date(notif.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  {notif.status === 'PENDING' && (
                    <span className="w-2 h-2 bg-[#2299C9] rounded-full" />
                  )}
                </div>
                <p className="text-gray-800 text-sm font-medium leading-relaxed">
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

export default PatientDashboard;


/* ─── Telemedicine Tab ────────────────────────────────────────── */
const TelemedicineTab = ({ user, doctors, appointments, setAppointments, navigate, onEdit, onDownload }) => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [booking, setBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('overview'); // 'overview' | 'specialties' | 'doctors' | 'sessions' | 'confirm' | 'payment'
  const [pendingAppointment, setPendingAppointment] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  // Form fields
  const [patientName, setPatientName] = useState('');
  const [patientNIC, setPatientNIC] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [reason, setReason] = useState('');

  // Unique specialties from doctors
  const specialties = [...new Set(doctors.map(d => d.specialty).filter(Boolean))].sort();

  // Doctors filtered by selected specialty
  const filteredDoctors = selectedSpecialty
    ? doctors.filter(d => d.specialty === selectedSpecialty)
    : [];

  // Online appointments for this patient (strictly active telemedicine)
  const onlineAppointments = appointments.filter(a =>
    (a.appointmentType === 'online' || a.sessionId?.sessionType === 'online') &&
    a.status !== 'cancelled'
  );

  const loadSessions = async (doctor) => {
    setLoadingSessions(true);
    try {
      const res = await sessionAPI.getAll({ doctorId: doctor.userId, status: 'active' });
      const allSessions = res.data?.data || [];
      setSessions(allSessions.filter(s => s.sessionType === 'online'));
    } catch (_) {
      setSessions([]);
    }
    setLoadingSessions(false);
  };

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setStep('sessions');
    loadSessions(doctor);
  };

  const handleSelectSession = (sess) => {
    if (sess.currentAppointmentsCount >= sess.maxAppointments) return;
    setSelectedSession(sess);
    setStep('confirm');
  };

  const handleBook = async () => {
    if (!patientName || !patientNIC || !patientPhone) {
      setError('Please fill in all required fields.');
      return;
    }

    // We only book after payment succeeds
    setPendingAppointment({
      _id: "PENDING",
      appointmentNumber: "TBD",
      sessionId: selectedSession._id,
      patientName,
      patientNIC,
      patientPhone,
      reasonForVisit: reason,
      appointmentType: 'online'
    });
    setStep('payment');
  };

  const handleJoinCall = (apt) => {
    navigate(`/video-call/${apt._id}?appointmentId=${apt._id}`);
  };

  const handleCancelRequest = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this consultation?')) return;
    try {
      await appointmentAPI.cancel(id);
      setAppointments(prev => prev.map(a => a._id === id ? { ...a, status: 'cancelled' } : a));
    } catch (err) {
      console.error('Cancel failed:', err);
    }
  };

  const resetFlow = () => {
    setStep('overview');
    setSelectedSpecialty('');
    setSelectedDoctor(null);
    setSelectedSession(null);
    setSessions([]);
    setPatientName('');
    setPatientNIC('');
    setPatientPhone('');
    setReason('');
    setError('');
    setBookingSuccess(false);
    setPendingAppointment(null);
    setShowPayment(false);
  };

  const goBack = () => {
    if (step === 'specialties') setStep('overview');
    else if (step === 'doctors') setStep('specialties');
    else if (step === 'sessions') setStep('doctors');
    else if (step === 'confirm') setStep('sessions');
  };

  // [Previously OnlineStatusBadge was here - removed per user request for no approval flow]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 text-xl font-bold flex items-center gap-2">
            <div className="text-[#0EA5E9]"><Icon path={icons.video} size={20} /></div>
            Telemedicine
          </h2>
          <p className="text-gray-500 text-sm mt-0.5">Book and manage online video consultations</p>
        </div>
        {step !== 'overview' && (
          <button onClick={goBack} className="text-xs px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition-all">
            ← Back
          </button>
        )}
      </div>

      {/* Step 0: Overview & Book Button */}
      {step === 'overview' && (
        <div className="space-y-6">
          <div className="bg-white border-2 border-dashed border-gray-100 rounded-[2rem] p-12 text-center flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-sky-50 rounded-3xl flex items-center justify-center text-sky-500 mb-6 group hover:scale-105 transition-transform duration-500">
              <Icon path={icons.video} size={36} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Virtual Consultation</h3>
            <p className="text-gray-500 max-w-sm mx-auto mb-8 text-sm leading-relaxed font-medium">
              Connect with our certified medical professionals from the comfort of your home.
            </p>
            <button
              onClick={() => setStep('specialties')}
              className="h-14 px-8 bg-[#2299C9] text-white rounded-2xl font-bold hover:bg-[#1C82AB] active:scale-[0.98] transition-all flex items-center gap-3 shadow-xl shadow-sky-500/20"
            >
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Icon path={icons.plus} size={18} />
              </div>
              Book New Consultation
            </button>
          </div>

          {onlineAppointments.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-gray-900 font-bold text-lg px-2">Active Online Appointments</h3>
              <div className="grid gap-3">
                {onlineAppointments.map(apt => {
                  const date = new Date(apt.date || apt.createdAt);
                  const doctorId = apt.doctorId || apt.sessionId?.doctorId;
                  const doctor = doctors.find(d => d.userId === doctorId || String(d._id) === String(doctorId));
                  const doctorName = doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : 'Doctor';
                  return (
                    <div key={apt._id} className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-lg hover:shadow-gray-100/50 transition-all group overflow-hidden relative">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-sky-50/50 rounded-bl-[4rem] -mr-8 -mt-8 transition-transform group-hover:scale-125 duration-700" />

                      <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-sm ring-1 ring-gray-100">
                            <img src={getDoctorImage(doctorId || '')} alt={doctorName} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="text-gray-900 text-base font-bold">{doctorName}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[#0EA5E9] text-[10px] font-black uppercase tracking-wider bg-sky-50 px-2 py-0.5 rounded-md">
                                {doctor?.specialty || 'General Specialist'}
                              </span>
                              <span className="text-gray-400 text-xs text-medium">
                                {isNaN(date) ? 'TBD' : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                {apt.startTime && ` at ${apt.startTime}`}
                              </span>
                            </div>
                            {apt.reasonForVisit && (
                              <p className="text-[10px] text-gray-500/80 font-medium mt-1 truncate max-w-[250px]">
                                <span className="text-gray-400 font-bold uppercase tracking-tighter mr-1 text-[9px]">Reason:</span> {apt.reasonForVisit}
                              </p>
                            )}
                            {apt.notes && (
                              <div className="mt-2.5 p-2 bg-sky-50/40 border border-sky-300/20 rounded-xl flex items-center gap-2 relative overflow-hidden group/note">
                                <div className="w-1 absolute left-0 top-0 bottom-0 bg-[#2299C9]" />
                                <div className="text-[#0EA5E9] shrink-0"><Icon path={icons.bell} size={12} /></div>
                                <p className="text-[10px] font-medium text-[#2299C9] leading-tight flex-1">
                                  <span className="font-black uppercase text-[8px] tracking-[0.1em] opacity-60 block mb-0.5">Doctor's Update:</span>
                                  {apt.notes}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 relative z-10 shrink-0">
                          {apt.status !== 'cancelled' ? (
                            <div className="flex items-center gap-2">
                              {apt.paymentStatus === 'paid' && (
                                <button
                                  onClick={() => onDownload(apt)}
                                  className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#0EA5E9] hover:border-[#0EA5E9] hover:bg-sky-50 transition-all"
                                  title="Download Receipt"
                                >
                                  <Icon path={icons.download} size={14} />
                                </button>
                              )}
                              {apt.paymentStatus === 'paid' && (
                                <span className="px-2 py-1 text-[10px] font-black uppercase bg-green-50 text-green-600 border border-green-100 rounded-lg">Paid</span>
                              )}
                              <button
                                onClick={() => handleJoinCall(apt)}
                                className="h-10 px-5 bg-[#2299C9] text-white rounded-xl font-bold text-sm hover:bg-[#1C82AB] transition-all flex items-center gap-2 shadow-lg shadow-sky-500/20"
                              >
                                <Icon path={icons.video} size={16} />
                                JOIN CALL
                              </button>
                              <button
                                onClick={() => onEdit(apt)}
                                className="w-10 h-10 border border-gray-100 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center hover:bg-gray-100 hover:text-[#0EA5E9] transition-all"
                                title="Edit Details"
                              >
                                <Icon path={icons.edit} size={15} />
                              </button>
                              <button
                                onClick={() => handleCancelRequest(apt._id)}
                                className="w-10 h-10 border border-red-500/10 bg-red-50 text-red-400 rounded-xl flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition-all"
                                title="Cancel Consultation"
                              >
                                <Icon path={icons.x} size={16} />
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs px-3 py-1 bg-red-50 text-red-600 border border-red-100 rounded-full font-bold uppercase tracking-wider">
                              Cancelled
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 1: Select Specialty */}
      {step === 'specialties' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-gray-900 font-bold text-lg">Medical Specialization</h3>
            <p className="text-gray-400 text-xs mt-0.5">Filter by the type of care you need</p>
          </div>
          {specialties.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center text-gray-400 text-sm">
              No specialties available right now.
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {specialties.map(spec => (
                <button
                  key={spec}
                  onClick={() => { setSelectedSpecialty(spec); setStep('doctors'); }}
                  className="px-6 py-4 bg-white border border-gray-200 rounded-2xl hover:border-[#2299C9] hover:bg-sky-50/50 transition-all group flex flex-col items-center min-w-[140px] text-center"
                >
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-[#2299C9] group-hover:bg-white mb-2 transition-colors">
                    <Icon path={icons.activity} size={20} />
                  </div>
                  <span className="text-sm font-bold text-gray-800">{spec}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 2: Select Doctor (Filtered) */}
      {step === 'doctors' && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-900 font-bold text-lg">Doctors in {selectedSpecialty}</h3>
              <p className="text-gray-400 text-xs mt-0.5">{filteredDoctors.length} verified professionals available</p>
            </div>
            <button onClick={() => setStep('specialties')} className="text-xs text-[#0EA5E9] font-bold hover:underline">Change Specialty</button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDoctors.map(doc => {
              const availDays = (doc.availability || []).map(a => a.day?.slice(0, 3)).join(', ') || 'Not set';
              return (
                <button
                  key={doc._id}
                  onClick={() => handleSelectDoctor(doc)}
                  className="text-left bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-[#0EA5E9] hover:shadow-lg hover:shadow-sky-50 transition-all group"
                >
                  {/* Doctor Image + Badge */}
                  <div className="relative">
                    <div className="w-full h-36 bg-gradient-to-br from-slate-50 to-gray-100 overflow-hidden">
                      <img
                        src={getDoctorImage(doc._id)}
                        alt={`Dr. ${doc.firstName} ${doc.lastName}`}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    {/* Online badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full border border-green-100">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-[10px] font-bold text-green-700 uppercase tracking-wider">Online</span>
                    </div>
                    {/* Fee badge */}
                    <div className="absolute top-3 right-3 px-2.5 py-1 bg-gray-900/80 backdrop-blur-sm rounded-full">
                      <span className="text-[11px] font-bold text-white">${doc.consultationFee || '—'}</span>
                    </div>
                  </div>

                  {/* Doctor Info */}
                  <div className="p-4">
                    <h4 className="text-gray-900 font-bold text-sm truncate">Dr. {doc.firstName} {doc.lastName}</h4>
                    <p className="text-[#0EA5E9] text-xs font-semibold uppercase tracking-wider mt-0.5">{doc.specialty}</p>

                    {/* Stats row */}
                    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-1.5">
                        <div className="text-gray-400"><Icon path={icons.activity} size={12} /></div>
                        <span className="text-[11px] font-bold text-gray-600">{doc.experienceYears || 0}+ yrs</span>
                      </div>
                      <div className="w-px h-3 bg-gray-200" />
                      <div className="flex items-center gap-1.5">
                        <div className="text-gray-400"><Icon path={icons.clock} size={12} /></div>
                        <span className="text-[11px] font-medium text-gray-500 truncate">{availDays}</span>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[11px] text-gray-400 font-medium">View available slots</span>
                      <div className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-[#0EA5E9] group-hover:text-white transition-all">
                        <Icon path={icons.chevronRight} size={14} />
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 2: Select Time Slot */}
      {step === 'sessions' && selectedDoctor && (
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl overflow-hidden border border-gray-100 shrink-0">
              <img
                src={getDoctorImage(selectedDoctor._id)}
                alt={`Dr. ${selectedDoctor.firstName} ${selectedDoctor.lastName}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-900 font-bold text-sm">Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}</p>
              <p className="text-[#0EA5E9] text-xs font-semibold uppercase tracking-wider">{selectedDoctor.specialty}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[11px] text-gray-500 font-medium">{selectedDoctor.experienceYears || 0}+ yrs experience</span>
                <span className="text-[11px] text-gray-400">·</span>
                <span className="text-[11px] font-bold text-gray-700">${selectedDoctor.consultationFee || '—'}</span>
              </div>
            </div>
          </div>

          <h3 className="text-gray-900 font-semibold text-sm">Select Available Time Slot</h3>

          {loadingSessions ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
            </div>
          ) : sessions.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
              <div className="text-gray-300 flex justify-center mb-3"><Icon path={icons.clock} size={32} /></div>
              <p className="text-gray-600 text-sm font-medium">No available slots</p>
              <p className="text-gray-400 text-xs mt-1">This doctor has no active sessions right now</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {sessions.map(sess => {
                const isFull = sess.currentAppointmentsCount >= sess.maxAppointments;
                const slotsLeft = sess.maxAppointments - sess.currentAppointmentsCount;
                return (
                  <button
                    key={sess._id}
                    onClick={() => handleSelectSession(sess)}
                    disabled={isFull}
                    className={`text-left p-5 rounded-2xl border-2 transition-all ${isFull
                      ? 'bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed'
                      : selectedSession?._id === sess._id
                        ? 'bg-gray-900 border-gray-900 text-white shadow-lg'
                        : 'bg-white border-gray-200 hover:border-cyan-400'
                      }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-1.5 rounded-lg ${selectedSession?._id === sess._id ? 'bg-white/10' : 'bg-gray-50'}`}>
                        <Icon path={icons.calendar} size={14} />
                      </div>
                      {isFull && <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">FULL</span>}
                    </div>
                    <p className={`text-xs font-bold uppercase tracking-tighter mb-0.5 ${selectedSession?._id === sess._id ? 'text-white/60' : 'text-gray-400'}`}>
                      {new Date(sess.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </p>
                    <p className="text-lg font-bold">{sess.startTime} – {sess.endTime}</p>
                    <p className={`text-xs mt-2 font-medium ${isFull ? 'text-red-500' : selectedSession?._id === sess._id ? 'text-white/50' : 'text-gray-400'}`}>
                      {isFull ? 'No slots available' : `${slotsLeft} slot${slotsLeft !== 1 ? 's' : ''} left`}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Step 3: Confirm Booking */}
      {step === 'confirm' && selectedSession && !bookingSuccess && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5">
          <div>
            <h3 className="text-gray-900 font-bold text-lg">Confirm Online Appointment</h3>
            <p className="text-gray-400 text-xs mt-0.5">Fill in your details to request an online consultation</p>
          </div>

          <div className="bg-cyan-50 border border-cyan-100 rounded-xl p-3 flex items-center gap-3">
            <div className="text-cyan-600"><Icon path={icons.video} size={16} /></div>
            <p className="text-cyan-700 text-xs font-medium">
              This will be a <strong>video consultation</strong>. The doctor will review and approve your request.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 text-xs font-medium mb-1.5">Full Name *</label>
              <input type="text" value={patientName} onChange={e => setPatientName(e.target.value)}
                placeholder="Your full name" className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all" />
            </div>
            <div>
              <label className="block text-gray-600 text-xs font-medium mb-1.5">NIC Number *</label>
              <input type="text" value={patientNIC} onChange={e => setPatientNIC(e.target.value)}
                placeholder="National ID" className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all" />
            </div>
            <div>
              <label className="block text-gray-600 text-xs font-medium mb-1.5">Phone Number *</label>
              <input type="tel" value={patientPhone} onChange={e => setPatientPhone(e.target.value)}
                placeholder="+94 77 123 4567" className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all" />
            </div>
            <div>
              <label className="block text-gray-600 text-xs font-medium mb-1.5">Reason for Visit</label>
              <input type="text" value={reason} onChange={e => setReason(e.target.value)}
                placeholder="Brief description" className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all" />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-xs font-medium">{error}</div>
          )}

          <div className="flex gap-4 pt-4">
            <button onClick={() => setStep('doctors')} className="flex-1 h-12 border border-gray-300 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all">
              Change Doctor
            </button>
            <button onClick={handleBook} disabled={booking}
              className="flex-1 h-12 bg-[#2299C9] text-white rounded-xl text-sm font-black hover:bg-[#1C82AB] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 duration-200">
              {booking ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (
                <div className="flex items-center gap-2">
                  <Icon path={icons.creditCard} size={16} />
                  <span>Pay & Confirm Appointment</span>
                  <span className="px-1.5 py-0.5 bg-white/20 rounded text-[10px]">LKR {selectedDoctor?.consultationFee || 2500}</span>
                </div>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Payment */}
      {step === 'payment' && pendingAppointment && (
        <PaymentCheckout
          appointment={pendingAppointment}
          doctor={selectedDoctor}
          onShowSuccess={async (orderId) => {
            try {
              // 1. Create the appointment NOW since payment succeeded
              const { _id, ...bookingData } = pendingAppointment;
              const bookRes = await appointmentAPI.book({
                ...bookingData,
                paymentStatus: 'paid'
              });
              const bookedApt = bookRes.data?.data;

              // 2. Link the payment to the real appointment ID
              await paymentAPI.confirm({
                paymentId: orderId,
                status: 'completed',
                appointmentId: bookedApt._id
              });

              setAppointments(prev => [...prev, bookedApt]);
              setBookingSuccess(true);
              setStep('success'); // advance the UI cleanly
            } catch (err) {
              console.error("Booking failed after payment:", err);
              const msg = err?.response?.data?.message || err.message;
              setError("Booking sync failed: " + msg);
              setStep('confirm');
            }
          }}
          onCancel={() => setStep('confirm')}
        />
      )}

      {/* Success */}
      {step === 'success' && bookingSuccess && (
        <div className="bg-white border border-green-200 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Icon path={icons.check} size={28} className="text-green-600" />
          </div>
          <h3 className="text-gray-900 font-bold text-lg">Consultation Requested!</h3>
          <p className="text-gray-500 text-sm mt-2">Your online consultation request has been sent to the doctor. You'll be able to join the video call once the doctor approves your request.</p>
          <button onClick={resetFlow} className="mt-4 px-6 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors">
            Done
          </button>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
