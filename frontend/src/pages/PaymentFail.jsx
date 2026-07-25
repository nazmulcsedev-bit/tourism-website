import { Link, useSearchParams } from 'react-router-dom';
import { XCircle } from 'lucide-react';

const PaymentFail = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId');

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 text-center">
      <XCircle size={56} className="text-sunset" strokeWidth={1.5} />
      <h1 className="mt-4 font-display text-3xl text-jungle">পেমেন্ট ব্যর্থ হয়েছে</h1>
      <p className="mt-2 text-ink/60">
        দুঃখিত, আপনার পেমেন্ট সম্পন্ন করা যায়নি। আপনার বুকিং এখনো "অপরিশোধিত" অবস্থায় আছে — আবার চেষ্টা করতে পারেন।
      </p>
      <div className="mt-8 flex gap-3">
        {bookingId ? (
          <Link to="/my-bookings" className="rounded-full bg-sunset px-6 py-3 text-sm font-semibold text-cream hover:bg-sunset-dark">
            আমার বুকিং থেকে আবার চেষ্টা করুন
          </Link>
        ) : (
          <Link to="/tours" className="rounded-full bg-sunset px-6 py-3 text-sm font-semibold text-cream hover:bg-sunset-dark">
            ট্যুর প্যাকেজ দেখুন
          </Link>
        )}
      </div>
    </div>
  );
};

export default PaymentFail;