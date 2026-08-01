'use client';

import React, { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { fetchPartnersMarquee } from './data';

export default function PartnersMarquee() {
  const [partners, setPartners] = useState<{ store_name: string }[]>([]);

  useEffect(() => {
    fetchPartnersMarquee().then(setPartners);
  }, []);

  if (partners.length === 0) return null;

  return (

    <section className="py-8 bg-white border-y border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-center">
        <p className="text-sm font-bold text-slate-400">شركاؤنا ومقدمو الخدمات الموثوقون</p>
      </div>

      <div className="relative flex w-full overflow-hidden">
        {/* We use a custom style block to ensure RTL marquee works perfectly */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes scroll-rtl {
            0% { transform: translateX(0); }
            100% { transform: translateX(50%); }
          }
          .animate-marquee-rtl {
            animation: scroll-rtl 30s linear infinite;
            width: max-content;
          }
        `}} />
        <div className="flex animate-marquee-rtl gap-8 whitespace-nowrap px-4 hover:[animation-play-state:paused]">
          {[...partners, ...partners, ...partners, ...partners, ...partners].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100 text-slate-600 font-bold transition-all duration-300 hover:text-[#007FB7] hover:border-[#007FB7]/30 hover:bg-[#007FB7]/5 hover:-translate-y-1 hover:shadow-md cursor-pointer"
            >
              <ShieldCheck className="w-5 h-5 text-[#22BC9F]" />
              <span>{item.store_name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
