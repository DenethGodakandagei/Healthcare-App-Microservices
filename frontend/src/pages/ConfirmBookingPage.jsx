import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import BookingForm from '../components/BookingForm';
import BookingSuccess from '../components/BookingSuccess';
import PaymentCheckout from '../components/PaymentCheckout';
import { doctorAPI, sessionAPI, appointmentAPI, patientAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import doc1 from '../assets/doc1.png';
import doc2 from '../assets/doc2.png';
import doc3 from '../assets/doc3.png';
import doc4 from '../assets/doc4.png';

const doctorImages = [doc1, doc2, doc3, doc4];

const ConfirmBookingPage = () => {
  const { doctorId, sessionId } = useParams();
  const [searchParams] = useSearchParams();
  const sessionType = searchParams.get('type') || 'offline';
  const isOnline = sessionType === 'online';
  const { user } = useAuth();
  const navigate = useNavigate();

  const getDoctorImage = (id) => {
    if (!id) return doc1;
    const index = Math.abs(id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % doctorImages.length;
    return doctorImages[index];
  };

  const [doctor, setDoctor] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [pendingAppointment, setPendingAppointment] = useState(null);

  const [patientName, setPatientName] = useState('');
  const [patientNIC, setPatientNIC] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [reason, setReason] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docRes, sessRes] = await Promise.all([
          doctorAPI.getById(doctorId),
          sessionAPI.getById(sessionId)
        ]);
        setDoctor(docRes.data?.data);
        setSession(sessRes.data?.data);
      } catch (err) {
        console.error("Failed to load booking data", err);
        setError("Could not load details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [doctorId, sessionId]);

  const fillSelfDetails = async () => {
    if (!user) return;
    setLoadingProfile(true);
    try {
      const profileRes = await patientAPI.getProfile();
      const profile = profileRes.data?.data;
      if (profile) {
        setPatientName(profile.name || user.username);
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
    if (!patientName || !patientNIC || !patientPhone) {
      setError("Please fill in all patient details.");
      return;
    }

    setBooking(true);
    setError('');
    try {
      const res = await appointmentAPI.book({
        sessionId,
        reasonForVisit: reason || "General Consultation",
        patientName,
        patientNIC,
        patientPhone,
        appointmentType: isOnline ? 'online' : 'physical'
      });
      setPendingAppointment(res.data?.data);
      setShowPayment(true);
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
          <div className="w-12 h-12 border-4 border-gray-100 border-t-gray-900 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/30">
      <Navbar />

      <div className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {success ? (
            <BookingSuccess appointment={success} doctor={doctor} />
          ) : showPayment ? (
            <PaymentCheckout
              appointment={pendingAppointment}
              doctor={doctor}
              onShowSuccess={() => setSuccess(pendingAppointment)}
              onCancel={() => setShowPayment(false)}
            />
          ) : (
            <div className="space-y-12">
              {/* Specialized Header */}
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-indigo-100/50">
                  Step 2: Confirmation
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Finalize Your Booking</h1>
                <p className="text-gray-500 font-medium max-w-lg">Review the details below and provide patient information to secure your token.</p>
              </div>

              {/* Summary Card */}
              <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-xl shadow-gray-100/50 flex flex-col md:flex-row gap-8 items-center justify-between overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="flex items-center gap-6 relative z-10">
                  <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden border-2 border-white shadow-md">
                    <img
                      src={getDoctorImage(doctor._id)}
                      alt={doctor.firstName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900 leading-tight">Dr. {doctor.firstName} {doctor.lastName}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-indigo-500 text-xs font-bold uppercase tracking-widest">{doctor.specialty}</p>
                      {isOnline && (
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-600 text-[9px] font-black uppercase tracking-widest rounded-full">Video Call</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-8 relative z-10 border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8 w-full md:w-auto">
                  <div className="flex-1 md:flex-none">
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Date</p>
                    <p className="text-gray-900 font-black truncate">{new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' })}</p>
                  </div>
                  <div className="flex-1 md:flex-none">
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Time</p>
                    <p className="text-gray-900 font-black truncate">{session.startTime} – {session.endTime}</p>
                  </div>
                </div>
              </div>

              <BookingForm
                selectedSession={session}
                patientName={patientName}
                setPatientName={setPatientName}
                patientNIC={patientNIC}
                setPatientNIC={setPatientNIC}
                patientPhone={patientPhone}
                setPatientPhone={setPatientPhone}
                reason={reason}
                setReason={setReason}
                error={error}
                booking={booking}
                onBook={handleBook}
                onFillSelf={fillSelfDetails}
                loadingProfile={loadingProfile}
              />
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ConfirmBookingPage;
