import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import api from '../../api/axios';

const AdminTours = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchTours = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/tours', { params: { limit: 100 } });
      setTours(data.tours);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('এই ট্যুর প্যাকেজটি মুছে ফেলতে চান?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/tours/${id}`);
      setTours((prev) => prev.filter((t) => t._id !== id));
    } catch {
      alert('মুছে ফেলা যায়নি।');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-jungle">ট্যুর প্যাকেজ</h1>
          <p className="mt-1 text-sm text-ink/50">{tours.length} টি প্যাকেজ আছে</p>
        </div>
        <Link
          to="/admin/tours/new"
          className="flex items-center gap-1.5 rounded-full bg-sunset px-5 py-2.5 text-sm font-semibold text-cream hover:bg-sunset-dark"
        >
          <Plus size={16} /> নতুন প্যাকেজ
        </Link>
      </div>

      {loading ? (
        <div className="flex min-h-[30vh] items-center justify-center text-jungle">
          <Loader2 className="animate-spin" size={28} />
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-sand">
          <table className="w-full text-sm">
            <thead className="bg-sand/50 text-left text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-4 py-3">প্যাকেজ</th>
                <th className="px-4 py-3">স্থান</th>
                <th className="px-4 py-3">মূল্য</th>
                <th className="px-4 py-3">ক্যাটেগরি</th>
                <th className="px-4 py-3 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {tours.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-ink/40">
                    কোনো ট্যুর প্যাকেজ নেই। "নতুন প্যাকেজ" দিয়ে একটা যোগ করুন।
                  </td>
                </tr>
              ) : (
                tours.map((tour) => (
                  <tr key={tour._id} className="border-t border-sand">
                    <td className="px-4 py-3 font-medium text-jungle">{tour.title}</td>
                    <td className="px-4 py-3 text-ink/60">{tour.location}</td>
                    <td className="px-4 py-3 font-mono text-sunset">৳{tour.price.toLocaleString('bn-BD')}</td>
                    <td className="px-4 py-3 text-ink/60">{tour.category}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/admin/tours/${tour._id}/edit`}
                          className="rounded-lg border border-sand-dark p-2 text-jungle hover:bg-sand/50"
                        >
                          <Pencil size={15} />
                        </Link>
                        <button
                          onClick={() => handleDelete(tour._id)}
                          disabled={deletingId === tour._id}
                          className="rounded-lg border border-sand-dark p-2 text-sunset-dark hover:bg-sand/50 disabled:opacity-50"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminTours;