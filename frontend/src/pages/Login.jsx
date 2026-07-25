import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Loader2, Compass } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectTo = location.state?.from || '/';

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      setError('ইমেইল ও পাসওয়ার্ড দিন');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      login(data);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'লগইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-sand/40 px-6 py-16">
      <div className="w-full max-w-md rounded-2xl bg-cream p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <Compass size={30} className="text-sunset" strokeWidth={1.75} />
          <h1 className="mt-3 font-display text-3xl text-jungle">আবার স্বাগতম</h1>
          <p className="mt-1 text-sm text-ink/60">আপনার একাউন্টে লগইন করুন</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink/70">ইমেইল</label>
            <div className="flex items-center gap-2 rounded-xl border border-sand-dark bg-cream px-4 py-3 focus-within:border-sunset">
              <Mail size={16} className="text-ink/40" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full bg-transparent text-sm focus:outline-none"
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink/70">পাসওয়ার্ড</label>
            <div className="flex items-center gap-2 rounded-xl border border-sand-dark bg-cream px-4 py-3 focus-within:border-sunset">
              <Lock size={16} className="text-ink/40" />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-transparent text-sm focus:outline-none"
                autoComplete="current-password"
              />
            </div>
          </div>

          {error && <p className="text-sm text-sunset-dark">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-jungle py-3 font-semibold text-cream transition-colors hover:bg-jungle-light disabled:opacity-60"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : 'লগইন করুন'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink/60">
          একাউন্ট নেই?{' '}
          <Link to="/signup" className="font-semibold text-sunset hover:underline">
            সাইন আপ করুন
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;