import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doctorAPI } from '../services/api';

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
};

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '', email: '', password: '', confirmPassword: '', role: 'patient',
    firstName: '', lastName: '', specialty: '', experienceYears: '', contactNumber: '', consultationFee: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const validate = () => {
    if (!form.username || !form.email || !form.password || !form.confirmPassword) return 'All core authentication fields are required.';
    if (form.username.length < 3) return 'Username must be at least 3 characters.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Enter a valid clinical email address.';
    if (form.password.length < 8) return 'Password must be at least 8 characters for security.';
    if (form.password !== form.confirmPassword) return 'Passwords do not match. Please verify.';
    
    if (form.role === 'doctor') {
      if (!form.firstName || !form.lastName || !form.specialty || !form.experienceYears || !form.contactNumber || !form.consultationFee) {
        return 'All doctor profile fields are required to join our network.';
      }
      if (Number(form.experienceYears) < 0 || Number(form.consultationFee) < 0) {
        return 'Experience and Consultation Fee must be valid positive numbers.';
      }
    }
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
      const user = await register({ username: form.username, email: form.email, password: form.password, role: form.role });
      if (user.role === 'doctor') {
        await doctorAPI.createProfile({
          firstName: form.firstName, lastName: form.lastName, specialty: form.specialty,
          experienceYears: Number(form.experienceYears), contactNumber: form.contactNumber, consultationFee: Number(form.consultationFee)
        });
      }
      navigate(user.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex font-sans text-[#111]">
      
      {/* Left Panel - Clean White with Form */}
      <div className="flex-1 flex flex-col p-8 lg:p-20 relative">
        <Link to="/" className="flex items-center gap-2.5 mb-20 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-[#427CFF] rounded-xl flex items-center justify-center text-white">
            <Icon path={icons.plus} size={18} />
          </div>
          <span className="font-extrabold text-xl tracking-tighter uppercase text-[#111]">BioGrid</span>
        </Link>

        <div className="max-w-[480px] w-full mx-auto">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-black tracking-tight mb-2">Create an Account</h1>
            <p className="text-[#64748B] font-medium">Join now to streamline your clinical operations.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-500 rounded-xl text-xs font-bold border border-red-100 italic">
               {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex p-1 bg-gray-50 rounded-xl mb-6">
              {['patient', 'doctor'].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setForm({ ...form, role })}
                  className={`flex-1 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                    form.role === role ? 'bg-white text-[#427CFF] shadow-sm' : 'text-gray-400'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>

            <div className="space-y-1.5">
              <label className="block text-[#64748B] text-[11px] font-bold">Username</label>
              <input name="username" value={form.username} onChange={handleChange} placeholder="JohnDoe" className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3.5 focus:shadow-[0_0_0_4px_rgba(66,124,255,0.1)] focus:border-[#427CFF] transition-all outline-none" />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[#64748B] text-[11px] font-bold">Email</label>
              <input name="email" value={form.email} onChange={handleChange} placeholder="name@company.com" className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3.5 focus:shadow-[0_0_0_4px_rgba(66,124,255,0.1)] focus:border-[#427CFF] transition-all outline-none" />
            </div>

            {form.role === 'doctor' && (
              <div className="space-y-5 animate-in slide-in-from-top-4 duration-500">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[#64748B] text-[11px] font-bold">First Name</label>
                    <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="John" className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3.5 focus:shadow-[0_0_0_4px_rgba(66,124,255,0.1)] focus:border-[#427CFF] transition-all outline-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[#64748B] text-[11px] font-bold">Last Name</label>
                    <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Doe" className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3.5 focus:shadow-[0_0_0_4px_rgba(66,124,255,0.1)] focus:border-[#427CFF] transition-all outline-none" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[#64748B] text-[11px] font-bold">Specialty</label>
                  <input name="specialty" value={form.specialty} onChange={handleChange} placeholder="Cardiology" className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3.5 focus:shadow-[0_0_0_4px_rgba(66,124,255,0.1)] focus:border-[#427CFF] transition-all outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[#64748B] text-[11px] font-bold">Years Experience</label>
                    <input name="experienceYears" type="number" value={form.experienceYears} onChange={handleChange} placeholder="5" className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3.5 focus:shadow-[0_0_0_4px_rgba(66,124,255,0.1)] focus:border-[#427CFF] transition-all outline-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[#64748B] text-[11px] font-bold">Consultation Fee ($)</label>
                    <input name="consultationFee" type="number" value={form.consultationFee} onChange={handleChange} placeholder="50" className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3.5 focus:shadow-[0_0_0_4px_rgba(66,124,255,0.1)] focus:border-[#427CFF] transition-all outline-none" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[#64748B] text-[11px] font-bold">Contact Number</label>
                  <input name="contactNumber" value={form.contactNumber} onChange={handleChange} placeholder="+1 (555) 000-0000" className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3.5 focus:shadow-[0_0_0_4px_rgba(66,124,255,0.1)] focus:border-[#427CFF] transition-all outline-none" />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[#64748B] text-[11px] font-bold">Password</label>
                <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3.5 focus:shadow-[0_0_0_4px_rgba(66,124,255,0.1)] focus:border-[#427CFF] transition-all outline-none" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[#64748B] text-[11px] font-bold">Confirm</label>
                <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="••••••••" className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3.5 focus:shadow-[0_0_0_4px_rgba(66,124,255,0.1)] focus:border-[#427CFF] transition-all outline-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-[#427CFF] text-white font-black rounded-xl hover:bg-blue-600 active:scale-[0.98] transition-all mt-4 box-border shadow-lg shadow-blue-200/50"
            >
              {loading ? "PROCESSING..." : "Register"}
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-gray-400 font-medium text-sm">
              Already account? <Link to="/login" className="text-[#427CFF] font-extrabold hover:underline">Sign In</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Indigo with Dashboard Mockup */}
      <div className="hidden lg:flex w-[45%] bg-[#427CFF] p-16 flex-col justify-center relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
           <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
           <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="relative z-10 space-y-8 mb-16">
          <h2 className="text-white text-5xl font-black leading-[1.1] tracking-tight">
            Seamless <br /> Appointments <br /> & Remote Care.
          </h2>
          <p className="text-white/70 text-lg font-medium max-w-sm">
            Book consultations instantly and meet with top-tier doctors online from the comfort of your home.
          </p>
        </div>

        {/* Dashboard Mockup - Complex SVG/Div component */}
        <div className="relative z-10 w-full aspect-[4/3] bg-white rounded-[2rem] shadow-2xl p-6 flex flex-col gap-6 overflow-hidden border border-white/20 select-none">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                <Icon path={icons.activity} size={20} />
              </div>
              <div className="space-y-1">
                <div className="h-2 w-24 bg-gray-100 rounded-full" />
                <div className="h-1.5 w-16 bg-gray-50 rounded-full" />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-50" />
              <div className="w-8 h-8 rounded-full bg-gray-50" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-500 rounded-3xl text-white space-y-3">
              <p className="text-[10px] font-black uppercase opacity-60">Daily Bookings</p>
              <h3 className="text-3xl font-black">128</h3>
              <div className="flex items-center gap-2 text-[10px] font-bold bg-white/10 w-fit px-2 py-0.5 rounded-full">
                <span>+12%</span>
              </div>
            </div>
            <div className="p-4 bg-emerald-50 rounded-3xl space-y-3">
              <p className="text-[#10B981] text-[10px] font-black uppercase opacity-60">Efficiency</p>
              <h3 className="text-3xl font-black text-[#111]">94%</h3>
              <div className="h-1.5 w-full bg-white rounded-full">
                <div className="h-full w-[94%] bg-[#10B981] rounded-full" />
              </div>
            </div>
          </div>

          <div className="flex-1 bg-gray-50 rounded-3xl p-4 flex flex-col gap-3">
            <div className="flex justify-between items-center mb-2">
              <div className="h-2 w-32 bg-gray-200 rounded-full" />
              <div className="h-2 w-12 bg-gray-200 rounded-full" />
            </div>
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center justify-between p-2.5 bg-white rounded-2xl">
                   <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-gray-50" />
                     <div className="h-2 w-20 bg-gray-100 rounded-full" />
                   </div>
                   <div className="w-12 h-4 rounded-full bg-blue-50" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
