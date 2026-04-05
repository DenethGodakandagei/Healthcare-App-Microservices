import React from 'react';
import { useOutletContext } from 'react-router-dom';

const Icon = ({ path, size = 20, className = "" }) => (
   <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {path}
   </svg>
);

const icons = {
   shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
   verified: <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></>,
   user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
};

const Credentials = () => {
   const { user, profile } = useOutletContext();

   return (
      <div className="max-w-5xl space-y-12 animate-in slide-in-from-bottom-8 duration-700">
         
         <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-4">
            <div>
               <h2 className="text-slate-950 text-5xl font-black tracking-tighter mb-4 leading-none uppercase font-sans antialiased">Clinical Identity</h2>
               <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.25em]">Verified Practitioner Profile / BioGrid Vault</p>
            </div>
            <div className="flex gap-3">
               <div className="px-5 py-3 bg-white border border-gray-100 rounded-2xl text-slate-950 font-black text-[10px] uppercase tracking-widest shadow-sm flex items-center gap-3">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  Licensed BioGrid Member
               </div>
            </div>
         </div>

         <div className="bg-white rounded-[3.5rem] border border-gray-50 p-12 flex flex-col md:flex-row gap-12 items-center hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-1000 group active:scale-[0.99]">
            <div className="relative">
               <div className="w-40 h-40 bg-indigo-950 rounded-[3rem] flex items-center justify-center text-white text-6xl font-black transform transition-transform duration-700 group-hover:rotate-3 shadow-2xl shadow-indigo-200">
                  {(profile?.firstName || user?.username || 'D')[0].toUpperCase()}
               </div>
               <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-white border-4 border-white rounded-[1.2rem] shadow-xl flex items-center justify-center text-emerald-500">
                  <Icon path={icons.verified} size={24} />
               </div>
            </div>
            <div className="space-y-4 text-center md:text-left flex-1">
               <div>
                  <h3 className="text-slate-950 text-6xl font-black tracking-tighter leading-none mb-2 uppercase">Dr. {profile?.firstName} {profile?.lastName}</h3>
                  <div className="flex items-center gap-3 justify-center md:justify-start">
                     <span className="px-4 py-1.5 bg-indigo-50 text-indigo-900 border border-indigo-100 rounded-full font-black text-[9px] uppercase tracking-widest leading-none">Senior Practitioner</span>
                     <span className="text-slate-400 font-black uppercase text-[11px] tracking-widest leading-none mt-1 ml-1">{profile?.specialty} Specialist</span>
                  </div>
               </div>
               <div className="flex gap-6 pt-2 justify-center md:justify-start text-gray-400 font-bold text-[10px] uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                     <span className="text-emerald-500 font-black">●</span> Account Identity Verified
                  </div>
                  <div className="flex items-center gap-2">
                     <span className="text-indigo-950 font-black">●</span> Clinical Access Active
                  </div>
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-[3.5rem] p-12 border border-gray-50 space-y-8 hover:shadow-xl transition-all duration-700 shadow-sm relative overflow-hidden group">
               <div className="absolute bottom-0 right-0 p-8 transform translate-y-8 translate-x-8 group-hover:translate-y-0 group-hover:translate-x-0 transition-transform duration-700 opacity-5 pointer-events-none">
                  <Icon path={icons.user} size={120} />
               </div>
               
               <h4 className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Verification Archive</h4>
               
               <div className="space-y-6">
                  {[
                     { l: 'Clinical Specialty', v: profile?.specialty, c: 'text-indigo-950' },
                     { l: 'Experience Threshold', v: `${profile?.experienceYears} Years Registry`, c: 'text-slate-950' },
                     { l: 'Consultation Protocol', v: `$${profile?.consultationFee}.00 Base`, c: 'text-emerald-600' },
                     { l: 'Global Point of Contact', v: profile?.contactNumber, c: 'text-slate-950' }
                  ].map((d, i) => (
                     <div key={i} className="flex justify-between items-end border-b border-gray-50 pb-6 group/item hover:border-indigo-100 transition-colors">
                        <span className="text-gray-400 font-bold text-[11px] uppercase tracking-widest">{d.l}</span>
                        <span className={`font-black text-lg tracking-tight group-hover/item:translate-x-1 transition-transform ${d.c}`}>{d.v}</span>
                     </div>
                  ))}
               </div>
               
               <button className="w-full h-16 bg-gray-50 border border-gray-100 rounded-[1.8rem] text-slate-400 font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 hover:text-indigo-950 hover:border-indigo-100 transition-all mt-4">Edit Profile Metadata</button>
            </div>

            <div className="bg-indigo-950 rounded-[3.5rem] p-12 flex flex-col justify-between text-white overflow-hidden relative shadow-2xl shadow-indigo-100 min-h-[400px] group">
               <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-400 blur-[120px] opacity-10 -translate-y-40 translate-x-40" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400 blur-[100px] opacity-5 translate-y-32 -translate-x-32" />
               </div>
               
               <div className="relative z-10">
                  <div className="w-16 h-16 bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center text-emerald-400 mb-8 transform transition-all group-hover:scale-110 group-hover:rotate-6">
                     <Icon path={icons.shield} size={32} />
                  </div>
                  <h4 className="font-black text-4xl tracking-tighter mb-4 uppercase leading-none">Security Encryption</h4>
                  <p className="text-white/40 text-[11px] font-bold leading-relaxed uppercase tracking-widest max-w-[280px]">Protected by BioGrid Vault: Your diagnostic logs and data keys are encrypted end-to-end with AES-256 military-grade standards.</p>
               </div>

               <div className="space-y-6 relative z-10 pt-8">
                  <div className="flex gap-2">
                     <div className="h-1 flex-1 bg-emerald-400 rounded-full" />
                     <div className="h-1 flex-1 bg-white/10 rounded-full shadow-inner" />
                     <div className="h-1 flex-1 bg-white/10 rounded-full" />
                  </div>
                  <button className="w-full h-20 bg-white/5 border border-white/10 rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all group">
                     Manage Clinical Access Keys 
                     <span className="ml-2 text-emerald-400 opacity-50 group-hover:opacity-100 transition-opacity">●</span>
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Credentials;
