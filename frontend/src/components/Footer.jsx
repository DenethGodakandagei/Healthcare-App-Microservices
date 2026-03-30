import { Link } from 'react-router-dom';

const Icon = ({ path, size = 18, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {path}
  </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white pt-24 pb-12 border-t border-gray-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-20">
          
          {/* Left Section: Logo & CTA */}
          <div className="space-y-10">
            <Link to="/" className="inline-block group">
              <span className="text-7xl md:text-8xl font-black text-gray-900 tracking-tighter hover:text-gray-800 transition-colors">
                ApexEHR
              </span>
            </Link>
            
            <div className="space-y-6">
              <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em]">
                Experience the Future of Healthcare with ApexEHR
              </p>
              
              <div className="flex flex-wrap items-center gap-6">
                <Link
                  to="/register"
                  className="flex items-center gap-3 px-8 py-4 bg-gray-900 text-white font-black rounded-full hover:bg-gray-800 transition-all shadow-2xl shadow-gray-900/10 active:scale-95 group"
                >
                  <div className="w-6 h-6 bg-white text-gray-900 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-1">
                    <Icon path={<polyline points="9 18 15 12 9 6" />} size={12} />
                  </div>
                  Get started
                </Link>
                
                <button className="flex items-center gap-3 text-[12px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors group">
                  <div className="w-5 h-5 flex items-center justify-center text-gray-300 group-hover:text-blue-500 transition-colors">
                    <Icon path={<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />} size={14} />
                  </div>
                  Request a demo
                </button>
              </div>
            </div>
          </div>

          {/* Right Section: Links Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 lg:gap-8">
            
            {/* Quick Links */}
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 mb-8">Quick Links</h4>
              <ul className="space-y-5">
                {['Home', 'Features', 'Pricing', 'Contact'].map((item) => (
                  <li key={item}>
                    <Link 
                      to={item === 'Home' || item === 'Contact' ? '/' : `/${item.toLowerCase()}`} 
                      className="text-base font-bold text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contacts */}
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 mb-8">Contacts</h4>
              <ul className="space-y-5 text-base font-bold text-gray-600">
                <li className="leading-relaxed">
                  1-6-2 Misuji, Taito-ku<br />
                  Tokyo 111-0055
                </li>
                <li>+9 999 999 999</li>
                <li>
                  <a href="mailto:apex@gmail.com" className="hover:text-gray-900 transition-colors">
                    apex@gmail.com
                  </a>
                </li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 mb-8">Social</h4>
              <div className="flex items-center gap-4">
                {[
                  { name: 'facebook', path: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /> },
                  { name: 'twitter', path: <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" /> },
                  { name: 'linkedin', path: <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></> }
                ].map((social) => (
                  <a
                    key={social.name}
                    href="#"
                    className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all group"
                  >
                    <Icon path={social.path} size={18} />
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex gap-10">
            <Link to="/terms" className="text-xs font-bold text-gray-400 hover:text-gray-900 transition-colors">Terms of use</Link>
            <Link to="/privacy" className="text-xs font-bold text-gray-400 hover:text-gray-900 transition-colors">Privacy Policy</Link>
          </div>
          <p className="text-xs font-bold text-gray-400">
            © ApexEHR All Rights Reserved {currentYear}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
