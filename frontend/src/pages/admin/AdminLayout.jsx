import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, MapPinned, ClipboardList, MessageCircle, Compass } from 'lucide-react';

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
    isActive ? 'bg-sunset text-cream' : 'text-cream/70 hover:bg-cream/10 hover:text-cream'
  }`;

const AdminLayout = () => {
  return (
    <div className="mx-auto flex max-w-7xl gap-8 px-6 py-10">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 rounded-2xl bg-jungle p-5">
        <div className="flex items-center gap-2 px-2 font-display text-xl text-cream">
          <Compass size={22} className="text-sunset" strokeWidth={1.75} />
          অ্যাডমিন
        </div>
        <nav className="mt-8 space-y-1.5">
          <NavLink to="/admin" end className={linkClass}>
            <LayoutDashboard size={18} /> ওভারভিউ
          </NavLink>
          <NavLink to="/admin/tours" className={linkClass}>
            <MapPinned size={18} /> ট্যুর প্যাকেজ
          </NavLink>
          <NavLink to="/admin/bookings" className={linkClass}>
            <ClipboardList size={18} /> বুকিং সমূহ
          </NavLink>
          <NavLink to="/admin/inquiries" className={linkClass}>
            <MessageCircle size={18} /> যোগাযোগ বার্তা
          </NavLink>
        </nav>
      </aside>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;