import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId');

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 text-center">
      <CheckCircle2 size={56} className="text-jungle" strokeWidth={1.5} />
      <h1 className="mt-4 font-display text-3xl text-jungle">পেমেন্ট সফল হয়েছে! 🎉</h1>
      <p className="mt-2 text-ink/60">
        আপনার বুকিং নিশ্চিত হয়ে গেছে। একটা confirmation email পাঠানো হয়েছে আপনার ইমেইলে।
      </p>
      {bookingId && <p className="mt-2 font-mono text-xs text-ink/40">Booking ID: {bookingId}</p>}
      <div className="mt-8 flex gap-3">
        <Link to="/my-bookings" className="rounded-full bg-jungle px-6 py-3 text-sm font-semibold text-cream hover:bg-jungle-light">
          আমার বুকিং দেখুন
        </Link>
        <Link to="/tours" className="rounded-full bg-sand px-6 py-3 text-sm font-semibold text-ink hover:bg-sand-dark">
          আরও ট্যুর দেখুন
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;