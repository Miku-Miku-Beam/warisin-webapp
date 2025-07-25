import { motion } from 'framer-motion';
import Image from 'next/image';

const internships = [
    {
      title: 'Batik Tulis Pekalongan',
      location: 'Kabupaten Pekalongan',
      mentor: 'Fauziah Hanum',
      image: '/batik-side.png',
    },
    {
      title: 'Pelatihan Angklung',
      location: 'Bandung, Jawa Barat',
      mentor: 'Dewi Lestari',
      image: '/angklung.png',
    },
    {
      title: 'Workshop Wayang Kulit',
      location: 'Yogyakarta',
      mentor: 'Budi Santoso',
      image: '/wayang-hero.png',
    },
    {
      title: 'Kelas Membatik Modern',
      location: 'Solo, Jawa Tengah',
      mentor: 'Siti Nurhaliza',
      image: '/batik-side.png',
    },
    {
      title: 'Eksplorasi Gamelan',
      location: 'Surakarta',
      mentor: 'Rizky Pratama',
      image: '/gamelan-girls.png',
    },
    {
      title: 'Pengenalan Kerajinan Kayu',
      location: 'Jepara',
      mentor: 'Pak Slamet',
      image: '/default-program.png',
    },
  ];

export default function LatestInternshipSection() {
  return (
    <section className="w-full flex flex-col items-center mt-32 py-16">
      <h2 className="text-3xl md:text-4xl font-extrabold mb-8">LATEST INTERNSHIP</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {internships.map((item, i) => (
          <motion.div
            key={i}
            className="bg-white rounded-xl shadow-md p-4 flex flex-col gap-3"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <div className="relative w-full h-32 mb-2 rounded-lg overflow-hidden">
              <Image src={item.image} alt={item.title} fill className="object-cover" />
            </div>
            <div className="font-bold text-lg">{item.title}</div>
            <div className="text-gray-600 text-sm">{item.location}</div>
            <div className="text-gray-500 text-xs">Mentor: {item.mentor}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
} 