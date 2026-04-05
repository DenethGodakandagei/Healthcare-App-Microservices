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
};

const AppointmentCard = ({ apt, onAccept, onComplete }) => {
  const [showModal, setShowModal] = useState(false);
  const [msgInput, setMsgInput] = useState(apt.notes || '');
  const [isSending, setIsSending] = useState(false);

  const date = new Date(apt.date || apt.scheduledAt || apt.createdAt);
  const status = apt.status || 'pending';
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
        {isOnline && (status === 'confirmed' || status === 'scheduled') && (
          <a href={`/video-call/${apt._id}?appointmentId=${apt._id}`} className="flex-1 md:flex-none h-11 px-5 bg-emerald-50/50 text-emerald-600 border border-emerald-100 rounded-xl font-bold text-[10px] uppercase tracking-wider hover:bg-emerald-100 transition-all flex items-center justify-center gap-2 group/btn">
            <Icon path={icons.video} size={15} className="group-hover/btn:scale-110 transition-transform" />
            JOIN CONSULTATION
          </a>
        )}
        {status === 'pending' && (
          <button onClick={() => onAccept && onAccept(apt._id)} className="flex-1 md:flex-none h-11 px-6 bg-[#2299C9] text-white rounded-xl font-bold text-[10px] uppercase tracking-wider hover:bg-[#1C82AB] active:scale-95 transition-all shadow-sm shadow-sky-500/10">Approve</button>
        )}
        {status === 'confirmed' && (
          <button onClick={() => onComplete && onComplete(apt._id)} className="flex-1 md:flex-none h-11 px-6 border-2 border-emerald-500 text-emerald-600 rounded-xl font-bold text-[10px] uppercase tracking-wider hover:bg-emerald-50 active:scale-95 transition-all">Complete</button>
        )}
        <button 
          onClick={() => setShowModal(true)}
          className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#2299C9] hover:border-[#2299C9] transition-all bg-white"
          title="Send message to patient"
        >
          <Icon path={icons.message} size={16} />
        </button>

        {/* Messaging Modal */}
        {showModal && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-300 border border-gray-100">
               <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-gray-900 font-black text-xl tracking-tight uppercase leading-tight">Patient Notification</h3>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Medical Update: {apt.patientName || apt.patient?.username || 'Patient'}</p>
                  </div>
                  <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all">
                     <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/></svg>
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

               <div className="mt-8 pt-6 border-t border-gray-50">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] leading-relaxed">
                    This message will be instantly visible on the patient's dashboard as a clinical update.
                  </p>
               </div>
            </div>
          </div>
        )}
        <button className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#0EA5E9] hover:border-[#0EA5E9] transition-all bg-white">
          <Icon path={icons.user} size={16} />
        </button>
      </div>
    </div>
  );
};

export default AppointmentCard;
