import { useEffect, useState } from 'react';
import { Loader2, Mail, Phone } from 'lucide-react';
import api from '../../api/axios';

const statusLabels = { new: 'নতুন', responded: 'উত্তর দেওয়া হয়েছে', closed: 'বন্ধ' };
const statusStyles = {
  new: 'bg-sunset/10 text-sunset-dark',
  responded: 'bg-jungle/10 text-jungle',
  closed: 'bg-sand text-ink/50',
};

const AdminInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/inquiries');
      setInquiries(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    try {
      await api.put(`/inquiries/${id}`, { status });
      setInquiries((prev) => prev.map((i) => (i._id === id ? { ...i, status } : i)));
    } catch {
      alert('আপডেট করা যায়নি।');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl text-jungle">যোগাযোগ বার্তা</h1>
      <p className="mt-1 text-sm text-ink/50">{inquiries.length} টি বার্তা এসেছে</p>

      {loading ? (
        <div className="flex min-h-[30vh] items-center justify-center text-jungle">
          <Loader2 className="animate-spin" size={28} />
        </div>
      ) : inquiries.length === 0 ? (
        <p className="mt-10 text-center text-ink/40">এখনো কোনো বার্তা আসেনি।</p>
      ) : (
        <div className="mt-6 space-y-4">
          {inquiries.map((inq) => (
            <div key={inq._id} className="rounded-2xl border border-sand bg-cream p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg text-jungle">{inq.name}</h3>
                  <span className="text-xs text-ink/50">{inq.subject}</span>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[inq.status]}`}>
                  {statusLabels[inq.status]}
                </span>
              </div>

              <div className="mt-2 flex flex-wrap gap-4 text-sm text-ink/60">
                <span className="flex items-center gap-1.5"><Mail size={13} /> {inq.email}</span>
                {inq.phone && <span className="flex items-center gap-1.5"><Phone size={13} /> {inq.phone}</span>}
              </div>

              <p className="mt-3 rounded-lg bg-sand/40 px-3 py-2 text-sm text-ink/70">{inq.message}</p>

              <select
                value={inq.status}
                disabled={updatingId === inq._id}
                onChange={(e) => handleStatusChange(inq._id, e.target.value)}
                className="mt-3 rounded-full border border-sand-dark bg-cream px-4 py-1.5 text-xs font-medium focus:border-sunset focus:outline-none disabled:opacity-50"
              >
                <option value="new">নতুন</option>
                <option value="responded">উত্তর দেওয়া হয়েছে</option>
                <option value="closed">বন্ধ</option>
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminInquiries;