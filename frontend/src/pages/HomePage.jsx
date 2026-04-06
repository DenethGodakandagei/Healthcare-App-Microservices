import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { doctorAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
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
  play: <><polygon points="5 3 19 12 5 21 5 3" /></>,
  layout: <><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></>,
};

import doc1 from '../assets/doc1.png';
import doc2 from '../assets/doc2.png';
import doc3 from '../assets/doc3.png';
import doc4 from '../assets/doc4.png';

const doctorImages = [doc1, doc2, doc3, doc4];

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [featuredDoctors, setFeaturedDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const getDashboardPath = () => {
    switch (user?.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'doctor':
        return '/doctor/dashboard';
      case 'patient':
        return '/patient/dashboard';
      default:
        return '/';
    }
  };

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

      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-end pb-20 overflow-hidden">
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
              with <span className="text-white/80">BioGrid</span>
            </h1>

            <p className="text-lg md:text-xl text-white/70 max-w-xl font-medium leading-relaxed tracking-tight">
              Streamlined, Secure, and Scalable Solutions <br className="hidden md:block" />
              Tailored for Modern Healthcare Providers.
            </p>

            <div className="flex flex-wrap items-center gap-5 pt-4">
              {user ? (
                <Link
                  to={getDashboardPath()}
                  className="group flex items-center gap-3 px-8 py-5 bg-white/20 backdrop-blur-sm text-white font-bold rounded-full hover:bg-white/30 transition-all border border-white/20 shadow-lg active:scale-95"
                >
                  <div className="w-6 h-6 bg-white/30 rounded-full flex items-center justify-center">
                    <Icon path={icons.layout} size={14} />
                  </div>
                  Go to Dashboard
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="group flex items-center gap-3 px-8 py-5 bg-white text-gray-900 font-black rounded-full hover:bg-gray-100 transition-all shadow-2xl shadow-white/5 active:scale-95"
                >
                  <div className="w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center transition-transform group-hover:translate-x-1">
                    <Icon path={<polyline points="9 18 15 12 9 6" />} size={14} />
                  </div>
                  Get started
                </Link>
              )}

              {!user && (
                <button className="flex items-center gap-3 px-8 py-5 border border-white/30 text-white font-bold rounded-full hover:bg-white/10 transition-all backdrop-blur-sm group active:scale-95">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/40 transition-colors">
                    <Icon path={icons.lightning} size={12} className="fill-white" />
                  </div>
                  Request a demo
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 right-10 hidden lg:flex items-center gap-4 text-white/40 animate-pulse">
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Scroll to explore</span>
          <div className="w-px h-12 bg-white/20" />
        </div>
      </section>

      {/* Features Showcase Section */}
      <section id="features" className="py-24 bg-[#FAFAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
            {/* 1. Doctor Dashboard - White/Light Card with % graphic */}
            <div className="lg:row-span-2 bg-[#FAFBFF] rounded-[2.5rem] p-10 flex flex-col border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group">
              <h3 className="text-gray-900 font-black text-xl mb-4">Doctor <br /> Dashboard</h3>
              <div className="space-y-3 mb-8">
                <div className="h-2 w-full bg-blue-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[70%]" />
                </div>
                <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <span>Daily Goal</span>
                  <span>70%</span>
                </div>
              </div>
              <div className="mt-auto relative w-32 h-32 self-center">
                <svg className="w-full h-full text-blue-100" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="280" strokeDashoffset="280" className="animate-[dash_2s_ease-out_forwards]" />
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.2" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-black text-blue-600">51%</span>
                </div>
              </div>
            </div>

            {/* 2. Revenue Cycle Management - Image Card */}
            <div className="lg:row-span-2 bg-gray-900 rounded-[2.5rem] overflow-hidden relative group shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
              <img src={revenueCycleImg} className="w-full h-full object-cover opacity-70 group-hover:scale-110 transition-transform duration-1000" alt="Revenue Cycle" />
              <div className="absolute inset-x-8 top-8">
                <h3 className="text-white font-black text-xl leading-tight">Revenue Cycle <br /> Management</h3>
              </div>
            </div>

            {/* 3. Patient Portal - White Glass Card */}
            <div className="bg-white rounded-[2.5rem] p-8 flex flex-col border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group">
              <h3 className="text-gray-900 font-black text-lg mb-2">Patient Portal</h3>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-6">Recent Activity</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                    <Icon path={<circle cx="12" cy="12" r="10" />} size={12} />
                  </div>
                  <div className="h-2 w-20 bg-gray-100 rounded-full" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                    <Icon path={<circle cx="12" cy="12" r="10" />} size={12} />
                  </div>
                  <div className="h-2 w-16 bg-gray-100 rounded-full" />
                </div>
              </div>
            </div>

            {/* 4. Appointment Scheduling - Image Card */}
            <div className="lg:row-span-2 bg-blue-50/50 rounded-[2.5rem] overflow-hidden relative group shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
              <img src="https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="Scheduling" />
              <div className="absolute inset-x-8 top-8">
                <h3 className="text-white font-black text-xl leading-tight drop-shadow-lg">Appointment <br /> Scheduling</h3>
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent opacity-70" />
            </div>

            {/* 5. Advanced Reporting - Blue Card */}
            <div className="bg-[#427CFF] rounded-[2.5rem] p-8 flex flex-col justify-between shadow-xl shadow-blue-500/20 group hover:-translate-y-1 transition-all">
              <h3 className="text-white font-black text-lg leading-tight">Advanced Reporting <br /> & Analytics</h3>
              <div className="flex items-end gap-1.5 h-12 mt-6">
                <div className="flex-1 bg-white/20 rounded-sm h-[40%]" />
                <div className="flex-1 bg-white/60 rounded-sm h-[70%]" />
                <div className="flex-1 bg-white/40 rounded-sm h-[55%]" />
                <div className="flex-1 bg-white/90 rounded-sm h-[90%]" />
              </div>
            </div>

            {/* 6. e-Prescription Management - Image Card */}
            <div className="bg-gray-100 rounded-[2.5rem] overflow-hidden relative group shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
              <img src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover opacity-80" alt="Prescriptions" />
              <div className="absolute inset-x-6 top-6">
                <h3 className="text-gray-900 font-black text-base leading-tight">e-Prescription <br /> Management</h3>
              </div>
            </div>

            {/* 7. Clinical Decision Support - Blue Card */}
            <div className="bg-[#427CFF] rounded-[2.5rem] p-8 flex flex-col justify-between shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group">
              <h3 className="text-white font-black text-lg leading-tight">Clinical Decision <br /> Support</h3>
              <div className="ml-auto w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-ping" />
              </div>
            </div>

            {/* 8. Telemedicine Integration - Dark Blue Tall Card */}
            <div className="lg:row-span-2 bg-[#1A337E] rounded-[3rem] p-10 flex flex-col justify-between shadow-2xl shadow-indigo-900/10 group hover:-translate-y-1 transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-white/10 transition-colors" />
              <div className="relative z-10">
                <h3 className="text-white font-black text-2xl mb-4 leading-tight">Telemedicine <br /> Integration</h3>
                <p className="text-white/40 text-xs font-bold leading-relaxed max-w-[200px]">Secure, real-time video consultations for remote care.</p>
              </div>
              <Link to="/doctors" className="mt-10 self-start group/btn flex items-center gap-3 px-8 py-4 bg-white text-gray-900 font-black rounded-full hover:bg-gray-100 transition-all text-xs uppercase tracking-widest shadow-xl active:scale-95">
                Start Now
                <div className="w-5 h-5 bg-gray-900 text-white rounded-full flex items-center justify-center transition-transform group-hover/btn:translate-x-1">
                  <Icon path={<polyline points="9 18 15 12 9 6" />} size={12} />
                </div>
              </Link>
            </div>

            {/* 9. Medication Management - White Card */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group">
              <h3 className="text-gray-900 font-black text-lg mb-4">Medication <br /> Management</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-red-50 rounded-2xl flex items-center justify-center text-red-500">
                  <Icon path={<path d="M10.5 3a2 2 0 1 1 4 0v15a2 2 0 1 1-4 0V3zM3 10.5a2 2 0 1 1 0 4h15a2 2 0 1 1 0-4H3z" />} size={20} />
                </div>
                <div className="p-3 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500">
                  <Icon path={<circle cx="12" cy="12" r="8" />} size={20} />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Live Tracking</span>
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


      {/* Contact Section - Industrial Blue Box */}
      <section id="contact" className="py-24 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden bg-[#427CFF] rounded-[3.5rem] p-12 lg:p-20 shadow-2xl shadow-blue-500/20 group">
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[40rem] h-[40rem] opacity-20 pointer-events-none group-hover:scale-110 transition-transform duration-[3000ms]">
            <div className="w-full h-full rounded-full border-[1.5px] border-white/40 border-dashed animate-[spin_60s_linear_infinite]" />
            <div className="absolute inset-8 rounded-full border-[2px] border-white/20 border-dotted animate-[spin_45s_linear_infinite_reverse]" />
            <div className="absolute inset-16 rounded-full border-[1px] border-white/30 border-dashed animate-[spin_30s_linear_infinite]" />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10">
              <h2 className="text-4xl md:text-6xl font-black text-white leading-[1.05] tracking-tighter">
                Experience the <br />
                Future of Healthcare <br />
                with BioGrid
              </h2>
              <div className="flex flex-wrap items-center gap-6">
                <Link
                  to="/register"
                  className="flex items-center gap-3 px-8 py-4 bg-white text-gray-900 font-black rounded-full hover:bg-gray-100 transition-all shadow-xl shadow-white/5 active:scale-95 group"
                >
                  <div className="w-5 h-5 bg-gray-900 text-white rounded-full flex items-center justify-center transition-transform group-hover:translate-x-1">
                    <Icon path={<polyline points="9 18 15 12 9 6" />} size={10} />
                  </div>
                  Get started
                </Link>
                <button className="flex items-center gap-3 text-[12px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors group">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <Icon path={<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />} size={14} className="fill-white" />
                  </div>
                  Request a demo
                </button>
              </div>
              <div className="pt-10 border-t border-white/10 flex flex-wrap gap-10">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Email us</p>
                  <p className="text-xl font-bold text-white">biogrid@gmail.com</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Call us</p>
                  <p className="text-xl font-bold text-white">+9 999 999 999</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-10 lg:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/40">
              <div className="mb-8">
                <h3 className="text-xl font-black text-gray-900 mb-2">Inquiry Form</h3>
                <p className="text-sm font-medium text-gray-500">Expect a response within 2 business hours.</p>
              </div>
              <form className="space-y-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#427CFF]">Your Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all  text-gray-900 placeholder:text-gray-300 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#427CFF]">Email Address</label>
                  <input
                    type="email"
                    placeholder="name@company.com"
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all  text-gray-900 placeholder:text-gray-300 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#427CFF]">Your Message</label>
                  <textarea
                    rows="3"
                    placeholder="Tell us about your needs..."
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all  text-gray-900 placeholder:text-gray-300 outline-none resize-none"
                  ></textarea>
                </div>
                <button className="w-full py-4 bg-[#427CFF] text-white font-black rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-blue-200 active:scale-[0.98]">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
