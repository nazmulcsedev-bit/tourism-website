import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Search, ShieldCheck, Wallet, Users, ArrowRight, Loader2 } from 'lucide-react';
import WaveDivider from '../components/WaveDivider';
import TourCard from '../components/TourCard';
import Testimonials from '../components/Testimonials';
import api from '../api/axios';

const stats = [
  { label: 'সন্তুষ্ট ভ্রমণকারী', value: '১২,০০০+' },
  { label: 'ট্যুর প্যাকেজ', value: '১৫০+' },
  { label: 'গন্তব্য', value: '৪৫+' },
  { label: 'বছরের অভিজ্ঞতা', value: '৮+' },
];

const features = [
  {
    icon: ShieldCheck,
    title: 'নিরাপদ ভ্রমণ',
    desc: 'প্রতিটি ট্যুর যাচাই করা গাইড ও নিরাপত্তা ব্যবস্থার সাথে পরিচালিত হয়।',
  },
  {
    icon: Wallet,
    title: 'স্বচ্ছ মূল্য',
    desc: 'কোনো লুকানো খরচ নেই — বুকিংয়ের আগেই সব কিছু স্পষ্ট।',
  },
  {
    icon: Users,
    title: 'অভিজ্ঞ গাইড',
    desc: 'স্থানীয় ইতিহাস ও সংস্কৃতি জানা প্রশিক্ষিত গাইড আপনার সাথে থাকবে।',
  },
];

const Home = () => {
  const [featuredTours, setFeaturedTours] = useState([]);
  const [loadingTours, setLoadingTours] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await api.get('/tours', { params: { featured: true, limit: 3 } });
        // যদি featured tour না থাকে, সাধারণ সাম্প্রতিক ট্যুর দেখাও
        if (data.tours.length === 0) {
          const fallback = await api.get('/tours', { params: { limit: 3 } });
          setFeaturedTours(fallback.data.tours);
        } else {
          setFeaturedTours(data.tours);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingTours(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div>
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden bg-jungle">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-jungle via-jungle/70 to-jungle/30" aria-hidden="true" />

        <div className="relative mx-auto max-w-5xl px-6 py-28 text-center md:py-40">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-sunset">
            বাংলাদেশ ভ্রমণ গাইড
          </span>
          <h1 className="mt-5 font-display text-4xl leading-tight text-cream md:text-6xl">
            পাহাড়, নদী আর সমুদ্রের
            <br />
            <span className="italic text-sunset">প্রতিটি গল্প</span> আবিষ্কার করুন
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-cream/70 md:text-lg">
            সাজেক থেকে সেন্ট মার্টিন — বাংলাদেশের সেরা গন্তব্যগুলোতে পরিকল্পিত ও নিরাপদ ট্যুর প্যাকেজ নিয়ে আমরা আছি আপনার পাশে।
          </p>

          {/* Search bar */}
          <div className="mx-auto mt-10 flex max-w-xl items-center gap-2 rounded-full bg-cream p-2 shadow-xl">
            <MapPin size={18} className="ml-3 shrink-0 text-jungle/50" />
            <input
              type="text"
              placeholder="কোথায় যেতে চান? যেমন: কক্সবাজার, সিলেট..."
              className="w-full bg-transparent py-2 text-sm text-ink placeholder:text-ink/40 focus:outline-none"
            />
            <Link
              to="/tours"
              className="flex shrink-0 items-center gap-1.5 rounded-full bg-sunset px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-sunset-dark"
            >
              <Search size={15} /> খুঁজুন
            </Link>
          </div>
        </div>

        <WaveDivider color="#FAF7F1" />
      </section>

      {/* ---------- Stats ---------- */}
      <section className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-14 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="font-display text-3xl text-jungle md:text-4xl">{s.value}</div>
            <div className="mt-1 text-xs uppercase tracking-wide text-ink/50">{s.label}</div>
          </div>
        ))}
      </section>

      {/* ---------- Featured tours ---------- */}
      <section className="bg-sand/50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-sunset">
                জনপ্রিয় গন্তব্য
              </span>
              <h2 className="mt-2 font-display text-3xl text-jungle md:text-4xl">
                আমাদের সেরা ট্যুর প্যাকেজ
              </h2>
            </div>
            <Link
              to="/tours"
              className="flex items-center gap-1.5 text-sm font-semibold text-jungle hover:text-sunset"
            >
              সব প্যাকেজ দেখুন <ArrowRight size={16} />
            </Link>
          </div>

          {loadingTours ? (
            <div className="mt-10 flex justify-center py-10 text-jungle">
              <Loader2 className="animate-spin" size={26} />
            </div>
          ) : featuredTours.length === 0 ? (
            <p className="mt-10 text-center text-ink/50">
              এখনো কোনো ট্যুর প্যাকেজ যোগ করা হয়নি। Admin panel থেকে যোগ করুন।
            </p>
          ) : (
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {featuredTours.map((tour) => (
                <TourCard key={tour._id} tour={tour} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ---------- Why choose us ---------- */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-sunset">কেন আমরা</span>
          <h2 className="mt-2 font-display text-3xl text-jungle md:text-4xl">
            আপনার বিশ্বাসের প্রতিদান
          </h2>
        </div>
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-jungle/10 text-jungle">
                <Icon size={24} strokeWidth={1.75} />
              </div>
              <h3 className="mt-4 font-display text-xl text-jungle">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/60">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Testimonials />

      {/* ---------- CTA ---------- */}
      <section className="relative overflow-hidden bg-jungle py-20 text-center">
        <div className="relative mx-auto max-w-2xl px-6">
          <h2 className="font-display text-3xl text-cream md:text-4xl">
            পরবর্তী ভ্রমণের পরিকল্পনা শুরু করুন আজই
          </h2>
          <p className="mt-4 text-cream/70">
            হাজারো ভ্রমণপ্রেমীর সাথে যুক্ত হয়ে আবিষ্কার করুন বাংলাদেশের অচেনা সৌন্দর্য।
          </p>
          <Link
            to="/tours"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-sunset px-8 py-3.5 font-semibold text-cream transition-colors hover:bg-sunset-dark"
          >
            ট্যুর প্যাকেজ দেখুন <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;