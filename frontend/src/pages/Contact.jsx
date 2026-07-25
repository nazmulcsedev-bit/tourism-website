import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../api/axios';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.message) {
      setError('নাম, ইমেইল ও মেসেজ পূরণ করুন');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/inquiries', form);
      setSuccess(true);
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'বার্তা পাঠানো যায়নি। আবার চেষ্টা করুন।');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="text-center">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-sunset">যোগাযোগ</span>
        <h1 className="mt-2 font-display text-4xl text-jungle">আমাদের সাথে কথা বলুন</h1>
        <p className="mx-auto mt-3 max-w-lg text-ink/60">
          কাস্টম ট্যুর পরিকল্পনা, গ্রুপ ডিসকাউন্ট, বা যেকোনো প্রশ্নের জন্য নিচের ফর্ম পূরণ করুন — আমরা দ্রুত সাড়া দেব।
        </p>
      </div>

      <div className="mt-12 grid gap-10 md:grid-cols-5">
        {/* Contact info */}
        <div className="space-y-6 md:col-span-2">
          <div className="rounded-2xl border border-sand bg-sand/30 p-6">
            <div className="flex items-start gap-3">
              <Phone size={18} className="mt-1 shrink-0 text-jungle" />
              <div>
                <h3 className="font-semibold text-jungle">ফোন</h3>
                <p className="mt-1 text-sm text-ink/60">+৮৮০ ১৭০০-০০০০০০</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-sand bg-sand/30 p-6">
            <div className="flex items-start gap-3">
              <Mail size={18} className="mt-1 shrink-0 text-jungle" />
              <div>
                <h3 className="font-semibold text-jungle">ইমেইল</h3>
                <p className="mt-1 text-sm text-ink/60">hello@bhromon.com</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-sand bg-sand/30 p-6">
            <div className="flex items-start gap-3">
              <MapPin size={18} className="mt-1 shrink-0 text-jungle" />
              <div>
                <h3 className="font-semibold text-jungle">অফিস</h3>
                <p className="mt-1 text-sm text-ink/60">ঢাকা, বাংলাদেশ</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="md:col-span-3">
          {success ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-sand bg-cream p-10 text-center">
              <CheckCircle2 size={48} className="text-jungle" strokeWidth={1.5} />
              <h3 className="mt-3 font-display text-xl text-jungle">বার্তা পাঠানো হয়েছে!</h3>
              <p className="mt-1 text-sm text-ink/60">আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।</p>
              <button onClick={() => setSuccess(false)} className="mt-5 text-sm font-semibold text-sunset hover:underline">
                আরেকটা বার্তা পাঠান
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink/70">নাম</label>
                  <input name="name" value={form.name} onChange={handleChange} className="w-full rounded-xl border border-sand-dark bg-cream px-4 py-2.5 text-sm focus:border-sunset focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink/70">ইমেইল</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full rounded-xl border border-sand-dark bg-cream px-4 py-2.5 text-sm focus:border-sunset focus:outline-none" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink/70">ফোন (ঐচ্ছিক)</label>
                  <input name="phone" value={form.phone} onChange={handleChange} className="w-full rounded-xl border border-sand-dark bg-cream px-4 py-2.5 text-sm focus:border-sunset focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink/70">বিষয়</label>
                  <input name="subject" value={form.subject} onChange={handleChange} placeholder="যেমন: কাস্টম ট্যুর" className="w-full rounded-xl border border-sand-dark bg-cream px-4 py-2.5 text-sm focus:border-sunset focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink/70">মেসেজ</label>
                <textarea name="message" value={form.message} onChange={handleChange} rows={5} className="w-full resize-none rounded-xl border border-sand-dark bg-cream px-4 py-2.5 text-sm focus:border-sunset focus:outline-none" />
              </div>
              {error && <p className="text-sm text-sunset-dark">{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 rounded-full bg-sunset px-8 py-3 font-semibold text-cream hover:bg-sunset-dark disabled:opacity-60"
              >
                {submitting ? <Loader2 size={18} className="animate-spin" /> : <><Send size={16} /> বার্তা পাঠান</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;