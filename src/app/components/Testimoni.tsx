const testimoni = [
  { nama: "Pak Budi", peran: "Empu Keris", pesan: "Lewat platform ini, saya bisa berbagi ilmu ke generasi muda yang benar-benar antusias." },
  { nama: "Dewi", peran: "Mahasiswa Seni", pesan: "Belajar langsung dari maestro adalah pengalaman tak ternilai!" },
];
const Testimoni = () => (
  <section className="py-10 px-4 bg-yellow-50 rounded-xl shadow mb-8">
    <h2 className="text-2xl font-bold text-yellow-800 mb-6">Testimoni</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {testimoni.map(t => (
        <blockquote key={t.nama} className="bg-white rounded-lg shadow p-6">
          <p className="italic text-gray-700 mb-2">"{t.pesan}"</p>
          <footer className="text-sm text-yellow-700 font-semibold">- {t.nama}, <span className="font-normal italic text-gray-500">{t.peran}</span></footer>
        </blockquote>
      ))}
    </div>
  </section>
);
export default Testimoni;