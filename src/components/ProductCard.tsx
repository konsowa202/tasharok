'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ProgressBar from '@/components/ProgressBar';
import { useCart } from '@/context/CartContext';
import { calculateSavings, formatPrice } from '@/lib/utils';
import type { Product } from '@/lib/types';

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const savings = calculateSavings(product.original_price, product.tasharok_price);

  return (
    <div
      onClick={() => router.push(`/product/${product.id}`)}
      className="group cursor-pointer flex flex-col h-full bg-white rounded-[1.5rem] border border-slate-100/60 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-[#007FB7]/5 hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-50">
        <Image
          src={product.image_url}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {/* Subtle gradient overlay for polish */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="p-4 flex flex-col flex-1 bg-white border-t border-slate-50/50">
        <p className="text-[11px] font-bold text-slate-400 mb-1.5 flex items-center gap-1">
          {product.store_name}
          {product.category_name && <span className="text-[#007FB7]">• {product.category_name}</span>}
        </p>
        
        <h3 className="font-bold text-slate-800 text-sm line-clamp-1 mb-3 group-hover:text-[#007FB7] transition-colors leading-relaxed">
          {product.title}
        </h3>

        <div className="flex items-end gap-2 mb-4 mt-auto">
          <span className="text-xl font-black text-[#1E293B] leading-none">
            {formatPrice(product.tasharok_price)}
            <span className="text-[10px] text-slate-500 font-bold mr-1">ر.س</span>
          </span>
          <span className="text-[11px] text-slate-400 line-through font-bold mb-0.5">
            {formatPrice(product.original_price)}
          </span>
          {savings > 0 && (
            <span className="bg-[#007FB7]/10 text-[#007FB7] px-1.5 py-0.5 rounded text-[10px] font-bold mr-auto mb-0.5 border border-[#007FB7]/20">
              -{savings}%
            </span>
          )}
        </div>

        <div className="mt-1">
          <ProgressBar
            current={product.current_reserved_quantity}
            target={product.target_quantity}
            variant="compact"
          />
        </div>
      </div>
    </div>
  );
}
