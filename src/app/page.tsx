'use client';
import HeroSection from './components/HeroSection';
import HowItWorksSection from './components/HowItWorksSection';
import TestimonialSection from './components/TestimonialSection';
import LatestInternshipSection from './components/LatestInternshipSection';
import CallToActionSection from './components/CallToActionSection';


export default function Home() {
  return (
    <main className="min-h-screen w-full bg-white">
      <HeroSection />
      <HowItWorksSection />
      <TestimonialSection />
      <LatestInternshipSection />
      <CallToActionSection />
    </main>
  );
}