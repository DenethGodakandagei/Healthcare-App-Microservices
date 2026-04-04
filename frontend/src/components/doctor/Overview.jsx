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
            iconContent={<React.Fragment><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0" /></React.Fragment>}
            trend="+4 now" 
          />
          <DocStatCard 
            label="Confirmed Sessions" 
            value={confirmed.length} 
            iconContent={<React.Fragment><path d="M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18" /></React.Fragment>}
            highlight 
          />
          <DocStatCard 
            label="Daily Yield" 
            value="94%" 
            iconContent={<polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />}
            trend="High" 
          />
          <DocStatCard 
            label="Registered" 
            value={appointments.length} 
            iconContent={<React.Fragment><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75" /></React.Fragment>}
            sub="Total Network" 
          />
       </div>

       <div className="flex flex-col xl:flex-row gap-8">
          <div className="flex-1 space-y-6">
             <h3 className="text-[#111] font-black text-2xl tracking-tighter mb-6 flex items-center gap-3 italic">
                Incoming Diagnoses <span className="text-blue-500 font-black text-sm not-italic mt-1.5 ml-2 uppercase tracking-widest">{pending.length}</span>
             </h3>
             {pending.length === 0 ? (
               <div className="p-16 bg-white rounded-[3rem] border border-gray-50 text-center space-y-4">
                  <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center text-emerald-500 mx-auto">
                     <Icon path={<React.Fragment><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></React.Fragment>} size={40} />
                  </div>
                  <p className="text-[#111] font-black text-lg">Shift Clear.</p>
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">No pending actions in your current cycle</p>
               </div>
             ) : (
               <div className="grid grid-cols-1 gap-4">
                 {pending.map(apt => (
                   <AppointmentCard 
                    key={apt._id} 
                    apt={apt} 
                    onAccept={(id) => appointmentAPI.updateStatus(id, 'confirmed').then(() => window.location.reload())} 
                    onComplete={(id) => appointmentAPI.updateStatus(id,'completed').then(()=>window.location.reload())} 
                   />
                 ))}
               </div>
             )}
          </div>
          <div className="w-full xl:w-96 space-y-6">
             <h3 className="text-[#111] font-black text-2xl tracking-tighter mb-6 italic">Shift Summary</h3>
             <div className="bg-[#111] rounded-[3rem] p-8 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#427CFF] blur-[80px] opacity-20 -translate-y-24 translate-x-12" />
                <div className="relative z-10 space-y-8">
                   {[
                     { l: 'Appointment Volume', v: appointments.length, p:'Total records' },
                     { l: 'Efficiency Core', v: '98.2%', p:'Network health' },
                     { l: 'Pending Cycle', v: pending.length, p:'Action required' }
                   ].map((s, i) => (
                     <div key={i} className="flex justify-between items-center group-hover:translate-x-2 transition-transform duration-500">
                        <div>
                           <p className="text-white font-black text-lg tracking-tight leading-none mb-1">{s.v}</p>
                           <p className="text-white/40 font-bold text-[10px] uppercase tracking-widest">{s.l}</p>
                        </div>
                        <p className="text-[#427CFF] font-black text-[9px] uppercase tracking-widest">{s.p}</p>
                     </div>
                   ))}
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default Overview;
