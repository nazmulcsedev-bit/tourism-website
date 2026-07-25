import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ProtectedRoute, AdminRoute } from './components/RouteGuards';
import Home from './pages/Home';
import Tours from './pages/Tours';
import TourDetails from './pages/TourDetails';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Contact from './pages/Contact';
import WhatsAppButton from './components/WhatsAppButton';
import BookingForm from './pages/BookingForm';
import MyBookings from './pages/MyBookings';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFail from './pages/PaymentFail';
import PaymentCancel from './pages/PaymentCancel';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminTours from './pages/admin/AdminTours';
import AdminTourForm from './pages/admin/AdminTourForm';
import AdminBookings from './pages/admin/AdminBookings';
import AdminInquiries from './pages/admin/AdminInquiries';

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tours" element={<Tours />} />
          <Route path="/tours/:id" element={<TourDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/fail" element={<PaymentFail />} />
          <Route path="/payment/cancel" element={<PaymentCancel />} />

          {/* লগইন করা user দের জন্য protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/book/:id" element={<BookingForm />} />
          </Route>

          {/* শুধু admin দের জন্য — nested routes with sidebar layout */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="tours" element={<AdminTours />} />
              <Route path="tours/new" element={<AdminTourForm />} />
              <Route path="tours/:id/edit" element={<AdminTourForm />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="inquiries" element={<AdminInquiries />} />
            </Route>
          </Route>
        </Routes>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

export default App;