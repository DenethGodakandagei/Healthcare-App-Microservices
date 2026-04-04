import React from 'react';

const Icon = ({ path, size = 20, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {path}
  </svg>
);

const AppointmentCard = ({ apt, onAccept, onComplete }) => {
  const date = new Date(apt.date || apt.scheduledAt || apt.createdAt);
  const status = apt.status || 'pending';
  
  const statusMap = {
    confirmed: { bg: 'bg-indigo-50 text-indigo-600 border-indigo-100', label: 'Confirmed' },
    scheduled: { bg: 'bg-blue-50 text-[#427CFF] border-blue-100', label: 'Scheduled' },
    pending: { bg: 'bg-amber-50 text-amber-600 border-amber-100', label: 'In Queue' },
    completed: { bg: 'bg-emerald-50 text-emerald-600 border-emerald-100', label: 'Satisfied' },
    cancelled: { bg: 'bg-red-50 text-red-600 border-red-100', label: 'Declined' }
  };

  const currentStatus = statusMap[status] || statusMap.pending;

  return (
    <div className="group bg-white p-6 rounded-[2rem] border border-gray-50 hover:shadow-2xl hover:shadow-gray-100/50 transition-all duration-300 flex items-center justify-between gap-6">
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-900 font-black text-xl group-hover:scale-110 transition-transform duration-500">
           {(apt.patientName || apt.patient?.username || 'P')[0].toUpperCase()}
        </div>
        <div>
          <h4 className="text-[#111] font-black text-lg tracking-tight mb-1">{apt.patientName || apt.patient?.username || 'P. Identification'}</h4>
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
