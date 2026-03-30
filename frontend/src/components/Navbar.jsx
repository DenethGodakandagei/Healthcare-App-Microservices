import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

const Icon = ({ path, size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {path}
  </svg>
);

const icons = {
  plus: <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>,
  user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
  menu: <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>,
  x: <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>,
  chevronDown: <><polyline points="6 9 12 15 18 9" /></>,
  logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>,
  layout: <><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></>,
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/features' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Contact', path: '/contact' },
  ];

  const dashboardPath = user?.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard';
  const isHeroMode = location.pathname === '/' && !isScrolled;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm py-4' : 'bg-transparent py-6'
      }`}>
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-500 ${isHeroMode ? 'bg-white/10 text-white backdrop-blur' : 'bg-gray-900 text-white shadow-lg'
              }`}>
              <Icon path={icons.plus} size={18} />
            </div>
            <span className={`font-black text-xl tracking-tighter transition-colors duration-500 ${isHeroMode ? 'text-white/90' : 'text-gray-900'
              }`}>ApexEHR</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-[13px] font-bold tracking-tight transition-all duration-300 ${isHeroMode
                    ? 'text-white/60 hover:text-white'
                    : (location.pathname === link.path ? 'text-gray-900' : 'text-gray-400 hover:text-gray-900')
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center gap-6">
            {!user && (
              <Link to="/demo" className={`flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest transition-all duration-300 ${isHeroMode ? 'text-white/60 hover:text-white' : 'text-gray-400 hover:text-gray-900'
                }`}>
                <Icon path={<><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></>} size={14} />
                Request a demo
              </Link>
            )}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className={`flex items-center gap-2 pl-2 pr-1 py-1 rounded-full border transition-all duration-300 ${isHeroMode ? 'border-white/20 bg-white/5 hover:bg-white/10' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  <span className={`text-[12px] font-bold ml-2 ${isHeroMode ? 'text-white/80' : 'text-gray-700'}`}>Hi, {user.username || 'User'}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isHeroMode ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'
                    }`}>
                    {(user.username || user.name || 'U')[0].toUpperCase()}
                  </div>
                </button>

                {profileDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setProfileDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-100/50 p-2 z-20 overflow-hidden">
                      <Link
                        to={dashboardPath}
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all"
                      >
                        <Icon path={icons.layout} size={16} />
                        Go to Dashboard
                      </Link>
                      <div className="h-px bg-gray-100 my-1 mx-2" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
                      >
                        <Icon path={icons.logout} size={16} />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                to="/register"
                className={`group px-6 py-3 rounded-full text-[12px] font-black uppercase tracking-widest transition-all duration-500 flex items-center gap-3 ${isHeroMode
                    ? 'bg-white text-gray-900 hover:bg-gray-100 shadow-xl shadow-white/10'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-1 ${isHeroMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
                  }`}>
                  <Icon path={<polyline points="9 18 15 12 9 6" />} size={12} />
                </div>
                Get started
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`${isHeroMode ? 'text-white' : 'text-gray-900'} p-2 rounded-xl hover:bg-white/10 transition-colors`}
            >
              <Icon path={mobileMenuOpen ? icons.x : icons.menu} size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 p-4 space-y-4 animate-in slide-in-from-top-4 duration-200 shadow-xl">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-xl text-base font-bold transition-colors ${location.pathname === link.path ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="h-px bg-gray-100 mx-2" />
          <div className="flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  to={dashboardPath}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-base font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                >
                  <Icon path={icons.layout} size={18} />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-3 rounded-xl text-left text-base font-bold text-red-500 hover:bg-red-50 flex items-center gap-3"
                >
                  <Icon path={icons.logout} size={18} />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-base font-bold text-gray-900 hover:bg-gray-50"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 bg-gray-900 text-white rounded-xl text-base font-bold text-center"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
