const HeroSection = () => (
  <section className="flex flex-col md:flex-row items-center gap-8 py-12 px-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl shadow mb-8">
    <div className="flex-1">
      <h1 className="text-3xl md:text-5xl font-bold text-yellow-800 mb-4">
        Regenerasi Warisan Budaya Indonesia
      </h1>
      <p className="text-lg md:text-xl text-gray-700 mb-6">
        Platform digital yang menghubungkan maestro pengrajin tradisional dengan generasi muda penerus budaya.<br />
        <span className="font-semibold text-yellow-700">Bukan sekadar jobseeker, tapi jembatan regenerasi <span className="underline">Cultural Heritage</span>.</span>
      </p>
      <a href="/register" className="inline-block bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-8 rounded-lg shadow transition">
        Gabung Sekarang
      </a>
    </div>
    <img
      src="/assets/hero-illustration.png"
      alt="Ilustrasi Budaya"
      className="w-64 md:w-80 rounded-xl shadow-lg"
    />
  </section>
);
export default HeroSection;