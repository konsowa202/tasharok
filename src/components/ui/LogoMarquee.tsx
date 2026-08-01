'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface LogoMarqueeProps {
  items: { name: string; icon?: React.ReactNode }[];
  className?: string;
  reverse?: boolean;
  speed?: 'slow' | 'normal' | 'fast';
}

export default function LogoMarquee({
  items,
  className,
  reverse = false,
  speed = 'normal',
}: LogoMarqueeProps) {
  const speedClass = {
    slow: '[animation-duration:40s]',
    normal: '[animation-duration:30s]',
    fast: '[animation-duration:20s]',
  }[speed];

  const duplicatedItems = [...items, ...items, ...items, ...items];

  return (
    <div className={cn('overflow-hidden w-full', className)}>
      <div
        className={cn(
          'flex items-center gap-12 w-max',
          reverse ? 'animate-marquee-reverse' : 'animate-marquee',
          speedClass
        )}
      >
        {duplicatedItems.map((item, idx) => (
          <div
            key={`${item.name}-${idx}`}
            className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/60 border border-slate-100 shadow-sm shrink-0"
          >
            {item.icon && <span className="text-[#22BC9F]">{item.icon}</span>}
            <span className="font-bold text-slate-700 whitespace-nowrap">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
