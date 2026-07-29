import { useState } from 'react';
import { User, Mail, Phone, Camera, Lock, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { userInfo, updateUser } = useAuth();

  const [name, setName] = useState(userInfo?.name || '');
  const [phone, setPhone] = useState(userInfo?.phone || '');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(userInfo?.avatar || '');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword && newPassword.length < 6) {
      setError('নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে');
      return;
    }
    if (newPassword && !currentPassword) {
      setError('পাসওয়ার্ড বদলাতে হলে বর্তমান পাসওয়ার্ড দিতে হবে');
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('phone', phone);
      if (avatarFile) formData.append('avatar', avatarFile);
      if (newPassword) {
        formData.append('currentPassword', currentPassword);
        formData.append('newPassword', newPassword);
      }

      const { data } = await api.put('/auth/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      updateUser(data);
      setSuccess('প্রোফাইল সফলভাবে আপডেট হয়েছে!');
      setCurrentPassword('');
      setNewPassword('');
      setAvatarFile(null);
    } catch (err) {
      setError(err.response?.data?.message || 'আপডেট করা যায়নি। আবার চেষ্টা করুন।');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-14">
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-sunset">আমার একাউন্ট</span>
      <h1 className="mt-2 font-display text-3xl text-jungle">প্রোফাইল সেটিংস</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-8 rounded-2xl border border-sand bg-cream p-6 sm:p-8">
        {/* Avatar */}
        <div className="flex items-center gap-5">
          <div className="relative">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className="h-20 w-20 rounded-full object-cover" />
            ) : (
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-jungle font-display text-2xl text-cream">
                {name?.charAt(0).toUpperCase() || 'U'}
              </span>
            )}
            <label className="absolute -bottom-1 -right-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-sunset text-cream shadow-sm hover:bg-sunset-dark">
              <Camera size={13} />
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </label>
          </div>
          <div>
            <h3 className="font-display text-lg text-jungle">{userInfo?.name}</h3>
            <p className="text-sm text-ink/50">{userInfo?.email}</p>
          </div>
        </div>

        {/* Name & Phone */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink/70">পূর্ণ নাম</label>
            <div className="flex items-center gap-2 rounded-xl border border-sand-dark bg-cream px-4 py-3 focus-within:border-sunset">
              <User size={16} className="text-ink/40" />
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-transparent text-sm focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink/70">ফোন নম্বর</label>
            <div className="flex items-center gap-2 rounded-xl border border-sand-dark bg-cream px-4 py-3 focus-within:border-sunset">
              <Phone size={16} className="text-ink/40" />
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01XXXXXXXXX" className="w-full bg-transparent text-sm focus:outline-none" />
            </div>
          </div>
        </div>

        {/* Email (read-only) */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink/70">ইমেইল</label>
          <div className="flex items-center gap-2 rounded-xl border border-sand-dark bg-sand/30 px-4 py-3">
            <Mail size={16} className="text-ink/40" />
            <span className="text-sm text-ink/60">{userInfo?.email}</span>
          </div>
          <p className="mt-1 text-xs text-ink/40">ইমেইল পরিবর্তন করা যায় না</p>
        </div>

        <hr className="border-sand" />

        {/* Password change */}
        <div>
          <h3 className="font-display text-lg text-jungle">পাসওয়ার্ড বদলান</h3>
          <p className="text-xs text-ink/40">খালি রাখলে পাসওয়ার্ড অপরিবর্তিত থাকবে</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink/70">বর্তমান পাসওয়ার্ড</label>
              <div className="flex items-center gap-2 rounded-xl border border-sand-dark bg-cream px-4 py-3 focus-within:border-sunset">
                <Lock size={16} className="text-ink/40" />
                <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" className="w-full bg-transparent text-sm focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink/70">নতুন পাসওয়ার্ড</label>
              <div className="flex items-center gap-2 rounded-xl border border-sand-dark bg-cream px-4 py-3 focus-within:border-sunset">
                <Lock size={16} className="text-ink/40" />
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="কমপক্ষে ৬ অক্ষর" className="w-full bg-transparent text-sm focus:outline-none" />
              </div>
            </div>
          </div>
        </div>

        {error && <p className="text-sm text-sunset-dark">{error}</p>}
        {success && (
          <p className="flex items-center gap-1.5 text-sm text-jungle">
            <CheckCircle2 size={15} /> {success}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 rounded-full bg-sunset px-8 py-3 font-semibold text-cream hover:bg-sunset-dark disabled:opacity-60"
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : 'পরিবর্তন সেভ করুন'}
        </button>
      </form>
    </div>
  );
};

export default Profile;