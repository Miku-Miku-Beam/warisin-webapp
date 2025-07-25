import Navbar from "@/app/components/Navbar";
import ArtisanUnggulan from './components/ArtisanUnggulan';
import CaraKerja from './components/CaraKerja';
import CTASection from './components/CTASection';
import FAQ from './components/FAQ';
import FiturUtama from './components/FiturUtama';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import TargetPengguna from './components/TargetPengguna';
import Testimoni from './components/Testimoni';


export default function HomePage() {
  <ArtisanUnggulan />
  return (
    <main>
      <div className="w-full flex flex-col items-center">
      <div>
        <HeroSection />
        <TargetPengguna />
        <FiturUtama />
        <CaraKerja />
        <Testimoni />
        <FAQ />
        <CTASection />
        <Footer />
      </div>
      </div>
    </main>
  );
}