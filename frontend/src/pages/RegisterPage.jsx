import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doctorAPI } from '../services/api';
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
  hospital: <><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/><path d="M9 10V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4"/></>,
  user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
};

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '', email: '', password: '', role: 'patient',
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
    if (!form.username || !form.email || !form.password) return 'Core authentication fields are mandatory.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Enter a valid address.';
    if (form.role === 'doctor') {
      if (!form.firstName || !form.lastName || !form.specialty) return 'Doctor profile fields are required.';
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
      setError(err.response?.data?.message || 'Onboarding failed. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white font-sans text-gray-900">
      
      {/* Left Panel - Onboarding Section */}
      <div className="flex-1 flex flex-col px-8 md:px-20 lg:px-32 py-20 relative overflow-y-auto min-h-screen">
        
        {/* Brand Logo */}
        <div className="absolute top-10 left-8 md:left-20 flex items-center gap-2">
           <div className="w-8 h-8 rounded-full border-4 border-[#0EA5E9] flex items-center justify-center p-0.5">
              <div className="w-full h-full bg-[#0EA5E9] rounded-full flex items-center justify-center text-white">
                <Icon path={icons.plus} size={14} strokeWidth={4} />
              </div>
           </div>
           <span className="font-black text-2xl tracking-tighter text-[#0EA5E9]">MEDSTAR</span>
        </div>

        <div className="max-w-[400px] w-full mx-auto my-auto pt-24 py-10">
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Create account</h1>
            <p className="text-gray-500 font-medium tracking-tight">Join Medstar and manage your care seamlessly.</p>
          </div>

          <div className="flex p-1.5 bg-gray-50 rounded-xl mb-10 w-fit mx-auto md:mx-0 shadow-inner border border-gray-100">
            {['patient', 'doctor'].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setForm({ ...form, role })}
                className={`py-2.5 px-6 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${
                  form.role === role ? 'bg-white text-[#0EA5E9] shadow-sm' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Icon path={role === 'doctor' ? icons.hospital : icons.user} size={14} />
                {role}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 text-rose-600 rounded-lg text-sm font-medium border border-rose-100 italic flex items-center gap-2">
               <div className="w-5 h-5 bg-rose-200 rounded-full flex items-center justify-center text-xs">!</div>
               {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="block text-gray-700 text-sm font-bold tracking-tight">Username</label>
                  <input name="username" value={form.username} onChange={handleChange} placeholder="johndoe_md" className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:ring-4 focus:ring-sky-100 focus:border-[#0EA5E9] transition-all outline-none" />
               </div>
               <div className="space-y-2">
                  <label className="block text-gray-700 text-sm font-bold tracking-tight">Email</label>
                  <input name="email" value={form.email} onChange={handleChange} placeholder="dr.doe@clinic.com" className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:ring-4 focus:ring-sky-100 focus:border-[#0EA5E9] transition-all outline-none" />
               </div>
            </div>

            {form.role === 'doctor' && (
              <div className="space-y-4 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-gray-700 text-sm font-bold tracking-tight">First Name</label>
                    <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="John" className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:ring-4 focus:ring-sky-100 focus:border-[#0EA5E9] transition-all outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-gray-700 text-sm font-bold tracking-tight">Last Name</label>
                    <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Doe" className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:ring-4 focus:ring-sky-100 focus:border-[#0EA5E9] transition-all outline-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-gray-700 text-sm font-bold tracking-tight">Specialty</label>
                  <input name="specialty" value={form.specialty} onChange={handleChange} placeholder="E.g. Cardiology" className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:ring-4 focus:ring-sky-100 focus:border-[#0EA5E9] transition-all outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-gray-700 text-sm font-bold tracking-tight">Exp. (Years)</label>
                    <input name="experienceYears" type="number" value={form.experienceYears} onChange={handleChange} placeholder="5" className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:ring-4 focus:ring-sky-100 focus:border-[#0EA5E9] transition-all outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-gray-700 text-sm font-bold tracking-tight">Consultation Fee ($)</label>
                    <input name="consultationFee" type="number" value={form.consultationFee} onChange={handleChange} placeholder="50" className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:ring-4 focus:ring-sky-100 focus:border-[#0EA5E9] transition-all outline-none" />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-gray-700 text-sm font-bold tracking-tight">Password</label>
              <div className="relative group">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  name="password" 
                  value={form.password} 
                  onChange={handleChange} 
                  placeholder="••••••••" 
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:ring-4 focus:ring-sky-100 focus:border-[#0EA5E9] transition-all outline-none tracking-widest shadow-sm" 
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

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#2299C9] text-white font-bold rounded-lg hover:bg-[#1C82AB] active:scale-[0.98] transition-all mt-4 shadow-sm"
            >
              {loading ? "ONBOARDING..." : "Complete Registration"}
            </button>

          </form>

          <div className="mt-8 text-center md:text-left">
            <p className="text-gray-500 font-medium text-sm">
              Already have an account? <Link to="/login" className="text-[#0EA5E9] font-bold hover:text-[#0284C7] ml-1">Sign in here</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Hero Branding */}
      <div className="hidden md:flex flex-1 p-6 h-screen sticky top-0">
        <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl">
          <img 
            src={doctorHero} 
            alt="Doctor" 
            className="w-full h-full object-cover shrink-0"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

          {/* Testimonial Card Overlay */}
          <div className="absolute bottom-10 left-10 md:right-10 lg:right-20 bg-black/30 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-white max-w-[600px] animate-in fade-in slide-in-from-bottom-10 duration-700">
             <blockquote className="text-[1.75rem] font-medium leading-tight tracking-tight mb-8">
               “The Medstar platform has completely transformed how I coordinate with patient care cycles.”
             </blockquote>
             
             <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Sarah Jenkins</h3>
                  <p className="text-white/60 text-sm">Clinical Coordinator</p>
                  <p className="text-white/40 text-xs mt-1">Valley Health Micro-network</p>
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

export default RegisterPage;
