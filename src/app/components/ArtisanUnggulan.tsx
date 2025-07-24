const artisans = [
  { name: "Pak Budi", bidang: "Empu Keris", kisah: "40 tahun melestarikan keris dan mengajarkan filosofi pusaka." },
  { name: "Bu Sari", bidang: "Pembatik Tulis", kisah: "Mewariskan motif batik klasik ke generasi muda." },
  { name: "Pak Wawan", bidang: "Pematung Kayu", kisah: "Menghidupkan seni ukir Jepara dengan inovasi modern." },
];
const ArtisanUnggulan = () => (
  <section className="py-10 px-4 bg-yellow-50 rounded-xl shadow mb-8">
    <h2 className="text-2xl font-bold text-yellow-800 mb-6">Artisan Unggulan</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {artisans.map(a => (
        <div key={a.name} className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <h3 className="font-semibold text-lg text-yellow-700 mb-1">{a.name}</h3>
          <p className="text-gray-700 mb-1"><b>{a.bidang}</b></p>
          <small className="text-gray-500 text-center">{a.kisah}</small>
        </div>
      ))}
    </div>
  </section>
);
export default ArtisanUnggulan; 