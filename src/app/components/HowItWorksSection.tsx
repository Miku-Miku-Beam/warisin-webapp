import { motion } from 'framer-motion';
import Image from 'next/image';

export default function HowItWorksSection() {
  return (
    <section className="w-full  mt-20 flex flex-col items-center py-16 md:py-20">
      <div className="flex flex-col md:flex-row items-center justify-center gap-10 w-full max-w-7xl">
        {/* Step 1 */}
        <motion.div
          className="flex-1 flex flex-col items-center md:items-end text-center md:text-right"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-5xl md:text-6xl font-extrabold mb-4">HOW WE</h2>
          <div className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mb-2">1</div>
          <p className="text-gray-700 max-w-lg">Explore open roles and understand the interests and needs required when applying.</p>
        </motion.div>
        {/* Illustration */}
        <motion.div
          className="flex-1 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="relative w-[220px] h-[220px] md:w-[320px] md:h-[320px]">
            <Image src="/batik-how.png" alt="How it works" fill className="object-contain" />
          </div>
        </motion.div>
        {/* Step 2 */}
        <motion.div
          className="flex-1 flex flex-col items-center md:items-start text-center md:text-left"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-5xl md:text-6xl font-extrabold mb-4">WORKS?</h2>
          <div className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mb-2">2</div>
          <p className="text-gray-700 max-w-lg">Our artists will review applications fairly. They will review each application until they find a candidate with a strong background and motivation.</p>
        </motion.div>
      </div>
    </section>
  );
} 