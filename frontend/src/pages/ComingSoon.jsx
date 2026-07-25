const ComingSoon = ({ title }) => (
  <div className="mx-auto flex min-h-[50vh] max-w-3xl flex-col items-center justify-center px-6 text-center">
    <span className="font-mono text-xs uppercase tracking-[0.2em] text-sunset">শীঘ্রই আসছে</span>
    <h1 className="mt-3 font-display text-4xl text-jungle">{title}</h1>
    <p className="mt-3 text-ink/60">এই পেইজটি পরবর্তী অংশে বানানো হবে।</p>
  </div>
);

export default ComingSoon;