'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import * as Icons from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchCategories } from './data';
import type { ServiceCategory } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function ServiceCategories() {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .finally(() => setLoading(false));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", bounce: 0.4, duration: 0.8 } }
  };

  return (
    <section id="categories" className="py-10">
      <div className="flex items-center justify-between mb-12">
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-4xl lg:text-5xl font-black text-[#1E293B] mb-4">
            استكشف الفئات
          </h2>
          <p className="text-slate-500 font-bold text-lg">كل ما تحتاجه في مكان واحد</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <Link
            href="/search?type=service"
            className="hidden md:inline-flex items-center justify-center h-12 px-8 rounded-full bg-slate-100 text-[#1E293B] font-bold hover:bg-[#22BC9F] hover:text-white transition-colors"
          >
            عرض الكل
          </Link>
        </motion.div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        {loading
          ? Array(8)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-slate-50 rounded-[2rem] border border-slate-100 animate-pulse"
                />
              ))
          : categories.map((category) => {
              // Map common category names/icons to valid Lucide icons
              const iconMap: Record<string, any> = {
                'مساج واسترخاء': Icons.Waves,
                'عناية بالأسنان': Icons.Smile,
                'صالونات وتجميل': Icons.Scissors,
                'عناية بالسيارات': Icons.Car,
                'نوادي رياضية': Icons.Dumbbell,
                'حمام مغربي وبخار': Icons.Droplets,
                'جلسات تجميلية': Icons.Sparkles,
                'فحوصات طبية': Icons.Stethoscope,
              };
              
              // @ts-ignore
              const IconComponent = iconMap[category.name] || Icons[category.icon] || Icons.LayoutGrid;

              return (
                <motion.div key={category.name} variants={itemVariants}>
                  <Link href={'/search?type=service&category=' + encodeURIComponent(category.name)} className="group block h-full">
                    <motion.div
                      whileHover={{ scale: 1.05, y: -10 }}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        "relative h-full aspect-square p-6 flex flex-col items-center justify-center text-center gap-5 cursor-pointer rounded-[2rem] border overflow-hidden",
                        "bg-white border-slate-100 shadow-sm"
                      )}
                    >
                      {/* Animated wave background on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[#22BC9F]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem]" />
                      
                      <div className="relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center bg-[#22BC9F]/10 text-[#22BC9F] transition-all duration-500 group-hover:bg-[#22BC9F] group-hover:text-white group-hover:shadow-lg group-hover:shadow-[#22BC9F]/30 group-hover:scale-110">
                        {IconComponent && <IconComponent className="w-8 h-8" strokeWidth={2} />}
                      </div>
                      
                      <span className="relative z-10 font-bold text-slate-800 text-lg group-hover:text-[#22BC9F] transition-colors duration-300">
                        {category.name}
                      </span>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
      </motion.div>
      
      <div className="mt-8 text-center md:hidden">
        <Link
          href="/search?type=service"
          className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-slate-100 text-[#1E293B] font-bold"
        >
          عرض الكل
        </Link>
      </div>
    </section>
  );
}
