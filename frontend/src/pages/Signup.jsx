import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, Compass, User, Phone } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.email || !form.password) {
      setError('নাম, ইমেইল ও পাসওয়ার্ড আবশ্যক');
      return;
    }
    if (form.password.length < 6) {
      setError('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('পাসওয়ার্ড দুটি মিলছে না');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/auth/signup', {
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
      });
      login(data);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'সাইন আপ ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-sand/40 px-6 py-16">
      <div className="w-full max-w-md rounded-2xl bg-cream p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <Compass size={30} className="text-sunset" strokeWidth={1.75} />
          <h1 className="mt-3 font-display text-3xl text-jungle">একাউন্ট তৈরি করুন</h1>
          <p className="mt-1 text-sm text-ink/60">ভ্রমণ শুরু করতে সাইন আপ করুন</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink/70">পূর্ণ নাম</label>
            <div className="flex items-center gap-2 rounded-xl border border-sand-dark bg-cream px-4 py-3 focus-within:border-sunset">
              <User size={16} className="text-ink/40" />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="আপনার নাম"
                className="w-full bg-transparent text-sm focus:outline-none"
              />
            </div>
          </div>

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
            <label className="mb-1.5 block text-sm font-medium text-ink/70">ফোন নম্বর (ঐচ্ছিক)</label>
            <div className="flex items-center gap-2 rounded-xl border border-sand-dark bg-cream px-4 py-3 focus-within:border-sunset">
              <Phone size={16} className="text-ink/40" />
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="01XXXXXXXXX"
                className="w-full bg-transparent text-sm focus:outline-none"
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
                placeholder="কমপক্ষে ৬ অক্ষর"
                className="w-full bg-transparent text-sm focus:outline-none"
                autoComplete="new-password"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink/70">পাসওয়ার্ড নিশ্চিত করুন</label>
            <div className="flex items-center gap-2 rounded-xl border border-sand-dark bg-cream px-4 py-3 focus-within:border-sunset">
              <Lock size={16} className="text-ink/40" />
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-transparent text-sm focus:outline-none"
                autoComplete="new-password"
              />
            </div>
          </div>

          {error && <p className="text-sm text-sunset-dark">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-jungle py-3 font-semibold text-cream transition-colors hover:bg-jungle-light disabled:opacity-60"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : 'সাইন আপ করুন'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink/60">
          আগে থেকেই একাউন্ট আছে?{' '}
          <Link to="/login" className="font-semibold text-sunset hover:underline">
            লগইন করুন
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;