'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProgressBar from '@/components/ProgressBar';
import ServiceBadge from '@/components/ui/ServiceBadge';
import { MOCK_PRODUCTS, Product } from '@/data/mockProducts';
import { createClient } from '@/lib/supabase/client';
import { formatPrice, cn } from '@/lib/utils';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { Filter, Clock } from 'lucide-react';

interface SearchResult extends Product {
  service_duration_minutes?: number;
  service_location_type?: 'at_merchant' | 'home' | 'both';
  service_category_name?: string;
  service_includes?: string[];
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="w-10 h-10 border-4 border-[#22BC9F] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const typeParam = searchParams.get('type') || '';
  const categoryId = searchParams.get('category') || '';

  const [products, setProducts] = useState<SearchResult[]>([]);
  const [serviceCategories, setServiceCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { addToCart } = useCart();

  // Load service categories once for the service filter
  useEffect(() => {
    const fetchServiceCategories = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('service_categories')
          .select('id, name')
          .order('name');

        if (!error && data) {
          setServiceCategories(data as { id: string; name: string }[]);
        }
      } catch {
        // Ignore service category fetch errors
      }
    };

    fetchServiceCategories();
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const supabase = createClient();
        let dbQuery = supabase
          .from('products')
          .select('*, service_categories(name), merchant_profiles(store_name)')
          .eq('status', 'approved');

        if (typeParam === 'service') {
          dbQuery = dbQuery.eq('item_type', 'service');
        } else if (typeParam === 'product') {
          dbQuery = dbQuery.eq('item_type', 'product');
        }

        if (categoryId) {
          if (typeParam === 'service') {
            dbQuery = dbQuery.eq('service_category_id', categoryId);
          } else {
            dbQuery = dbQuery.eq('category_id', categoryId);
          }
        }

        if (query) {
          const terms = query.split(' ').filter((t) => t.trim().length > 0);
          if (terms.length > 0) {
            const orQuery = terms.map((t) => `title.ilike.%${t}%`).join(',');
            dbQuery = dbQuery.or(orQuery);
          }
        }

        const { data, error } = await dbQuery;

        if (!error && data && data.length > 0) {
          const formatted: SearchResult[] = data.map((item: any) => {
            const merchantProfile = Array.isArray(item.merchant_profiles)
              ? item.merchant_profiles[0]
              : item.merchant_profiles;
            const serviceCategory = Array.isArray(item.service_categories)
              ? item.service_categories[0]
              : item.service_categories;

            return {
              id: item.id,
              merchant_id: item.merchant_id,
              title: item.title,
              description: item.description,
              original_price: Number(item.original_price),
              tasharok_price: Number(item.tasharok_price),
              target_quantity: item.target_quantity,
              current_reserved_quantity: item.current_reserved_quantity,
              status: item.status,
              image_url:
                item.image_url ||
                'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
              store_name: merchantProfile?.store_name || 'تاجر تشارك المعتمد',
              category: serviceCategory?.name || item.category,
              item_type: item.item_type || 'product',
              service_duration_minutes: item.service_duration_minutes,
              service_location_type: item.service_location_type,
              service_category_name: serviceCategory?.name,
              service_includes: item.service_includes,
            };
          });
          setProducts(formatted);
        } else {
          // Mock filtering logic for testing if DB is empty
          let filtered = [
            ...MOCK_PRODUCTS,
            ...MOCK_PRODUCTS.map((p) => ({ ...p, id: p.id + '_dup' })),
          ];
          if (query) {
            const terms = query.split(' ').filter((t) => t.trim().length > 0);
            filtered = filtered.filter((p) => terms.some((t) => p.title.includes(t)));
          }
          setProducts(filtered);
        }
      } catch (e) {
        setProducts(MOCK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, categoryId, typeParam]);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/search?${params.toString()}`);
  };

  const setType = (type: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (type) {
      params.set('type', type);
    } else {
      params.delete('type');
    }
    // Clear category because product vs service categories use different IDs
    params.delete('category');
    router.push(`/search?${params.toString()}`);
  };

  const handleReserveQuick = (e: React.MouseEvent, product: SearchResult) => {
    e.stopPropagation();
    addToCart(product, 1);
    router.push('/cart');
  };

  const pageTitle = (() => {
    if (typeParam === 'service') {
      if (query) return `نتائج البحث عن "${query}" في الخدمات`;
      if (categoryId) return 'خدمات التصنيف';
      return 'جميع الخدمات';
    }
    if (typeParam === 'product') {
      if (query) return `نتائج البحث عن "${query}" في المنتجات`;
      if (categoryId) return 'منتجات التصنيف';
      return 'جميع المنتجات';
    }
    if (query) return `نتائج البحث عن "${query}"`;
    if (categoryId) return 'منتجات التصنيف';
    return 'جميع المنتجات';
  })();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] font-arabic text-right" dir="rtl">
      <Header />

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full md:w-64 shrink-0 bg-white p-6 rounded-3xl border border-gray-100 h-fit sticky top-24 shadow-sm">
          <div className="flex items-center gap-2 font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100 text-lg">
            <Filter className="w-5 h-5" /> الفلاتر
          </div>

          <div className="space-y-6">
            {/* Type filter */}
            <div className="border-b border-gray-100 pb-6">
              <h3 className="font-bold text-sm text-gray-700 mb-3">نوع العرض</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: '', label: 'الكل' },
                  { key: 'service', label: 'الخدمات' },
                  { key: 'product', label: 'المنتجات' },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setType(opt.key)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs font-bold border transition',
                      typeParam === opt.key
                        ? 'bg-[#22BC9F] text-white border-[#22BC9F]'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-[#22BC9F] hover:text-[#22BC9F]'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Service category filter */}
            {typeParam === 'service' && serviceCategories.length > 0 && (
              <div className="border-b border-gray-100 pb-6">
                <h3 className="font-bold text-sm text-gray-700 mb-3">تصنيف الخدمة</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => updateParam('category', '')}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs font-bold border transition',
                      !categoryId
                        ? 'bg-[#007FB7] text-white border-[#007FB7]'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-[#007FB7] hover:text-[#007FB7]'
                    )}
                  >
                    الكل
                  </button>
                  {serviceCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => updateParam('category', cat.id)}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-xs font-bold border transition',
                        categoryId === cat.id
                          ? 'bg-[#007FB7] text-white border-[#007FB7]'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-[#007FB7] hover:text-[#007FB7]'
                      )}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="font-bold text-sm text-gray-700 mb-3">السعر</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <label className="flex items-center gap-2 cursor-pointer hover:text-gray-900">
                  <input type="checkbox" className="rounded text-[#007FB7] focus:ring-[#007FB7]" /> أقل من 100 ريال
                </label>
                <label className="flex items-center gap-2 cursor-pointer hover:text-gray-900">
                  <input type="checkbox" className="rounded text-[#007FB7] focus:ring-[#007FB7]" /> 100 - 500 ريال
                </label>
                <label className="flex items-center gap-2 cursor-pointer hover:text-gray-900">
                  <input type="checkbox" className="rounded text-[#007FB7] focus:ring-[#007FB7]" /> 500 - 1000 ريال
                </label>
                <label className="flex items-center gap-2 cursor-pointer hover:text-gray-900">
                  <input type="checkbox" className="rounded text-[#007FB7] focus:ring-[#007FB7]" /> أكثر من 1000 ريال
                </label>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-sm text-gray-700 mb-3">حالة التشارك</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <label className="flex items-center gap-2 cursor-pointer hover:text-gray-900">
                  <input type="checkbox" className="rounded text-[#007FB7] focus:ring-[#007FB7]" /> أوشك على الاكتمال
                </label>
                <label className="flex items-center gap-2 cursor-pointer hover:text-gray-900">
                  <input type="checkbox" className="rounded text-[#007FB7] focus:ring-[#007FB7]" /> جديد
                </label>
              </div>
            </div>
          </div>
        </aside>

        {/* Results Area */}
        <div className="flex-1">
          <div className="mb-6">
            <h1 className="text-2xl font-black text-gray-900">{pageTitle}</h1>
            <p className="text-gray-500 mt-1">{products.length} نتيجة</p>
          </div>

          {loading ? (
            <div className="py-20 text-center text-gray-500 font-bold">جاري البحث...</div>
          ) : products.length === 0 ? (
            <div className="py-20 text-center text-gray-500 bg-white rounded-3xl border border-gray-100">
              <p className="text-xl font-bold text-gray-800 mb-2">لم نجد أية نتائج</p>
              <p>حاول البحث بكلمات مختلفة أو تصفح التصنيفات الأخرى.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  onClick={() => router.push(`/product/${product.id}`)}
                  className="group cursor-pointer flex flex-col h-full bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-[#22BC9F] hover:shadow-lg transition-all duration-300"
                >
                  <div className="aspect-square relative w-full bg-gray-50 border-b border-gray-100">
                    <Image
                      src={product.image_url}
                      alt={product.title}
                      fill
                      className="object-cover mix-blend-multiply p-2 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-bold text-gray-800 shadow-sm border border-gray-200">
                      {product.store_name}
                    </div>
                    <div className="absolute top-2 left-2">
                      <ServiceBadge itemType={product.item_type || 'product'} size="sm" />
                    </div>
                  </div>

                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-bold text-gray-900 text-sm md:text-base line-clamp-2 min-h-[44px] mb-2 leading-snug group-hover:text-[#007FB7] transition-colors">
                      {product.title}
                    </h3>

                    {product.item_type === 'service' && product.service_duration_minutes ? (
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
                        <Clock className="w-3.5 h-3.5 text-[#22BC9F]" />
                        <span>{product.service_duration_minutes} دقيقة</span>
                      </div>
                    ) : null}

                    <div className="flex items-end gap-2 mb-4">
                      <span className="text-lg md:text-2xl font-black text-black">
                        {formatPrice(product.tasharok_price)} ريال
                      </span>
                      <span className="text-xs md:text-sm text-gray-400 line-through mb-1">
                        {formatPrice(product.original_price)} ريال
                      </span>
                    </div>

                    <div className="mt-auto flex flex-col gap-3">
                      <div className="w-full">
                        <ProgressBar
                          current={product.current_reserved_quantity}
                          target={product.target_quantity}
                        />
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleReserveQuick(e, product)}
                      className="mt-4 w-full bg-white border-2 border-[#22BC9F] text-[#22BC9F] py-2 md:py-2.5 rounded-xl font-bold text-sm md:text-base hover:bg-[#22BC9F] hover:text-white transition-colors"
                    >
                      حجز سريع
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
