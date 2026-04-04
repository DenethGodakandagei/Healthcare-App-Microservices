import React from 'react';

const Icon = ({ path, size = 18, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {path}
  </svg>
);

const icons = {
  video: <><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></>,
  clock: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>,
  user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
};

const AppointmentCard = ({ apt, onAccept, onComplete }) => {
  const date = new Date(apt.date || apt.scheduledAt || apt.createdAt);
  const status = apt.status || 'pending';
  const isOnline = apt.appointmentType === 'online';

  const statusMap = {
    confirmed: { bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', label: 'Confirmed' },
    scheduled: { bg: 'bg-blue-50 text-blue-700 border-blue-200', label: 'Scheduled' },
    pending: { bg: 'bg-amber-50 text-amber-700 border-amber-200', label: 'In Queue' },
    completed: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Satisfied' },
    cancelled: { bg: 'bg-red-50 text-red-700 border-red-200', label: 'Declined' }
  };

  const currentStatus = statusMap[status] || statusMap.pending;

  return (
    <div className={`group bg-white rounded-3xl border p-6 transition-all duration-300 hover:shadow-xl hover:shadow-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 ${isOnline ? 'border-purple-100 bg-purple-50/10' : 'border-gray-50'}`}>
      <div className="flex items-center gap-5 w-full md:w-auto">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl transition-transform duration-500 group-hover:scale-105 border ${isOnline ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-indigo-50 text-indigo-900 border-indigo-100'}`}>
          {(apt.patientName || apt.patient?.username || 'P')[0].toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h4 className="text-gray-900 font-black text-lg tracking-tight uppercase leading-none">{apt.patientName || apt.patient?.username || 'P. Identification'}</h4>
            {isOnline && (
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1 border border-emerald-100">
                <Icon path={icons.video} size={10} />Online Consultation
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
            <span className={`px-3 py-1 rounded-full border ${currentStatus.bg}`}>{currentStatus.label}</span>
            <span className="flex items-center gap-1.5 font-bold">
              <Icon path={icons.clock} size={10} />
              {isNaN(date) ? 'TBD' : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {date.toLocaleDateString([], { month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
        {isOnline && (status === 'confirmed' || status === 'scheduled') && (
          <a href={`/video-call/${apt._id}?appointmentId=${apt._id}`} className="flex-1 md:flex-none h-12 px-6 bg-emerald-50 text-emerald-600 border-2 border-emerald-100 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-100 active:scale-95 transition-all flex items-center justify-center gap-2 group/btn">
            <Icon path={icons.video} size={14} className="group-hover/btn:scale-110 transition-transform" /> Join Consultation
          </a>
        )}
        {status === 'pending' && (
          <button onClick={() => onAccept && onAccept(apt._id)} className="flex-1 md:flex-none h-12 px-6 bg-indigo-50 text-indigo-900 border border-indigo-100 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-100 active:scale-95 transition-all shadow-sm">Approve Request</button>
        )}
        {status === 'confirmed' && (
          <button onClick={() => onComplete && onComplete(apt._id)} className="flex-1 md:flex-none h-12 px-6 border-2 border-emerald-500 text-emerald-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-50 active:scale-95 transition-all">Mark Complete</button>
        )}
        <button className="w-12 h-12 rounded-xl border border-gray-100 flex items-center justify-center text-gray-300 hover:text-indigo-950 hover:border-indigo-950 transition-all shadow-sm">
          <Icon path={icons.user} size={18} />
        </button>
      </div>
    </div>
  );
};

export default AppointmentCard;
