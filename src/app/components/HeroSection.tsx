'use client'
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="w-full flex flex-col items-center py-16 md:py-20 justify-center">
      <div className="flex flex-col md:flex-row-reverse items-center justify-center gap-10 w-full max-w-7xl">
        {/* Right: Illustration (di atas pada mobile, kanan pada desktop) */}
        <motion.div
          className="flex-1 flex items-center justify-center"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="relative w-[260px] h-[260px] md:w-[400px] md:h-[400px] drop-shadow-xl">
            <Image src="/wayang-hero.png" alt="Wayang Puppeteer" fill className="object-contain" priority />
          </div>
        </motion.div>
        {/* Left: Headline & CTA */}
        <motion.div
          className="flex-1 flex flex-col items-center md:items-start text-center md:text-left justify-center"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-3xl md:text-6xl font-extrabold mb-6 md:mb-8 leading-tight tracking-tight text-black">
            JOIN AND BE<br />PART OF<br />CULTURAL HERITAGE
          </h1>
          <p className="text-gray-700 text-base md:text-xl mb-8 max-w-lg">
            &quot;To be a bridge for the regeneration of Indonesia&apos;s cultural heritage by connecting traditional artisan masters and the younger generation.&quot;
          </p>
          <Link
            href="/programs"
            className="bg-gradient-to-r from-[#ff8800] to-[#ff4d00] hover:from-[#ff4d00] hover:to-[#ff8800] text-white font-bold px-10 py-4 rounded-xl text-lg shadow-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff8800]"
          >
            Apply Now
          </Link>
        </motion.div>
      </div>
    </section>
  );
}