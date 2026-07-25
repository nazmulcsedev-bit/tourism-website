// Shared wrapper so every email looks consistent with the brand
const wrapper = (contentHtml) => `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; background:#FAF7F1; padding:32px 16px;">
    <div style="max-width:560px; margin:0 auto; background:#ffffff; border-radius:16px; overflow:hidden;">
      <div style="background:#12463D; padding:24px 32px;">
        <span style="color:#FAF7F1; font-size:22px; font-weight:700;">Bhromon</span>
      </div>
      <div style="padding:32px;">
        ${contentHtml}
      </div>
      <div style="background:#F1E7D3; padding:16px 32px; text-align:center; font-size:12px; color:#6b6b6b;">
        © ${new Date().getFullYear()} Bhromon. All rights reserved.
      </div>
    </div>
  </div>
`;

const bookingConfirmationTemplate = (booking, tour) => wrapper(`
  <h2 style="color:#12463D; margin-top:0;">আপনার বুকিং request পাওয়া গেছে ✅</h2>
  <p style="color:#333; line-height:1.6;">প্রিয় ${booking.fullName},</p>
  <p style="color:#333; line-height:1.6;">
    আপনার <strong>${tour.title}</strong> ট্যুরের বুকিং request আমরা পেয়েছি। আমাদের টিম শীঘ্রই এটি review করে confirm করবে।
  </p>
  <table style="width:100%; border-collapse:collapse; margin:20px 0;">
    <tr><td style="padding:8px 0; color:#666;">গন্তব্য</td><td style="padding:8px 0; text-align:right; font-weight:600; color:#12463D;">${tour.location}</td></tr>
    <tr><td style="padding:8px 0; color:#666;">যাত্রার তারিখ</td><td style="padding:8px 0; text-align:right; font-weight:600; color:#12463D;">${new Date(booking.travelDate).toLocaleDateString('bn-BD')}</td></tr>
    <tr><td style="padding:8px 0; color:#666;">যাত্রী সংখ্যা</td><td style="padding:8px 0; text-align:right; font-weight:600; color:#12463D;">${booking.numberOfPeople} জন</td></tr>
    <tr><td style="padding:8px 0; color:#666;">সর্বমোট মূল্য</td><td style="padding:8px 0; text-align:right; font-weight:700; color:#E2632B;">৳${booking.totalPrice.toLocaleString('bn-BD')}</td></tr>
  </table>
  <p style="color:#333; line-height:1.6;">কোনো প্রশ্ন থাকলে এই ইমেইলে reply করুন, আমরা সাহায্য করতে প্রস্তুত।</p>
`);

const adminNewBookingTemplate = (booking, tour) => wrapper(`
  <h2 style="color:#12463D; margin-top:0;">🔔 নতুন বুকিং এসেছে</h2>
  <table style="width:100%; border-collapse:collapse; margin:20px 0;">
    <tr><td style="padding:8px 0; color:#666;">গ্রাহক</td><td style="padding:8px 0; text-align:right; font-weight:600;">${booking.fullName}</td></tr>
    <tr><td style="padding:8px 0; color:#666;">ইমেইল</td><td style="padding:8px 0; text-align:right;">${booking.email}</td></tr>
    <tr><td style="padding:8px 0; color:#666;">ফোন</td><td style="padding:8px 0; text-align:right;">${booking.phone}</td></tr>
    <tr><td style="padding:8px 0; color:#666;">ট্যুর</td><td style="padding:8px 0; text-align:right; font-weight:600;">${tour.title}</td></tr>
    <tr><td style="padding:8px 0; color:#666;">যাত্রী সংখ্যা</td><td style="padding:8px 0; text-align:right;">${booking.numberOfPeople} জন</td></tr>
    <tr><td style="padding:8px 0; color:#666;">মূল্য</td><td style="padding:8px 0; text-align:right; font-weight:700; color:#E2632B;">৳${booking.totalPrice.toLocaleString('bn-BD')}</td></tr>
  </table>
  <p style="color:#333;">Admin panel এ গিয়ে এই বুকিংটি review করুন।</p>
`);

const statusUpdateTemplate = (booking, tour) => {
  const statusLabels = { confirmed: 'নিশ্চিত হয়েছে ✅', cancelled: 'বাতিল হয়েছে ❌', completed: 'সম্পন্ন হয়েছে 🎉', pending: 'অপেক্ষমাণ' };
  return wrapper(`
    <h2 style="color:#12463D; margin-top:0;">আপনার বুকিং স্ট্যাটাস আপডেট হয়েছে</h2>
    <p style="color:#333; line-height:1.6;">প্রিয় ${booking.fullName},</p>
    <p style="color:#333; line-height:1.6;">
      আপনার <strong>${tour.title}</strong> ট্যুরের বুকিং এখন: <strong style="color:#E2632B;">${statusLabels[booking.status]}</strong>
    </p>
  `);
};

module.exports = { bookingConfirmationTemplate, adminNewBookingTemplate, statusUpdateTemplate };