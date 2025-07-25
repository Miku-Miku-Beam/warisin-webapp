import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CallToActionSection() {
  return (
    <motion.section
      className="w-full flex flex-col items-center py-12"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
    >
      <div className="text-xl md:text-2xl font-semibold mb-6 text-center">Ready to Be Part of Cultural Regeneration?</div>
      <div className="flex gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Link href="/apply" className="bg-gradient-to-r from-[#ff8800] to-[#ff4d00] hover:from-[#ff4d00] hover:to-[#ff8800] text-white font-bold px-8 py-3 rounded-full text-lg shadow-lg transition-all duration-150">
            Apply Now
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          
        </motion.div>
      </div>
    </motion.section>
  );
} 