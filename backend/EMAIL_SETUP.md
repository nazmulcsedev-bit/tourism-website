# Email Notifications Setup (Part 11)

## কি যোগ করা হলো
- বুকিং করলে → **user এর কাছে confirmation email** যাবে
- বুকিং করলে → **admin এর কাছেও notification email** যাবে (নতুন বুকিং এসেছে)
- Admin বুকিং status বদলালে (confirmed/cancelled/completed) → **user কে email** যাবে

## Gmail App Password বানানোর নিয়ম

সরাসরি Gmail password ব্যবহার করা যায় না (Google security এর কারণে)। "App Password" নামে আলাদা একটা ১৬-ডিজিটের পাসওয়ার্ড বানাতে হয়।

1. আপনার Gmail account এ **2-Step Verification চালু** করুন (না থাকলে):
   [myaccount.google.com/security](https://myaccount.google.com/security)

2. তারপর এখানে যান: [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)

3. একটা নাম দিন (যেমন: "Bhromon Website") → **Create** ক্লিক করুন

4. ১৬ ডিজিটের একটা password দেখাবে (স্পেস সহ, যেমন: `abcd efgh ijkl mnop`) — এটা **কপি করে রাখুন**

## `.env` এ যোগ করুন

```
EMAIL_USER=youraddress@gmail.com
EMAIL_PASS=abcdefghijklmnop
ADMIN_EMAIL=admin@example.com
```

- `EMAIL_USER` — যে Gmail থেকে email পাঠানো হবে
- `EMAIL_PASS` — Google App Password (স্পেস বাদ দিয়ে লিখুন)
- `ADMIN_EMAIL` — নতুন বুকিং এর notification কোন ইমেইলে যাবে (আপনার business email)

## Dependencies Install করুন

`package.json` এ `nodemailer` যোগ করা হয়েছে, তাই backend folder এ:
```bash
npm install
```

## Test করুন

Backend restart করে (`npm run dev`) একটা নতুন বুকিং করে দেখুন — user email আর admin email দুটোতেই মেইল আসার কথা। Terminal এ দেখাবে:
```
📧 Email sent to user@example.com: আপনার বুকিং request পাওয়া গেছে — Bhromon
📧 Email sent to admin@example.com: নতুন বুকিং: ...
```

## ⚠️ যদি email না যায়
- Terminal এ `❌ Email failed to send` দেখাবে সাথে exact কারণ — সেটা copy করে জানান
- সবচেয়ে common কারণ: App Password ভুল বসানো (স্পেস থেকে যাওয়া) অথবা 2-Step Verification চালু না থাকা