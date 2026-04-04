import React from 'react';
import { useOutletContext } from 'react-router-dom';

const Icon = ({ path, size = 20, className = "" }) => (
   <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {path}
   </svg>
);

const icons = {
   shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
};

const Credentials = () => {
   const { user, profile } = useOutletContext();

   return (
      <div className="max-w-5xl space-y-8 animate-in slide-in-from-bottom-8 duration-700">
         <div className="bg-white rounded-[3rem] border border-gray-50 p-12 flex flex-col md:flex-row gap-8 items-center hover:shadow-2xl hover:shadow-gray-100/50 transition-all duration-700">
            <div className="w-32 h-32 bg-[#111] rounded-[2.5rem] flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-gray-200">
               {(profile?.firstName || user?.username || 'D')[0].toUpperCase()}
            </div>
            <div className="space-y-1 text-center md:text-left">
               <h2 className="text-[#111] text-5xl font-black tracking-tighter italic">Dr. {profile?.firstName} {profile?.lastName}</h2>
               <p className="text-blue-500 font-bold uppercase tracking-[0.3em] text-[11px]">{profile?.specialty} • Senior Practitioner</p>
               <div className="flex gap-4 pt-4 justify-center md:justify-start">
                  <div className="px-4 py-2 bg-gray-50 rounded-xl text-gray-500 font-black text-[10px] uppercase tracking-widest border border-gray-100">Licensed HMS Member</div>
                  <div className="px-4 py-2 bg-blue-50 rounded-xl text-blue-500 font-black text-[10px] uppercase tracking-widest border border-blue-100">Identity Verified</div>
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-[3rem] p-10 border border-gray-50 space-y-6 hover:shadow-xl transition-all">
               <h4 className="text-[#111] font-black uppercase tracking-widest text-[11px] mb-4">Core Credentials</h4>
               {[
                  { l: 'Clinical Specialty', v: profile?.specialty },
                  { l: 'Experience Threshold', v: `${profile?.experienceYears} Years` },
                  { l: 'Base Consultation', v: `$${profile?.consultationFee}` },
                  { l: 'Primary Contact', v: profile?.contactNumber }
               ].map((d, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-gray-50 pb-4">
                     <span className="text-gray-400 font-bold text-xs">{d.l}</span>
                     <span className="text-[#111] font-black text-sm">{d.v}</span>
                  </div>
               ))}
            </div>
            <div className="bg-[#111] rounded-[3rem] p-10 flex flex-col justify-between text-white overflow-hidden relative min-h-[320px]">
               <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white blur-[60px]" />
               </div>
               <div className="relative z-10">
                  <Icon path={icons.shield} size={40} className="text-[#427CFF] mb-6" />
                  <h4 className="font-black text-3xl tracking-tighter mb-2 italic">BioGrid Vault.</h4>
                  <p className="text-white/40 text-xs font-bold leading-relaxed">Your data and patient diagnostic logs are encrypted with AES-256 end-to-end security protocols.</p>
               </div>
               <button className="w-full h-14 bg-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/20 transition-all border border-white/10 mt-8 relative z-10">Manage Security Keys</button>
            </div>
         </div>
      </div>
   );
};

export default Credentials;
