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
              <span className="text-8xl md:text-[12rem] font-light text-black tracking-tighter hover:text-black/70 transition-all duration-700 leading-none">
                BioGrid
              </span>
            </Link>
            
            <div className="space-y-8">
              <p className="text-[11px] font-light text-black/40 uppercase tracking-[0.4em]">
                The future of healthcare infrastructure.
              </p>
              
              <div className="flex flex-wrap items-center gap-8">
                <Link
                  to="/register"
                  className="h-14 px-10 bg-black text-white font-medium rounded-2xl hover:bg-black/90 transition-all active:scale-95 flex items-center justify-center tracking-widest text-[10px] uppercase"
                >
                  Get started
                </Link>
                
                <button className="text-[10px] font-light uppercase tracking-[0.3em] text-black/40 hover:text-black transition-colors">
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
              <ul className="space-y-4">
                {['Home', 'Doctors', 'Features', 'Pricing', 'Contact'].map((item) => (
                  <li key={item}>
                    <Link 
                      to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} 
                      className="text-sm font-light text-black/50 hover:text-black transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contacts */}
            <div>
              <h4 className="text-[10px] font-medium uppercase tracking-[0.3em] text-black/20 mb-10">Contacts</h4>
              <ul className="space-y-5 text-sm font-light text-black/50">
                <li className="leading-relaxed">
                  1-6-2 Misuji, Taito-ku<br />
                  Tokyo 111-0055
                </li>
                <li>+9 999 999 999</li>
                <li>
                  <a href="mailto:hello@biogrid.com" className="hover:text-black transition-colors">
                    hello@biogrid.com
                  </a>
                </li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 className="text-[12px] font-medium uppercase tracking-[0.4em] text-black/30 mb-12">Connect</h4>
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
          <div className="flex gap-12">
            <Link to="/terms" className="text-[12px] font-light text-black/40 hover:text-black transition-colors tracking-[0.3em] uppercase">Terms</Link>
            <Link to="/privacy" className="text-[12px] font-light text-black/40 hover:text-black transition-colors tracking-[0.3em] uppercase">Privacy</Link>
          </div>
          <p className="text-[12px] font-light text-black/40 tracking-[0.3em] uppercase">
            © BioGrid {currentYear}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
