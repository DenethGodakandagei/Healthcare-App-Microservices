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

  useEffect(() => {
    const hash = location.hash;
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  const handleNavClick = (e, path) => {
    if (path.startsWith('/#')) {
      if (location.pathname === '/') {
        e.preventDefault();
        const element = document.getElementById(path.substring(2));
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Doctors', path: '/doctors' },
    { name: 'Features', path: '/#features' },
    { name: 'Contact', path: '/#contact' },
  ];

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
  const dashboardPath = getDashboardPath();
  const isHeroMode = location.pathname === '/' && !isScrolled;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${isScrolled ? 'py-4' : 'py-8'
      }`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className={`w-10 h-10 flex items-center justify-center rounded-2xl transition-all duration-700 ${isHeroMode ? 'bg-white/5 text-white backdrop-blur-sm' : 'bg-black/5 text-black'
              }`}>
              <Icon path={icons.plus} size={20} />
            </div>
            <span className={`font-semibold text-2xl tracking-tight transition-colors duration-700 ${isHeroMode ? 'text-white drop-shadow-md' : 'text-black/90'
              }`}>BioGrid</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-12">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={(e) => handleNavClick(e, link.path)}
                className={`text-[15px] font-semibold tracking-wide transition-all duration-500 ${isHeroMode
                  ? 'text-white hover:text-white/80 [text-shadow:_0_1px_4px_rgba(0,0,0,0.4)]'
                  : (location.pathname === link.path ? 'text-black font-semibold' : 'text-black/60 hover:text-black')
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center gap-8">
            {!user && (
              <Link to="/demo" className={`flex items-center gap-2 text-[11px] font-light uppercase tracking-[0.2em] transition-all duration-500 ${isHeroMode ? 'text-white/40 hover:text-white/90' : 'text-black/30 hover:text-black'
                }`}>
                Request a demo
              </Link>
            )}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className={`flex items-center gap-3 pl-3 pr-1.5 py-1.5 rounded-2xl transition-all duration-500 ${isHeroMode ? 'bg-white/5 hover:bg-white/10' : 'bg-black/5 hover:bg-black/10'
                    }`}
                >
                  <span className={`text-[13px] font-semibold ${isHeroMode ? 'text-white drop-shadow-sm' : 'text-black/70'}`}>Hi, {user.username || 'User'}</span>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-light ${isHeroMode ? 'bg-white text-black' : 'bg-black text-white'
                    }`}>
                    {(user.username || user.name || 'U')[0].toUpperCase()}
                  </div>
                </button>

                {profileDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setProfileDropdownOpen(false)} />
                    <div className="absolute right-0 mt-4 w-60 bg-white/80 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl shadow-black/5 p-2 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                      <Link
                        to={dashboardPath}
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-light text-black/60 hover:text-black hover:bg-black/5 transition-all"
                      >
                        <Icon path={icons.layout} size={16} />
                        Go to Dashboard
                      </Link>
                      <div className="h-px bg-black/5 my-1 mx-2" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-light text-red-500/80 hover:bg-red-500/5 transition-all"
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
                className={`group h-14 px-10 rounded-2xl text-[13px] font-medium uppercase tracking-[0.2em] transition-all duration-700 flex items-center justify-center ${isHeroMode
                  ? 'bg-white text-black hover:bg-white/90'
                  : 'bg-black text-white hover:bg-black/90'
                  }`}
              >
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
                onClick={(e) => handleNavClick(e, link.path)}
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
