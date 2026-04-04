import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Icon = ({ path, size = 20, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {path}
  </svg>
);

const icons = {
  plus: <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>,
  eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
  eyeOff: <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>,
  google: <><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.41 2.64c2-1.84 3.16-4.55 3.16-7.46z" fill="#4285F4"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 23c2.97 0 5.46-1 7.28-2.69l-3.41-2.64c-1 .67-2.28 1.07-3.87 1.07-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/></>,
  apple: <path d="M17.05 20.28c-.96.95-2.04 1.43-3.24 1.43-1.18 0-2.05-.39-3.2-.39-1.16 0-2.13.39-3.2.39-1.22 0-2.31-.54-3.32-1.63-2.06-2.18-3.09-5.49-3.09-9.1 0-2.41.67-4.32 2-5.74 1.05-1.1 2.3-1.68 3.75-1.68 1.1 0 1.96.34 2.89.34.89 0 1.55-.38 2.85-.38.1 0 .2 0 .31.01 2.22.09 3.86 1.44 4.8 2.92-2.16 1.3-3.35 3.49-3.35 5.86 0 1.94.86 3.65 2.1 4.37-.17.5-.39 1-.65 1-.41 0-.91-.18-1.34-.18-.4 0-.41.17-.41.17zm-1.84-15.01c-.13-.02-.2-.02-.21-.02-1.34 0-2.58.74-3.15 1.83-.87 1.63-.58 3.99.78 5.6.1.13.2.14.22.14 1.25 0 2.59-1 3.11-2.22.75-1.74.45-3.84-.75-5.33z" fill="currentColor"/>,
  activity: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />,
};

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const validate = () => {
    if (!form.email || !form.password) return 'Please provide both your clinical email and password.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'The provided email is not a valid clinical address.';
    if (form.password.length < 8) return 'Password must be at least 8 characters long for security purposes.';
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
      const user = await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'The credentials you provided are incorrect. Please verify your identity.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex font-sans text-[#111]">
      
      {/* Left Panel - Clean White with Login Form */}
      <div className="flex-1 flex flex-col p-8 lg:p-20 relative">
        <Link to="/" className="flex items-center gap-2.5 mb-24 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-[#427CFF] rounded-xl flex items-center justify-center text-white">
            <Icon path={icons.plus} size={18} />
          </div>
          <span className="font-extrabold text-xl tracking-tighter uppercase text-[#111]">BioGrid</span>
        </Link>

        <div className="max-w-[480px] w-full mx-auto">
          <div className="mb-12 text-center lg:text-left">
            <h1 className="text-4xl font-black tracking-tight mb-2">Welcome Back</h1>
            <p className="text-[#64748B] font-medium">Log in to keep managing your practice efficiently.</p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 text-red-500 rounded-xl text-xs font-bold border border-red-100 italic">
               {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[#64748B] text-[11px] font-bold">Email Address</label>
              <input 
                name="email" 
                value={form.email} 
                onChange={handleChange} 
                placeholder="name@company.com" 
                className="w-full bg-white border border-gray-200 rounded-xl px-5 py-4 focus:shadow-[0_0_0_4px_rgba(66,124,255,0.1)] focus:border-[#427CFF] transition-all outline-none" 
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-[#64748B] text-[11px] font-bold">Password</label>
                <Link to="/forgot-password" className="text-[#64748B] text-[11px] font-bold hover:text-[#111]">Forgot password?</Link>
              </div>
              <div className="relative group">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  name="password" 
                  value={form.password} 
                  onChange={handleChange} 
                  placeholder="••••••••" 
                  className="w-full bg-white border border-gray-200 rounded-xl px-5 py-4 focus:shadow-[0_0_0_4px_rgba(66,124,255,0.1)] focus:border-[#427CFF] transition-all outline-none" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#427CFF] transition-colors"
                >
                  <Icon path={showPassword ? icons.eyeOff : icons.eye} size={18} />
                </button>
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-[#427CFF] text-white font-black rounded-xl hover:bg-blue-600 active:scale-[0.98] transition-all mt-4 box-border shadow-lg shadow-blue-200/50"
            >
              {loading ? "AUTHENTICATING..." : "Sign In"}
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-gray-400 font-medium text-sm">
              Don't have an account? <Link to="/register" className="text-[#427CFF] font-extrabold hover:underline underline-offset-4 decoration-2">Create Account</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Sellora-Style Indigo with Mockup */}
      <div className="hidden lg:flex w-[45%] bg-[#427CFF] p-16 flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
           <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
           <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="relative z-10 space-y-8 mb-20 px-8">
          <h2 className="text-white text-6xl font-black leading-[1.05] tracking-tight">
            Instant Booking. <br /> Expert Consultations.
          </h2>
          <p className="text-white/60 text-lg font-medium max-w-sm">
            Schedule appointments in seconds and connect with experienced doctors through our high-performance telemedicine portal.
          </p>
        </div>

        {/* Dashboard Mockup Visual */}
        <div className="relative z-10 w-full aspect-[4/3] bg-white rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] p-8 flex flex-col gap-6 overflow-hidden border border-white/20">
          <div className="flex items-center justify-between mb-2">
            <div className="h-8 w-32 bg-gray-50/50 rounded-xl flex items-center justify-center px-4">
               <div className="h-1.5 w-full bg-gray-100 rounded-full" />
            </div>
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-50" />
              <div className="w-8 h-8 rounded-full bg-gray-50" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
             <div className="h-32 bg-blue-500 rounded-3xl p-4 flex flex-col justify-between">
                <div className="w-6 h-6 rounded-lg bg-white/20" />
                <div className="space-y-1">
                   <div className="h-1.5 w-12 bg-white/30 rounded-full" />
                   <div className="h-6 w-16 bg-white rounded-md" />
                </div>
             </div>
             <div className="h-32 bg-gray-50 rounded-3xl p-4 flex flex-col justify-between">
                <div className="w-6 h-6 rounded-lg bg-gray-100" />
                <div className="space-y-1">
                   <div className="h-1.5 w-12 bg-gray-200 rounded-full" />
                   <div className="h-6 w-16 bg-gray-100 rounded-md" />
                </div>
             </div>
             <div className="h-32 bg-purple-50 rounded-3xl p-4 flex flex-col justify-between">
                <div className="w-6 h-6 rounded-lg bg-white" />
                <div className="space-y-1">
                   <div className="h-1.5 w-12 bg-purple-200 rounded-full" />
                   <div className="h-6 w-16 bg-purple-500/20 rounded-md" />
                </div>
             </div>
          </div>

          <div className="flex-1 bg-gray-50 rounded-[2rem] p-6 space-y-4">
             <div className="h-3 w-40 bg-gray-100 rounded-full" />
             <div className="grid grid-cols-2 gap-4">
                <div className="h-24 bg-white rounded-2xl p-4 flex flex-col gap-3">
                   <div className="flex gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-50" />
                      <div className="h-1.5 w-16 bg-gray-50 mt-2" />
                   </div>
                   <div className="h-1.5 w-full bg-gray-100" />
                </div>
                <div className="h-24 bg-white rounded-2xl p-4 flex flex-col gap-3">
                   <div className="flex gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-50" />
                      <div className="h-1.5 w-16 bg-gray-50 mt-2" />
                   </div>
                   <div className="h-1.5 w-full bg-gray-100" />
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
