import HeroSection from './components/HeroSection';
import VisiMisi from './components/VisiMisi';
import TargetPengguna from './components/TargetPengguna';
import FiturUtama from './components/FiturUtama';
import ArtisanUnggulan from './components/ArtisanUnggulan';
import CaraKerja from './components/CaraKerja';
import Testimoni from './components/Testimoni';
import FAQ from './components/FAQ';
import CTASection from './components/CTASection';
import Footer from './components/Footer';

export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <HeroSection />
      <VisiMisi />
      <TargetPengguna />
      <FiturUtama />
      <ArtisanUnggulan />
      <CaraKerja />
      <Testimoni />
      <FAQ />
      <CTASection />
      <Footer />
    </main>
  );
}