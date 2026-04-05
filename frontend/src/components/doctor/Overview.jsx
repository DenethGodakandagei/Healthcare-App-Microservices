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
    <div className="space-y-8 animate-in fade-in duration-500">
       {/* Stats Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <DocStatCard 
            label="Pending Requests" 
            value={pending.length} 
            iconContent={<><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0" /></>}
            trend="+2 today" 
            highlight
          />
          <DocStatCard 
            label="Confirmed Video" 
            value={confirmed.length} 
            iconContent={<><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>}
            sub="Ready to join" 
          />
          <DocStatCard 
            label="Success Rate" 
            value="98%" 
            iconContent={<polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />}
            trend="Stable" 
          />
          <DocStatCard 
            label="Total Patients" 
            value={appointments.length} 
            iconContent={<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>}
            sub="Across all channels"
          />
       </div>

       <div className="flex flex-col xl:flex-row gap-8">
          <div className="flex-1 space-y-6">
             <div className="flex items-center justify-between px-1">
                <div>
                   <h3 className="text-gray-900 font-bold text-lg">Consultation Requests</h3>
                   <p className="text-gray-400 text-xs mt-0.5">Manage your incoming virtual care requests</p>
                </div>
                <span className="px-3 py-1 bg-sky-50 text-[#0EA5E9] border border-sky-100 rounded-full font-bold text-[10px] uppercase tracking-wider">{pending.length} New</span>
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

          <div className="w-full xl:w-80 space-y-4">
             <h3 className="text-gray-900 font-bold text-lg px-1">Duty Summary</h3>
             <div className="bg-[#2299C9] rounded-3xl p-6 text-white relative overflow-hidden shadow-xl shadow-sky-500/10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                <div className="relative z-10 space-y-6">
                   {[
                     { l: 'Today\'s Load', v: appointments.length, p:'Total' },
                     { l: 'Clinical Quality', v: '99.1%', p:'Stable' },
                     { l: 'Pending Actions', v: pending.length, p:'Active' }
                   ].map((s, i) => (
                     <div key={i} className="flex justify-between items-center group-hover:translate-x-2 transition-transform duration-500">
                        <div>
                           <p className="text-white font-bold text-lg leading-none mb-1">{s.v}</p>
                           <p className="text-white/60 font-bold text-[10px] uppercase tracking-widest">{s.l}</p>
                        </div>
                        <p className="text-white/80 font-bold text-[8px] uppercase tracking-widest bg-white/10 px-2 py-0.5 rounded-full border border-white/10">{s.p}</p>
                     </div>
                   ))}
                </div>
                <div className="mt-8 pt-6 border-t border-white/10 relative z-10">
                   <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em] mb-4">Patient Priority</p>
                   <div className="flex gap-2">
                      <div className="h-1 flex-1 bg-white rounded-full opacity-100" />
                      <div className="h-1 flex-1 bg-white rounded-full opacity-30" />
                      <div className="h-1 flex-1 bg-white rounded-full opacity-30" />
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default Overview;
