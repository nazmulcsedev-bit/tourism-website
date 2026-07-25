# Tourism Website — Frontend (Part 6: Setup + Home Page)

## Tech Stack
- **Vite** — fast dev server & build tool
- **React 18** — UI library
- **React Router v6** — page routing
- **Tailwind CSS** — styling with custom design tokens (Jungle green / Sunset orange / Sand)
- **Axios** — API calls to backend
- **lucide-react** — icons

## কিভাবে চালাবেন

1. Dependencies install করুন:
   ```
   npm install
   ```

2. Dev server চালান:
   ```
   npm run dev
   ```

3. Browser এ খুলুন: `http://localhost:3000`

## ⚠️ Backend Connection
`vite.config.js` এ একটা proxy সেট করা আছে — `/api` দিয়ে শুরু হওয়া সব request automatically `http://localhost:5000` এ (আপনার backend) forward হবে। তাই frontend চালানোর আগে backend ও (`npm run dev` — backend folder এ) চালু রাখুন।

## এখন পর্যন্ত যা আছে
- ✅ Home page (Hero, Featured tours — demo data, Stats, Why-choose-us, CTA)
- ✅ Navbar + Footer (Bangla)
- ✅ Routing setup — বাকি pages আপাতত "শীঘ্রই আসছে" দেখাবে

## পরবর্তী Parts এ যা আসবে
- Part 7: Tours listing + Tour details page (API connected)
- Part 8: Login / Signup pages + Auth flow
- Part 9: Booking form + My Bookings page
- Part 10: Admin dashboard