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
            staggerChildren: 0.1
          }
        }
      }}
      className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-6xl mx-auto p-4"
    >
      {children}
    </motion.div>
  );
}
