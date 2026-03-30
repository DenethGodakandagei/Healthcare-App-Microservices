import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { doctorAPI } from '../services/api';

const Icon = ({ path, size = 20, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {path}
  </svg>
);

const icons = {
  check: <polyline points="20 6 9 17 4 12"/>,
  arrowRight: <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
  search: <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
  star: <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></>,
  users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
  shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>,
  activity: <><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></>,
};

const HomePage = () => {
  const [featuredDoctors, setFeaturedDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-900/5 border border-gray-900/10 rounded-full mb-6">
                <span className="w-2 h-2 bg-gray-900 rounded-full animate-pulse" />
                <span className="text-xs font-bold text-gray-900 uppercase tracking-widest">Now available in your city</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-[1.05] tracking-tight mb-8">
                The future of <span className="text-gray-400">healthcare</span> is here.
              </h1>
              <p className="text-xl text-gray-500 mb-10 leading-relaxed font-medium">
                Connect with world-class specialists, manage your health records, and book appointments in seconds. All in one seamless platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/doctors"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-all shadow-xl shadow-gray-200"
                >
                  Find a Doctor
                  <Icon path={icons.arrowRight} size={18} />
                </Link>
                <div className="relative group flex-1 max-w-sm">
                   <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
                     <Icon path={icons.search} size={18} />
                   </div>
                   <input
                     type="text"
                     placeholder="Search for specialty..."
                     className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:bg-white transition-all"
                   />
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="mt-12 flex items-center gap-8 border-t border-gray-100 pt-8">
                <div>
                   <p className="text-2xl font-extrabold text-gray-900">500+</p>
                   <p className="text-sm font-bold text-gray-400 uppercase tracking-tighter">Doctors</p>
                </div>
                <div className="w-px h-8 bg-gray-100" />
                <div>
                   <p className="text-2xl font-extrabold text-gray-900">10k+</p>
                   <p className="text-sm font-bold text-gray-400 uppercase tracking-tighter">Patients</p>
                </div>
                <div className="w-px h-8 bg-gray-100" />
                <div className="flex items-center gap-1.5">
                   <div className="flex text-gray-900">
                     <Icon path={icons.star} size={14} className="fill-current" />
                     <Icon path={icons.star} size={14} className="fill-current" />
                     <Icon path={icons.star} size={14} className="fill-current" />
                     <Icon path={icons.star} size={14} className="fill-current" />
                     <Icon path={icons.star} size={14} className="fill-current" />
                   </div>
                   <p className="text-sm font-bold text-gray-900">4.9/5 Rating</p>
                </div>
              </div>
            </div>

            <div className="hidden lg:block relative">
              <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-gray-50 rounded-full blur-3xl opacity-50" />
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-gray-200 border-8 border-white group">
                <img
                  src="https://images.unsplash.com/photo-1576091160550-217359f4ecf8?auto=format&fit=crop&q=80&w=2070"
                  alt="Healthcare Professional"
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-x-6 bottom-6 p-6 bg-white/80 backdrop-blur-lg rounded-3xl border border-white/50 shadow-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-white">
                      <Icon path={icons.activity} size={24} />
                    </div>
                    <div>
                      <p className="text-gray-900 font-extrabold">Instant Booking</p>
                      <p className="text-gray-500 text-sm font-medium">Book your session in 3 clicks</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services/Features */}
      <section className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-extrabold text-gray-400 uppercase tracking-[0.2em] mb-4">Our Services</h2>
            <p className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">Designed for your convenience.</p>
            <p className="text-lg text-gray-500 font-medium leading-relaxed">We've built a platform that puts you at the center of your healthcare journey.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Find Specialists', desc: 'Browse through hundreds of verified medical professionals and specialists.', icon: icons.users, color: 'bg-gray-900' },
              { title: 'Secure Records', desc: 'Your medical history and prescriptions are encrypted and accessible anywhere.', icon: icons.shield, color: 'bg-gray-900' },
              { title: 'Real-time Updates', desc: 'Get instant notifications for your appointments and laboratory results.', icon: icons.activity, color: 'bg-gray-900' },
            ].map((f, i) => (
              <div key={i} className="group p-10 bg-white border border-gray-100 rounded-[2.5rem] hover:border-gray-900 transition-all hover:shadow-2xl hover:shadow-gray-100">
                <div className={`w-14 h-14 ${f.color} rounded-2xl mb-8 flex items-center justify-center text-white transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-lg shadow-gray-200`}>
                  <Icon path={f.icon} size={28} />
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-4">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed font-medium">
                  {f.desc}
                </p>
              </div>
            ))}
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
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${doc.userId}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`}
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
