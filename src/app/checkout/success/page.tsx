'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { CheckCircle2, Home, Sparkles, Calendar, Clock, FileText, Phone } from 'lucide-react';
import type { CartItem } from '@/context/CartContext';

interface ReservationSummary {
  orderId: string;
  items: CartItem[];
  totalTasharokPrice: number;
  paymentMethod: string;
  depositAmount?: number;
  shippingAddress: string;
  customerName: string;
  customerPhone: string;
  createdAt: string;
  preferredDate?: string;
  preferredTime?: string;
  bookingNotes?: string;
}

const preferredTimeLabels: Record<string, string> = {
  morning: 'صباحاً',
  afternoon: 'بعد الظهر',
  evening: 'مساءً',
  any: 'أي وقت',
};

export default function CheckoutSuccessPage() {
  const [summary, setSummary] = useState<ReservationSummary | null>(null);

  useEffect(() => {
    const data = sessionStorage.getItem('tasharok_last_reservation');
    if (data) {
      try {
        setSummary(JSON.parse(data));
      } catch {
        // Fallback
      }
    }
  }, []);

  const hasServices = summary?.items.some((item) => item.item_type === 'service') ?? false;

  const getPaymentLabel = (method?: string) => {
    if (method === 'deposit') return 'دفع عربون (%20)';
    if (method === 'cash_on_delivery') return 'كاش عند الاستلام / الفرع';
    return 'دفع كامل المبلغ أونلاين';
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-arabic text-right" dir="rtl">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-2xl space-y-8 text-center sm:text-right">
          <div className="text-center space-y-3">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-4 border-emerald-50 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <span className="inline-block bg-[#22BC9F]/15 text-[#22BC9F] text-xs font-black px-4 py-1.5 rounded-full border border-[#22BC9F]/30">
              تم تأكيد الالتزام بالحجز بنجاح! 🚀
            </span>
            <h1 className="text-3xl font-black text-gray-900">شكراً لك! تم انضمامك إلى مجموعة التشارك</h1>
            <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
              رقم الحجز المرجعي الخاص بك هو:{' '}
              <strong className="text-[#007FB7] font-mono text-base">{summary?.orderId || 'TSK-892301'}</strong>
            </p>
          </div>

          {hasServices && (
            <div className="bg-[#22BC9F]/5 border border-[#22BC9F]/20 rounded-3xl p-5 text-right space-y-3">
              <div className="flex items-center gap-2 text-[#22BC9F] font-extrabold text-sm">
                <Phone className="w-4 h-4" />
                <span>تأكيد الموعد</span>
              </div>
              <p className="text-xs text-[#22BC9F] leading-relaxed">
                سيتواصل معك مقدم الخدمة خلال 24 ساعة لتأكيد الموعد.
              </p>
            </div>
          )}

          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200/80 space-y-4">
            <h3 className="font-extrabold text-sm text-gray-900 text-right flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#22BC9F]" /> خريطة مرحلة طلبك الجماعي:
            </h3>

            <div className={`grid grid-cols-1 ${hasServices ? 'sm:grid-cols-5' : 'sm:grid-cols-4'} gap-4 text-center`}>
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
                <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto text-xs font-bold mb-1">
                  1
                </div>
                <div className="font-bold text-xs text-emerald-900">تم الانضمام للحجز</div>
                <div className="text-[10px] text-emerald-700">مكتمل الان 🟢</div>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl">
                <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center mx-auto text-xs font-bold mb-1">
                  2
                </div>
                <div className="font-bold text-xs text-amber-900">مراجعة واكتمال الهدف</div>
                <div className="text-[10px] text-amber-700">جاري التجميع ⏳</div>
              </div>

              <div className="bg-white border border-gray-200 p-3 rounded-xl">
                <div className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center mx-auto text-xs font-bold mb-1">
                  3
                </div>
                <div className="font-bold text-xs text-gray-700">تأكيد المورد للدفعة</div>
                <div className="text-[10px] text-gray-400">قادمة</div>
              </div>

              {hasServices ? (
                <>
                  <div className="bg-white border border-[#22BC9F]/30 p-3 rounded-xl">
                    <div className="w-8 h-8 bg-[#22BC9F]/10 text-[#22BC9F] rounded-full flex items-center justify-center mx-auto text-xs font-bold mb-1">
                      4
                    </div>
                    <div className="font-bold text-xs text-gray-700">تأكيد الموعد مع مقدم الخدمة</div>
                    <div className="text-[10px] text-[#22BC9F]">قادمة</div>
                  </div>

                  <div className="bg-white border border-gray-200 p-3 rounded-xl">
                    <div className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center mx-auto text-xs font-bold mb-1">
                      5
                    </div>
                    <div className="font-bold text-xs text-gray-700">الشحن والتسليم</div>
                    <div className="text-[10px] text-gray-400">قادمة</div>
                  </div>
                </>
              ) : (
                <div className="bg-white border border-gray-200 p-3 rounded-xl">
                  <div className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center mx-auto text-xs font-bold mb-1">
                    4
                  </div>
                  <div className="font-bold text-xs text-gray-700">الشحن والتسليم</div>
                  <div className="text-[10px] text-gray-400">قادمة</div>
                </div>
              )}
            </div>
          </div>

          {summary && (
            <div className="border-t border-b border-gray-100 py-6 space-y-4 text-xs">
              <h3 className="font-extrabold text-sm text-gray-900 text-right">
                {hasServices ? 'تفاصيل بيانات الحجز والتواصل:' : 'تفاصيل بيانات الشحنة الحالية:'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-gray-100">
                <div>
                  <span className="text-gray-500">اسم المشتري:</span>{' '}
                  <strong className="text-gray-900">{summary.customerName}</strong>
                </div>
                <div>
                  <span className="text-gray-500">رقم الهاتف:</span>{' '}
                  <strong className="text-gray-900">{summary.customerPhone}</strong>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-gray-500">عنوان الاستلام:</span>{' '}
                  <strong className="text-gray-900">{summary.shippingAddress}</strong>
                </div>
                {hasServices && summary.preferredDate && (
                  <div>
                    <span className="text-gray-500">التاريخ المفضل:</span>{' '}
                    <strong className="text-gray-900 inline-flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#22BC9F]" /> {summary.preferredDate}
                    </strong>
                  </div>
                )}
                {hasServices && summary.preferredTime && (
                  <div>
                    <span className="text-gray-500">الوقت المفضل:</span>{' '}
                    <strong className="text-gray-900 inline-flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#22BC9F]" /> {preferredTimeLabels[summary.preferredTime] || summary.preferredTime}
                    </strong>
                  </div>
                )}
                {hasServices && summary.bookingNotes && (
                  <div className="sm:col-span-2">
                    <span className="text-gray-500">ملاحظات الحجز:</span>{' '}
                    <strong className="text-gray-900 inline-flex items-start gap-1">
                      <FileText className="w-3 h-3 text-[#22BC9F] mt-0.5" /> {summary.bookingNotes}
                    </strong>
                  </div>
                )}
                <div>
                  <span className="text-gray-500">طريقة الدفع المحددة:</span>{' '}
                  <strong className="text-[#007FB7] font-bold">{getPaymentLabel(summary.paymentMethod)}</strong>
                </div>
                <div>
                  <span className="text-gray-500">إجمالي المبلغ المحجوز:</span>{' '}
                  <strong className="text-[#22BC9F] font-bold text-sm">
                    {formatPrice(summary.totalTasharokPrice)} ريال
                  </strong>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 flex flex-wrap gap-4 justify-center">
            <Link
              href="/"
              className="flex items-center gap-2 bg-[#22BC9F] text-white px-8 py-3.5 rounded-2xl font-bold text-xs shadow-lg hover:bg-[#1fa98f] transition"
            >
              <Home className="w-4 h-4" /> العودة للصفحة الرئيسية وتصفح صفقات أخرى
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
