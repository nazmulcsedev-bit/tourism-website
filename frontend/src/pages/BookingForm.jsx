import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Loader2, Calendar, Users, Phone, Mail, User, MessageSquare } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const BookingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useAuth();

  const [tour, setTour] = useState(null);
  const [loadingTour, setLoadingTour] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    fullName: userInfo?.name || '',
    email: userInfo?.email || '',
    phone: '',
    numberOfPeople: 1,
    travelDate: '',
    specialRequests: '',
  });

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const { data } = await api.get(`/tours/${id}`);
        setTour(data);
      } catch {
        setError('ট্যুর প্যাকেজটি খুঁজে পাওয়া যায়নি।');
      } finally {
        setLoadingTour(false);
      }
    };
    fetchTour();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === 'numberOfPeople' ? Number(value) : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.fullName || !form.email || !form.phone || !form.travelDate) {
      setError('অনুগ্রহ করে সব প্রয়োজনীয় ঘর পূরণ করুন');
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await api.post('/bookings', { tourId: id, ...form });

      // বুকিং তৈরি হয়ে গেছে — এবার SSLCommerz payment gateway তে পাঠাই
      const paymentRes = await api.post(`/payments/init/${data._id}`);
      if (paymentRes.data.url) {
        window.location.href = paymentRes.data.url; // SSLCommerz এর hosted page এ redirect
      } else {
        setError('পেমেন্ট গেটওয়ে চালু করা যায়নি।');
        setSubmitting(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'বুকিং ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
      setSubmitting(false);
    }
  };

  if (loadingTour) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-jungle">
        <Loader2 className="animate-spin" size={28} />
      </div>
    );
  }

  if (error && !tour) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="font-display text-2xl text-jungle">{error}</h1>
        <Link to="/tours" className="mt-4 inline-block text-sunset hover:underline">
          সব ট্যুর প্যাকেজে ফিরে যান
        </Link>
      </div>
    );
  }


  const totalPrice = tour.price * form.numberOfPeople;

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-sunset">বুকিং নিশ্চিত করুন</span>
      <h1 className="mt-2 font-display text-3xl text-jungle">{tour.title}</h1>
      <p className="mt-1 text-sm text-ink/50">{tour.location} · {tour.duration}</p>

      <div className="mt-10 grid gap-10 md:grid-cols-3">
        <form onSubmit={handleSubmit} className="space-y-4 md:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink/70">পূর্ণ নাম</label>
              <div className="flex items-center gap-2 rounded-xl border border-sand-dark bg-cream px-4 py-3 focus-within:border-sunset">
                <User size={16} className="text-ink/40" />
                <input name="fullName" value={form.fullName} onChange={handleChange} className="w-full bg-transparent text-sm focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink/70">ইমেইল</label>
              <div className="flex items-center gap-2 rounded-xl border border-sand-dark bg-cream px-4 py-3 focus-within:border-sunset">
                <Mail size={16} className="text-ink/40" />
                <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full bg-transparent text-sm focus:outline-none" />
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink/70">ফোন নম্বর</label>
              <div className="flex items-center gap-2 rounded-xl border border-sand-dark bg-cream px-4 py-3 focus-within:border-sunset">
                <Phone size={16} className="text-ink/40" />
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="01XXXXXXXXX" className="w-full bg-transparent text-sm focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink/70">যাত্রীর সংখ্যা</label>
              <div className="flex items-center gap-2 rounded-xl border border-sand-dark bg-cream px-4 py-3 focus-within:border-sunset">
                <Users size={16} className="text-ink/40" />
                <input type="number" min="1" max={tour.maxGroupSize} name="numberOfPeople" value={form.numberOfPeople} onChange={handleChange} className="w-full bg-transparent text-sm focus:outline-none" />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink/70">ভ্রমণের তারিখ</label>
            <div className="flex items-center gap-2 rounded-xl border border-sand-dark bg-cream px-4 py-3 focus-within:border-sunset">
              <Calendar size={16} className="text-ink/40" />
              <input type="date" name="travelDate" value={form.travelDate} onChange={handleChange} min={new Date().toISOString().split('T')[0]} className="w-full bg-transparent text-sm focus:outline-none" />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink/70">বিশেষ অনুরোধ (ঐচ্ছিক)</label>
            <div className="flex items-start gap-2 rounded-xl border border-sand-dark bg-cream px-4 py-3 focus-within:border-sunset">
              <MessageSquare size={16} className="mt-0.5 text-ink/40" />
              <textarea name="specialRequests" value={form.specialRequests} onChange={handleChange} rows={3} placeholder="যেমন: নিরামিষ খাবার প্রয়োজন..." className="w-full resize-none bg-transparent text-sm focus:outline-none" />
            </div>
          </div>

          {error && <p className="text-sm text-sunset-dark">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-sunset py-3.5 font-semibold text-cream transition-colors hover:bg-sunset-dark disabled:opacity-60 sm:w-auto sm:px-10"
          >
            {submitting ? <Loader2 size={18} className="animate-spin" /> : 'বুকিং নিশ্চিত করুন'}
          </button>
        </form>

        {/* Price summary */}
        <aside className="h-fit rounded-2xl border border-sand bg-sand/40 p-6">
          <h3 className="font-display text-lg text-jungle">মূল্য বিবরণ</h3>
          <div className="mt-4 flex items-center justify-between text-sm text-ink/60">
            <span>প্রতি জন</span>
            <span className="font-mono">৳{tour.price.toLocaleString('bn-BD')}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm text-ink/60">
            <span>যাত্রী সংখ্যা</span>
            <span className="font-mono">× {form.numberOfPeople}</span>
          </div>
          <hr className="my-4 border-sand-dark" />
          <div className="flex items-center justify-between font-semibold text-jungle">
            <span>সর্বমোট</span>
            <span className="font-mono text-xl text-sunset">৳{totalPrice.toLocaleString('bn-BD')}</span>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BookingForm;