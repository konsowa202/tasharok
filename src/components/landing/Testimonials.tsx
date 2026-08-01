'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { fetchTestimonials } from './data';

interface Testimonial {
  id: string;
  name: string;
  rating: number;
  content: string;
  avatar_url?: string;
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    fetchTestimonials().then(setTestimonials);
  }, []);

  if (testimonials.length === 0) return null;

  return (
    <section className="py-24 bg-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-4xl lg:text-5xl font-black text-[#1E293B] mb-4"
        >
          ماذا يقول عملاؤنا
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-slate-500 font-bold text-lg"
        >
          تجارب حقيقية من مستخدمي تشارك
        </motion.p>
      </div>

      <div className="relative flex w-full overflow-hidden" dir="ltr">
        {/* Left and Right Fade Masks for smooth entry/exit */}
        <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <motion.div 
          animate={{ x: [0, -2000] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="flex gap-6 px-4 hover:[animation-play-state:paused] w-max cursor-grab active:cursor-grabbing"
        >
          {[...testimonials, ...testimonials, ...testimonials, ...testimonials].map((testimonial, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10, scale: 1.02 }}
              className="w-[350px] shrink-0 p-8 rounded-[2rem] bg-white border-2 border-slate-50 shadow-[0_10px_40px_rgba(0,0,0,0.03)] flex flex-col h-full"
              dir="rtl"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-slate-100 overflow-hidden relative">
                  {testimonial.avatar_url ? (
                    <Image
                      src={testimonial.avatar_url}
                      alt={testimonial.name || 'عميل'}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#22BC9F] to-[#007FB7] text-white font-bold text-xl">
                      {(testimonial.name || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-[#1E293B] text-lg">{testimonial.name || 'عميل تشارك'}</h4>
                  <div className="flex gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          'w-4 h-4',
                          i < (testimonial.rating || 5)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-200'
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <p className="text-slate-600 font-medium leading-relaxed italic relative z-10 flex-1">
                <span className="text-4xl text-[#22BC9F]/20 absolute -top-4 -right-2 -z-10">"</span>
                {testimonial.content}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
