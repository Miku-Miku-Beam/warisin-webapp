import { Navbar } from '@/lib/components';
import ArtisanUnggulan from './components/ArtisanUnggulan';
import CaraKerja from './components/CaraKerja';
import CTASection from './components/CTASection';
import FAQ from './components/FAQ';
import FiturUtama from './components/FiturUtama';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import TargetPengguna from './components/TargetPengguna';
import Testimoni from './components/Testimoni';
import VisiMisi from './components/VisiMisi';

export default function HomePage() {
  <ArtisanUnggulan />
  return (
    <main>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <HeroSection />
        <VisiMisi />
        <TargetPengguna />
        <FiturUtama />
        <CaraKerja />
        <Testimoni />
        <FAQ />
        <CTASection />
        <Footer />
      </div>
    </main>
  );
}