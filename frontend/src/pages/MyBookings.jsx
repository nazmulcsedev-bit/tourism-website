import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, MapPin, Calendar, Users, XCircle, CreditCard } from 'lucide-react';
import api from '../api/axios';

const statusStyles = {
  pending: 'bg-sand text-ink/70',
  confirmed: 'bg-jungle/10 text-jungle',
  cancelled: 'bg-sunset/10 text-sunset-dark',
  completed: 'bg-jungle text-cream',
};

const statusLabels = {
  pending: 'অপেক্ষমাণ',
  confirmed: 'নিশ্চিত হয়েছে',
  cancelled: 'বাতিল হয়েছে',
  completed: 'সম্পন্ন হয়েছে',
};

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);
  const [payingId, setPayingId] = useState(null);

  const handlePay = async (bookingId) => {
    setPayingId(bookingId);
    try {
      const { data } = await api.post(`/payments/init/${bookingId}`);
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      alert('পেমেন্ট গেটওয়ে চালু করা যায়নি। আবার চেষ্টা করুন।');
      setPayingId(null);
    }
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/bookings/my-bookings');
      setBookings(data);
    } catch {
      setError('বুকিং লোড করা যায়নি।');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('আপনি কি নিশ্চিত এই বুকিং বাতিল করতে চান?')) return;
    setCancellingId(bookingId);
    try {
      await api.put(`/bookings/${bookingId}/cancel`);
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: 'cancelled' } : b))
      );
    } catch {
      alert('বাতিল করা যায়নি। আবার চেষ্টা করুন।');
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-jungle">
        <Loader2 className="animate-spin" size={28} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-sunset">আমার একাউন্ট</span>
      <h1 className="mt-2 font-display text-3xl text-jungle">আমার বুকিংসমূহ</h1>

      {error && <p className="mt-6 text-sunset-dark">{error}</p>}

      {!error && bookings.length === 0 ? (
        <div className="mt-14 text-center">
          <p className="text-ink/50">আপনার এখনো কোনো বুকিং নেই।</p>
          <Link to="/tours" className="mt-4 inline-block rounded-full bg-sunset px-6 py-3 text-sm font-semibold text-cream hover:bg-sunset-dark">
            ট্যুর প্যাকেজ দেখুন
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-5">
          {bookings.map((b) => (
            <div key={b._id} className="flex flex-col gap-4 rounded-2xl border border-sand bg-cream p-5 sm:flex-row">
              <div className="h-32 w-full shrink-0 overflow-hidden rounded-xl bg-sand sm:w-44">
                <img
                  src={b.tour?.images?.[0] || 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400&q=80'}
                  alt={b.tour?.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display text-lg text-jungle">{b.tour?.title || 'ট্যুর'}</h3>
                    <span className="flex items-center gap-1 text-xs text-ink/50">
                      <MapPin size={12} /> {b.tour?.location}
                    </span>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[b.status]}`}>
                    {statusLabels[b.status]}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-4 text-sm text-ink/60">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} /> {new Date(b.travelDate).toLocaleDateString('bn-BD')}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users size={14} /> {b.numberOfPeople} জন
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="font-mono text-lg text-sunset">
                    ৳{b.totalPrice?.toLocaleString('bn-BD')}
                    {b.paymentStatus === 'paid' && (
                      <span className="ml-2 rounded-full bg-jungle/10 px-2 py-0.5 text-xs font-sans text-jungle">পরিশোধিত</span>
                    )}
                  </span>
                  <div className="flex items-center gap-4">
                    {b.paymentStatus !== 'paid' && b.status !== 'cancelled' && (
                      <button
                        onClick={() => handlePay(b._id)}
                        disabled={payingId === b._id}
                        className="flex items-center gap-1.5 rounded-full bg-sunset px-4 py-1.5 text-xs font-semibold text-cream hover:bg-sunset-dark disabled:opacity-50"
                      >
                        <CreditCard size={13} />
                        {payingId === b._id ? 'অপেক্ষা করুন...' : 'এখনই পে করুন'}
                      </button>
                    )}
                    {(b.status === 'pending' || b.status === 'confirmed') && (
                      <button
                        onClick={() => handleCancel(b._id)}
                        disabled={cancellingId === b._id}
                        className="flex items-center gap-1.5 text-sm font-medium text-sunset-dark hover:underline disabled:opacity-50"
                      >
                        <XCircle size={15} />
                        {cancellingId === b._id ? 'বাতিল হচ্ছে...' : 'বাতিল'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;