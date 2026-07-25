import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPinned, ClipboardList, Wallet, Loader2 } from 'lucide-react';
import api from '../../api/axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ tourCount: 0, bookingCount: 0, pendingCount: 0, revenue: 0 });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [toursRes, bookingsRes] = await Promise.all([
          api.get('/tours', { params: { limit: 1 } }),
          api.get('/bookings', { params: { limit: 5 } }),
        ]);

        const allBookings = await api.get('/bookings', { params: { limit: 1000 } });
        const pending = allBookings.data.bookings.filter((b) => b.status === 'pending').length;
        const revenue = allBookings.data.bookings
          .filter((b) => b.paymentStatus === 'paid')
          .reduce((sum, b) => sum + b.totalPrice, 0);

        setStats({
          tourCount: toursRes.data.total,
          bookingCount: bookingsRes.data.total,
          pendingCount: pending,
          revenue,
        });
        setRecentBookings(bookingsRes.data.bookings);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: 'মোট ট্যুর প্যাকেজ', value: stats.tourCount, icon: MapPinned },
    { label: 'মোট বুকিং', value: stats.bookingCount, icon: ClipboardList },
    { label: 'অপেক্ষমাণ বুকিং', value: stats.pendingCount, icon: ClipboardList },
    { label: 'মোট আয়', value: `৳${stats.revenue.toLocaleString('bn-BD')}`, icon: Wallet },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-jungle">
        <Loader2 className="animate-spin" size={28} />
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-jungle">ওভারভিউ</h1>
      <p className="mt-1 text-sm text-ink/50">আপনার ব্যবসার সংক্ষিপ্ত চিত্র</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-2xl border border-sand bg-cream p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-jungle/10 text-jungle">
              <Icon size={18} />
            </div>
            <div className="mt-3 font-mono text-2xl text-jungle">{value}</div>
            <div className="mt-1 text-xs text-ink/50">{label}</div>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl text-jungle">সাম্প্রতিক বুকিং</h2>
          <Link to="/admin/bookings" className="text-sm font-semibold text-sunset hover:underline">
            সব দেখুন →
          </Link>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-sand">
          <table className="w-full text-sm">
            <thead className="bg-sand/50 text-left text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-4 py-3">নাম</th>
                <th className="px-4 py-3">ট্যুর</th>
                <th className="px-4 py-3">মূল্য</th>
                <th className="px-4 py-3">স্ট্যাটাস</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-ink/40">
                    এখনো কোনো বুকিং নেই
                  </td>
                </tr>
              ) : (
                recentBookings.map((b) => (
                  <tr key={b._id} className="border-t border-sand">
                    <td className="px-4 py-3">{b.fullName}</td>
                    <td className="px-4 py-3 text-ink/60">{b.tour?.title || '—'}</td>
                    <td className="px-4 py-3 font-mono text-sunset">৳{b.totalPrice.toLocaleString('bn-BD')}</td>
                    <td className="px-4 py-3 text-ink/60">{b.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;