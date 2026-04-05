import { Link } from 'react-router-dom';

const Icon = ({ path, size = 20, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {path}
  </svg>
);

const icons = {
  check: <polyline points="20 6 9 17 4 12" />,
};

const BookingSuccess = ({ appointment, doctor }) => {
  if (!appointment || !doctor) return null;

  const calculateApproxTime = (startStr, token) => {
    if (!startStr || isNaN(token)) return startStr;
    const [h, m] = startStr.split(':').map(Number);
    const date = new Date();
    date.setHours(h, m + (token - 1) * 15, 0);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const appointmentDate = new Date(appointment.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="max-w-2xl mx-auto bg-white border border-gray-100 rounded-[3rem] p-12 text-center shadow-2xl shadow-gray-100 animate-in zoom-in-95 duration-500">
      <div className="w-24 h-24 bg-green-500 rounded-3xl flex items-center justify-center text-white mx-auto mb-8 shadow-lg shadow-green-200">
        <Icon path={icons.check} size={48} />
      </div>

      <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Booking Confirmed!</h2>
      <p className="text-lg text-gray-500 font-medium mb-12 leading-relaxed">
        Your appointment with <span className="text-gray-900 font-bold">Dr. {doctor.firstName} {doctor.lastName}</span> has been successfully scheduled.
      </p>

      {/* Appointment Snapshot Card */}
      <div className="bg-gray-50 rounded-[2.5rem] p-10 mb-12 border border-gray-100/50 flex flex-col gap-8 text-left">
        <div className="flex justify-between items-center pb-6 border-b border-gray-200/50">
          <div>
            <span className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.25em] block mb-1">Appointment ID</span>
            <span className="text-gray-900 font-black text-2xl tracking-tight">{appointment.appointmentNumber}</span>
          </div>
          <div className="text-right">
            <span className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.25em] block mb-1">Token No.</span>
            <span className="text-green-600 font-black text-3xl">#{appointment.tokenNumber}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10">
          <div className="space-y-1.5">
            <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest block">Consultation Date</span>
            <span className="text-gray-900 font-extrabold block text-lg">{appointmentDate}</span>
          </div>
          <div className="space-y-1.5 text-right">
            <span className="text-indigo-500 font-bold uppercase text-[10px] tracking-widest block">Estimated Arrival</span>
            <span className="text-gray-900 font-extrabold block text-lg">{calculateApproxTime(appointment.startTime, appointment.tokenNumber)}</span>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200/50 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest block">Session Window</span>
            <span className="text-gray-600 font-semibold block text-sm">{appointment.startTime} – {appointment.endTime}</span>
          </div>
          <div className="bg-white/50 px-4 py-2 rounded-2xl border border-gray-100">
            <span className="text-gray-400 font-bold text-[10px] uppercase tracking-tighter">Status: </span>
            <span className="text-indigo-600 font-bold text-xs uppercase tracking-widest ml-1">Confirmed</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-5">
        <Link to="/patient/dashboard" className="flex-1 py-5 bg-gray-900 text-white font-bold rounded-3xl hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-2">
          Go to My Dashboard
        </Link>
        <Link to="/doctors" className="flex-1 py-5 bg-gray-100 text-gray-900 font-bold rounded-3xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
          Find More Specialists
        </Link>
      </div>

      <p className="mt-10 text-gray-400 text-sm font-medium">
        A confirmation has been sent to your registered email.
      </p>
    </div>
  );
};

export default BookingSuccess;
