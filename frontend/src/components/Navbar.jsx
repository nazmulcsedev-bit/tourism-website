import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Compass, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium tracking-wide transition-colors ${
    isActive ? 'text-sunset' : 'text-cream/90 hover:text-sunset'
  }`;

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { userInfo, logout, isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-jungle">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 font-display text-2xl text-cream" onClick={() => setOpen(false)}>
          <Compass size={26} className="text-sunset" strokeWidth={1.75} />
          Bhromon
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          <NavLink to="/" className={navLinkClass} end>
            হোম
          </NavLink>
          <NavLink to="/tours" className={navLinkClass}>
            ট্যুর প্যাকেজ
          </NavLink>
          <NavLink to="/contact" className={navLinkClass}>
            যোগাযোগ
          </NavLink>
          {userInfo && (
            <NavLink to="/my-bookings" className={navLinkClass}>
              আমার বুকিং
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin" className={navLinkClass}>
              অ্যাডমিন
            </NavLink>
          )}
        </div>

        <div className="hidden items-center gap-4 md:flex">
          {userInfo ? (
            <button
              onClick={logout}
              className="rounded-full border border-cream/30 px-5 py-2 text-sm font-medium text-cream transition-colors hover:border-sunset hover:text-sunset"
            >
              লগ আউট
            </button>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-cream/90 hover:text-sunset">
                লগইন
              </Link>
              <Link
                to="/signup"
                className="flex items-center gap-1.5 rounded-full bg-sunset px-5 py-2 text-sm font-semibold text-cream transition-colors hover:bg-sunset-dark"
              >
                <User size={15} /> সাইন আপ
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="text-cream md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="flex flex-col gap-4 border-t border-cream/10 bg-jungle px-6 py-6 md:hidden">
          <NavLink to="/" className={navLinkClass} end onClick={() => setOpen(false)}>
            হোম
          </NavLink>
          <NavLink to="/tours" className={navLinkClass} onClick={() => setOpen(false)}>
            ট্যুর প্যাকেজ
          </NavLink>
          <NavLink to="/contact" className={navLinkClass} onClick={() => setOpen(false)}>
            যোগাযোগ
          </NavLink>
          {userInfo && (
            <NavLink to="/my-bookings" className={navLinkClass} onClick={() => setOpen(false)}>
              আমার বুকিং
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin" className={navLinkClass} onClick={() => setOpen(false)}>
              অ্যাডমিন
            </NavLink>
          )}
          <hr className="border-cream/10" />
          {userInfo ? (
            <button onClick={logout} className="text-left text-sm font-medium text-cream/90">
              লগ আউট
            </button>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-cream/90" onClick={() => setOpen(false)}>
                লগইন
              </Link>
              <Link to="/signup" className="text-sm font-medium text-sunset" onClick={() => setOpen(false)}>
                সাইন আপ
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;