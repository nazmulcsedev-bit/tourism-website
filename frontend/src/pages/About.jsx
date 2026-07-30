import { Compass, Heart, ShieldCheck, Users, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import WaveDivider from '../components/WaveDivider';

const values = [
  {
    icon: Heart,
    title: 'ভালোবাসা দিয়ে পরিকল্পনা',
    desc: 'প্রতিটি ট্যুর আমরা এমনভাবে সাজাই যেন মনে হয় নিজেদের পরিবারের জন্যই বানাচ্ছি।',
  },
  {
    icon: ShieldCheck,
    title: 'নিরাপত্তা সবার আগে',
    desc: 'যাচাই করা গাইড, নিরাপদ যানবাহন আর জরুরি সহায়তা — সবসময় প্রস্তুত।',
  },
  {
    icon: Users,
    title: 'স্থানীয়দের সাথে',
    desc: 'প্রতিটি গন্তব্যে স্থানীয় মানুষদের সাথে কাজ করি, যাতে ভ্রমণ হয় প্রকৃত অভিজ্ঞতা।',
  },
];

const stats = [
  { value: '৮+', label: 'বছরের অভিজ্ঞতা' },
  { value: '১২,০০০+', label: 'সন্তুষ্ট ভ্রমণকারী' },
  { value: '৪৫+', label: 'গন্তব্য' },
  { value: '১৫০+', label: 'ট্যুর প্যাকেজ' },
];

const team = [
  { name: 'নাজমুল হাসান', role: 'প্রতিষ্ঠাতা ও সিইও', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80' },
  { name: 'আবির  ইসলাম', role: 'অপারেশনস প্রধান', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80' },
  { name: 'রায়হান কবির', role: 'ট্যুর গাইড ও কোঅর্ডিনেটর', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80' },
];

const About = () => {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-jungle">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1600&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-jungle via-jungle/70 to-jungle/40" aria-hidden="true" />
        <div className="relative mx-auto max-w-4xl px-6 py-24 text-center md:py-32">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-sunset">আমাদের সম্পর্কে</span>
          <h1 className="mt-4 font-display text-4xl leading-tight text-cream md:text-5xl">
            বাংলাদেশকে ভালোবেসেই
            <br />
            <span className="italic text-sunset">শুরু হয়েছিল</span> এই যাত্রা
          </h1>
        </div>
        <WaveDivider color="#FAF7F1" />
      </section>

      {/* Story */}
      <section className="mx-auto max-w-4xl px-6 py-20">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-sunset">আমাদের গল্প</span>
        <h2 className="mt-2 font-display text-3xl text-jungle">কেন Bhromon শুরু হলো</h2>
        <div className="mt-6 space-y-4 leading-relaxed text-ink/70">
          <p>
            ২০১৮ সালে কয়েকজন ভ্রমণপ্রেমী বন্ধু মিলে Bhromon এর যাত্রা শুরু করি — একটাই লক্ষ্য নিয়ে, বাংলাদেশের অচেনা সৌন্দর্যকে
            মানুষের কাছে পৌঁছে দেওয়া। সাজেকের মেঘ থেকে সেন্ট মার্টিনের নীল জল, সুন্দরবনের গভীর জঙ্গল থেকে সিলেটের চা বাগান —
            আমরা বিশ্বাস করি প্রতিটি জায়গার নিজস্ব একটা গল্প আছে, আর সেই গল্প বলার দায়িত্ব আমাদের।
          </p>
          <p>
            শুরুতে ছোট্ট একটা টিম নিয়ে কাজ শুরু করলেও, আজ আমরা হাজারো ভ্রমণকারীর বিশ্বস্ত সঙ্গী। প্রতিটি ট্যুর পরিকল্পনা করি
            নিরাপত্তা, স্বচ্ছতা আর আন্তরিকতাকে সবার আগে রেখে।
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-sand/50 py-16">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-6 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-3xl text-jungle md:text-4xl">{s.value}</div>
              <div className="mt-1 text-xs uppercase tracking-wide text-ink/50">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-sunset">আমাদের মূল্যবোধ</span>
          <h2 className="mt-2 font-display text-3xl text-jungle md:text-4xl">যা আমাদের আলাদা করে</h2>
        </div>
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {values.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-jungle/10 text-jungle">
                <Icon size={24} strokeWidth={1.75} />
              </div>
              <h3 className="mt-4 font-display text-xl text-jungle">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/60">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="bg-sand/50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-sunset">আমাদের টিম</span>
            <h2 className="mt-2 font-display text-3xl text-jungle md:text-4xl">যাদের হাতে গড়া এই যাত্রা</h2>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <div key={member.name} className="rounded-2xl bg-cream p-6 text-center shadow-sm">
                <img
                  src={member.image}
                  alt={member.name}
                  className="mx-auto h-24 w-24 rounded-full object-cover"
                />
                <h3 className="mt-4 font-display text-lg text-jungle">{member.name}</h3>
                <p className="mt-1 text-sm text-ink/50">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-jungle py-20 text-center">
        <div className="relative mx-auto max-w-2xl px-6">
          <MapPin size={32} className="mx-auto text-sunset" />
          <h2 className="mt-4 font-display text-3xl text-cream md:text-4xl">
            আমাদের সাথে আবিষ্কার করুন বাংলাদেশ
          </h2>
          <p className="mt-4 text-cream/70">
            হাজারো ভ্রমণপ্রেমীর গল্পে যুক্ত হোন আজই।
          </p>
          <Link
            to="/tours"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-sunset px-8 py-3.5 font-semibold text-cream transition-colors hover:bg-sunset-dark"
          >
            <Compass size={18} /> ট্যুর প্যাকেজ দেখুন
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;