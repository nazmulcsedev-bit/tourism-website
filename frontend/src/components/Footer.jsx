import { Link } from 'react-router-dom';
import { Compass, Facebook, Instagram, Mail, Phone } from 'lucide-react';

const Footer = () => (
  <footer className="bg-jungle-dark text-cream/80">
    <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
      <div>
        <div className="flex items-center gap-2 font-display text-2xl text-cream">
          <Compass size={22} className="text-sunset" strokeWidth={1.75} />
          Bhromon
        </div>
        <p className="mt-3 max-w-xs text-sm leading-relaxed text-cream/60">
          বাংলাদেশের প্রতিটি কোণ ঘুরে দেখার জন্য আপনার বিশ্বস্ত সঙ্গী — পাহাড়, সমুদ্র, নদী আর ইতিহাসের গল্প।
        </p>
      </div>

      <div>
        <h4 className="font-display text-lg text-cream">দ্রুত লিংক</h4>
        <ul className="mt-3 space-y-2 text-sm text-cream/60">
          <li><Link to="/" className="hover:text-sunset">হোম</Link></li>
          <li><Link to="/tours" className="hover:text-sunset">ট্যুর প্যাকেজ</Link></li>
          <li><Link to="/contact" className="hover:text-sunset">যোগাযোগ</Link></li>
          <li><Link to="/login" className="hover:text-sunset">লগইন</Link></li>
          <li><Link to="/signup" className="hover:text-sunset">সাইন আপ</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="font-display text-lg text-cream">যোগাযোগ</h4>
        <ul className="mt-3 space-y-2 text-sm text-cream/60">
          <li className="flex items-center gap-2"><Phone size={14} /> +৮৮০ ০১৪১২৩১২১৫</li>
          <li className="flex items-center gap-2"><Mail size={14} /> hello@bhromon.com</li>
        </ul>
      </div>

      <div>
        <h4 className="font-display text-lg text-cream">ফলো করুন</h4>
        <div className="mt-3 flex gap-3">
          <a href="#" aria-label="Facebook" className="rounded-full border border-cream/20 p-2 hover:border-sunset hover:text-sunset">
            <Facebook size={16} />
          </a>
          <a href="#" aria-label="Instagram" className="rounded-full border border-cream/20 p-2 hover:border-sunset hover:text-sunset">
            <Instagram size={16} />
          </a>
        </div>
      </div>
    </div>
    <div className="border-t border-cream/10 py-5 text-center text-xs text-cream/40">
      © {new Date().getFullYear()} Bhromon সর্বস্বত্ব সংরক্ষিত।
    </div>
  </footer>
);

export default Footer; 