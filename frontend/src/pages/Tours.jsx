import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Loader2 } from 'lucide-react';
import api from '../api/axios';
import TourCard from '../components/TourCard';

const categories = ['সব', 'Beach', 'Mountain', 'Historical', 'Adventure', 'City', 'Village'];

const Tours = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tours, setTours] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'সব');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  useEffect(() => {
    const fetchTours = async () => {
      setLoading(true);
      setError('');
      try {
        const params = { page, limit: 9 };
        if (search) params.search = search;
        if (category && category !== 'সব') params.category = category;

        const { data } = await api.get('/tours', { params });
        setTours(data.tours);
        setTotal(data.total);
        setPages(data.pages);
      } catch (err) {
        setError('ট্যুর প্যাকেজ লোড করা যায়নি। কিছুক্ষণ পর আবার চেষ্টা করুন।');
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
    setSearchParams({ search, category, page });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, category]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setSearchParams({ search, category, page: 1 });
    // trigger fetch manually since search isn't in dependency array
    const fetchTours = async () => {
      setLoading(true);
      try {
        const params = { page: 1, limit: 9 };
        if (search) params.search = search;
        if (category && category !== 'সব') params.category = category;
        const { data } = await api.get('/tours', { params });
        setTours(data.tours);
        setTotal(data.total);
        setPages(data.pages);
      } catch {
        setError('ট্যুর প্যাকেজ লোড করা যায়নি।');
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      {/* Header */}
      <div className="text-center">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-sunset">
          সব গন্তব্য
        </span>
        <h1 className="mt-2 font-display text-4xl text-jungle">ট্যুর প্যাকেজ খুঁজুন</h1>
        <p className="mt-2 text-ink/60">{total} টি প্যাকেজ পাওয়া গেছে আপনার জন্য</p>
      </div>

      {/* Search + filters */}
      <div className="mt-10 space-y-5">
        <form onSubmit={handleSearchSubmit} className="mx-auto flex max-w-xl items-center gap-2 rounded-full bg-sand/60 p-2">
          <Search size={18} className="ml-3 shrink-0 text-jungle/50" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="জায়গা বা প্যাকেজের নাম লিখুন..."
            className="w-full bg-transparent py-2 text-sm text-ink placeholder:text-ink/40 focus:outline-none"
          />
          <button
            type="submit"
            className="shrink-0 rounded-full bg-jungle px-5 py-2.5 text-sm font-semibold text-cream hover:bg-jungle-light"
          >
            খুঁজুন
          </button>
        </form>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <SlidersHorizontal size={15} className="text-ink/40" />
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => {
                setCategory(c);
                setPage(1);
              }}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                category === c
                  ? 'bg-sunset text-cream'
                  : 'bg-sand/60 text-ink/60 hover:bg-sand'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="mt-12">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-jungle">
            <Loader2 className="animate-spin" size={28} />
          </div>
        ) : error ? (
          <p className="py-20 text-center text-sunset-dark">{error}</p>
        ) : tours.length === 0 ? (
          <p className="py-20 text-center text-ink/50">
            কোনো ট্যুর প্যাকেজ পাওয়া যায়নি। ভিন্ন কিছু খুঁজে দেখুন।
          </p>
        ) : (
          <div className="grid gap-8 md:grid-cols-3">
            {tours.map((tour) => (
              <TourCard key={tour._id} tour={tour} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="mt-12 flex justify-center gap-2">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`h-9 w-9 rounded-full text-sm font-medium ${
                page === p ? 'bg-jungle text-cream' : 'bg-sand/60 text-ink/60 hover:bg-sand'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tours;