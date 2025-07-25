"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
  {
    name: 'Fauziah Hanum',
    text: 'Through this platform, I can share knowledge with the younger generation who are truly enthusiastic.',
    avatar: '/default-avatar.png',
    role: 'Artisan Batik',
  },
  {
    name: 'Rizky Pratama',
    text: 'Saya mendapatkan pengalaman magang langsung dari maestro. Sangat bermanfaat untuk karir saya!',
    avatar: '/default-avatar.png',
    role: 'Mahasiswa Seni',
  },
  {
    name: 'Siti Nurhaliza',
    text: 'Platform ini memudahkan saya menemukan program budaya yang sesuai minat. Prosesnya juga sangat mudah.',
    avatar: '/default-avatar.png',
    role: 'Pencari Magang',
  },
  {
    name: 'Budi Santoso',
    text: 'Sebagai pengrajin, saya bisa berbagi ilmu dan meregenerasi keahlian tradisional ke generasi muda.',
    avatar: '/default-avatar.png',
    role: 'Empu Keris',
  },
];

export default function TestimonialSection() {
  const [index, setIndex] = useState(0);
  const next = () => setIndex((i) => (i + 1) % testimonials.length);
  const prev = () => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="w-full flex flex-col mt-20 items-center">
      <h2 className="text-3xl md:text-6xl font-extrabold mb-12">TESTIMONIAL</h2>
      <div className="relative w-full max-w-2xl">
        {/* Tombol panah */}
        <button
          onClick={prev}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 text-3xl bg-white/80 backdrop-blur rounded-full shadow-lg hover:bg-yellow-100 active:scale-90 transition border border-yellow-200"
          aria-label="Previous testimonial"
        >
          &#60;
        </button>
        <button
          onClick={next}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 text-3xl bg-white/80 backdrop-blur rounded-full shadow-lg hover:bg-yellow-100 active:scale-90 transition border border-yellow-200"
          aria-label="Next testimonial"
        >
          &#62;
        </button>
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.98 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl p-10 flex flex-col items-center gap-5 min-h-[220px] border border-yellow-100 relative"
          >
            <motion.div
              className="w-20 h-20 rounded-full border-4 border-yellow-300 shadow-lg overflow-hidden mb-2 hover:scale-105 transition"
              whileHover={{ scale: 1.08 }}
            >
              <img
                src={testimonials[index].avatar}
                alt={testimonials[index].name}
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div className="font-bold text-lg text-yellow-800">{testimonials[index].name}</div>
            <span className="inline-block bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full mb-2">
              {testimonials[index].role}
            </span>
            <div className="relative text-gray-700 text-center text-base max-w-md">
              <span className="absolute -left-6 -top-2 text-5xl text-yellow-200 select-none">“</span>
              {testimonials[index].text}
              <span className="absolute -right-6 -bottom-2 text-5xl text-yellow-200 select-none">”</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
} 