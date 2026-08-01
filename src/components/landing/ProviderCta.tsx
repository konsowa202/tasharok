'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';

// Array of chic product/service images and logos for the background
const BACKGROUND_ITEMS = [
  { type: 'image', src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80', size: 'w-48 h-32' },
  { type: 'logo', src: '/logo-03.png', size: 'w-24 h-24' },
  { type: 'image', src: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=300&q=80', size: 'w-32 h-40' },
  { type: 'image', src: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=300&q=80', size: 'w-40 h-40' },
  { type: 'logo', src: '/logo-04.png', size: 'w-32 h-32' },
  { type: 'image', src: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=300&q=80', size: 'w-48 h-48' },
  { type: 'image', src: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=300&q=80', size: 'w-32 h-32' },
  { type: 'image', src: 'https://images.unsplash.com/photo-1521556662401-42294f419c72?auto=format&fit=crop&w=300&q=80', size: 'w-40 h-56' },
  { type: 'logo', src: '/logo-02.png', size: 'w-32 h-32' },
  { type: 'image', src: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=300&q=80', size: 'w-56 h-40' },
];

export default function ProviderCta() {
  return (
    <section className="relative overflow-hidden bg-[#0F172A] py-32 my-20">
      
      {/* Dynamic Floating Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ y: [0, -1000] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-0 w-full flex flex-wrap justify-center gap-10 p-10 opacity-70"
        >
          {/* Repeat items to ensure continuous scroll */}
          {[...BACKGROUND_ITEMS, ...BACKGROUND_ITEMS, ...BACKGROUND_ITEMS, ...BACKGROUND_ITEMS].map((item, i) => {
            const xOffset = (i % 3 === 0) ? 'translate-x-12' : (i % 2 === 0) ? '-translate-x-16' : 'translate-x-4';
            
            return (
              <motion.div
                key={i}
                animate={{ y: [0, 20, 0], rotate: [0, i % 2 === 0 ? 5 : -5, 0] }}
                transition={{ duration: 6 + (i % 5), repeat: Infinity, ease: "easeInOut" }}
                className={`relative rounded-3xl overflow-hidden shadow-2xl ${item.size} ${xOffset} border border-white/20 bg-slate-800`}
              >
                <Image
                  src={item.src}
                  alt="Background"
                  fill
                  className={item.type === 'logo' ? 'object-contain p-4' : 'object-cover'}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Dark Overlay without heavy blur so images are visible */}
      <div className="absolute inset-0 bg-[#0F172A]/60 pointer-events-none" />

      {/* Animated Glowing Orbs */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#22BC9F] rounded-full blur-[150px] pointer-events-none mix-blend-screen" 
      />
      <motion.div 
        animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#007FB7] rounded-full blur-[150px] pointer-events-none mix-blend-screen" 
      />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="w-24 h-24 mx-auto bg-white/10 rounded-[2rem] flex items-center justify-center mb-8 backdrop-blur-xl border border-white/20 shadow-2xl"
        >
          <Building2 className="w-12 h-12 text-[#22BC9F]" />
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight drop-shadow-2xl"
        >
          هل أنت مزود خدمة <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22BC9F] to-[#007FB7]">مميز؟</span>
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-2xl text-slate-200 font-medium mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-lg"
        >
          انضم إلى شبكة مزودي <span className="text-[#22BC9F] font-bold">تشارك</span> واعرض خدماتك ومنتجاتك
          لآلاف العملاء الجاهزين للشراء المباشر.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link
            href="/supplier/register"
            className="inline-flex items-center gap-3 px-12 py-6 rounded-full bg-white text-[#0F172A] font-black text-xl hover:bg-[#22BC9F] hover:text-white transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(34,188,159,0.5)] group"
          >
            سجل كمزود خدمة الآن
            <ArrowLeft className="w-6 h-6 group-hover:-translate-x-2 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
