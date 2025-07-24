import Link from 'next/link';

const Header = () => (
  <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-yellow-100 shadow-sm">
    <nav className="container mx-auto flex items-center justify-between py-3 px-4">
      <Link href="/" className="text-xl md:text-2xl font-bold text-yellow-800 tracking-tight">
        HeritageID
      </Link>
      <div className="hidden md:flex gap-6 items-center">
        <Link href="#fitur" className="text-gray-700 hover:text-yellow-700 font-medium transition">Fitur</Link>
        <Link href="#artisan" className="text-gray-700 hover:text-yellow-700 font-medium transition">Artisan</Link>
        <Link href="#testimoni" className="text-gray-700 hover:text-yellow-700 font-medium transition">Testimoni</Link>
        <Link href="/login" className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-5 rounded-lg shadow transition">Login</Link>
        <Link href="/register" className="border border-yellow-600 hover:bg-yellow-50 text-yellow-700 font-bold py-2 px-5 rounded-lg transition">Daftar</Link>
      </div>
      {/* Mobile menu button (optional, simple) */}
      <div className="md:hidden">
        {/* Implementasi mobile menu bisa ditambah jika perlu */}
      </div>
    </nav>
  </header>
);

export default Header; 