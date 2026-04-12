import React, { useState } from 'react';

const Icon = ({ path, size = 18, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {path}
  </svg>
);

const icons = {
  video: <><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></>,
  clock: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>,
  user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
  message: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></>,
  send: <><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></>,
  trash: <><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></>,
  info: <><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></>,
  x: <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>,
};

const AppointmentCard = ({ apt, onAccept, onDecline, onComplete, onRemove }) => {
  const [showModal, setShowModal] = useState(false);
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [msgInput, setMsgInput] = useState(apt.notes || '');
  const [isSending, setIsSending] = useState(false);

  const date = new Date(apt.date || apt.scheduledAt || apt.createdAt);
  const status = apt.status || 'pending';
  const onlineStatus = apt.onlineStatus || ((status === 'scheduled' || status === 'confirmed') ? 'approved' : 'pending');
  const isOnline = apt.appointmentType === 'online';

  const statusMap = {
    confirmed: { bg: 'bg-sky-50 text-[#0EA5E9] border-sky-100', label: 'Confirmed' },
    scheduled: { bg: 'bg-blue-50 text-blue-700 border-blue-200', label: 'Scheduled' },
    pending: { bg: 'bg-amber-50 text-amber-700 border-amber-200', label: 'In Queue' },
    completed: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Completed' },
    cancelled: { bg: 'bg-red-50 text-red-600 border-red-100', label: 'Cancelled' }
  };

  const currentStatus = statusMap[status] || statusMap.pending;

  return (
    <div className={`group bg-white rounded-2xl border p-5 transition-all duration-300 hover:shadow-md flex flex-col md:flex-row items-center justify-between gap-4 ${isOnline ? 'border-sky-100 bg-sky-50/10' : 'border-gray-200 shadow-sm'}`}>
      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-lg transition-transform duration-500 border ${isOnline ? 'bg-sky-50 text-[#0EA5E9] border-sky-100' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>
          {(apt.patientName || apt.patient?.username || 'P')[0].toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <h4 className="text-gray-900 font-bold text-base leading-none truncate">{apt.patientName || apt.patient?.username || 'Patient Identification'}</h4>
            {isOnline && (
              <span className="px-2 py-0.5 bg-sky-50 text-[#0EA5E9] text-[9px] font-bold uppercase tracking-wider rounded border border-sky-100 flex items-center gap-1">
                <Icon path={icons.video} size={10} /> Online
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-gray-400 text-xs">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${currentStatus.bg}`}>{currentStatus.label}</span>
            <span className="flex items-center gap-1.5 font-medium whitespace-nowrap">
              <Icon path={icons.clock} size={11} />
              {isNaN(date) ? 'TBD' : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {date.toLocaleDateString([], { month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto mt-3 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">
        <div className="flex items-center gap-2 mr-2">
          {isOnline && onlineStatus !== 'approved' && (
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${onlineStatus === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-red-50 text-red-600 border-red-100'}`}>
              {onlineStatus === 'pending' ? 'Waiting Approval' : 'Declined'}
            </span>
          )}
        </div>

        {isOnline && onlineStatus === 'approved' && (status === 'confirmed' || status === 'scheduled') && (
          <a href={`/video-call/${apt._id}?appointmentId=${apt._id}`} className="flex-1 md:flex-none h-11 px-5 bg-emerald-50/50 text-emerald-600 border border-emerald-100 rounded-xl font-bold text-[10px] uppercase tracking-wider hover:bg-emerald-100 transition-all flex items-center justify-center gap-2 group/btn">
            <Icon path={icons.video} size={15} className="group-hover/btn:scale-110 transition-transform" />
            JOIN CONSULTATION
          </a>
        )}

        {isOnline && onlineStatus === 'pending' && (
          <div className="flex gap-2">
            <button
              onClick={() => onAccept && onAccept(apt._id)}
              className="px-4 h-11 bg-[#2299C9] text-white rounded-xl font-bold text-[10px] uppercase tracking-wider hover:bg-[#1C82AB] active:scale-95 transition-all shadow-lg shadow-sky-500/10"
            >
              Approve
            </button>
            <button
              onClick={() => onDecline && onDecline(apt._id)}
              className="px-4 h-11 border-2 border-red-500 text-red-600 rounded-xl font-bold text-[10px] uppercase tracking-wider hover:bg-red-50 active:scale-95 transition-all"
            >
              Decline
            </button>
          </div>
        )}

        {!isOnline && status === 'pending' && (
          <button onClick={() => onAccept && onAccept(apt._id)} className="flex-1 md:flex-none h-11 px-6 bg-[#2299C9] text-white rounded-xl font-bold text-[10px] uppercase tracking-wider hover:bg-[#1C82AB] active:scale-95 transition-all shadow-sm shadow-sky-500/10">Approve</button>
        )}

        {status === 'confirmed' && (
          <button onClick={() => onComplete && onComplete(apt._id)} className="flex-1 md:flex-none h-11 px-6 border-2 border-emerald-500 text-emerald-600 rounded-xl font-bold text-[10px] uppercase tracking-wider hover:bg-emerald-50 active:scale-95 transition-all">Complete</button>
        )}

        {/* Remove button visible for cancelled appointments */}
        {status === 'cancelled' && (
          <button
            onClick={() => onRemove && onRemove(apt._id)}
            className="flex-1 md:flex-none h-11 px-6 bg-red-50 text-red-600 border border-red-100 rounded-xl font-bold text-[10px] uppercase tracking-wider hover:bg-red-100 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Icon path={icons.trash} size={14} />
            Remove Record
          </button>
        )}

        {/* View Patient Details Button */}
        <button
          onClick={() => setShowPatientDetails(true)}
          className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#0EA5E9] hover:border-[#0EA5E9] transition-all bg-white"
          title="View Patient Details"
        >
          <Icon path={icons.info} size={16} />
        </button>

        <button
          onClick={() => setShowModal(true)}
          className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#2299C9] hover:border-[#2299C9] transition-all bg-white"
          title="Send message to patient"
        >
          <Icon path={icons.message} size={16} />
        </button>

        {/* Patient Details Modal */}
        {showPatientDetails && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
              {/* Modal Header */}
              <div className="relative h-32 bg-gradient-to-r from-sky-400 to-[#2299C9] p-8">
                <button
                  onClick={() => setShowPatientDetails(false)}
                  className="absolute top-6 right-6 w-10 h-10 rounded-2xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all border border-white/20"
                >
                  <Icon path={icons.x} size={20} />
                </button>
                <div className="flex items-center gap-5 mt-4">
                  <div className="w-20 h-20 rounded-3xl bg-white p-1 shadow-xl">
                    <div className="w-full h-full bg-sky-50 rounded-2xl flex items-center justify-center text-[#2299C9] text-3xl font-black">
                      {(apt.patientName || 'P')[0]}
                    </div>
                  </div>
                  <div className="text-white">
                    <h3 className="text-2xl font-black tracking-tight leading-none">{apt.patientName || 'Anonymous Patient'}</h3>
                    <p className="text-sky-100 text-xs font-bold uppercase tracking-widest mt-2 bg-white/10 px-2 py-0.5 rounded inline-block">Ref: {apt.appointmentNumber}</p>
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-8 pt-12 space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Contact Number</p>
                    <p className="text-gray-900 font-bold text-sm">{apt.patientPhone || 'No contact provided'}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">ID/NIC Number</p>
                    <p className="text-gray-900 font-bold text-sm tracking-widest">{apt.patientNIC || '—'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Appointment Date</p>
                    <p className="text-gray-900 font-bold text-sm">{date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Scheduled Slot</p>
                    <p className="text-gray-900 font-bold text-sm capitalize">{apt.startTime} – {apt.endTime}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                    <Icon path={icons.message} size={10} className="text-[#2299C9]" />
                    Reason for Consultation
                  </p>
                  <p className="text-gray-700 text-sm font-medium leading-relaxed italic">
                    "{apt.reasonForVisit || 'No specific reason entered by patient.'}"
                  </p>
                </div>

                {apt.notes && (
                  <div className="bg-sky-50/50 rounded-3xl p-6 border border-sky-100">
                    <p className="text-[10px] font-black text-[#2299C9] uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                      <Icon path={icons.send} size={10} />
                      Clinical Notes / Previous Updates
                    </p>
                    <p className="text-[#1C82AB] text-sm font-bold leading-relaxed">
                      {apt.notes}
                    </p>
                  </div>
                )}

                {isOnline && apt.medicalReport && (
                  <div className="bg-emerald-50/50 rounded-3xl p-6 border border-emerald-100">
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                      <Icon path={<><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></>} size={10} />
                      Clinical Report / Attached Document
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-700 text-sm font-bold truncate max-w-[200px]">patient_clinical_record.pdf</span>
                      <a
                        href={apt.medicalReport}
                        download={`Report_${apt.patientName || 'Patient'}.pdf`}
                        className="h-10 px-4 bg-emerald-600 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center gap-2"
                      >
                        <Icon path={<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></>} size={12} />
                        Download
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-8 pb-8 flex gap-3">
                <button
                  onClick={() => setShowPatientDetails(false)}
                  className="flex-1 h-14 bg-gray-50 text-gray-600 rounded-[1.25rem] font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all border border-gray-100"
                >
                  Close Records
                </button>
                <button
                  onClick={() => { setShowPatientDetails(false); setShowModal(true); }}
                  className="flex-[1.5] h-14 bg-gray-900 text-white rounded-[1.25rem] font-black text-xs uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-3"
                >
                  <Icon path={icons.message} size={14} />
                  Contact Patient
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Messaging Modal */}
        {showModal && (
          <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-300 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-gray-900 font-black text-xl tracking-tight uppercase leading-tight">Patient Notification</h3>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Medical Update: {apt.patientName || apt.patient?.username || 'Patient'}</p>
                </div>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all">
                  <Icon path={icons.x} size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <textarea
                    value={msgInput}
                    onChange={(e) => setMsgInput(e.target.value)}
                    placeholder="Type your clinical update or cancellation reason here..."
                    className="w-full h-32 bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 text-gray-900 text-sm font-medium focus:border-[#2299C9] focus:outline-none transition-all resize-none placeholder:text-gray-300"
                  />
                  <div className="absolute bottom-4 right-4 text-[10px] font-black text-gray-300 uppercase tracking-widest">{msgInput.length}/500 chars</div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 h-12 bg-gray-50 text-gray-400 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all"
                  >
                    Dismiss
                  </button>
                  <button
                    disabled={isSending || !msgInput.trim()}
                    onClick={() => {
                      setIsSending(true);
                      import('../../services/api').then(({ appointmentAPI }) => {
                        appointmentAPI.updateStatus(apt._id, { notes: msgInput }).then(() => {
                          window.location.reload();
                        }).finally(() => setIsSending(false));
                      });
                    }}
                    className="flex-2 px-8 h-12 bg-[#2299C9] text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#1C82AB] active:scale-95 transition-all flex items-center justify-center gap-3 shadow-xl shadow-sky-500/20 disabled:opacity-50 disabled:grayscale disabled:scale-100"
                  >
                    {isSending ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Icon path={icons.send} size={14} />
                        Send Update
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;
