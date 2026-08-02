'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ProgressBar from '@/components/ProgressBar';
import CountdownTimer from '@/components/CountdownTimer';
import { useCart } from '@/context/CartContext';
import { calculateSavings, formatPrice } from '@/lib/utils';
import type { Product as BaseProduct } from '@/lib/types';

// Extend product type to include new fields from DB schema
type Product = BaseProduct & {
  offer_end_date?: string | null;
  is_timer_active?: boolean;
};
import AnimatedCard from '@/components/ui/AnimatedCard';

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const savings = calculateSavings(product.original_price, product.tasharok_price);

  return (
    <AnimatedCard hover glow="teal" className="group cursor-pointer flex flex-col h-full bg-white rounded-[1.5rem] border border-slate-100/60 overflow-hidden transition-all duration-300">
      <div 
        onClick={() => router.push(`/product/${product.id}`)}
        className="relative aspect-[4/3] w-full overflow-hidden bg-slate-50"
      >
        <Image
          src={product.image_url}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {/* Subtle gradient overlay for polish */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Countdown Timer */}
        {product.is_timer_active && product.offer_end_date && (
          <div className="absolute top-3 right-3 z-10">
            <CountdownTimer endDate={product.offer_end_date} compact />
          </div>
        )}
      </div>

      <div 
        onClick={() => router.push(`/product/${product.id}`)}
        className="p-4 flex flex-col flex-1 bg-white"
      >
        <p className="text-[11px] font-bold text-slate-400 mb-1.5 flex items-center gap-1">
          {product.store_name}
          {product.category_name && <span className="text-[#22BC9F]">• {product.category_name}</span>}
        </p>
        
        <h3 className="font-bold text-slate-800 text-sm line-clamp-1 mb-3 group-hover:text-[#22BC9F] transition-colors leading-relaxed">
          {product.title}
        </h3>

        <div className="flex flex-col mb-4 mt-auto">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[14px] text-red-500 line-through font-extrabold decoration-red-500/50 decoration-2">
              {formatPrice(product.original_price)} ر.س
            </span>
            {savings > 0 && (
              <span className="bg-red-50 text-red-600 px-1.5 py-0.5 rounded text-[10px] font-bold border border-red-100">
                خصم {savings}%
              </span>
            )}
          </div>
          <div className="flex items-end gap-1">
            <span className="text-2xl font-black text-[#22BC9F] leading-none">
              {formatPrice(product.tasharok_price)}
            </span>
            <span className="text-xs text-slate-500 font-bold mb-0.5">ر.س (سعر المجموعة)</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-50">
          <ProgressBar
            current={product.current_reserved_quantity}
            target={product.target_quantity}
            variant="compact"
          />
        </div>
      </div>
    </AnimatedCard>
  );
}
