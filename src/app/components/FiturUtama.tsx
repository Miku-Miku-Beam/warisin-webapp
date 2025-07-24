const fitur = [
  { icon: "🧑‍🎨", title: "Profil Artisan", desc: "Halaman profil detail setiap maestro." },
  { icon: "🎓", title: "Peluang Magang", desc: "Artisan dapat mempublikasikan kesempatan magang." },
  { icon: "🤖", title: "Asisten AI", desc: "Bantuan AI untuk membuat narasi & deskripsi lowongan." },
  { icon: "👍", title: "Tombol 'Saya Tertarik'", desc: "Calon murid mudah menunjukkan minat." },
  { icon: "📝", title: "Sistem Pendaftaran Sederhana", desc: "Alur mudah untuk mendaftar & melihat peminat." },
];
const FiturUtama = () => (
  <section className="py-10 px-4 bg-white rounded-xl shadow mb-8">
    <h2 className="text-2xl font-bold text-yellow-800 mb-6">Fitur Utama</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {fitur.map(f => (
        <div key={f.title} className="bg-yellow-50 rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-4xl mb-2">{f.icon}</span>
          <h3 className="font-semibold text-lg mb-1 text-yellow-700">{f.title}</h3>
          <p className="text-gray-600 text-center">{f.desc}</p>
        </div>
      ))}
    </div>
  </section>
);
export default FiturUtama;