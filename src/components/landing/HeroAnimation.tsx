'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CheckCircle2, Percent, Sparkles } from 'lucide-react';

export default function HeroAnimation() {
  return (
    <div className="relative w-full h-[500px] md:h-[650px] flex items-center justify-center">
      
      {/* Background Abstract Glows */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
        viewport={{ once: false, margin: "-100px" }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#22BC9F] rounded-full blur-[90px]"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.2, 1] }}
        viewport={{ once: false, margin: "-100px" }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-[#007FB7] rounded-full blur-[70px]"
      />

      {/* Main Hyper-Realistic Phone Mockup */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: [-10, 10, -10], opacity: 1 }}
        viewport={{ once: false, margin: "-100px" }}
        transition={{ 
          y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 0.5 }
        }}
        className="relative z-10 w-[290px] h-[600px] bg-white rounded-[3.5rem] flex flex-col"
        style={{
          // Hyper-realistic iPhone borders: Black inner bezel, dark grey metallic outer rim, and strong drop shadow
          boxShadow: 'inset 0 0 0 10px #09090b, inset 0 0 0 12px #3f3f46, 0 30px 60px -15px rgba(0,0,0,0.3)',
          padding: '10px' // Space for the bezel
        }}
      >
        {/* Hardware Buttons */}
        <div className="absolute top-28 -left-[2px] w-[3px] h-8 bg-[#3f3f46] rounded-l-md" /> {/* Mute */}
        <div className="absolute top-44 -left-[2px] w-[3px] h-12 bg-[#3f3f46] rounded-l-md" /> {/* Vol Up */}
        <div className="absolute top-60 -left-[2px] w-[3px] h-12 bg-[#3f3f46] rounded-l-md" /> {/* Vol Down */}
        <div className="absolute top-48 -right-[2px] w-[3px] h-16 bg-[#3f3f46] rounded-r-md" /> {/* Power */}
        
        {/* Screen Area (Inside Bezel) */}
        <div className="relative w-full h-full bg-slate-50 rounded-[3rem] overflow-hidden shadow-inner flex flex-col">
          
          {/* Glass Reflection Overlay */}
          <div className="absolute top-0 right-0 w-[150%] h-full bg-gradient-to-tr from-transparent via-white/10 to-transparent -rotate-45 pointer-events-none z-50" />

          {/* Dynamic Island */}
          <div className="absolute top-2 inset-x-0 h-7 flex justify-center z-50">
            <div className="w-24 h-[26px] bg-black rounded-full flex items-center justify-end px-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#111] border border-white/10" />
            </div>
          </div>

          {/* Mock App Header */}
          <div className="pt-12 pb-4 px-5 bg-white border-b border-slate-100 flex justify-between items-center z-40 relative shadow-sm">
            <div className="w-24 h-7 relative">
              <Image src="/logo-02.png" alt="Logo" fill className="object-contain object-right" />
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#22BC9F] to-[#007FB7] shadow-sm flex items-center justify-center text-white text-xs font-bold ring-2 ring-white">
              JD
            </div>
          </div>

          {/* Mock App Content */}
          <div className="flex-1 bg-slate-50/50 p-4 space-y-4 overflow-hidden relative">
            
            {/* Featured Deal Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: 0.3, type: "spring" }}
              className="bg-white rounded-3xl p-3.5 shadow-sm border border-slate-100 relative z-10"
            >
              <div className="relative w-full h-32 bg-slate-100 rounded-2xl mb-4 flex items-center justify-center overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
                <Image src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=400&q=80" alt="Watch" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-2 right-2 bg-gradient-to-r from-[#007FB7] to-[#22BC9F] text-white px-2.5 py-1 rounded-xl text-[10px] font-black z-20 shadow-lg">
                  وفر 45%
                </div>
              </div>
              <h4 className="font-bold text-slate-800 text-sm mb-1 leading-tight">ساعة أبل الذكية الفئة الثامنة</h4>
              <div className="flex items-end gap-2 mb-4">
                <span className="text-lg font-black text-[#22BC9F]">899 ريال</span>
                <span className="text-[10px] text-slate-400 line-through mb-1">1,600 ريال</span>
              </div>
              
              {/* Animated Mock Progress Bar */}
              <div className="mb-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-2">
                  <span className="text-[#007FB7]">المشاركين: 8</span>
                  <span>الهدف: 10</span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: "80%" }}
                    viewport={{ once: false }}
                    transition={{ duration: 1.5, delay: 0.8, type: "spring" }}
                    className="h-full bg-gradient-to-r from-[#007FB7] to-[#22BC9F] relative"
                  >
                    <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse" />
                  </motion.div>
                </div>
              </div>
              
              <button className="w-full py-2.5 rounded-xl bg-[#22BC9F] text-white font-black text-[11px] shadow-md shadow-[#22BC9F]/20">
                انضم للمجموعة الآن
              </button>
            </motion.div>

            {/* Secondary Deal Card */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{ delay: 0.6, type: "spring" }}
              className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100 flex gap-3 items-center relative z-10"
            >
              <div className="w-14 h-14 bg-slate-100 rounded-xl relative overflow-hidden shrink-0">
                 <Image src="https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=200&q=80" alt="Laptop" fill className="object-cover" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-800 text-[11px] mb-1 leading-tight">لابتوب ماك بوك برو M2</h4>
                <div className="flex justify-between items-center">
                  <span className="text-[13px] font-black text-[#22BC9F]">4,500 ريال</span>
                  <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-[8px] font-bold">
                    🔥
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </motion.div>

      {/* Chic Floating Stars */}
      
      {/* Star 1: Top Right */}
      <motion.div 
        initial={{ opacity: 0, scale: 0, x: -50, y: 100, rotate: -90 }}
        whileInView={{ 
          opacity: 1, 
          scale: 1, 
          x: 0, 
          y: 0, 
          rotate: 0 
        }}
        viewport={{ once: false }}
        transition={{ duration: 1.2, type: "spring", bounce: 0.3 }}
        className="absolute top-12 right-2 md:-right-8 z-30 text-[#22BC9F]"
      >
        <Sparkles className="w-12 h-12 md:w-16 md:h-16 drop-shadow-[0_0_15px_rgba(34,188,159,0.6)]" />
      </motion.div>

      {/* Star 2: Bottom Left */}
      <motion.div 
        initial={{ opacity: 0, scale: 0, x: 50, y: -100, rotate: 90 }}
        whileInView={{ 
          opacity: 1, 
          scale: 1,
          x: 0,
          y: 0, 
          rotate: 0 
        }}
        viewport={{ once: false }}
        transition={{ duration: 1.2, delay: 0.2, type: "spring", bounce: 0.3 }}
        className="absolute bottom-24 left-2 md:-left-8 z-30 text-[#007FB7]"
      >
        <Sparkles className="w-10 h-10 md:w-14 md:h-14 drop-shadow-[0_0_15px_rgba(0,127,183,0.6)]" />
      </motion.div>

    </div>
  );
}
