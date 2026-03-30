import { Link } from 'react-router-dom';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Icon = ({ path, size = 20, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {path}
  </svg>
);

const icons = {
  mail: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2-2-2z" /><polyline points="22,6 12,13 2,6" /></>,
  phone: <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></>,
  mapPin: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></>,
  send: <><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></>,
  arrowRight: <><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></>,
  check: <polyline points="20 6 9 17 4 12" />
};

const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] overflow-x-hidden pt-12">
      <Navbar />

      <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
        
        {/* The "Blue Box" Hero Section */}
        <section className="relative overflow-hidden bg-[#427CFF] rounded-[3.5rem] p-12 lg:p-24 shadow-2xl shadow-blue-500/20 mb-20 group">
          {/* Animated Graphic (Background Sphere) */}
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[40rem] h-[40rem] opacity-20 pointer-events-none group-hover:scale-110 transition-transform duration-[3000ms]">
            <div className="w-full h-full rounded-full border-[1.5px] border-white/40 border-dashed animate-[spin_60s_linear_infinite]" />
            <div className="absolute inset-8 rounded-full border-[2px] border-white/20 border-dotted animate-[spin_45s_linear_infinite_reverse]" />
            <div className="absolute inset-16 rounded-full border-[1px] border-white/30 border-dashed animate-[spin_30s_linear_infinite]" />
            {/* Simulation of "stardust" dots */}
            {Array(30).fill(0).map((_, i) => (
              <div 
                key={i} 
                className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`
                }}
              />
            ))}
          </div>

          <div className="relative z-10 max-w-2xl">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tighter mb-10">
              Experience the <br />
              Future of Healthcare <br />
              with ApexEHR
            </h1>

            <p className="text-lg md:text-xl text-white/70 max-w-xl font-medium leading-relaxed tracking-tight mb-12">
              Have questions or need assistance? Our team of specialists is here to help you revolutionize your workspace.
            </p>

            <div className="flex flex-wrap items-center gap-6">
                <button className="flex items-center gap-3 px-8 py-5 bg-white text-gray-900 font-black rounded-full hover:bg-gray-100 transition-all shadow-xl shadow-white/5 active:scale-95 group">
                  <div className="w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center transition-transform group-hover:translate-x-1">
                    <Icon path={icons.arrowRight} size={14} />
                  </div>
                  Get started
                </button>
                
                <button className="flex items-center gap-3 px-8 py-5 border border-white/30 text-white font-bold rounded-full hover:bg-white/10 transition-all backdrop-blur-sm group active:scale-95">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/40 transition-colors">
                    <Icon path={<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />} size={12} className="fill-white" />
                  </div>
                  Request a demo
                </button>
            </div>
          </div>
        </section>

        {/* Contact Logic Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          
          {/* Left: Contact Form */}
          <div className="bg-white rounded-[2.5rem] p-8 lg:p-16 border border-gray-100 shadow-sm transition-all hover:shadow-xl hover:shadow-gray-100/50">
            <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Drop us a line</h2>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-10">We reply in less than 24 hours.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Your Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="John Doe"
                    className="w-full px-8 py-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#427CFF] transition-all font-bold text-gray-900 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Email Address</label>
                  <input 
                    type="email" 
                    required
                    placeholder="john@example.com"
                    className="w-full px-8 py-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#427CFF] transition-all font-bold text-gray-900 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Subject</label>
                <input 
                  type="text" 
                  required
                  placeholder="Inquiry about pricing"
                  className="w-full px-8 py-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#427CFF] transition-all font-bold text-gray-900 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Your Message</label>
                <textarea 
                  rows="5"
                  required
                  placeholder="How can we help you?"
                  className="w-full px-8 py-6 bg-gray-50 border-none rounded-3xl focus:ring-2 focus:ring-[#427CFF] transition-all font-bold text-gray-900 outline-none resize-none"
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={submitted}
                className={`w-full py-5 rounded-2xl font-black text-[12px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
                  submitted 
                  ? 'bg-green-500 text-white shadow-xl shadow-green-500/20' 
                  : 'bg-gray-900 text-white hover:bg-gray-800 shadow-xl shadow-gray-900/10 active:scale-95'
                }`}
              >
                {submitted ? (
                  <>
                    <Icon path={icons.check} size={18} />
                    Message Sent
                  </>
                ) : (
                  <>
                    <Icon path={icons.send} size={18} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right: Info & Directions */}
          <div className="flex flex-col justify-center space-y-12 h-full py-12">
            <div className="space-y-12">
               <div className="flex items-start gap-8 group">
                  <div className="w-16 h-16 bg-[#EFF3FF] text-[#427CFF] rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110">
                     <Icon path={icons.mail} size={28} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-300 mb-2">Email Us</h4>
                    <p className="text-2xl font-black text-gray-900 tracking-tight">apex@gmail.com</p>
                    <p className="text-gray-400 font-medium">Available 24/7 for support.</p>
                  </div>
               </div>

               <div className="flex items-start gap-8 group">
                  <div className="w-16 h-16 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110">
                     <Icon path={icons.phone} size={28} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-300 mb-2">Call Us</h4>
                    <p className="text-2xl font-black text-gray-900 tracking-tight">+9 999 999 999</p>
                    <p className="text-gray-400 font-medium">Mon-Fri from 9am to 6pm.</p>
                  </div>
               </div>

               <div className="flex items-start gap-8 group">
                  <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110">
                     <Icon path={icons.mapPin} size={28} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-300 mb-2">Visit Us</h4>
                    <p className="text-2xl font-black text-gray-900 tracking-tight">1-6-2 Misuji, Taito-ku</p>
                    <p className="text-gray-400 font-medium leading-relaxed">Tokyo 111-0055, Japan</p>
                  </div>
               </div>
            </div>

            <div className="pt-10 border-t border-gray-100 flex items-center gap-4 text-gray-400">
               <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
               <span className="text-[9px] font-black uppercase tracking-[0.3em]">Support Team: online</span>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
