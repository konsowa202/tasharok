'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, Sparkles } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import HeroAnimation from './HeroAnimation';

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      router.push(`/search?type=service&q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <section className="relative w-full pt-16 pb-20 lg:pt-24 lg:pb-32 overflow-hidden bg-white">
      {/* Very clean subtle background tint, similar to premium sites */}
      <div className="absolute inset-0 bg-slate-50/50 pointer-events-none" />



      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Hero text */}
          <div className="text-center lg:text-right z-10">
            <Reveal delay={0.1}>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-[#1E293B] leading-[1.2] tracking-tight mb-6 animate-slide-up">
                اختبر السعودية بأسعار <span className="text-[#22BC9F]">تشارك</span>
              </h1>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="text-lg text-slate-500 font-medium max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
                انضم إلى آلاف العملاء الذين يوفرون على خدماتهم اليومية. من المساج والعناية بالأسنان إلى
                صيانة السيارات والنوادي الرياضية - احصل على أسعار الجملة عندما نشتري معاً.
              </p>
            </Reveal>

            {/* Search bar */}
            <Reveal delay={0.3}>
              <form onSubmit={handleSearchSubmit} className="relative max-w-xl mx-auto lg:mx-0 mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ما الخدمة التي تبحث عنها؟"
                    className="w-full h-16 pr-14 pl-32 rounded-3xl border-2 border-slate-100 bg-white text-slate-900 placeholder:text-slate-400 font-bold focus:outline-none focus:border-[#22BC9F] transition-all"
                  />
                  <div className="absolute right-5 text-slate-400">
                    <Search className="w-6 h-6" />
                  </div>
                  <button
                    type="submit"
                    className="absolute left-2 h-12 px-6 rounded-2xl bg-[#1E293B] text-white font-bold text-base hover:bg-slate-800 transition-colors flex items-center gap-2"
                  >
                    بحث
                  </button>
                </div>
              </form>
            </Reveal>

            <Reveal delay={0.4}>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <Link
                  href="/search?type=service"
                  className="w-full sm:w-auto px-8 py-4 rounded-3xl bg-[#22BC9F] text-white font-black text-lg hover:bg-[#1da88d] transition-all flex items-center justify-center gap-2 hover:-translate-y-1 hover:shadow-lg"
                >
                  استكشف الخدمات
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <Link
                  href="/search?type=product"
                  className="w-full sm:w-auto px-8 py-4 rounded-3xl bg-transparent text-[#1E293B] font-black text-lg hover:text-[#22BC9F] transition-colors flex items-center justify-center gap-2"
                >
                  تصفح المنتجات
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Hero animated graphics */}
          <div className="relative z-0">
            <Reveal delay={0.2} className="relative mx-auto w-full max-w-lg h-full flex flex-col justify-center mt-8 lg:mt-0">
              <HeroAnimation />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
