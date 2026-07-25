# SSLCommerz Payment Setup (Part 12)

## যা যোগ করা হলো
- বুকিং করার পর user সরাসরি **SSLCommerz এর payment page** এ চলে যাবে
- সেখানে bKash, Nagad, Rocket, Visa/Mastercard — যেকোনো একটা দিয়ে টাকা দিতে পারবে
- পেমেন্ট সফল হলে → booking `paid` + `confirmed` হয়ে যাবে, user কে email যাবে
- পেমেন্ট ব্যর্থ/বাতিল হলে → booking `unpaid` থেকে যাবে, user "আমার বুকিং" থেকে আবার চেষ্টা করতে পারবে

## ধাপ ১: Sandbox Account বানান

1. [developer.sslcommerz.com/registration](https://developer.sslcommerz.com/registration/) এ যান
2. ফ্রি sandbox account বানান (নাম, ইমেইল, business info দিয়ে)
3. Registration সম্পন্ন হলে email এ **Store ID** ও **Store Password** পাবেন (অথবা dashboard এ লগইন করে পাবেন)

## ধাপ ২: `.env` এ বসান

```
SSLCZ_STORE_ID=your_store_id
SSLCZ_STORE_PASSWORD=your_store_password
SSLCZ_IS_LIVE=false

BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
```

- `SSLCZ_IS_LIVE=false` — sandbox/test mode (আসল টাকা কাটবে না)
- Live business এ যাওয়ার আগে SSLCommerz এর সাথে merchant agreement করে আসল credentials নিয়ে `SSLCZ_IS_LIVE=true` করতে হবে

## ধাপ ৩: Dependencies Install করুন

```bash
npm install
```
(`sslcommerz-lts` package যোগ হয়েছে `package.json` এ)

## Test করার নিয়ম

1. Backend + frontend দুটোই চালু রাখুন
2. একটা ট্যুর বুক করুন — booking তৈরি হওয়ার সাথে সাথেই SSLCommerz এর sandbox payment page এ redirect হবে
3. Sandbox এ **test card/mobile banking** তথ্য দিয়ে payment complete করুন — SSLCommerz এর sandbox page এই test credentials দেখিয়ে দেয় (সাধারণত card: `4111111111111111`, যেকোনো future expiry, যেকোনো CVV)
4. Payment সফল হলে আপনার website এর `/payment/success` page এ ফিরে আসবে, আর "আমার বুকিং" এ status "নিশ্চিত হয়েছে" ও "পরিশোধিত" দেখাবে

## ⚠️ Localhost এ IPN নিয়ে একটা কথা

`success_url`, `fail_url`, `cancel_url` — এগুলো ব্যবহারকারীর browser থেকে redirect হয়, তাই `localhost` এ ঠিকমতো কাজ করবে টেস্টের জন্য।

কিন্তু `ipn_url` (Instant Payment Notification) SSLCommerz এর সার্ভার থেকে সরাসরি call হয় — তাই এটা `localhost` এ পৌঁছাতে পারবে না। এটা শুধু production এ (Part 13 — Deployment এর পর, যখন backend একটা public URL পাবে) সঠিকভাবে কাজ করবে। এখন এটা বাদ দিলেও সমস্যা নেই, কারণ `success_url` দিয়েই মূল payment confirm হয়ে যাচ্ছে — IPN শুধু একটা backup নিশ্চিতকরণ।