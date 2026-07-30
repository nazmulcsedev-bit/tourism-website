import { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Compass, User, ChevronDown, LogOut, UserCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium tracking-wide transition-colors ${
    isActive ? 'text-sunset' : 'text-cream/90 hover:text-sunset'
  }`;

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { userInfo, logout, isAdmin } = useAuth();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          <NavLink to="/about" className={navLinkClass}>
            আমাদের সম্পর্কে
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
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-cream/20 py-1 pl-1 pr-3 text-cream transition-colors hover:border-sunset"
              >
                {userInfo.avatar ? (
                  <img src={userInfo.avatar} alt={userInfo.name} className="h-8 w-8 rounded-full object-cover" />
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sunset font-display text-sm text-cream">
                    {userInfo.name?.charAt(0).toUpperCase()}
                  </span>
                )}
                <span className="max-w-[100px] truncate text-sm font-medium">{userInfo.name}</span>
                <ChevronDown size={14} className={`transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-xl border border-sand bg-cream py-1.5 shadow-lg">
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink hover:bg-sand/50"
                  >
                    <UserCircle size={16} /> আমার প্রোফাইল
                  </Link>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                    }}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-sunset-dark hover:bg-sand/50"
                  >
                    <LogOut size={16} /> লগ আউট
                  </button>
                </div>
              )}
            </div>
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
          <NavLink to="/about" className={navLinkClass} onClick={() => setOpen(false)}>
            আমাদের সম্পর্কে
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
            <>
              <div className="flex items-center gap-3 py-1">
                {userInfo.avatar ? (
                  <img src={userInfo.avatar} alt={userInfo.name} className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sunset font-display text-cream">
                    {userInfo.name?.charAt(0).toUpperCase()}
                  </span>
                )}
                <span className="text-sm font-medium text-cream">{userInfo.name}</span>
              </div>
              <Link to="/profile" className={navLinkClass} onClick={() => setOpen(false)}>
                আমার প্রোফাইল
              </Link>
              <button onClick={logout} className="text-left text-sm font-medium text-cream/90">
                লগ আউট
              </button>
            </>
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