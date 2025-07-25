import Image from "next/image";
import Navbar from "@/app/components/Navbar";
export default function HeroSection() {
  return (
    <section className="relative w-full flex items-center justify-center overflow-hidden min-h-[70vh] sm:min-h-screen">
      {/* Background Image */}
      <Image
        src="/Heroes-section.png"
        alt="Cultural Heritage"
        fill
        className="object-cover object-center z-0"
        priority
        sizes="100vw"
      />
      {/* Overlay Gradient */}
      {/* Navbar at the very top, above content */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 w-[95vw] max-w-7xl">
        <Navbar />
      </div>
      {/* Content */}
      
    </section>
  );
}