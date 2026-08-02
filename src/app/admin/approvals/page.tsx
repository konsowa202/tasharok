'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { formatPrice } from '@/lib/utils';
import { Check, X, Box, Search, Filter } from 'lucide-react';
import Image from 'next/image';

type PendingProduct = {
  id: string;
  title: string;
  description: string;
  tasharok_price: number;
  original_price: number;
  target_quantity: number;
  image_url: string;
  merchant_profiles: { store_name: string } | null;
};

export default function AdminApprovals() {
  const [products, setProducts] = useState<PendingProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const supabase = createClient();

  const fetchPending = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('products')
      .select('*, merchant_profiles(store_name)')
      .eq('status', 'pending');

    if (data) {
      setProducts(data as unknown as PendingProduct[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (id: string) => {
    await supabase.from('products').update({ status: 'approved' }).eq('id', id);
    fetchPending();
  };

  const handleReject = async (id: string) => {
    const reason = window.prompt('يرجى كتابة سبب الرفض ليتم إرساله للتاجر:');
    if (reason === null) return;
    
    await supabase.from('products').update({ 
      status: 'rejected',
      admin_notes: reason
    }).eq('id', id);
    fetchPending();
  };

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.merchant_profiles?.store_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 font-arabic animate-in fade-in duration-500" dir="rtl">
      
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex gap-10">
          <div>
            <h1 className="text-xl font-black text-slate-900">طلبات الاعتماد المعلقة</h1>
            <p className="text-sm text-slate-500 font-medium mt-1">مراجعة المنتجات الجديدة المقدمة من التجار</p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="bg-amber-50 text-amber-600 px-4 py-2 rounded-xl text-sm font-bold border border-amber-100">
            {products.length} معلق
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="البحث عن منتج أو تاجر..." 
            className="w-full pr-10 pl-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 flex items-center gap-2 transition">
            <Filter className="w-4 h-4" /> تصفية
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20 text-slate-400 font-bold">جاري تحميل المنتجات...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-4">
            <Box className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-700">لا توجد طلبات اعتماد</h3>
          <p className="text-sm text-slate-500 mt-1">تمت مراجعة جميع المنتجات.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6 items-start">
              
              <div className="w-full md:w-56 h-56 bg-slate-50 rounded-2xl overflow-hidden shrink-0 relative border border-slate-100">
                <Image 
                  src={product.image_url} 
                  alt={product.title} 
                  fill
                  className="object-cover" 
                />
              </div>

              <div className="flex-1 w-full space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{product.title}</h2>
                    <p className="text-sm text-[#4F46E5] font-bold mt-1">التاجر: {product.merchant_profiles?.store_name}</p>
                  </div>
                  <span className="bg-amber-50 text-amber-600 text-xs font-bold px-3 py-1 rounded-full border border-amber-100">
                    بانتظار المراجعة
                  </span>
                </div>
                
                <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">{product.description}</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 max-w-3xl">
                  <div>
                    <p className="text-xs text-slate-500 font-bold">سعر تشارك</p>
                    <p className="text-lg font-black text-[#4F46E5]">{formatPrice(product.tasharok_price)} ريال</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold">سعر السوق</p>
                    <p className="text-lg font-bold text-slate-400 line-through">{formatPrice(product.original_price)} ريال</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold">نسبة الخصم</p>
                    <p className="text-lg font-bold text-emerald-500" dir="ltr">
                      {Math.round(((product.original_price - product.tasharok_price) / product.original_price) * 100)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold">الكمية المستهدفة</p>
                    <p className="text-lg font-bold text-slate-700">{product.target_quantity} قطعة</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <button 
                    onClick={() => handleApprove(product.id)}
                    className="flex-1 md:flex-none md:w-48 bg-emerald-50 text-emerald-600 border border-emerald-200 font-bold py-2.5 rounded-xl hover:bg-emerald-100 transition flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Check className="w-5 h-5" /> اعتماد المنتج
                  </button>
                  <button 
                    onClick={() => handleReject(product.id)}
                    className="flex-1 md:flex-none md:w-48 bg-rose-50 text-rose-600 border border-rose-200 font-bold py-2.5 rounded-xl hover:bg-rose-100 transition flex items-center justify-center gap-2 shadow-sm"
                  >
                    <X className="w-5 h-5" /> رفض
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
