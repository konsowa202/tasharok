'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import ServiceCard from '@/components/ServiceCard';
import { fetchFeaturedServices } from './data';
import type { Product } from '@/lib/types';

export default function FeaturedServices() {
  const [services, setServices] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedServices()
      .then(setServices)
      .finally(() => setLoading(false));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, bounce: 0.3, duration: 0.8 } }
  };

  return (
    <section id="services">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-center justify-between mb-10"
      >
        <div>
          <h2 className="font-display text-4xl lg:text-5xl font-black text-[#1E293B] mb-3">
            خدمات مميزة للشراء الجماعي
          </h2>
          <p className="text-slate-500 font-medium text-lg">أفضل الخدمات بأسعار لا تقبل المنافسة</p>
        </div>
        <Link
          href="/search?type=service"
          className="hidden sm:inline-flex items-center gap-1.5 text-[#22BC9F] font-bold hover:underline shrink-0"
        >
          عرض كل الخدمات
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="flex overflow-x-auto pb-6 -mx-4 px-4 snap-x snap-mandatory gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:overflow-x-visible md:pb-0 md:mx-0 md:px-0 md:snap-none md:gap-6 hide-scrollbar"
      >
        {loading
          ? Array(4)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="h-[360px] min-w-[85vw] sm:min-w-[320px] md:min-w-0 bg-slate-50 rounded-[2rem] border border-slate-100 animate-pulse snap-center"
                />
              ))
          : services.map((service) => (
              <motion.div 
                key={service.id} 
                variants={itemVariants} 
                whileHover={{ y: -5 }}
                className="h-full min-w-[85vw] sm:min-w-[320px] md:min-w-0 snap-center"
              >
                <ServiceCard service={service} />
              </motion.div>
            ))}
      </motion.div>

      <div className="mt-8 text-center sm:hidden">
        <Link
          href="/search?type=service"
          className="inline-flex items-center gap-1.5 text-[#22BC9F] font-bold hover:underline"
        >
          عرض كل الخدمات
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
