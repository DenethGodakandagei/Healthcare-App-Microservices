import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const EyeIcon = ({ open }) => open ? (
  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
) : (
  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
  </svg>
);

const passwordStrength = (pwd) => {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  if (score <= 1) return { label: 'Weak', color: 'bg-red-400', width: 'w-1/4' };
  if (score === 2) return { label: 'Fair', color: 'bg-yellow-400', width: 'w-2/4' };
  if (score === 3) return { label: 'Good', color: 'bg-blue-400', width: 'w-3/4' };
  return { label: 'Strong', color: 'bg-green-500', width: 'w-full' };
};

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '', email: '', password: '', confirmPassword: '', role: 'patient'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const strength = form.password ? passwordStrength(form.password) : null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const validate = () => {
    if (!form.username || !form.email || !form.password || !form.confirmPassword) return 'All fields are required.';
    if (form.username.length < 3) return 'Username must be at least 3 characters.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Enter a valid email address.';
    if (form.password.length < 8) return 'Password must be at least 8 characters.';
    if (form.password !== form.confirmPassword) return 'Passwords do not match.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true);
    try {
      const user = await register({ username: form.username, email: form.email, password: form.password, role: form.role });
      navigate(user.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between w-5/12 bg-white border-r border-gray-200 p-12">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white">
            <PlusIcon />
          </div>
          <span className="text-gray-900 font-bold text-lg tracking-tight">HealthConnect</span>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-gray-900 text-3xl font-bold leading-snug mb-3">
              Join the future<br />of healthcare.
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Sign up as a patient to book appointments, or as a doctor to manage your practice.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: '🧑', title: 'Patient', desc: 'Book appointments & track your health' },
              { icon: '👨‍⚕️', title: 'Doctor', desc: 'Manage patients & your schedule' },
            ].map((r) => (
              <div key={r.title} className="border border-gray-100 rounded-xl p-3 bg-gray-50">
                <div className="text-xl mb-1">{r.icon}</div>
                <p className="text-gray-800 text-sm font-semibold">{r.title}</p>
                <p className="text-gray-400 text-xs mt-0.5 leading-tight">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-gray-400 text-xs">&copy; 2025 HealthConnect. All rights reserved.</p>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-12 overflow-y-auto">
        <div className="flex lg:hidden items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white">
            <PlusIcon />
          </div>
          <span className="text-gray-900 font-bold text-base tracking-tight">HealthConnect</span>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-6">
            <h1 className="text-gray-900 text-2xl font-bold tracking-tight mb-1">Create account</h1>
            <p className="text-gray-500 text-sm">Get started with your free account today</p>
          </div>

          {/* Role Selector */}
          <div className="mb-5 p-1 bg-gray-100 border border-gray-200 rounded-xl flex gap-1">
            {['patient', 'doctor'].map((role) => (
              <button
                key={role}
                type="button"
                id={`role-${role}`}
                onClick={() => setForm({ ...form, role })}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all duration-200 ${
                  form.role === role
                    ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {role === 'doctor' ? '👨‍⚕️ Doctor' : '🧑 Patient'}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 border border-red-200 bg-red-50 rounded-xl">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="block text-gray-600 text-xs font-semibold uppercase tracking-widest mb-2">Username</label>
              <input
                id="reg-username"
                name="username"
                type="text"
                autoComplete="username"
                value={form.username}
                onChange={handleChange}
                placeholder="johndoe"
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all"
              />
            </div>

            <div>
              <label className="block text-gray-600 text-xs font-semibold uppercase tracking-widest mb-2">Email Address</label>
              <input
                id="reg-email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all"
              />
            </div>

            <div>
              <label className="block text-gray-600 text-xs font-semibold uppercase tracking-widest mb-2">Password</label>
              <div className="relative">
                <input
                  id="reg-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all pr-12"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors p-1">
                  <EyeIcon open={showPassword} />
                </button>
              </div>
              {form.password && (
                <div className="mt-2 space-y-1">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full transition-all duration-300 ${strength.color} ${strength.width}`} />
                  </div>
                  <p className="text-gray-400 text-xs">{strength.label} password</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-gray-600 text-xs font-semibold uppercase tracking-widest mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  id="reg-confirm-password"
                  name="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat your password"
                  className={`w-full bg-white border rounded-xl px-4 py-3 text-gray-900 text-sm placeholder-gray-400 focus:outline-none transition-all pr-12 ${
                    form.confirmPassword && form.password !== form.confirmPassword
                      ? 'border-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-300'
                      : form.confirmPassword && form.password === form.confirmPassword
                        ? 'border-green-400 focus:border-green-500 focus:ring-1 focus:ring-green-300'
                        : 'border-gray-200 focus:border-gray-900 focus:ring-1 focus:ring-gray-900'
                  }`}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors p-1">
                  <EyeIcon open={showConfirm} />
                </button>
              </div>
            </div>

            <button
              id="reg-submit"
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white font-semibold text-sm py-3 rounded-xl hover:bg-gray-800 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-1"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : `Create ${form.role === 'doctor' ? 'Doctor' : 'Patient'} Account`}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-500 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-gray-900 font-semibold hover:underline underline-offset-2 transition-all">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
