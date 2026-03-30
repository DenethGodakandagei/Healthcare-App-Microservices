import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import BookingSuccess from '../components/BookingSuccess';
import { doctorAPI, sessionAPI, appointmentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Icon = ({ path, size = 20, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {path}
  </svg>
);

const icons = {
  calendar: <><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
  clock: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
  user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
  check: <polyline points="20 6 9 17 4 12"/>,
  chevronLeft: <polyline points="15 18 9 12 15 6"/>,
  alert: <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>,
  steth: <><path d="M4.8 2.3A.3.3 0 1 0 5 2a.3.3 0 0 0-.2.3Z"/><path d="M10 22v-2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2"/><path d="M18 14h-4a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2ZM22 5V2.5A.5.5 0 0 0 21.5 2h-15A.5.5 0 0 0 6 2.5V5"/><path d="M6 5v.5A2.5 2.5 0 0 0 8.5 8h7A2.5 2.5 0 0 0 18 5.5V5"/></>,
  info: <><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></>,
};

const BookingPage = () => {
  const { doctorId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [doctor, setDoctor] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientNIC, setPatientNIC] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [success, setSuccess] = useState(false);
  const [reason, setReason] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Doctor Profile first to get the userId
        const docRes = await doctorAPI.getById(doctorId);
        const doctorData = docRes.data?.data;
        if (!doctorData) throw new Error("Doctor not found");
        setDoctor(doctorData);

        // 2. Fetch Sessions using the doctor's userId
        const sessRes = await sessionAPI.getAll({ 
          doctorId: doctorData.userId, 
          status: 'active' 
        });
        setSessions(sessRes.data?.data || []);
      } catch (err) {
        console.error("Failed to load booking data", err);
        setError("Could not load doctor details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [doctorId]);

  const fillSelfDetails = async () => {
    if (!user) return;
    setLoadingProfile(true);
    try {
      // Try to get patient profile for auto-fill
      const profileRes = await patientAPI.getProfile();
      const profile = profileRes.data?.data;
      if (profile) {
        setPatientName(profile.name || user.username);
        // If patient model doesn't have NIC/Phone, we just fill the name
      } else {
        setPatientName(user.username);
      }
    } catch (err) {
      setPatientName(user.username);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleBook = async () => {
    if (!user) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }
    if (user.role !== 'patient') {
      setError("Only patients can book appointments.");
      return;
    }
    if (!selectedSession) return;
    if (!patientName || !patientNIC || !patientPhone) {
        setError("Please fill in all patient details.");
        return;
    }

    setBooking(true);
    setError('');
    try {
      const res = await appointmentAPI.book({
        sessionId: selectedSession._id,
        reasonForVisit: reason || "General Consultation",
        patientName,
        patientNIC,
        patientPhone
      });
      setSuccess(res.data?.data); // Store the appointment object
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
        console.error("Booking Error:", err);
      setError(err?.response?.data?.message || "Failed to book appointment.");
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center h-[70vh]">
          <div className="w-10 h-10 border-4 border-gray-100 border-t-gray-900 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!doctor && !loading) {
     return (
       <div className="min-h-screen bg-white">
         <Navbar />
         <div className="max-w-xl mx-auto pt-48 px-4 text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Doctor not found</h1>
            <p className="text-gray-500 mb-8">The specialist you are looking for does not exist or has been removed.</p>
            <Link to="/doctors" className="px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl">Back to Doctors</Link>
         </div>
       </div>
     );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />

      <div className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {success ? (
            <BookingSuccess appointment={success} doctor={doctor} />
          ) : (
            <div className="grid lg:grid-cols-12 gap-12 items-start">
              
              {/* Left Column: Doctor Info */}
              <div className="lg:col-span-5 space-y-8">
                <button 
                  onClick={() => navigate(-1)} 
                  className="flex items-center gap-2 text-gray-400 font-bold hover:text-gray-900 transition-colors uppercase text-xs tracking-widest"
                >
                  <Icon path={icons.chevronLeft} size={14} />
                  Back
                </button>

                <div className="bg-white border border-gray-100 rounded-[3rem] p-8 md:p-10 shadow-xl shadow-gray-100/50">
                  <div className="flex items-center gap-6 mb-10">
                    <div className="w-24 h-24 bg-gray-50 rounded-[2rem] overflow-hidden shrink-0 border-4 border-white shadow-lg">
                       <img
                         src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${doctor.userId}&backgroundColor=b6e3f4`}
                         alt={doctor.firstName}
                         className="w-full h-full object-cover"
                       />
                    </div>
                    <div>
                      <span className="inline-block px-3 py-1 bg-gray-900 text-white text-[10px] font-bold rounded-full uppercase tracking-tighter mb-2">{doctor.specialty}</span>
                      <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">Dr. {doctor.firstName} {doctor.lastName}</h1>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 shrink-0">
                        <Icon path={icons.user} size={18} />
                      </div>
                      <div>
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Experience</p>
                        <p className="text-gray-900 font-bold">{doctor.experienceYears}+ Years in Practice</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 shrink-0">
                        <Icon path={icons.info} size={18} />
                      </div>
                      <div>
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Consultation Fee</p>
                        <p className="text-gray-900 font-bold text-xl">${doctor.consultationFee}</p>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-50">
                       <p className="text-gray-500 font-medium leading-relaxed">
                         Dr. {doctor.firstName} is a highly regarded specialist in {doctor.specialty} with a focus on patient-centered care and modern diagnostic techniques.
                       </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-4">Patient Reviews</h3>
                    <div className="flex items-center gap-2 mb-6">
                       <div className="flex text-white">
                         {[1,2,3,4,5].map(n => <Icon key={n} path={<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>} size={14} className="fill-current" />)}
                       </div>
                       <span className="text-sm font-bold">4.9/5 (120+ reviews)</span>
                    </div>
                    <p className="text-white/60 text-sm font-medium italic">"Excellent consultation, very professional and empathetic. Highly recommended!"</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Sessions & Booking */}
              <div className="lg:col-span-7 space-y-8">
                <div>
                  <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Available Sessions</h2>
                  <p className="text-gray-500 font-medium">Select a time slot that works best for you.</p>
                </div>

                {sessions.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {sessions.map((sess) => (
                      <button
                        key={sess._id}
                        onClick={() => setSelectedSession(sess)}
                        className={`text-left p-6 rounded-[2.2rem] border-2 transition-all ${
                          selectedSession?._id === sess._id 
                            ? 'bg-gray-900 border-gray-900 text-white shadow-xl shadow-gray-300' 
                            : 'bg-white border-gray-100 hover:border-gray-900 text-gray-900'
                        }`}
                      >
                         <div className="flex items-center justify-between mb-4">
                            <div className={`p-2 rounded-xl ${selectedSession?._id === sess._id ? 'bg-white/10' : 'bg-gray-50'}`}>
                              <Icon path={icons.calendar} size={18} />
                            </div>
                            {selectedSession?._id === sess._id && <Icon path={icons.check} size={18} />}
                         </div>
                         <p className={`text-sm font-bold uppercase tracking-tighter mb-1 ${selectedSession?._id === sess._id ? 'text-white/60' : 'text-gray-400'}`}>
                           {new Date(sess.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                         </p>
                         <p className="text-xl font-extrabold">{sess.startTime} – {sess.endTime}</p>
                         <div className="mt-4 flex items-center justify-between">
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${selectedSession?._id === sess._id ? 'text-white/40' : 'text-gray-300'}`}>Availability</span>
                            <span className="text-xs font-bold">{sess.maxAppointments - sess.currentAppointmentsCount} slots left</span>
                         </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white border border-gray-100 rounded-[3rem] p-16 text-center shadow-sm">
                     <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 mx-auto mb-6">
                       <Icon path={icons.alert} size={28} />
                     </div>
                     <h3 className="text-xl font-extrabold text-gray-900 mb-2">No active sessions</h3>
                     <p className="text-gray-500 font-medium">This doctor doesn't have any available time slots at the moment. Please check back later.</p>
                  </div>
                )}

                {selectedSession && (
                  <div className="bg-white border border-gray-100 rounded-[3rem] p-10 shadow-2xl shadow-gray-100 animate-in slide-in-from-bottom-6 duration-500">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-2xl font-extrabold text-gray-900">Confirm Appointment</h3>
                      <button 
                        onClick={fillSelfDetails}
                        disabled={loadingProfile}
                        className="text-[10px] font-black text-gray-400 hover:text-gray-900 transition-all uppercase tracking-[0.2em] bg-gray-50 px-4 py-2 rounded-full border border-gray-100"
                      >
                        {loadingProfile ? 'Fetching...' : 'Use My Details'}
                      </button>
                    </div>
                    
                    <div className="space-y-8">
                       <div className="grid sm:grid-cols-2 gap-6">
                         <div className="space-y-2">
                           <label className="block text-gray-400 text-[10px] font-bold uppercase tracking-widest ml-1">Patient's Full Name</label>
                           <div className="relative group">
                             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-300 group-focus-within:text-gray-900 transition-colors">
                               <Icon path={icons.user} size={16} />
                             </div>
                             <input
                               type="text"
                               placeholder="Full name of the person visiting"
                               value={patientName}
                               onChange={(e) => setPatientName(e.target.value)}
                               className="w-full pl-11 pr-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 font-semibold focus:outline-none focus:ring-4 focus:ring-gray-900/5 focus:bg-white focus:border-gray-900 transition-all placeholder:text-gray-300 placeholder:font-medium"
                             />
                           </div>
                         </div>

                         <div className="space-y-2">
                           <label className="block text-gray-400 text-[10px] font-bold uppercase tracking-widest ml-1">National ID (NIC)</label>
                           <input
                             type="text"
                             placeholder="Identity card number"
                             value={patientNIC}
                             onChange={(e) => setPatientNIC(e.target.value)}
                             className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 font-semibold focus:outline-none focus:ring-4 focus:ring-gray-900/5 focus:bg-white focus:border-gray-900 transition-all placeholder:text-gray-300 placeholder:font-medium"
                           />
                         </div>

                         <div className="sm:col-span-2 space-y-2">
                           <label className="block text-gray-400 text-[10px] font-bold uppercase tracking-widest ml-1">Contact Phone Number</label>
                           <input
                             type="tel"
                             placeholder="Active phone number for updates"
                             value={patientPhone}
                             onChange={(e) => setPatientPhone(e.target.value)}
                             className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 font-semibold focus:outline-none focus:ring-4 focus:ring-gray-900/5 focus:bg-white focus:border-gray-900 transition-all placeholder:text-gray-300 placeholder:font-medium"
                           />
                         </div>
                       </div>

                       <div className="space-y-2 pt-2">
                         <label className="block text-gray-400 text-[10px] font-bold uppercase tracking-widest ml-1">Reason for visit (Optional)</label>
                         <textarea
                           placeholder="Briefly describe the health concern or purpose of visit..."
                           value={reason}
                           onChange={(e) => setReason(e.target.value)}
                           className="w-full p-5 bg-gray-50 border border-gray-100 rounded-3xl text-gray-900 font-semibold focus:outline-none focus:ring-4 focus:ring-gray-900/5 focus:bg-white focus:border-gray-900 transition-all h-32 placeholder:text-gray-300 placeholder:font-medium"
                         />
                       </div>

                       {error && (
                         <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600">
                            <Icon path={icons.alert} size={18} />
                            <p className="text-sm font-bold">{error}</p>
                         </div>
                       )}

                       <button
                         onClick={handleBook}
                         disabled={booking}
                         className="w-full py-5 bg-gray-900 text-white font-bold rounded-3xl hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                       >
                         {booking ? 'Scheduling...' : `Confirm Booking for ${selectedSession.startTime}`}
                       </button>

                       {!user && (
                         <p className="text-center text-gray-400 text-sm font-medium">
                           You need to <Link to="/login" className="text-gray-900 font-bold hover:underline">log in</Link> as a patient to complete this booking.
                         </p>
                       )}
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default BookingPage;
