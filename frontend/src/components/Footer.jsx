import { Link } from 'react-router-dom';

const Icon = ({ path, size = 18, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {path}
  </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white text-[#111] pt-32 pb-16 overflow-hidden relative border-t border-gray-100">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/[0.03] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      
      <div className="max-w-8xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
        
        {/* Massive Hero Branding Part */}
        <div className="mb-32">
           <Link to="/" className="inline-block group relative">
             <span className="text-[12vw] font-black tracking-[-0.05em] leading-[0.8] transition-all duration-1000 group-hover:tracking-[-0.08em] block translate-x-[-1vw] text-[#111]">
               BioGrid<span className="text-blue-500">.</span>
             </span>
             <p className="mt-8 text-[11px] font-black uppercase tracking-[0.6em] text-gray-300 ml-2">The Future of Healthcare Infrastructure</p>
           </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 pb-24 border-b border-gray-100">
          
          {/* Left: About & Stats */}
          <div className="lg:col-span-5 space-y-12">
            <div className="max-w-md space-y-8">
              <h3 className="text-3xl font-black tracking-tighter italic leading-tight text-[#111]">Empowering clinicians with high-performance digital terminals.</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                BioGrid is a next-generation clinical operating system designed to eliminate technical friction between doctors and patients through seamless biometric synchronization and diagnostic automation.
              </p>
            </div>
            
            <div className="flex gap-16 pt-4">
               <div>
                  <p className="text-[40px] font-black tracking-tighter mb-1 text-[#111]">99.9%</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">Uptime SLA</p>
               </div>
               <div>
                  <p className="text-[40px] font-black tracking-tighter mb-1 text-[#111]">256bit</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">AES Vault</p>
               </div>
            </div>
          </div>

          {/* Right: Nested Grids */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-8">
             
             {/* Ecosystem */}
             <div>
               <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mb-10">Ecosystem</h4>
               <ul className="space-y-5">
                 {['Home', 'Doctors', 'Features', 'Pricing', 'Contact'].map((item) => (
                   <li key={item}>
                     <Link to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="text-sm font-bold text-gray-400 hover:text-[#111] transition-all hover:translate-x-1 inline-block">
                       {item}
                     </Link>
                   </li>
                 ))}
               </ul>
             </div>

             {/* Support */}
             <div>
               <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-200 mb-10">Support</h4>
               <ul className="space-y-6 text-sm font-medium text-gray-400">
                 <li className="flex flex-col gap-1">
                   <span className="text-[9px] font-black uppercase tracking-widest text-gray-200">Location</span>
                   1-6-2 Misuji, Taito-ku<br />Tokyo 111-0055
                 </li>
                 <li className="flex flex-col gap-1">
                   <span className="text-[9px] font-black uppercase tracking-widest text-gray-200">Inquiries</span>
                   biogrid@gmail.com
                 </li>
               </ul>
             </div>

             {/* Connect */}
             <div className="space-y-10">
               <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-200 mb-10">Connect</h4>
                  <div className="flex flex-wrap gap-4">
                    {[
                      { n: 'fb', p: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /> },
                      { n: 'tw', p: <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" /> },
                      { n: 'li', p: <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></> }
                    ].map((s) => (
                      <a key={s.n} href="#" className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:bg-gray-900 hover:text-white transition-all hover:-translate-y-1">
                        <Icon path={s.p} size={20} />
                      </a>
                    ))}
                  </div>
               </div>
               
               <div className="p-1 bg-gray-50 rounded-2xl border border-gray-100">
                  <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-gray-300 hover:text-[#111] transition-colors">
                     Back to Top ↑
                  </button>
               </div>
             </div>

          </div>
        </div>

        {/* Bottom Metadata */}
        <div className="pt-16 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex gap-12">
            {['Terms of Service', 'Privacy Policy', 'Cookie Compliance'].map(l => (
               <Link key={l} to="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-[#111] transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
             <div className="w-2 h-2 bg-green-500 rounded-full" />
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">
               © BioGrid {currentYear} • All Operations Encrypted
             </p>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
