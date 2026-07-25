import { useEffect, useState } from 'react';
import { Star, Quote, Loader2 } from 'lucide-react';
import api from '../api/axios';

const Testimonials = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await api.get('/reviews/featured');
        setReviews(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  // কোনো review না থাকলে পুরো section লুকিয়ে ফেলা — খালি জায়গা দেখানোর দরকার নেই
  if (!loading && reviews.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="text-center">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-sunset">
          ভ্রমণকারীদের মতামত
        </span>
        <h2 className="mt-2 font-display text-3xl text-jungle md:text-4xl">
          তাদের কথায় আমাদের গল্প
        </h2>
      </div>

      {loading ? (
        <div className="mt-12 flex justify-center text-jungle">
          <Loader2 className="animate-spin" size={26} />
        </div>
      ) : (
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {reviews.slice(0, 3).map((r) => (
            <div key={r._id} className="relative rounded-2xl border border-sand bg-sand/30 p-6">
              <Quote size={28} className="text-sunset/30" />
              <div className="mt-3 flex gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star key={n} size={14} className={n <= r.rating ? 'fill-sunset text-sunset' : 'text-sand-dark'} />
                ))}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink/70 line-clamp-4">{r.comment}</p>
              <div className="mt-4 flex items-center justify-between border-t border-sand-dark/50 pt-4">
                <span className="font-semibold text-jungle">{r.user?.name || 'ভ্রমণকারী'}</span>
                <span className="text-xs text-ink/40">{r.tour?.title}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Testimonials;