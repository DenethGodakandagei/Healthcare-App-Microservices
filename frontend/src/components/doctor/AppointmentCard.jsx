import React from 'react';

const Icon = ({ path, size = 20, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {path}
  </svg>
);

const icons = {
  video: <><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></>,
};

const AppointmentCard = ({ apt, onAccept, onComplete }) => {
  const date = new Date(apt.date || apt.scheduledAt || apt.createdAt);
  const status = apt.status || 'pending';
  const isOnline = apt.appointmentType === 'online';
  
  const statusMap = {
    confirmed: { bg: 'bg-indigo-50 text-indigo-600 border-indigo-100', label: 'Confirmed' },
    scheduled: { bg: 'bg-blue-50 text-[#427CFF] border-blue-100', label: 'Scheduled' },
    pending: { bg: 'bg-amber-50 text-amber-600 border-amber-100', label: 'In Queue' },
    completed: { bg: 'bg-emerald-50 text-emerald-600 border-emerald-100', label: 'Satisfied' },
    cancelled: { bg: 'bg-red-50 text-red-600 border-red-100', label: 'Declined' }
  };

  const currentStatus = statusMap[status] || statusMap.pending;

  return (
    <div className={`group bg-white p-6 rounded-[2rem] border hover:shadow-2xl hover:shadow-gray-100/50 transition-all duration-300 flex items-center justify-between gap-6 ${isOnline ? 'border-purple-100' : 'border-gray-50'}`}>
      <div className="flex items-center gap-5">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl group-hover:scale-110 transition-transform duration-500 ${isOnline ? 'bg-purple-50 text-purple-600' : 'bg-gray-50 text-gray-900'}`}>
           {(apt.patientName || apt.patient?.username || 'P')[0].toUpperCase()}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-[#111] font-black text-lg tracking-tight">{apt.patientName || apt.patient?.username || 'P. Identification'}</h4>
            {isOnline && (
              <span className="px-2 py-0.5 bg-purple-100 text-purple-600 text-[9px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1">
                <Icon path={icons.video} size={10} />Online
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
             <span className={`text-[10px] px-3 py-1 rounded-full border font-black uppercase tracking-widest ${currentStatus.bg}`}>
               {currentStatus.label}
             </span>
             <span className="text-gray-300 text-[11px] font-bold">
               {isNaN(date) ? 'TBD' : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {date.toLocaleDateString([], { month: 'short', day: 'numeric' })}
             </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
         {isOnline && (status === 'confirmed' || status === 'scheduled') && (
           <a href={`/video-call/${apt._id}?appointmentId=${apt._id}`} className="h-12 px-6 bg-purple-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-purple-700 active:scale-95 transition-all shadow-lg shadow-purple-100 flex items-center gap-2">
             <Icon path={icons.video} size={14} />Join Call
           </a>
         )}
         {status === 'pending' && (
           <button onClick={() => onAccept && onAccept(apt._id)} className="h-12 px-6 bg-[#427CFF] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 active:scale-95 transition-all shadow-lg shadow-blue-100">Accept Request</button>
         )}
         {status === 'confirmed' && (
           <button onClick={() => onComplete && onComplete(apt._id)} className="h-12 px-6 border border-emerald-100 text-emerald-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-50 transition-all">Mark Complete</button>
         )}
         <button className="w-12 h-12 rounded-2xl border border-gray-100 flex items-center justify-center text-gray-300 hover:text-[#427CFF] hover:border-blue-100 transition-all">
           <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
         </button>
      </div>
    </div>
  );
};

export default AppointmentCard;

