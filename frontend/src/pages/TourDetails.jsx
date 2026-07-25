import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Star, Users, Clock, Check, X, Loader2 } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ReviewSection from '../components/ReviewSection';

const TourDetails = () => {
  const { id } = useParams();
  const { userInfo } = useAuth();
  const [tour, setTour] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTour = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get(`/tours/${id}`);
        setTour(data);
      } catch {
        setError('এই ট্যুর প্যাকেজটি খুঁজে পাওয়া যায়নি।');
      } finally {
        setLoading(false);
      }
    };
    fetchTour();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-jungle">
        <Loader2 className="animate-spin" size={28} />
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="font-display text-2xl text-jungle">{error}</h1>
        <Link to="/tours" className="mt-4 inline-block text-sunset hover:underline">
          সব ট্যুর প্যাকেজে ফিরে যান
        </Link>
      </div>
    );
  }

  const images = tour.images?.length ? tour.images : ['https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1200&q=80'];

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      {/* Breadcrumb-ish header */}
      <span className="flex items-center gap-1 font-mono text-xs uppercase tracking-wide text-sunset">
        <MapPin size={13} /> {tour.location}
      </span>
      <h1 className="mt-2 font-display text-4xl text-jungle">{tour.title}</h1>
      <div className="mt-3 flex flex-wrap items-center gap-5 text-sm text-ink/60">
        <span className="flex items-center gap-1.5">
          <Star size={15} className="fill-sunset text-sunset" /> {tour.ratingsAverage?.toFixed(1) || 'নতুন'} ({tour.ratingsCount || 0} রিভিউ)
        </span>
        <span className="flex items-center gap-1.5">
          <Clock size={15} /> {tour.duration}
        </span>
        <span className="flex items-center gap-1.5">
          <Users size={15} /> সর্বোচ্চ {tour.maxGroupSize} জন
        </span>
      </div>

      {/* Gallery */}
      <div className="mt-8">
        <div className="h-96 overflow-hidden rounded-2xl bg-sand">
          <img src={images[activeImage]} alt={tour.title} className="h-full w-full object-cover" />
        </div>
        {images.length > 1 && (
          <div className="mt-3 flex gap-3">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`h-20 w-28 shrink-0 overflow-hidden rounded-lg border-2 ${
                  activeImage === i ? 'border-sunset' : 'border-transparent'
                }`}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-12 grid gap-12 md:grid-cols-3">
        {/* Left: details */}
        <div className="space-y-10 md:col-span-2">
          <div>
            <h2 className="font-display text-2xl text-jungle">ট্যুর সম্পর্কে</h2>
            <p className="mt-3 leading-relaxed text-ink/70">{tour.description}</p>
          </div>

          {tour.itinerary?.length > 0 && (
            <div>
              <h2 className="font-display text-2xl text-jungle">দিনভিত্তিক পরিকল্পনা</h2>
              <div className="mt-4 space-y-4">
                {tour.itinerary.map((day) => (
                  <div key={day.day} className="flex gap-4 rounded-xl bg-sand/50 p-4">
                    <span className="shrink-0 font-mono text-sm font-semibold text-sunset">
                      দিন {String(day.day).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="font-semibold text-jungle">{day.title}</h3>
                      <p className="mt-1 text-sm text-ink/60">{day.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(tour.included?.length > 0 || tour.excluded?.length > 0) && (
            <div className="grid gap-8 sm:grid-cols-2">
              {tour.included?.length > 0 && (
                <div>
                  <h3 className="font-display text-lg text-jungle">অন্তর্ভুক্ত</h3>
                  <ul className="mt-3 space-y-2">
                    {tour.included.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-ink/70">
                        <Check size={15} className="shrink-0 text-jungle" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {tour.excluded?.length > 0 && (
                <div>
                  <h3 className="font-display text-lg text-jungle">অন্তর্ভুক্ত নয়</h3>
                  <ul className="mt-3 space-y-2">
                    {tour.excluded.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-ink/70">
                        <X size={15} className="shrink-0 text-sunset" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <ReviewSection tourId={tour._id} />
        </div>

        {/* Right: booking card */}
        <aside className="h-fit rounded-2xl border border-sand bg-cream p-6 shadow-sm md:sticky md:top-24">
          <div className="font-mono text-3xl text-sunset">
            ৳{tour.price?.toLocaleString('bn-BD')}
            <span className="text-sm text-ink/40"> /জনপ্রতি</span>
          </div>
          <Link
            to={userInfo ? `/book/${tour._id}` : '/login'}
            className="mt-5 block w-full rounded-full bg-sunset py-3 text-center font-semibold text-cream transition-colors hover:bg-sunset-dark"
          >
            {userInfo ? 'এখনই বুক করুন' : 'বুক করতে লগইন করুন'}
          </Link>
          <p className="mt-3 text-center text-xs text-ink/40">
            কোনো টাকা এখনই কাটা হবে না — শুধু বুকিং request পাঠানো হবে
          </p>
        </aside>
      </div>
    </div>
  );
};

export default TourDetails;