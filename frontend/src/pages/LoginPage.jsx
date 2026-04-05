import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import doctorHero from '../assets/doctor-hero.png';

const Icon = ({ path, size = 20, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {path}
  </svg>
);

const icons = {
  plus: <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>,
  eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>,
  eyeOff: <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></>,
  chevronLeft: <polyline points="15 18 9 12 15 6" />,
  chevronRight: <polyline points="9 18 15 12 9 6" />,
};

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
    setError('');
  };

  const validate = () => {
    if (!form.email || !form.password) return 'Please provide both your email and password.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'The provided email is not a valid address.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'The credentials you provided are incorrect. Please verify your identity.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      
      {/* Left Panel - Sign In Section */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-20 lg:px-32 relative">
        
        {/* Brand Logo */}
        <div className="absolute top-10 left-8 md:left-20 flex items-center gap-2">
           <div className="w-8 h-8 rounded-full border-4 border-[#0EA5E9] flex items-center justify-center p-0.5">
              <div className="w-full h-full bg-[#0EA5E9] rounded-full flex items-center justify-center text-white">
                <Icon path={icons.plus} size={14} strokeWidth={4} />
              </div>
           </div>
           <span className="font-black text-2xl tracking-tighter text-[#0EA5E9]">MEDSTAR</span>
        </div>

        <div className="max-w-[360px] w-full mx-auto md:mx-0">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome back</h1>
            <p className="text-gray-500 font-medium tracking-tight">Welcome back! Please enter your details.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 text-rose-600 rounded-lg text-sm font-medium border border-rose-100 italic">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-gray-700 text-sm font-bold tracking-tight">Email</label>
              <input 
                name="email" 
                value={form.email} 
                onChange={handleChange} 
                placeholder="Enter your email" 
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:ring-4 focus:ring-sky-100 focus:border-[#0EA5E9] transition-all outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-gray-700 text-sm font-bold tracking-tight">Password</label>
              <div className="relative group">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  name="password" 
                  value={form.password} 
                  onChange={handleChange} 
                  placeholder="••••••••" 
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:ring-4 focus:ring-sky-100 focus:border-[#0EA5E9] transition-all outline-none" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  <Icon path={showPassword ? icons.eyeOff : icons.eye} size={18} />
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2 text-gray-700 font-medium cursor-pointer">
                <input 
                  type="checkbox" 
                  name="remember" 
                  checked={form.remember}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-300 text-[#0EA5E9] focus:ring-[#0EA5E9]" 
                />
                Remember for 30 days
              </label>
              <Link to="/forgot-password" tabIndex="-1" className="text-[#0EA5E9] font-bold hover:text-[#0284C7] transition-colors">Forgot password</Link>
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#2299C9] text-white font-bold rounded-lg hover:bg-[#1C82AB] active:scale-[0.98] transition-all mt-4 shadow-sm"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

          </form>

          <div className="mt-8 text-center md:text-left">
            <p className="text-gray-500 font-medium text-sm">
              Don't have an account? <Link to="/register" className="text-[#0EA5E9] font-bold hover:text-[#0284C7] ml-1">Sign up</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Hero Section */}
      <div className="hidden md:flex flex-1 p-6 h-screen sticky top-0">
        <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl">
          <img 
            src={doctorHero} 
            alt="Doctor" 
            className="w-full h-full object-cover"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {/* Testimonial Card */}
          <div className="absolute bottom-10 left-10 md:right-10 lg:right-20 bg-black/30 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-white max-w-[600px] animate-in fade-in slide-in-from-bottom-10 duration-700">
             <blockquote className="text-[1.75rem] font-medium leading-tight tracking-tight mb-8">
               “I’ve been using Medstar to start every new patient and can’t imagine working without it.”
             </blockquote>
             
             <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Edwin Taylor</h3>
                  <p className="text-white/60 text-sm">Attending physician</p>
                  <p className="text-white/40 text-xs mt-1">MedExpress Regional Clinic</p>
                </div>
                
                <div className="flex gap-4">
                  <button className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors">
                    <Icon path={icons.chevronLeft} size={20} />
                  </button>
                  <button className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors">
                    <Icon path={icons.chevronRight} size={20} />
                  </button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
