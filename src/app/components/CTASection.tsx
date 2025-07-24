const CTASection = () => (
  <section className="py-10 px-4 bg-yellow-100 rounded-xl shadow mb-8 text-center">
    <h2 className="text-2xl font-bold text-yellow-800 mb-4">Siap Menjadi Bagian Regenerasi Budaya?</h2>
    <a href="/register" className="inline-block bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-8 rounded-lg shadow transition mb-2 mr-2">
      Daftar Sekarang
    </a>
    <span className="text-gray-600 mx-2">atau</span>
    <a href="/login" className="inline-block bg-white border border-yellow-600 hover:bg-yellow-50 text-yellow-700 font-bold py-3 px-8 rounded-lg shadow transition mb-2 ml-2">
      Login
    </a>
  </section>
);
export default CTASection; 