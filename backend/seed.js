// Run this once to fill your database with sample tour packages for testing.
// Usage: node seed.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const TourPackage = require('./models/TourPackage');

dotenv.config();

const sampleTours = [
  {
    title: 'সেন্ট মার্টিন দ্বীপ ভ্রমণ',
    description:
      'বাংলাদেশের একমাত্র প্রবাল দ্বীপ সেন্ট মার্টিনে কাটান স্বপ্নের মতো কয়েকটা দিন। নীল জলরাশি, নারকেল গাছের সারি আর তাজা সামুদ্রিক খাবারের অভিজ্ঞতা নিয়ে এই প্যাকেজ সাজানো হয়েছে।',
    location: 'কক্সবাজার',
    price: 4500,
    duration: '৩ দিন ২ রাত',
    maxGroupSize: 15,
    category: 'Beach',
    images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80'],
    included: ['হোটেল', 'সকালের নাস্তা', 'বোট ট্রান্সফার', 'গাইড'],
    excluded: ['দুপুর ও রাতের খাবার', 'ব্যক্তিগত খরচ'],
    itinerary: [
      { day: 1, title: 'কক্সবাজার থেকে সেন্ট মার্টিন যাত্রা', description: 'সকালে জাহাজে করে দ্বীপে পৌঁছানো ও হোটেলে চেক-ইন।' },
      { day: 2, title: 'দ্বীপ ভ্রমণ ও স্নরকেলিং', description: 'সারাদিন দ্বীপ ঘুরে দেখা ও স্নরকেলিং এর অভিজ্ঞতা।' },
      { day: 3, title: 'ফেরত যাত্রা', description: 'সকালের নাস্তার পর কক্সবাজারের উদ্দেশ্যে রওনা।' },
    ],
    featured: true,
    ratingsAverage: 4.8,
    ratingsCount: 124,
  },
  {
    title: 'সাজেক ভ্যালি — মেঘের রাজ্য',
    description:
      'পাহাড়ের চূড়ায় দাঁড়িয়ে মেঘের ভেলা দেখতে চাইলে সাজেক ভ্যালিই সেরা জায়গা। রাঙামাটির এই স্বর্গীয় স্থানে থাকবে চাঁদের গাড়িতে ভ্রমণ আর পাহাড়ি জীবনের ছোঁয়া।',
    location: 'রাঙামাটি',
    price: 6200,
    duration: '২ দিন ১ রাত',
    maxGroupSize: 10,
    category: 'Mountain',
    images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80'],
    included: ['রিসোর্ট', 'সকালের নাস্তা', 'চাঁদের গাড়ি', 'গাইড'],
    excluded: ['দুপুর ও রাতের খাবার'],
    itinerary: [
      { day: 1, title: 'খাগড়াছড়ি থেকে সাজেক যাত্রা', description: 'চাঁদের গাড়িতে পাহাড়ি পথ পেরিয়ে সাজেক পৌঁছানো।' },
      { day: 2, title: 'সূর্যোদয় ও মেঘ দেখা', description: 'ভোরে কংলাক পাহাড়ে সূর্যোদয় দেখে ফেরার পথে রওনা।' },
    ],
    featured: true,
    ratingsAverage: 4.9,
    ratingsCount: 98,
  },
  {
    title: 'সুন্দরবন অভিযান',
    description:
      'পৃথিবীর সবচেয়ে বড় ম্যানগ্রোভ বনে রয়্যাল বেঙ্গল টাইগারের রাজ্যে একটা অভিযান। নদীপথে জাহাজে করে গভীর জঙ্গলের ভেতর দিয়ে ভ্রমণ।',
    location: 'খুলনা',
    price: 8900,
    duration: '৪ দিন ৩ রাত',
    maxGroupSize: 20,
    category: 'Adventure',
    images: ['https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=80'],
    included: ['জাহাজে থাকা-খাওয়া', 'ফরেস্ট পারমিট', 'গাইড', 'নিরাপত্তা'],
    excluded: ['ব্যক্তিগত খরচ'],
    itinerary: [
      { day: 1, title: 'খুলনা থেকে যাত্রা শুরু', description: 'জাহাজে চেক-ইন ও নদীপথে যাত্রা শুরু।' },
      { day: 2, title: 'করমজল ও হারবাড়িয়া', description: 'বন্যপ্রাণী কেন্দ্র পরিদর্শন।' },
      { day: 3, title: 'কটকা ও কচিখালী', description: 'হরিণ ও বাঘের পায়ের ছাপ খোঁজা।' },
      { day: 4, title: 'ফেরত যাত্রা', description: 'খুলনায় ফিরে আসা।' },
    ],
    featured: true,
    ratingsAverage: 4.7,
    ratingsCount: 76,
  },
  {
    title: 'সিলেটের চা বাগান ভ্রমণ',
    description:
      'সবুজ চা বাগানের ঢেউ খেলানো টিলা, ঝর্ণা আর জাফলংয়ের স্বচ্ছ পানি — সিলেট ভ্রমণে থাকছে প্রকৃতির সব রূপ একসাথে।',
    location: 'সিলেট',
    price: 5200,
    duration: '৩ দিন ২ রাত',
    maxGroupSize: 12,
    category: 'Village',
    images: ['https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=1200&q=80'],
    included: ['হোটেল', 'সকালের নাস্তা', 'প্রাইভেট গাড়ি', 'গাইড'],
    excluded: ['দুপুর ও রাতের খাবার'],
    itinerary: [
      { day: 1, title: 'সিলেট পৌঁছানো ও চা বাগান', description: 'মালনীছড়া চা বাগান পরিদর্শন।' },
      { day: 2, title: 'জাফলং ও বিছানাকান্দি', description: 'নদী ও পাথরের রাজ্যে একদিন।' },
      { day: 3, title: 'রাতারগুল সোয়াম্প ফরেস্ট', description: 'নৌকায় জলাবনে ভ্রমণ শেষে ফেরত যাত্রা।' },
    ],
    featured: false,
    ratingsAverage: 4.6,
    ratingsCount: 52,
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected for seeding');

    await TourPackage.deleteMany({});
    console.log('🗑️  Old tour packages removed');

    await TourPackage.insertMany(sampleTours);
    console.log(`✅ ${sampleTours.length} sample tour packages added`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();