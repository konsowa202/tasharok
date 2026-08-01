'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/lib/utils';
import ServiceBadge from '@/components/ui/ServiceBadge';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Trash2, ArrowLeft, ShieldCheck, Tag, Info, Clock, MapPin } from 'lucide-react';
import ProgressBar from '@/components/ProgressBar';

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalOriginalPrice,
    totalTasharokPrice,
    totalSavings,
    cartCount,
  } = useCart();

  const { user } = useAuth();
  const router = useRouter();

  const hasServices = cart.some((item) => item.item_type === 'service');

  const handleProceedToCheckout = () => {
    if (!user) {
      router.push('/login?redirect_to=/checkout');
    } else {
      router.push('/checkout');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-arabic text-right" dir="rtl">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
              <ShoppingCart className="w-8 h-8 text-[#22BC9F]" /> سلة حجوزات التشارك ({cartCount})
            </h1>
            <p className="text-xs text-gray-500 mt-1">راجع المنتجات والخدمات التي التزمت بحجزها قبل الانتقال لخطة الدفع والتأكيد</p>
          </div>

          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1 hover:underline"
            >
              <Trash2 className="w-4 h-4" /> تفريغ السلة
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-lg space-y-4 max-w-xl mx-auto">
            <div className="w-20 h-20 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto">
              <ShoppingCart className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">سلة الحجوزات فارغة حالياً</h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              لم تقم بإضافة أي صفقة تشارك لسلتك بعد. تصفح الصفقات المتاحة واحجز حصتك لتستفيد من خصم الجملة!
            </p>
            <div className="pt-2">
              <Link
                href="/#deals"
                className="inline-flex items-center gap-2 bg-[#22BC9F] text-white px-8 py-3 rounded-xl font-bold text-xs shadow-md hover:bg-[#1fa98f] transition"
              >
                تصفح الصفقات الحالية <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-4">
              {hasServices && (
                <div className="bg-[#007FB7]/5 border border-[#007FB7]/20 rounded-3xl p-4 flex items-start gap-3">
                  <Info className="w-5 h-5 text-[#007FB7] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#007FB7] leading-relaxed font-medium">
                    الخدمات تحتاج تأكيد موعد بعد اكتمال العدد المستهدف. سيتواصل معك مقدم الخدمة لتحديد الموعد المناسب.
                  </p>
                </div>
              )}

              {cart.map((item) => {
                const itemSavings = (item.original_price - item.tasharok_price) * item.quantity;
                const isService = item.item_type === 'service';

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl p-5 border border-gray-100 shadow-md flex flex-col sm:flex-row gap-5 items-center justify-between"
                  >
                    <div className="relative h-28 w-28 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                      <Image src={item.image_url} alt={item.title} fill className="object-cover" />
                    </div>

                    <div className="flex-1 space-y-2 text-right">
                      <div className="flex flex-wrap items-center gap-2">
                        <ServiceBadge itemType={item.item_type} size="sm" />
                        <div className="text-[11px] font-bold text-[#007FB7]">
                          المورد: {item.store_name || 'تاجر تشارك'}
                        </div>
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm line-clamp-1">{item.title}</h3>

                      {isService && (item.service_duration_minutes || item.service_location_type) && (
                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-600">
                          {item.service_duration_minutes && (
                            <span className="inline-flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                              <Clock className="w-3 h-3 text-[#22BC9F]" />
                              {item.service_duration_minutes} دقيقة
                            </span>
                          )}
                          {item.service_location_type && (
                            <span className="inline-flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                              <MapPin className="w-3 h-3 text-[#007FB7]" />
                              {item.service_location_type}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex items-baseline gap-3 text-xs">
                        <span className="font-black text-[#22BC9F] text-base">
                          {formatPrice(item.tasharok_price)} ريال
                        </span>
                        <span className="text-gray-400 line-through">
                          {formatPrice(item.original_price)} ريال
                        </span>
                        <span className="text-emerald-700 bg-emerald-50 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-100">
                          وفرت {formatPrice(itemSavings)} ريال
                        </span>
                      </div>

                      <div className="max-w-xs pt-1">
                        <ProgressBar
                          current={item.current_reserved_quantity}
                          target={item.target_quantity}
                          showDetails={false}
                        />
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center justify-between sm:justify-center gap-4 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
                      <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 bg-white rounded font-bold text-gray-700 hover:bg-gray-200 flex items-center justify-center shadow-sm text-xs"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-bold text-xs">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 bg-white rounded font-bold text-gray-700 hover:bg-gray-200 flex items-center justify-center shadow-sm text-xs"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-600 transition p-1"
                        title="حذف من السلة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-gray-100 shadow-xl space-y-6">
              <h3 className="font-extrabold text-lg text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#22BC9F]" /> ملخص الحجز المالي
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>إجمالي السعر الأصلي في السوق:</span>
                  <span className="font-bold line-through text-gray-400">{formatPrice(totalOriginalPrice)} ريال</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>إجمالي سعر التشارك المخفض:</span>
                  <span className="font-bold text-gray-900">{formatPrice(totalTasharokPrice)} ريال</span>
                </div>

                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 flex justify-between font-extrabold text-xs">
                  <span>إجمالي وفرك في هذه المجموعة:</span>
                  <span>{formatPrice(totalSavings)} ريال 🎉</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="font-black text-sm text-gray-900">المبلغ النهائي الملتزم به:</span>
                  <span className="text-2xl font-black text-[#22BC9F]">{formatPrice(totalTasharokPrice)} ريال</span>
                </div>

                <button
                  onClick={handleProceedToCheckout}
                  className="w-full py-4 rounded-2xl font-extrabold text-sm text-white bg-gradient-to-r from-[#22BC9F] to-[#007FB7] shadow-lg shadow-[#22BC9F]/25 hover:opacity-95 transition flex items-center justify-center gap-2"
                >
                  الانتقال لإتمام الحجز والدفع <ArrowLeft className="w-4 h-4" />
                </button>
              </div>

              <div className="pt-2 text-[11px] text-gray-400 space-y-1 text-center border-t border-gray-50">
                <p className="flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#22BC9F]" /> جميع الحجوزات مشمولة بضمان التشارك الرسمية
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
