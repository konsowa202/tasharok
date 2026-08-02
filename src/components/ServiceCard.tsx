'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Clock, MapPin } from 'lucide-react';
import AnimatedCard from '@/components/ui/AnimatedCard';
import ServiceBadge from '@/components/ui/ServiceBadge';
import DealCountdown from '@/components/ui/DealCountdown';
import ProgressBar from '@/components/ProgressBar';
import { useCart } from '@/context/CartContext';
import { calculateSavings, formatPrice } from '@/lib/utils';
import type { Product as BaseProduct } from '@/lib/types';
import CountdownTimer from '@/components/CountdownTimer';

// Extend product type to include new fields from DB schema
type Product = BaseProduct & {
  offer_end_date?: string | null;
  is_timer_active?: boolean;
};

interface ServiceCardProps {
  service: Product;
  showCountdown?: boolean;
}

export default function ServiceCard({ service, showCountdown = true }: ServiceCardProps) {
  const router = useRouter();
  const savings = calculateSavings(service.original_price, service.tasharok_price);

  return (
    <AnimatedCard hover glow="teal" className="group cursor-pointer flex flex-col h-full overflow-hidden border border-slate-100/60 rounded-[1.5rem]">
      <div
        className="relative aspect-[4/3] w-full overflow-hidden bg-slate-50"
        onClick={() => router.push(`/product/${service.id}`)}
      >
        <Image
          src={service.image_url}
          alt={service.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {/* Very subtle gradient to ensure text readability if any */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {/* Countdown Timer */}
        {service.is_timer_active && service.offer_end_date && (
          <div className="absolute top-3 right-3 z-10">
            <CountdownTimer endDate={service.offer_end_date} compact />
          </div>
        )}
      </div>

      <div 
        className="p-4 flex flex-col flex-1 bg-white"
        onClick={() => router.push(`/product/${service.id}`)}
      >
        <p className="text-[11px] font-bold text-slate-400 mb-1.5 flex items-center gap-1">
          {service.category_name || service.store_name}
          {service.item_type === 'service' && <span className="text-[#007FB7]">• خدمة</span>}
        </p>
        
        <h3 className="font-bold text-slate-800 text-sm line-clamp-1 mb-3 group-hover:text-[#22BC9F] transition-colors leading-relaxed">
          {service.title}
        </h3>

        <div className="flex flex-col mb-4 mt-auto">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[14px] text-red-500 line-through font-extrabold decoration-red-500/50 decoration-2">
              {formatPrice(service.original_price)} ر.س
            </span>
            {savings > 0 && (
              <span className="bg-red-50 text-red-600 px-1.5 py-0.5 rounded text-[10px] font-bold border border-red-100">
                خصم {savings}%
              </span>
            )}
          </div>
          <div className="flex items-end gap-1">
            <span className="text-2xl font-black text-[#22BC9F] leading-none">
              {formatPrice(service.tasharok_price)}
            </span>
            <span className="text-xs text-slate-500 font-bold mb-0.5">ر.س (سعر المجموعة)</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-50">
          <ProgressBar
            current={service.current_reserved_quantity}
            target={service.target_quantity}
            variant="compact"
          />
        </div>
      </div>
    </AnimatedCard>
  );
}
