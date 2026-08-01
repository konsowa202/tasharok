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
import type { Product } from '@/lib/types';

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
        
        {showCountdown && (
          <div className="absolute bottom-2 left-2 right-2 flex justify-center">
            <DealCountdown className="text-[10px] shadow-sm backdrop-blur-md bg-white/90 border-white/20" />
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

        <div className="flex items-end gap-2 mb-4 mt-auto">
          <span className="text-xl font-black text-[#1E293B] leading-none">
            {formatPrice(service.tasharok_price)}
            <span className="text-[10px] text-slate-500 font-bold mr-1">ر.س</span>
          </span>
          <span className="text-[11px] text-slate-400 line-through font-bold mb-0.5">
            {formatPrice(service.original_price)}
          </span>
          {savings > 0 && (
            <span className="bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded text-[10px] font-bold mr-auto mb-0.5 border border-emerald-100">
              -{savings}%
            </span>
          )}
        </div>

        <div className="mt-1">
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
