const faqs = [
  { q: "Apakah platform ini gratis?", a: "Ya, pendaftaran dan penggunaan fitur utama gratis." },
  { q: "Bagaimana cara menjadi artisan?", a: "Daftar sebagai artisan, lengkapi profil, dan mulai posting peluang magang." },
  { q: "Apakah ada seleksi untuk magang?", a: "Setiap artisan menentukan kriteria dan memilih peserta yang sesuai." },
];
const FAQ = () => (
  <section className="py-10 px-4 bg-white rounded-xl shadow mb-8">
    <h2 className="text-2xl font-bold text-yellow-800 mb-6">FAQ</h2>
    <ul className="space-y-4">
      {faqs.map((f, i) => (
        <li key={i} className="bg-yellow-50 rounded-lg p-4 shadow">
          <strong className="text-yellow-700">{f.q}</strong>
          <p className="text-gray-700 mt-1">{f.a}</p>
        </li>
      ))}
    </ul>
  </section>
);
export default FAQ;