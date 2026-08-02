'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProgressBar from '@/components/ProgressBar';
import ServiceBadge from '@/components/ui/ServiceBadge';
import { MOCK_PRODUCTS, Product } from '@/data/mockProducts';
import { createClient } from '@/lib/supabase/client';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShoppingCart,
  ShieldCheck,
  Building2,
  CheckCircle2,
  Sparkles,
  CreditCard,
  Building,
  DollarSign,
  Clock,
  MapPin,
  Check,
  Info,
  ChevronRight,
  Zap,
  MessageSquare,
} from 'lucide-react';
import CountdownTimer from '@/components/CountdownTimer';

interface ProductDetail extends Product {
  item_type?: 'product' | 'service';
  service_duration_minutes?: number;
  service_location_type?: 'at_merchant' | 'home' | 'both';
  service_booking_notes?: string;
  service_includes?: string[];
  service_category_name?: string;
  offer_end_date?: string | null;
  is_timer_active?: boolean;
}

const locationLabels: Record<'at_merchant' | 'home' | 'both', string> = {
  at_merchant: 'في مركز مقدم الخدمة',
  home: 'خدمة منزلية',
  both: 'في المركز أو المنزل',
};

export default function SingleProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addedToast, setAddedToast] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('products')
          .select('*, service_categories(name), merchant_profiles(store_name)')
          .eq('id', productId)
          .single();

        if (data && !error) {
          const merchantProfile = Array.isArray(data.merchant_profiles)
            ? data.merchant_profiles[0]
            : data.merchant_profiles;
          const serviceCategory = Array.isArray(data.service_categories)
            ? data.service_categories[0]
            : data.service_categories;

          setProduct({
            id: data.id,
            merchant_id: data.merchant_id,
            title: data.title,
            description: data.description,
            original_price: Number(data.original_price),
            tasharok_price: Number(data.tasharok_price),
            target_quantity: data.target_quantity,
            current_reserved_quantity: data.current_reserved_quantity,
            status: data.status,
            image_url:
              data.image_url ||
              'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
            store_name: merchantProfile?.store_name || 'تاجر تشارك المعتمد',
            category: serviceCategory?.name || data.category,
            item_type: data.item_type || 'product',
            service_duration_minutes: data.service_duration_minutes,
            service_location_type: data.service_location_type,
            service_booking_notes: data.service_booking_notes,
            service_includes: data.service_includes,
            service_category_name: serviceCategory?.name,
            offer_end_date: data.offer_end_date,
            is_timer_active: data.is_timer_active,
          });
          setLoading(false);
          return;
        }
      } catch (err) {
        // Fallback
      }

      const foundMock = MOCK_PRODUCTS.find((p) => p.id === productId);
      if (foundMock) {
        setProduct(foundMock as ProductDetail);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [productId]);

  useEffect(() => {
    const trackView = async () => {
      try {
        const supabase = createClient();
        const channels = ['Direct', 'Facebook', 'Instagram', 'WhatsApp'];
        const randomChannel = channels[Math.floor(Math.random() * channels.length)];

        await supabase.from('page_views').insert({
          product_id: productId,
          viewer_id: user?.id || null,
          channel: randomChannel,
        });
      } catch {
        // Ignore tracking errors
      }
    };

    if (product) {
      trackView();
    }
  }, [product, productId, user?.id]);

  const handleReserveNow = () => {
    if (!product) return;
    if (!user) {
      router.push(`/login?redirect_to=/product/${product.id}`);
      return;
    }
    addToCart(product, quantity);
    router.push('/cart');
  };

  const handleAddToCartOnly = () => {
    if (!product) return;
    addToCart(product, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white font-arabic text-right" dir="rtl">
        <Header />
        <div className="flex-1 flex items-center justify-center py-20 text-slate-400 font-bold text-sm">
          جاري تحميل تفاصيل الصفقة...
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-white font-arabic text-right" dir="rtl">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-slate-700 font-bold text-base space-y-4">
          <p>الصفقة المطلوبة غير موجودة أو تم انتهاؤها.</p>
          <Link href="/" className="bg-[#22BC9F] text-white px-6 py-2 rounded-xl text-xs">
            العودة للصفقات
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const savingsPerUnit = product.original_price - product.tasharok_price;
  const savingsPercentage = Math.round((savingsPerUnit / product.original_price) * 100);
  const isService = product.item_type === 'service';

  return (
    <div className="min-h-screen flex flex-col bg-white font-arabic text-right" dir="rtl">
      <Header />

      {/* Sleek Breadcrumbs */}
      <div className="border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-[11px] font-bold text-slate-400 flex items-center gap-2">
          <Link href="/" className="hover:text-[#22BC9F] transition-colors">الرئيسية</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/#deals" className="hover:text-[#22BC9F] transition-colors">الصفقات</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-800 truncate">{product.title}</span>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        {addedToast && (
          <div className="mb-6 p-4 bg-[#22BC9F]/10 text-[#1da88d] border border-[#22BC9F]/20 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5" />
              <span>تمت إضافة الصفقة لسلة الحجوزات بنجاح!</span>
            </div>
            <Link href="/cart" className="bg-[#22BC9F] text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-[#1da88d] transition-colors">
              عرض السلة
            </Link>
          </div>
        )}

        {/* 3-Column Layout for Desktop to ensure Buy Button is always visible above fold */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Column 1: Image Gallery (Right in RTL) */}
          <div className="lg:col-span-5">
            <div className="sticky top-24">
              <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden bg-slate-50 border border-slate-100/50 shadow-sm">
                <Image
                  src={product.image_url}
                  alt={product.title}
                  fill
                  className="object-cover hover:scale-105 transition duration-700"
                  priority
                />
                {savingsPercentage > 0 && (
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-[#22BC9F] px-3 py-1.5 rounded-lg text-sm font-black shadow-lg border border-white/20">
                    وفر {savingsPercentage}%
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Column 2: Product Details (Middle in RTL) */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="flex items-center gap-2 mb-3 text-[11px] font-bold text-slate-400">
              <Building2 className="w-3 h-3" />
              <span>المورد: <span className="text-[#007FB7]">{product.store_name}</span></span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-[1.3] mb-4">
              {product.title}
            </h1>

            <p className="text-slate-500 text-sm leading-relaxed font-medium mb-6">
              {product.description}
            </p>

            {/* Essential Info List */}
            {isService && (
              <div className="space-y-4 mb-6 text-sm font-medium text-slate-600 bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
                {product.service_duration_minutes && (
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>المدة: <strong className="text-slate-900">{product.service_duration_minutes} دقيقة</strong></span>
                  </div>
                )}
                {product.service_location_type && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>المكان: <strong className="text-slate-900">{locationLabels[product.service_location_type] || product.service_location_type}</strong></span>
                  </div>
                )}
                {product.service_includes && product.service_includes.length > 0 && (
                  <div className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <ul className="space-y-1">
                      {product.service_includes.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Modern Progress Section */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <ProgressBar current={product.current_reserved_quantity} target={product.target_quantity} />
            </div>
          </div>

          {/* Column 3: Sticky Action Box (Left in RTL) */}
          <div className="lg:col-span-3">
            <div className="sticky top-24 bg-white rounded-3xl p-6 border border-slate-200 shadow-xl shadow-slate-200/40">
              
              {/* Offer Timer */}
              {product.is_timer_active && product.offer_end_date && (
                <div className="mb-6">
                  <CountdownTimer endDate={product.offer_end_date} />
                </div>
              )}

              {/* Price */}
              <div className="mb-6 flex flex-col">
                <span className="text-sm text-slate-500 font-bold block mb-2">السعر للمجموعة:</span>
                <div className="flex items-center gap-3 mb-1">
                  <div className="text-sm text-slate-400 font-bold">
                    بدلاً من <span className="text-red-500 line-through decoration-red-500/50 decoration-2">{formatPrice(product.original_price)} ر.س</span>
                  </div>
                </div>
                <div className="flex items-end gap-2">
                  <div className="text-4xl font-black text-[#22BC9F] leading-none">
                    {formatPrice(product.tasharok_price)}
                  </div>
                  <span className="text-sm text-slate-500 font-bold mb-1">ر.س</span>
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <span className="text-xs font-bold text-slate-700 block mb-2">الكمية المطلوبة</span>
                <div className="flex items-center justify-between bg-slate-50 rounded-xl p-1 border border-slate-100">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-lg font-black text-slate-600 hover:bg-white hover:shadow-sm flex items-center justify-center transition-all">-</button>
                  <span className="w-8 text-center font-black text-base">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-lg font-black text-slate-600 hover:bg-white hover:shadow-sm flex items-center justify-center transition-all">+</button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleReserveNow}
                  className="w-full py-3.5 rounded-xl font-black text-sm text-white bg-[#22BC9F] hover:bg-[#1da88d] transition-colors flex items-center justify-center gap-2 shadow-md shadow-[#22BC9F]/20"
                >
                  {isService ? 'احجز الآن ضمن المجموعة' : `انضم للمجموعة`}
                </button>
                
                {/* Direct Buy */}
                <button
                  onClick={() => {
                    if (!user) {
                      router.push(`/login?redirect_to=/product/${product.id}`);
                      return;
                    }
                    addToCart(product, quantity, true);
                    router.push('/cart');
                  }}
                  className="w-full py-3 rounded-xl font-bold text-xs text-[#22BC9F] bg-[#22BC9F]/5 hover:bg-[#22BC9F]/10 border border-[#22BC9F]/20 transition-colors flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  شراء فوري بدون مجموعة ({formatPrice(product.original_price)} ر.س)
                </button>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={handleAddToCartOnly}
                    className="w-full py-2.5 rounded-xl font-bold text-xs text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" /> للسلة
                  </button>
                  
                  {/* Negotiate */}
                  <button
                    onClick={() => {
                      if (!user) {
                        router.push(`/login?redirect_to=/negotiate/${product.id}`);
                        return;
                      }
                      router.push(`/negotiate/${product.id}`);
                    }}
                    className="w-full py-2.5 rounded-xl font-bold text-xs text-[#22BC9F] bg-white border border-[#22BC9F]/30 hover:bg-[#22BC9F]/5 transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" /> تفاوض مع التاجر
                  </button>
                </div>
              </div>

              {/* Minimalist Trust Badge */}
              <div className="mt-5 flex items-start gap-2 text-[10px] font-medium text-slate-500 leading-relaxed bg-slate-50 p-3 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-[#22BC9F] shrink-0" />
                <p>دفع آمن. لن يتم تحصيل المبلغ النهائي حتى تكتمل المجموعة بنجاح.</p>
              </div>
            </div>
          </div>

        </div>

        {/* Info Cards (Payment Methods) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-20 mb-8 border-t border-slate-100 pt-12">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 text-slate-600 flex items-center justify-center shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 mb-1">دفع آمن بالكامل</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                إذا لم تكتمل المجموعة، يُعاد المبلغ كاملاً لمحفظتك فوراً.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 text-slate-600 flex items-center justify-center shrink-0">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 mb-1">حجز بعربون</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                ثبت حصتك بتقديم عربون رمزي بسيط ودفع المتبقي لاحقاً.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 text-slate-600 flex items-center justify-center shrink-0">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 mb-1">دفع عند الاستلام</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                احجز بدون دفع مسبق وادفع عند التوصيل أو في المركز.
              </p>
            </div>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
