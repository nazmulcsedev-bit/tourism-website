import { Link } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';

const TourCard = ({ tour }) => {
  const image = tour.images && tour.images.length > 0
    ? tour.images[0]
    : 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80';

  return (
    <Link
      to={`/tours/${tour._id}`}
      className="group overflow-hidden rounded-2xl bg-cream shadow-sm transition-shadow hover:shadow-lg"
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={image}
          alt={tour.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-cream/95 px-3 py-1 font-mono text-xs text-jungle">
          {tour.duration}
        </span>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs text-ink/50">
            <MapPin size={12} /> {tour.location}
          </span>
          <span className="flex items-center gap-1 font-mono text-xs text-jungle-dark/70">
            <Star size={13} className="fill-sunset text-sunset" />
            {tour.ratingsAverage?.toFixed(1) || 'নতুন'}
          </span>
        </div>
        <h3 className="mt-2 font-display text-xl text-jungle line-clamp-1">{tour.title}</h3>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-mono text-lg text-sunset">
            ৳{tour.price?.toLocaleString('bn-BD')}
            <span className="text-xs text-ink/40"> /জনপ্রতি</span>
          </span>
          <span className="text-sm font-semibold text-jungle group-hover:text-sunset">
            বিস্তারিত →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default TourCard;