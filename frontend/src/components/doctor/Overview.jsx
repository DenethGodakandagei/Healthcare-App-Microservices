import React from 'react';
import { useOutletContext } from 'react-router-dom';
import DocStatCard from './DocStatCard';
import AppointmentCard from './AppointmentCard';
import { appointmentAPI } from '../../services/api';

const Icon = ({ path, size = 20, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {path}
  </svg>
);

const Overview = () => {
  const { user, appointments, pending, confirmed } = useOutletContext();
  
  return (
    <div className="space-y-12 animate-in slide-in-from-bottom-8 duration-700">
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DocStatCard 
            label="Live Requests" 
            value={pending.length} 
            iconContent={<><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0" /></>}
            trend="+4 now" 
            intensity="amber"
          />
          <DocStatCard 
            label="Confirmed Sessions" 
            value={confirmed.length} 
            iconContent={<><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>}
            highlight 
          />
          <DocStatCard 
            label="Clinical Yield" 
            value="94%" 
            iconContent={<polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />}
            trend="High Efficiency" 
            intensity="emerald"
          />
          <DocStatCard 
            label="Total Network" 
            value={appointments.length} 
            iconContent={<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>}
          />
       </div>

       <div className="flex flex-col xl:flex-row gap-8">
          <div className="flex-1 space-y-6">
             <div className="flex items-center justify-between px-2">
                <h3 className="text-slate-950 font-black text-2xl tracking-tighter uppercase leading-none">Incoming Diagnoses</h3>
                <span className="px-4 py-2 bg-indigo-50 text-indigo-900 border border-indigo-100 rounded-xl font-black text-[10px] uppercase tracking-widest">{pending.length} Requests Pending</span>
             </div>
             
             {pending.length === 0 ? (
               <div className="p-24 bg-white rounded-[3rem] border border-gray-50 text-center space-y-6 shadow-sm">
                  <div className="w-24 h-24 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center text-emerald-500 mx-auto border border-emerald-100">
                     <Icon path={<><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></>} size={44} />
                  </div>
                  <div>
                    <p className="text-slate-950 font-black text-xl mb-1 uppercase tracking-tight">Shift Clear.</p>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">No pending actions in your current cycle</p>
                  </div>
               </div>
             ) : (
               <div className="grid grid-cols-1 gap-4">
                 {pending.map(apt => (
                   <AppointmentCard 
                    key={apt._id} 
                    apt={apt} 
                    onAccept={(id) => appointmentAPI.updateStatus(id, { status: 'confirmed' }).then(() => window.location.reload())} 
                    onComplete={(id) => appointmentAPI.updateStatus(id, { status: 'completed' }).then(() => window.location.reload())} 
                   />
                 ))}
               </div>
             )}
          </div>

          <div className="w-full xl:w-96 space-y-6">
             <h3 className="text-slate-950 font-black text-2xl tracking-tighter px-2 uppercase leading-none">Shift Summary</h3>
             <div className="bg-indigo-950 rounded-[3rem] p-10 text-white relative overflow-hidden group shadow-2xl shadow-indigo-100">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400 blur-[100px] opacity-10 -translate-y-32 translate-x-16" />
                <div className="relative z-10 space-y-10">
                   {[
                     { l: 'Appointment Volume', v: appointments.length, p:'Total records' },
                     { l: 'Efficiency Core', v: '98.2%', p:'Network health' },
                     { l: 'Pending Cycle', v: pending.length, p:'Action required' }
                   ].map((s, i) => (
                     <div key={i} className="flex justify-between items-center group-hover:translate-x-2 transition-transform duration-500">
                        <div>
                           <p className="text-white font-black text-xl tracking-tight leading-none mb-1">{s.v}</p>
                           <p className="text-white/40 font-bold text-[10px] uppercase tracking-widest">{s.l}</p>
                        </div>
                        <p className="text-emerald-400/80 font-black text-[9px] uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/5">{s.p}</p>
                     </div>
                   ))}
                </div>
                <div className="mt-12 pt-10 border-t border-white/10 relative z-10">
                   <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em] mb-4">Diagnostic Priority</p>
                   <div className="flex gap-2">
                      <div className="h-1 flex-1 bg-emerald-400 rounded-full" />
                      <div className="h-1 flex-1 bg-white/10 rounded-full" />
                      <div className="h-1 flex-1 bg-white/10 rounded-full" />
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default Overview;
