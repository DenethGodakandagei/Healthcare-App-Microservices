import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { doctorAPI } from '../services/api';
import heroBg from '../assets/hero-bg.png';
import revenueCycleImg from '../assets/revenue_cycle.png';
import labResultsImg from '../assets/lab_results.png';

const Icon = ({ path, size = 20, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {path}
  </svg>
);

const icons = {
  check: <polyline points="20 6 9 17 4 12" />,
  arrowRight: <><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></>,
  search: <><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>,
  star: <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></>,
  users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
  shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></>,
  activity: <><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></>,
  lightning: <><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></>,
  play: <><polygon points="5 3 19 12 5 21 5 3" /></>
};

import doc1 from '../assets/doc1.png';
import doc2 from '../assets/doc2.png';
import doc3 from '../assets/doc3.png';
import doc4 from '../assets/doc4.png';

const doctorImages = [doc1, doc2, doc3, doc4];

const HomePage = () => {
  const [featuredDoctors, setFeaturedDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const getDoctorImage = (id) => {
    if (!id) return doc1;
    const index = Math.abs(id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % doctorImages.length;
    return doctorImages[index];
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await doctorAPI.getAll();
        setFeaturedDoctors(res.data?.data?.slice(0, 3) || []);
      } catch (err) {
        console.error("Failed to fetch doctors", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />

      {/* Hero Section ... */}
      <section className="relative h-screen w-full flex items-end pb-20 overflow-hidden">
        {/* ... hero background ... */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroBg}
            alt="Healthcare Environment"
            className="w-full h-full object-cover scale-105 animate-in fade-in zoom-in-110 duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-black/5" />
        </div>

        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-4xl space-y-8 animate-in slide-in-from-bottom-12 duration-1000">
            <h1 className="text-3xl md:text-5xl font-black text-white leading-[0.95] tracking-tighter">
              Revolutionize <br />
              Healthcare <br />
              with <span className="text-white/80">ApexEHR</span>
            </h1>

            <p className="text-lg md:text-xl text-white/70 max-w-xl font-medium leading-relaxed tracking-tight">
              Streamlined, Secure, and Scalable Solutions <br className="hidden md:block" />
              Tailored for Modern Healthcare Providers.
            </p>

            <div className="flex flex-wrap items-center gap-5 pt-4">
              <Link
                to="/register"
                className="group flex items-center gap-3 px-8 py-5 bg-white text-gray-900 font-black rounded-full hover:bg-gray-100 transition-all shadow-2xl shadow-white/5 active:scale-95"
              >
                <div className="w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center transition-transform group-hover:translate-x-1">
                  <Icon path={<polyline points="9 18 15 12 9 6" />} size={14} />
                </div>
                Get started
              </Link>

              <button className="flex items-center gap-3 px-8 py-5 border border-white/30 text-white font-bold rounded-full hover:bg-white/10 transition-all backdrop-blur-sm group active:scale-95">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/40 transition-colors">
                  <Icon path={icons.lightning} size={12} className="fill-white" />
                </div>
                Request a demo
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 right-10 hidden lg:flex items-center gap-4 text-white/40 animate-pulse">
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Scroll to explore</span>
          <div className="w-px h-12 bg-white/20" />
        </div>
      </section>

      {/* Features Showcase Section - Rebuilt from Mockup Image */}
      <section className="py-24 bg-[#FAFAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Mockup Heading Styling */}
          <div className="text-center max-w-4xl mx-auto mb-20 space-y-6">
            <div className="inline-block px-4 py-1.5 bg-[#EFF3FF] text-[#427CFF] rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4">
              For Providers
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-[#111] leading-tight flex flex-col items-center">
              <span>Discover Powerful</span>
              <span className="text-[#A0A4B3]">Features Tailored to</span>
              <span className="text-[#A0A4B3]">Your Needs</span>
            </h2>
          </div>

          {/* Masonry-Style Grid for "Discover Features" */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
            
            {/* 1. Doctor Dashboard / Stat Card */}
            <div className="bg-[#EBEEF5]/40 rounded-[2.5rem] p-8 flex flex-col justify-between border border-white relative overflow-hidden group hover:bg-[#EBEEF5]/60 transition-all hover:-translate-y-1">
               <div>
                  <h3 className="text-[#111] font-black text-xl mb-1">Doctor Dashboard</h3>
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Growth Tracking</p>
               </div>
               <div className="flex items-center justify-between mt-auto">
                  <div className="relative w-24 h-24 transform rotate-[-90deg]">
                     <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#E2E8F0" strokeWidth="8" />
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#427CFF" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset="115.5" strokeLinecap="round" className="animate-[dash_1.5s_ease-in-out]" />
                     </svg>
                     <div className="absolute inset-0 flex items-center justify-center rotate-[90deg]">
                        <span className="text-2xl font-black text-blue-600">54%</span>
                     </div>
                  </div>
                  <div className="flex flex-col gap-1">
                     <div className="w-12 h-1 px-1 bg-blue-100 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full w-[60%] rounded-full" />
                     </div>
                     <div className="w-12 h-1 px-1 bg-green-100 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full w-[80%] rounded-full" />
                     </div>
                  </div>
               </div>
            </div>

            {/* 2. Revenue Cycle Management - Large Image Card */}
            <div className="sm:col-span-1 lg:col-span-1 row-span-2 rounded-[2.5rem] overflow-hidden relative group shadow-lg">
               <img src={revenueCycleImg} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="RC Management" />
               <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
               <div className="absolute inset-0 p-8 flex flex-col justify-start">
                  <h3 className="text-white font-black text-xl leading-snug drop-shadow-md">Revenue Cycle <br /> Management</h3>
               </div>
               <div className="absolute bottom-8 left-8 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-white/70 text-[10px] font-black tracking-widest uppercase">System Active</span>
               </div>
            </div>

            {/* 3. Patient Portal - Rich Mockup Card */}
            <div className="bg-white rounded-[2.5rem] p-8 flex flex-col justify-between border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-100/50 transition-all hover:-translate-y-1">
               <h3 className="text-[#111] font-black text-xl mb-auto">Patient Portal</h3>
               <div className="space-y-4 mt-6">
                  {/* Mock Activity List */}
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                     <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Icon path={icons.users} size={14} className="text-blue-600" />
                     </div>
                     <div className="flex-1">
                        <div className="h-2 w-16 bg-gray-200 rounded-full mb-1.5" />
                        <div className="h-1.5 w-12 bg-gray-100 rounded-full" />
                     </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-2xl opacity-60">
                     <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <Icon path={icons.check} size={14} className="text-green-600" />
                     </div>
                     <div className="flex-1">
                        <div className="h-2 w-20 bg-gray-200 rounded-full mb-1.5" />
                        <div className="h-1.5 w-14 bg-gray-100 rounded-full" />
                     </div>
                  </div>
               </div>
            </div>

            {/* 4. Telemedicine - Video Call UI Mockup (Long) */}
            <div className="lg:row-span-2 bg-[#00174F] rounded-[2.5rem] p-8 flex flex-col justify-start relative overflow-hidden group shadow-2xl shadow-indigo-900/10">
               <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-150 transition-transform duration-1000" />
               <h3 className="text-white font-black text-xl mb-4 relative z-10">Telemedicine <br /> Integration</h3>
               
               {/* Mock Call UI */}
               <div className="mt-8 space-y-3 relative z-10">
                  <div className="w-full h-32 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center overflow-hidden">
                     <Icon path={icons.users} size={32} className="text-white/20" />
                     <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-red-500 px-2 py-1 rounded-full">
                        <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                        <span className="text-white text-[8px] font-black uppercase">Live</span>
                     </div>
                  </div>
                  <div className="flex justify-center gap-4 mt-4">
                     <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10 cursor-pointer hover:bg-white/20 transition-colors">
                        <Icon path={<path d="M12 18.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM12 12v3M12 9v1" />} size={18} className="text-white" />
                     </div>
                     <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors shadow-lg shadow-red-900/50">
                        <Icon path={<path d="M10.68 13.31a16 16 0 0 0 7.01 7.01l2.21-2.21a1.27 1.27 0 0 1 1.28-.33 12.03 12.03 0 0 0 3.75.59 1.28 1.28 0 0 1 1.28 1.28v3.51a1.28 1.28 0 0 1-1.28 1.28A22.03 22.03 0 0 1 2 4.01a1.28 1.28 0 0 1 1.28-1.28h3.51a1.28 1.28 0 0 1 1.28 1.28 12.03 12.03 0 0 0 .59 3.75 1.27 1.27 0 0 1-.33 1.28z" />} size={18} className="text-white" />
                     </div>
                  </div>
               </div>
            </div>

            {/* 5. Advanced Reporting - Vibrants Blue Card with Bar Graph */}
            <div className="bg-[#427CFF] rounded-[2.5rem] p-8 flex flex-col justify-between shadow-xl shadow-blue-500/20 group hover:bg-[#346AFF] transition-all hover:-translate-y-1">
               <div>
                  <h3 className="text-white font-black text-lg mb-1 leading-tight">Advanced Reporting <br /> & Analytics</h3>
                  <p className="text-white/40 text-[9px] font-black uppercase tracking-widest">Live Metrics</p>
               </div>
               <div className="flex items-end gap-2.5 h-20 group-hover:h-24 transition-all duration-500 mt-8">
                  <div className="flex-1 bg-white/20 rounded-t-xl h-[40%] transition-all" />
                  <div className="flex-1 bg-white/80 rounded-t-xl h-[70%] transition-all" />
                  <div className="flex-1 bg-white/40 rounded-t-xl h-[30%] transition-all" />
                  <div className="flex-1 bg-white/100 rounded-t-xl h-[90%] transition-all" />
                  <div className="flex-1 bg-white/50 rounded-t-xl h-[60%] transition-all" />
                  <div className="flex-1 bg-white/30 rounded-t-xl h-[50%] transition-all" />
               </div>
            </div>

            {/* 6. e-Prescription - Image Card */}
            <div className="bg-white rounded-[2.5rem] p-0 overflow-hidden relative group border border-gray-100 flex flex-col h-full shadow-lg">
               <div className="bg-gray-100 h-1/2 w-full overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover grayscale brightness-110 group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute inset-x-0 h-1/2 bottom-0 bg-gradient-to-t from-white to-transparent" />
               </div>
               <div className="p-8">
                  <h3 className="text-[#111] font-black text-lg leading-tight">e-Prescription Management</h3>
                  <div className="flex gap-2 mt-4">
                     <div className="w-8 h-1 bg-blue-100 rounded-full" />
                     <div className="w-4 h-1 bg-blue-50 rounded-full" />
                  </div>
               </div>
            </div>

            {/* 7. Integrated Lab Results - Image Card */}
            <div className="bg-[#1C202B] rounded-[2.5rem] overflow-hidden relative group shadow-2xl">
               <img src={labResultsImg} className="w-full h-full object-cover opacity-50 grayscale transition-transform duration-1000 group-hover:scale-110" />
               <div className="absolute inset-0 p-8 flex flex-col justify-start">
                  <h3 className="text-white font-black text-lg">Integrated Lab Results</h3>
                  <div className="mt-4 flex items-center gap-2">
                     <span className="text-white text-[8px] font-black uppercase tracking-widest bg-blue-600 px-2 py-1 rounded">Secure</span>
                  </div>
               </div>
            </div>

            {/* 8. Clinical Decision Support - Blue Card */}
            <div className="bg-[#427CFF] rounded-[2.5rem] p-8 flex flex-col justify-start shadow-xl shadow-blue-500/20 group hover:-translate-y-1 transition-all">
               <h3 className="text-white font-black text-lg">Clinical Decision <br /> Support</h3>
               <div className="mt-8 flex flex-col gap-3 opacity-20 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-3">
                     <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
                        <Icon path={icons.check} size={12} className="text-white" />
                     </div>
                     <div className="h-1.5 w-full bg-white/20 rounded-full" />
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
                        <Icon path={icons.lightning} size={12} className="text-white" />
                     </div>
                     <div className="h-1.5 w-full bg-white/20 rounded-full" />
                  </div>
               </div>
            </div>

            {/* 9. Task Management - Micro-animated Checklist */}
            <div className="sm:col-span-1 lg:col-span-1 bg-white rounded-[2.5rem] p-8 flex flex-col border border-gray-100 group shadow-sm hover:shadow-xl transition-all h-full">
               <h3 className="text-[#111] font-black text-lg mb-6">Task Management</h3>
               <div className="space-y-4">
                  <div className="flex items-center gap-3">
                     <div className="w-5 h-5 bg-blue-100/50 border-2 border-blue-500 rounded-md flex items-center justify-center animate-pulse">
                        <Icon path={icons.check} size={10} className="text-blue-600" />
                     </div>
                     <div className="h-1.5 w-3/4 bg-gray-100 rounded-full group-hover:bg-blue-50 transition-colors" />
                  </div>
                  <div className="flex items-center gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
                     <div className="w-5 h-5 border-2 border-gray-200 rounded-md" />
                     <div className="h-1.5 w-1/2 bg-gray-50 rounded-full" />
                  </div>
                  <div className="flex items-center gap-3 opacity-40 group-hover:opacity-100 transition-opacity delay-75">
                     <div className="w-5 h-5 border-2 border-gray-200 rounded-md" />
                     <div className="h-1.5 w-2/3 bg-gray-50 rounded-full" />
                  </div>
               </div>
            </div>

             {/* 10. Medication Management - Grid Hover Reveal */}
             <div className="bg-white rounded-[2.5rem] p-8 flex flex-col justify-between border border-gray-100 shadow-sm group hover:-translate-y-1 transition-all">
               <h3 className="text-[#111] font-black text-lg">Medication Management</h3>
               <div className="mt-8 grid grid-cols-4 gap-2">
                  {Array(12).fill(0).map((_,i) => (
                    <div 
                      key={i} 
                      className="aspect-square bg-indigo-50/50 rounded-xl transition-all duration-300 hover:bg-indigo-600 hover:scale-110" 
                      style={{ transitionDelay: `${i * 30}ms` }}
                    />
                  ))}
               </div>
            </div>

            {/* 11. Appointment Scheduling - Action Card (Solid UI) */}
            <div className="lg:col-span-1 bg-[#1A337E] rounded-[2.5rem] p-8 flex flex-col justify-center items-center text-center group shadow-2xl relative overflow-hidden h-full">
               <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/10 to-transparent" />
               <div className="relative z-10">
                  <h3 className="text-white font-black text-2xl mb-4 leading-tight">Appointment <br /> Scheduling</h3>
                  <p className="text-white/50 text-[11px] font-medium mb-8 leading-relaxed px-4">Secure, self-service access to records and appointments.</p>
                  
                  <Link 
                    to="/doctors" 
                    className="flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-black rounded-full text-[11px] uppercase tracking-widest hover:bg-gray-100 hover:scale-105 transition-all shadow-xl"
                  >
                    <div className="w-4 h-4 bg-gray-900 text-white rounded-full flex items-center justify-center animate-bounce-horizontal">
                       <Icon path={<path d="M5 12h14m-7-7 7 7-7 7" />} size={10} />
                    </div>
                    Book Now
                  </Link>
               </div>
            </div>

            {/* 12. Patient Communication - Centered Action Card */}
            <div className="bg-white/50 backdrop-blur rounded-[2.5rem] p-8 border border-gray-100 flex flex-col items-center justify-center text-center h-full shadow-sm hover:bg-white transition-all group relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/30 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
               
               <div className="relative mb-6">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                     <Icon path={icons.users} size={28} className="text-blue-600" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white animate-ping" />
               </div>

               <h3 className="text-[#111] font-black text-xl mb-3 leading-tight relative z-10">Patient <br /> Communication</h3>
               <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-8">Direct Messaging</p>
               
               {/* Centered Chat Mockup */}
               <div className="flex flex-col items-center gap-2 relative z-10 w-full">
                  <div className="flex items-center gap-2">
                     <div className="h-1.5 w-8 bg-blue-100 rounded-full" />
                     <div className="h-1.5 w-12 bg-blue-600 rounded-full" />
                     <div className="h-1.5 w-6 bg-blue-100 rounded-full" />
                  </div>
                  <div className="flex gap-1 mt-2">
                     <div className="w-1.5 h-1.5 bg-blue-600/20 rounded-full animate-bounce" />
                     <div className="w-1.5 h-1.5 bg-blue-600/20 rounded-full animate-bounce [animation-delay:150ms]" />
                     <div className="w-1.5 h-1.5 bg-blue-600/20 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Doctors */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-sm font-extrabold text-gray-400 uppercase tracking-[0.2em] mb-4">Top Rated</h2>
              <p className="text-4xl font-extrabold text-gray-900">Featured Specialists.</p>
            </div>
            <Link to="/doctors" className="hidden sm:flex items-center gap-2 text-gray-900 font-bold hover:gap-3 transition-all">
              View All Doctors
              <Icon path={icons.arrowRight} size={18} />
            </Link>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map(n => <div key={n} className="h-96 bg-gray-50 animate-pulse rounded-[2.5rem]" />)}
            </div>
          ) : featuredDoctors.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {featuredDoctors.map((doc) => (
                <div key={doc._id} className="group bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden hover:border-gray-900 transition-all hover:shadow-2xl hover:shadow-gray-100">
                  <div className="aspect-[4/5] bg-gray-100 relative overflow-hidden">
                    <img
                      src={getDoctorImage(doc._id)}
                      alt={doc.firstName}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur rounded-full text-xs font-bold text-gray-900 shadow-sm">
                      ${doc.consultationFee}/Session
                    </div>
                  </div>
                  <div className="p-8">
                    <p className="text-sm font-extrabold text-gray-400 uppercase tracking-widest mb-1">{doc.specialty}</p>
                    <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Dr. {doc.firstName} {doc.lastName}</h3>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
                        <Icon path={icons.star} size={14} className="fill-current" />
                        4.9
                      </div>
                      <div className="w-1 h-1 bg-gray-200 rounded-full" />
                      <p className="text-sm font-medium text-gray-500">{doc.experienceYears}+ years exp.</p>
                    </div>
                    <Link
                      to="/doctors"
                      className="w-full flex items-center justify-center gap-2 py-4 bg-gray-50 text-gray-900 font-bold rounded-2xl hover:bg-gray-900 hover:text-white transition-all"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-[2.5rem] p-20 text-center">
              <p className="text-gray-500 font-medium">Connect with our specialists to see them here.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer-ish CTA */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-8 tracking-tight">Ready to take control of your health?</h2>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register" className="px-10 py-5 bg-white text-gray-900 font-bold rounded-2xl hover:bg-gray-100 transition-all text-lg shadow-xl shadow-black/20">
                  Get Started Free
                </Link>
                <Link to="/login" className="px-10 py-5 border border-white/20 text-white font-bold rounded-2xl hover:bg-white/10 transition-all text-lg">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Actual Footer */}
      <footer className="py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white">
              <Icon path={icons.check} size={16} />
            </div>
            <span className="text-gray-900 font-bold">MediCare.</span>
          </div>
          <p className="text-gray-400 text-sm font-medium">© 2026 MediCare Health Systems. All rights reserved.</p>
          <div className="flex gap-8 text-sm font-bold text-gray-500">
            <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Terms</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
