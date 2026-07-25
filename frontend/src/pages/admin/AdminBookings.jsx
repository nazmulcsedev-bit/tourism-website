import { useEffect, useState } from 'react';
import { Loader2, MapPin, Calendar, Users, Phone, Mail } from 'lucide-react';
import api from '../../api/axios';

const statusOptions = ['pending', 'confirmed', 'cancelled', 'completed'];
const statusLabels = {
  pending: 'অপেক্ষমাণ',
  confirmed: 'নিশ্চিত হয়েছে',
  cancelled: 'বাতিল হয়েছে',
  completed: 'সম্পন্ন হয়েছে',
};
const paymentOptions = ['unpaid', 'paid', 'refunded'];
const paymentLabels = { unpaid: 'অপরিশোধিত', paid: 'পরিশোধিত', refunded: 'ফেরত' };

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = { limit: 100 };
      if (filter) params.status = filter;
      const { data } = await api.get('/bookings', { params });
      setBookings(data.bookings);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handleUpdate = async (id, field, value) => {
    setUpdatingId(id);
    try {
      await api.put(`/bookings/${id}`, { [field]: value });
      setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, [field]: value } : b)));
    } catch {
      alert('আপডেট করা যায়নি।');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-jungle">বুকিং সমূহ</h1>
          <p className="mt-1 text-sm text-ink/50">{bookings.length} টি বুকিং</p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-full border border-sand-dark bg-cream px-4 py-2 text-sm focus:border-sunset focus:outline-none"
        >
          <option value="">সব স্ট্যাটাস</option>
          {statusOptions.map((s) => <option key={s} value={s}>{statusLabels[s]}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex min-h-[30vh] items-center justify-center text-jungle">
          <Loader2 className="animate-spin" size={28} />
        </div>
      ) : bookings.length === 0 ? (
        <p className="mt-10 text-center text-ink/40">কোনো বুকিং পাওয়া যায়নি।</p>
      ) : (
        <div className="mt-6 space-y-4">
          {bookings.map((b) => (
            <div key={b._id} className="rounded-2xl border border-sand bg-cream p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg text-jungle">{b.fullName}</h3>
                  <span className="flex items-center gap-1 text-xs text-ink/50">
                    <MapPin size={12} /> {b.tour?.title} — {b.tour?.location}
                  </span>
                </div>
                <span className="font-mono text-lg text-sunset">৳{b.totalPrice.toLocaleString('bn-BD')}</span>
              </div>

              <div className="mt-3 flex flex-wrap gap-4 text-sm text-ink/60">
                <span className="flex items-center gap-1.5"><Mail size={13} /> {b.email}</span>
                <span className="flex items-center gap-1.5"><Phone size={13} /> {b.phone}</span>
                <span className="flex items-center gap-1.5"><Calendar size={13} /> {new Date(b.travelDate).toLocaleDateString('bn-BD')}</span>
                <span className="flex items-center gap-1.5"><Users size={13} /> {b.numberOfPeople} জন</span>
              </div>

              {b.specialRequests && (
                <p className="mt-2 rounded-lg bg-sand/40 px-3 py-2 text-sm text-ink/60">{b.specialRequests}</p>
              )}

              <div className="mt-4 flex flex-wrap gap-3">
                <select
                  value={b.status}
                  disabled={updatingId === b._id}
                  onChange={(e) => handleUpdate(b._id, 'status', e.target.value)}
                  className="rounded-full border border-sand-dark bg-cream px-4 py-1.5 text-xs font-medium focus:border-sunset focus:outline-none disabled:opacity-50"
                >
                  {statusOptions.map((s) => <option key={s} value={s}>{statusLabels[s]}</option>)}
                </select>

                <select
                  value={b.paymentStatus}
                  disabled={updatingId === b._id}
                  onChange={(e) => handleUpdate(b._id, 'paymentStatus', e.target.value)}
                  className="rounded-full border border-sand-dark bg-cream px-4 py-1.5 text-xs font-medium focus:border-sunset focus:outline-none disabled:opacity-50"
                >
                  {paymentOptions.map((p) => <option key={p} value={p}>{paymentLabels[p]}</option>)}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminBookings;