import React from 'react';

const Icon = ({ path, size = 20, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {path}
  </svg>
);

const icons = {
  user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
  alert: <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></>,
  phone: <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></>,
  id: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><line x1="15" y1="8" x2="19" y2="8" /><line x1="15" y1="12" x2="19" y2="12" /><line x1="15" y1="16" x2="19" y2="16" /><line x1="8" y1="16" x2="13" y2="16" /></>,
};

const BookingForm = ({
  selectedSession,
  patientName,
  setPatientName,
  patientNIC,
  setPatientNIC,
  patientPhone,
  setPatientPhone,
  reason,
  setReason,
  error,
  booking,
  onBook,
  onFillSelf,
  loadingProfile,
  medicalReport,
  setMedicalReport,
  isOnline
}) => {
  if (!selectedSession) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setMedicalReport(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-[3rem] p-10 shadow-2xl shadow-gray-100/50 animate-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h3 className="text-3xl font-black text-gray-900 tracking-tight">Confirm Appointment</h3>
          <p className="text-gray-400 font-medium text-sm mt-1">Please provide the visitor's identification details.</p>
        </div>
        <button
          onClick={onFillSelf}
          disabled={loadingProfile}
          className="group flex items-center gap-2 text-[10px] font-black text-gray-500 hover:text-gray-900 transition-all uppercase tracking-[0.2em] bg-gray-50 hover:bg-gray-100 px-6 py-3 rounded-2xl border border-gray-100"
        >
          {loadingProfile ? (
            <div className="w-3 h-3 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
          ) : (
            <Icon path={icons.user} size={14} className="group-hover:scale-110 transition-transform" />
          )}
          {loadingProfile ? 'Fetching...' : 'Use My Details'}
        </button>
      </div>

      <div className="space-y-10">
        {/* Patient Details Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-[0.15em] ml-1">
              <Icon path={icons.user} size={12} />
              Patient's Full Name
            </label>
            <div className="relative group">
              <input
                type="text"
                placeholder="Full name as per ID"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full px-6 py-5 bg-gray-50/50 border border-gray-100 rounded-[1.5rem] text-gray-900 font-bold focus:outline-none focus:ring-4 focus:ring-gray-900/5 focus:bg-white focus:border-gray-900 transition-all placeholder:text-gray-300 placeholder:font-semibold text-lg"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-[0.15em] ml-1">
              <Icon path={icons.id} size={12} />
              National ID / NIC
            </label>
            <input
              type="text"
              placeholder="Identification number"
              value={patientNIC}
              onChange={(e) => setPatientNIC(e.target.value)}
              className="w-full px-6 py-5 bg-gray-50/50 border border-gray-100 rounded-[1.5rem] text-gray-900 font-bold focus:outline-none focus:ring-4 focus:ring-gray-900/5 focus:bg-white focus:border-gray-900 transition-all placeholder:text-gray-300 placeholder:font-semibold text-lg"
            />
          </div>

          <div className="md:col-span-2 space-y-3">
            <label className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-[0.15em] ml-1">
              <Icon path={icons.phone} size={12} />
              Contact Phone Number
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-gray-400 font-bold">
                +94
              </div>
              <input
                type="tel"
                placeholder="77 123 4567"
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                className="w-full pl-16 pr-6 py-5 bg-gray-50/50 border border-gray-100 rounded-[1.5rem] text-gray-900 font-bold focus:outline-none focus:ring-4 focus:ring-gray-900/5 focus:bg-white focus:border-gray-900 transition-all placeholder:text-gray-300 placeholder:font-semibold text-lg"
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-gray-400 text-[10px] font-black uppercase tracking-[0.15em] ml-1">Reason for Visit (Optional)</label>
          <textarea
            placeholder="Briefly describe your symptoms or reason for the appointment..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full p-6 bg-gray-50/50 border border-gray-100 rounded-[2rem] text-gray-900 font-bold focus:outline-none focus:ring-4 focus:ring-gray-900/5 focus:bg-white focus:border-gray-900 transition-all h-40 placeholder:text-gray-300 placeholder:font-semibold resize-none"
          />
        </div>

        {isOnline && (
          <div className="space-y-3">
             <label className="flex items-center justify-between text-gray-400 text-[10px] font-black uppercase tracking-[0.15em] ml-1">
                <span>Medical Reports / Documents (Optional)</span>
                {medicalReport && <span className="text-green-600 font-bold">File Attached ✓</span>}
             </label>
             <div className="relative">
                <input
                  type="file"
                  id="medicalReport"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <label 
                  htmlFor="medicalReport"
                  className={`w-full h-32 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${medicalReport ? 'border-green-200 bg-green-50/50' : 'border-gray-100 bg-gray-50/30 hover:border-gray-900 hover:bg-white'}`}
                >
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${medicalReport ? 'bg-green-600 text-white shadow-lg shadow-green-200' : 'bg-white text-gray-400 border border-gray-100 group-hover:bg-gray-900 group-hover:text-white'}`}>
                    <Icon path={<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></>} size={18} />
                  </div>
                  <span className={`text-sm font-bold ${medicalReport ? 'text-green-700' : 'text-gray-400'}`}>
                    {medicalReport ? 'Report Successfully Attached' : 'Attach Clinical Documents (PDF/JPG)'}
                  </span>
                </label>
                {medicalReport && (
                  <button 
                    onClick={() => setMedicalReport('')}
                    className="absolute -top-3 -right-3 w-8 h-8 bg-white text-red-600 rounded-full flex items-center justify-center text-sm hover:bg-red-50 shadow-xl border border-gray-100 transition-all active:scale-90"
                    title="Remove file"
                  >
                    ✕
                  </button>
                )}
             </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-4 p-5 bg-red-50/50 border border-red-100 rounded-[1.5rem] text-red-600 animate-in fade-in slide-in-from-left-4 duration-300">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
              <Icon path={icons.alert} size={20} />
            </div>
            <p className="text-sm font-bold opacity-90">{error}</p>
          </div>
        )}

        <div className="pt-4">
          <button
            onClick={onBook}
            disabled={booking}
            className="w-full py-6 bg-gray-900 text-white font-black rounded-[2rem] hover:bg-gray-800 transition-all shadow-2xl shadow-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-xl flex items-center justify-center gap-3 active:scale-[0.98] duration-200"
          >
            {booking ? (
              <>
                <div className="w-5 h-5 border-3 border-gray-500 border-t-white rounded-full animate-spin" />
                <span>Scheduling Appointment...</span>
              </>
            ) : (
              <span>Confirm & Book for {selectedSession.startTime}</span>
            )}
          </button>
          <p className="text-center text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mt-6 flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            Instant Booking Confirmation
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
