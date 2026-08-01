'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/lib/utils';
import { Package, PlusCircle, Edit, Trash2, Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight, Copy, Share2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

type Product = {
  id: string;
  title: string;
  tasharok_price: number;
  original_price: number;
  target_quantity: number;
  current_reserved_quantity: number;
  status: string;
  image_url: string;
  item_type?: 'product' | 'service';
  created_at: string;
};

const TABS = [
  { id: 'all', label: 'كل المنتجات' },
  { id: 'approved', label: 'نشط' },
  { id: 'pending', label: 'قيد المراجعة' },
  { id: 'rejected', label: 'مرفوض' },
];

export default function MerchantProducts() {
  const { user } = useAuth();
  const supabase = createClient();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      if (!user) return;
      setLoading(true);
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('merchant_id', user.id)
        .order('created_at', { ascending: false });

      if (data) setProducts(data as Product[]);
      setLoading(false);
    };

    fetchProducts();
  }, [user]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-xs font-bold border border-emerald-100/50">نشط</span>;
      case 'pending':
        return <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-lg text-xs font-bold border border-amber-100/50">قيد المراجعة</span>;
      case 'rejected':
        return <span className="bg-rose-50 text-rose-600 px-3 py-1 rounded-lg text-xs font-bold border border-rose-100/50">مرفوض</span>;
      default:
        return null;
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesTab = activeTab === 'all' || product.status === activeTab;
    const matchesSearch = search === '' || product.title.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6 font-arabic animate-in fade-in duration-500" dir="rtl">
      
      {/* Header & Stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100 gap-4 sm:gap-0">
        <div className="flex gap-10">
          <div>
            <p className="text-xs text-slate-500 font-bold mb-1">إجمالي المنتجات</p>
            <p className="text-xl font-black text-slate-800">{products.length}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold mb-1">نشط</p>
            <p className="text-xl font-black text-emerald-600">
              {products.filter(p => p.status === 'approved').length}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50">
            تصدير الكتالوج
          </button>
          <Link 
            href="/merchant/products/new"
            className="flex items-center gap-2 px-4 py-2 bg-[#4F46E5] text-white rounded-lg text-sm font-bold shadow-sm hover:bg-[#4338CA]"
          >
            <PlusCircle className="w-4 h-4" /> إضافة منتج
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-center px-6 py-4 border-b border-slate-100 gap-4 md:gap-0">
          <div className="flex space-x-6 space-x-reverse w-full md:w-auto overflow-x-auto hide-scrollbar">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-sm font-bold pb-4 -mb-4 border-b-2 transition-colors whitespace-nowrap px-2 ${
                  activeTab === tab.id ? 'border-[#4F46E5] text-[#4F46E5]' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <input 
                type="text" 
                placeholder="البحث عن منتج..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pr-10 pl-4 py-1.5 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/50 text-sm w-full md:w-48 shadow-inner"
              />
              <Search className="absolute right-3 top-2 w-4 h-4 text-slate-400" />
            </div>
            <button className="p-1.5 text-slate-400 hover:text-slate-600 border border-slate-200 rounded-md">
              <Filter className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-slate-400 hover:text-slate-600 border border-slate-200 rounded-md">
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="p-12 text-center text-slate-400 font-bold">جاري تحميل البيانات...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <Package className="w-12 h-12 text-slate-200 mb-4" />
            <p className="text-slate-500 font-bold mb-4">لا توجد منتجات.</p>
            <Link href="/merchant/products/new" className="text-[#4F46E5] font-bold hover:underline">أضف أول منتج لك</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-white text-slate-400 text-xs tracking-wider">
                  <th className="px-6 py-4 font-bold border-b border-slate-100 w-12">
                    <input type="checkbox" className="rounded border-slate-300 text-[#4F46E5] focus:ring-[#4F46E5]" />
                  </th>
                  <th className="px-6 py-4 font-bold border-b border-slate-100">المنتج / الخدمة</th>
                  <th className="px-6 py-4 font-bold border-b border-slate-100 text-center">النوع</th>
                  <th className="px-6 py-4 font-bold border-b border-slate-100">السعر</th>
                  <th className="px-6 py-4 font-bold border-b border-slate-100">المخزون / الهدف</th>
                  <th className="px-6 py-4 font-bold border-b border-slate-100">تاريخ الإضافة</th>
                  <th className="px-6 py-4 font-bold border-b border-slate-100 text-center">الحالة</th>
                  <th className="px-6 py-4 font-bold border-b border-slate-100 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4">
                      <input type="checkbox" className="rounded border-slate-300 text-[#4F46E5] focus:ring-[#4F46E5]" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden relative shrink-0">
                          {product.image_url ? (
                            <Image src={product.image_url} alt={product.title} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300"><Package className="w-6 h-6"/></div>
                          )}
                        </div>
                        <div className="font-bold text-slate-800 text-sm">{product.title}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {product.item_type === 'service' ? (
                        <span className="bg-purple-50 text-purple-600 px-3 py-1 rounded-lg text-xs font-bold border border-purple-100/50">خدمة</span>
                      ) : (
                        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold border border-blue-100/50">منتج</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-black text-slate-800">{formatPrice(product.tasharok_price)} <span className="text-xs text-slate-400">ريال</span></div>
                      {product.original_price > product.tasharok_price && (
                        <div className="text-xs text-slate-400 line-through mt-0.5">{formatPrice(product.original_price)} ريال</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 max-w-[100px]">
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden" dir="ltr">
                            <div 
                              className="h-full rounded-full transition-all duration-1000 ease-out bg-[#4F46E5]"
                              style={{ width: `${Math.min(Math.round((product.current_reserved_quantity / product.target_quantity) * 100), 100)}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-xs font-bold text-slate-600" dir="ltr">
                          {product.current_reserved_quantity}/{product.target_quantity}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-500">
                      {new Date(product.created_at).toLocaleDateString('ar-EG')}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(product.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-1.5 text-slate-400 hover:text-[#4F46E5] bg-slate-50 hover:bg-indigo-50 rounded-lg transition border border-slate-200" title="تعديل">
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-emerald-500 bg-slate-50 hover:bg-emerald-50 rounded-lg transition border border-slate-200" title="مشاركة الرابط">
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-rose-500 bg-slate-50 hover:bg-rose-50 rounded-lg transition border border-slate-200" title="حذف">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination mock */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-slate-100 gap-2">
          <button className="p-1 rounded-md text-slate-400 border border-slate-200 hover:bg-slate-50"><ChevronRight className="w-4 h-4" /></button>
          <button className="p-1 rounded-md text-slate-400 border border-slate-200 hover:bg-slate-50"><ChevronLeft className="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  );
}
