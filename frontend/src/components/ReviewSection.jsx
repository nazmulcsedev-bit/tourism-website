import { useEffect, useState } from 'react';
import { Star, Loader2, Trash2, MessageSquareOff } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const StarInput = ({ value, onChange }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((n) => (
      <button
        key={n}
        type="button"
        onClick={() => onChange(n)}
        className="transition-transform hover:scale-110"
        aria-label={`${n} star`}
      >
        <Star size={22} className={n <= value ? 'fill-sunset text-sunset' : 'text-sand-dark'} />
      </button>
    ))}
  </div>
);

const ReviewSection = ({ tourId }) => {
  const { userInfo } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eligibility, setEligibility] = useState({ canReview: false, alreadyReviewed: false });
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const fetchReviews = async () => {
    try {
      const { data } = await api.get(`/reviews/tour/${tourId}`);
      setReviews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEligibility = async () => {
    if (!userInfo) return;
    try {
      const { data } = await api.get(`/reviews/eligibility/${tourId}`);
      setEligibility(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReviews();
    fetchEligibility();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tourId, userInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!comment.trim()) {
      setError('অনুগ্রহ করে একটা মন্তব্য লিখুন');
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await api.post('/reviews', { tourId, rating, comment });
      setReviews([data, ...reviews]);
      setEligibility({ canReview: false, alreadyReviewed: true });
      setComment('');
      setRating(5);
    } catch (err) {
      setError(err.response?.data?.message || 'Review জমা দেওয়া যায়নি।');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('এই review মুছে ফেলতে চান?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/reviews/${id}`);
      setReviews(reviews.filter((r) => r._id !== id));
      if (userInfo) fetchEligibility();
    } catch {
      alert('মুছে ফেলা যায়নি।');
    } finally {
      setDeletingId(null);
    }
  };

  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null;

  return (
    <div>
      <div className="flex items-center gap-3">
        <h2 className="font-display text-2xl text-jungle">রিভিউ</h2>
        {avgRating && (
          <span className="flex items-center gap-1 rounded-full bg-sand/60 px-3 py-1 text-sm font-mono text-jungle-dark">
            <Star size={14} className="fill-sunset text-sunset" /> {avgRating} ({reviews.length})
          </span>
        )}
      </div>

      {/* Review form */}
      {userInfo && eligibility.canReview && (
        <form onSubmit={handleSubmit} className="mt-5 rounded-2xl border border-sand bg-sand/30 p-5">
          <label className="mb-2 block text-sm font-medium text-ink/70">আপনার রেটিং</label>
          <StarInput value={rating} onChange={setRating} />
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="আপনার অভিজ্ঞতা শেয়ার করুন..."
            rows={3}
            className="mt-4 w-full resize-none rounded-xl border border-sand-dark bg-cream px-4 py-3 text-sm focus:border-sunset focus:outline-none"
          />
          {error && <p className="mt-2 text-sm text-sunset-dark">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="mt-3 flex items-center gap-2 rounded-full bg-sunset px-6 py-2.5 text-sm font-semibold text-cream hover:bg-sunset-dark disabled:opacity-60"
          >
            {submitting ? <Loader2 size={16} className="animate-spin" /> : 'রিভিউ জমা দিন'}
          </button>
        </form>
      )}

      {userInfo && eligibility.alreadyReviewed && (
        <p className="mt-4 text-sm text-ink/50">আপনি ইতিমধ্যে এই ট্যুরের জন্য রিভিউ দিয়েছেন। ধন্যবাদ! 🙏</p>
      )}

      {userInfo && !eligibility.canReview && !eligibility.alreadyReviewed && (
        <p className="mt-4 flex items-center gap-2 text-sm text-ink/40">
          <MessageSquareOff size={15} /> রিভিউ দিতে হলে আগে এই ট্যুর বুক করে নিশ্চিত হতে হবে।
        </p>
      )}

      {/* Review list */}
      <div className="mt-6 space-y-4">
        {loading ? (
          <div className="flex justify-center py-6 text-jungle"><Loader2 className="animate-spin" size={22} /></div>
        ) : reviews.length === 0 ? (
          <p className="py-4 text-sm text-ink/40">এখনো কোনো রিভিউ নেই। প্রথম রিভিউ দিন!</p>
        ) : (
          reviews.map((r) => (
            <div key={r._id} className="rounded-xl border border-sand bg-cream p-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-semibold text-jungle">{r.user?.name || 'ব্যবহারকারী'}</span>
                  <div className="mt-1 flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star key={n} size={13} className={n <= r.rating ? 'fill-sunset text-sunset' : 'text-sand-dark'} />
                    ))}
                  </div>
                </div>
                {userInfo && (userInfo._id === r.user?._id || userInfo.role === 'admin') && (
                  <button
                    onClick={() => handleDelete(r._id)}
                    disabled={deletingId === r._id}
                    className="text-ink/30 hover:text-sunset disabled:opacity-50"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">{r.comment}</p>
              <span className="mt-2 block text-xs text-ink/30">
                {new Date(r.createdAt).toLocaleDateString('bn-BD')}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewSection;