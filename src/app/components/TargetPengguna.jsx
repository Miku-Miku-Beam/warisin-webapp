const TargetPengguna = () => (
  <section className="py-10 px-4 bg-yellow-50 rounded-xl shadow mb-8">
    <h2 className="text-2xl font-bold text-yellow-800 mb-6">Siapa Saja yang Bisa Bergabung?</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold text-lg text-yellow-700 mb-2">Artisan (Maestro/Mentor)</h3>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>Empu keris, pembatik, pemahat, penenun, dsb.</li>
          <li>Ingin mewariskan ilmu & karya</li>
        </ul>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold text-lg text-yellow-700 mb-2">Calon Murid (Penerus)</h3>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>Mahasiswa/lulusan seni, desain, antropologi, sejarah</li>
          <li>Pelajar SMK seni/kriya</li>
          <li>Hobiis, peneliti, masyarakat umum</li>
        </ul>
      </div>
    </div>
  </section>
);
export default TargetPengguna;