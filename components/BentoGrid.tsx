'use client';

import { motion } from 'framer-motion';

export function BentoGrid({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      layout
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.2,
            delayChildren: 0.4
          }
        }
      }}
      className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 auto-rows-[160px] md:auto-rows-[180px] gap-4 sm:gap-6 mx-auto"
    >
      {children}
    </motion.div>
  );
}
