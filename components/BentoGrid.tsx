'use client';

import { motion } from 'framer-motion';

export function BentoGrid({ children }: { children: React.ReactNode }) {
  return (
    <motion.div 
      initial="hidden"
      animate="show"
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
      className="grid grid-cols-1 md:grid-cols-4 auto-rows-[240px] gap-8 max-w-7xl mx-auto"
    >
      {children}
    </motion.div>
  );
}
