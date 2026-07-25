// আপনার business এর WhatsApp নম্বর এখানে বসান (country code সহ, + ছাড়া)
const WHATSAPP_NUMBER = '8801410231215';
const DEFAULT_MESSAGE = 'আসসালামু আলাইকুম, আমি ট্যুর প্যাকেজ সম্পর্কে জানতে চাই।';

const WhatsAppButton = () => {
  const link = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp এ যোগাযোগ করুন"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-transform hover:scale-110"
    >
      {/* Inline WhatsApp icon (brand-accurate glyph) */}
      <svg viewBox="0 0 32 32" width="28" height="28" fill="white" aria-hidden="true">
        <path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.386.696 4.61 1.902 6.487L4 29l7.72-1.867A11.93 11.93 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm6.98 16.982c-.294.827-1.464 1.514-2.395 1.71-.637.132-1.47.238-4.27-.917-3.585-1.478-5.893-5.106-6.074-5.343-.174-.237-1.457-1.94-1.457-3.702 0-1.762.92-2.626 1.246-2.987.326-.36.712-.45.949-.45.237 0 .475.002.682.013.219.011.513-.083.803.612.294.708.998 2.446 1.086 2.624.088.178.147.386.03.623-.119.237-.178.386-.356.594-.178.208-.376.464-.535.623-.178.178-.363.373-.156.732.207.359.92 1.518 1.978 2.459 1.36 1.212 2.507 1.588 2.865 1.766.359.178.568.148.777-.089.208-.237.89-1.036 1.128-1.393.237-.356.475-.297.802-.178.327.119 2.08.981 2.436 1.16.356.178.593.267.681.416.089.148.089.859-.207 1.686Z" />
      </svg>
    </a>
  );
};

export default WhatsAppButton;