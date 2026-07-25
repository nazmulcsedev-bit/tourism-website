import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

const PaymentCancel = () => (
  <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 text-center">
    <AlertCircle size={56} className="text-ink/40" strokeWidth={1.5} />
    <h1 className="mt-4 font-display text-3xl text-jungle">পেমেন্ট বাতিল করা হয়েছে</h1>
    <p className="mt-2 text-ink/60">আপনি পেমেন্ট প্রক্রিয়াটি বাতিল করেছেন। কোনো টাকা কাটা হয়নি।</p>
    <div className="mt-8 flex gap-3">
      <Link to="/my-bookings" className="rounded-full bg-jungle px-6 py-3 text-sm font-semibold text-cream hover:bg-jungle-light">
        আমার বুকিং দেখুন
      </Link>
      <Link to="/tours" className="rounded-full bg-sand px-6 py-3 text-sm font-semibold text-ink hover:bg-sand-dark">
        ট্যুর প্যাকেজ দেখুন
      </Link>
    </div>
  </div>
);

export default PaymentCancel;