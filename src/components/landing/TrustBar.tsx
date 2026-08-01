'use client';

import React from 'react';
import { Percent, Sparkles, Store, Users } from 'lucide-react';
import AnimatedCard from '@/components/ui/AnimatedCard';
import CountUp from '@/components/ui/CountUp';
import Reveal from '@/components/ui/Reveal';

const STATS = [
  {
    icon: <Sparkles className="w-6 h-6" />,
    color: '#22BC9F',
    value: <CountUp prefix="+" suffix=" خدمة" end={500} />,
    label: 'خدمات متنوعة',
  },
  {
    icon: <Store className="w-6 h-6" />,
    color: '#007FB7',
    value: <CountUp prefix="+" suffix=" مقدم" end={200} />,
    label: 'مقدم خدمة',
  },
  {
    icon: <Percent className="w-6 h-6" />,
    color: '#D4AF37',
    value: <CountUp suffix="%" end={70} />,
    label: 'وفر حتى',
  },
  {
    icon: <Users className="w-6 h-6" />,
    color: '#006C35',
    value: <CountUp prefix="+" suffix=" عميل" end={50000} formatter={(v) => v.toLocaleString('en-US')} />,
    label: 'عميل سعيد',
  },
];

export default function TrustBar() {
  return (
    <section className="relative z-20 -mt-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <AnimatedCard className="bg-white shadow-xl shadow-slate-200/60 border border-slate-100 p-8 lg:p-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div
                    className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-3"
                    style={{ backgroundColor: `${stat.color}1A`, color: stat.color }}
                  >
                    {stat.icon}
                  </div>
                  <div className="font-display text-3xl lg:text-4xl font-black text-[#1E293B]">
                    {stat.value}
                  </div>
                  <p className="text-slate-500 font-medium mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </AnimatedCard>
        </Reveal>
      </div>
    </section>
  );
}
