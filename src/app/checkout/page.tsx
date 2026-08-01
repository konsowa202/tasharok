'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { formatPrice } from '@/lib/utils';
import ServiceBadge from '@/components/ui/ServiceBadge';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  CreditCard,
  DollarSign,
  Building,
  MapPin,
  Phone,
  User,
  Calendar,
  Clock,
  FileText,
  Info,
} from 'lucide-react';

type PaymentMethodType = 'full_payment' | 'deposit' | 'cash_on_delivery';
type PreferredTimeType = 'morning' | 'afternoon' | 'evening' | 'any';

export default function CheckoutPage() {
  const { cart, totalTasharokPrice, totalSavings, clearCart } = useCart();
  const { user, profile } = useAuth();
  const router = useRouter();

  const hasServices = cart.some((item) => item.item_type === 'service');

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [city, setCity] = useState('القاهرة');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState<PreferredTimeType>('any');
  const [bookingNotes, setBookingNotes] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('full_payment');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const depositAmount = Math.round(totalTasharokPrice * 0.2); // 20% Deposit

  const handleSubmitReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!fullName || !phone || (paymentMethod !== 'cash_on_delivery' && !address)) {
      setErrorMsg('يرجى ملء كافة تفاصيل العنوان ورقم التواصل المطلوبة');
      return;
    }

    if (hasServices && (!preferredDate || !preferredTime)) {
      setErrorMsg('يرجى تحديد التاريخ والوقت المفضل لتأكيد الحجز');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const supabase = createClient();

      for (const item of cart) {
        if (user && user.id) {
          const reservationPayload: Record<string, unknown> = {
            customer_id: user.id,
            product_id: item.id,
            quantity: item.quantity,
            payment_method: paymentMethod,
            status: 'pending_target',
          };

          if (item.item_type === 'service') {
            reservationPayload.preferred_date = preferredDate;
            reservationPayload.preferred_time = preferredTime;
            reservationPayload.booking_notes = bookingNotes;
            reservationPayload.fulfillment_status = 'pending_target';
          }

          await supabase.from('reservations').insert(reservationPayload);
        }
      }

      const reservationSummary = {
        orderId: `TSK-${Math.floor(100000 + Math.random() * 900000)}`,
        items: cart,
        totalTasharokPrice,
        paymentMethod,
        depositAmount: paymentMethod === 'deposit' ? depositAmount : 0,
        shippingAddress: `${city} - ${address}`,
        customerName: fullName,
        customerPhone: phone,
        createdAt: new Date().toISOString(),
        preferredDate: hasServices ? preferredDate : undefined,
        preferredTime: hasServices ? preferredTime : undefined,
        bookingNotes: hasServices ? bookingNotes : undefined,
      };

      sessionStorage.setItem('tasharok_last_reservation', JSON.stringify(reservationSummary));
      clearCart();

      router.push('/checkout/success');
    } catch {
      setErrorMsg('حدث خطأ أثناء إرسال الحجز، تم الحفظ في الوضع التجريبي');
      setSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 font-arabic text-right" dir="rtl">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-gray-700 font-bold space-y-4">
          <p>سلة الحجوزات فارغة حالياً</p>
          <button
            onClick={() => router.push('/')}
            className="bg-[#22BC9F] text-white px-6 py-2 rounded-xl text-xs font-bold"
          >
            تصفح الصفقات
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const shippingSectionTitle = hasServices ? 'بيانات التواصل والاستلام' : 'بيانات الشحن والاستلام';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-arabic text-right" dir="rtl">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900">إتمام حجز مجموعة التشارك 📝</h1>
          <p className="text-xs text-gray-500 mt-1">
            أدخل تفاصيل {hasServices ? 'الحجز والتواصل' : 'الشحن'} واختر طريقة الدفع المفضلة للالتزام بالحجز
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm font-bold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmitReservation} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-lg space-y-4">
              <h3 className="font-extrabold text-base text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#22BC9F]" /> {shippingSectionTitle}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">الاسم بالكامل</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute right-3 top-3" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pr-9 pl-3 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#22BC9F] text-gray-900"
                      placeholder="أحمد محمود"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">رقم الهاتف للتواصل للتسليم</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute right-3 top-3" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pr-9 pl-3 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#22BC9F] text-gray-900"
                      placeholder="+20 100 000 0000"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">المحافظة</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#22BC9F] text-gray-900 bg-white"
                  >
                    <option value="القاهرة">القاهرة</option>
                    <option value="الجيزة">الجيزة</option>
                    <option value="الإسكندرية">الإسكندرية</option>
                    <option value="الشرقية">الشرقية</option>
                    <option value="المنوفية">المنوفية</option>
                    <option value="مصر الكبرى">باقي المحافظات</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">العنوان التفصيلي (الشارع/المبنى)</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#22BC9F] text-gray-900"
                    placeholder="شارع التحرير - مبنى 14 - الشقة 5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">ملاحظات التوصيل / الفرع (اختياري)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#22BC9F] text-gray-900"
                  placeholder="ميعاد المندوب المفضل أو تفضيل الاستلام من الفرع الرئيسي"
                />
              </div>
            </div>

            {hasServices && (
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-lg space-y-4">
                <h3 className="font-extrabold text-base text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#22BC9F]" /> بيانات الحجز
                </h3>

                <div className="bg-[#22BC9F]/5 border border-[#22BC9F]/20 rounded-2xl p-4 flex items-start gap-3">
                  <Info className="w-5 h-5 text-[#22BC9F] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#22BC9F] leading-relaxed font-medium">
                    الخدمات تحتاج تأكيد موعد بعد اكتمال العدد المستهدف. سيتواصل معك مقدم الخدمة لتحديد الموعد المناسب.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">التاريخ المفضل *</label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-3" />
                      <input
                        type="date"
                        required={hasServices}
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        className="w-full pr-9 pl-3 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#22BC9F] text-gray-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">الوقت المفضل *</label>
                    <div className="relative">
                      <Clock className="w-4 h-4 text-gray-400 absolute right-3 top-3" />
                      <select
                        required={hasServices}
                        value={preferredTime}
                        onChange={(e) => setPreferredTime(e.target.value as PreferredTimeType)}
                        className="w-full pr-9 pl-3 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#22BC9F] text-gray-900 bg-white appearance-none"
                      >
                        <option value="morning">صباحاً</option>
                        <option value="afternoon">بعد الظهر</option>
                        <option value="evening">مساءً</option>
                        <option value="any">أي وقت</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">ملاحظات لمقدم الخدمة (اختياري)</label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-gray-400 absolute right-3 top-3" />
                    <textarea
                      value={bookingNotes}
                      onChange={(e) => setBookingNotes(e.target.value)}
                      rows={3}
                      className="w-full pr-9 pl-3 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#22BC9F] text-gray-900 resize-none"
                      placeholder="أي تفاصيل إضافية تريد مشاركتها مع مقدم الخدمة..."
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-lg space-y-4">
              <h3 className="font-extrabold text-base text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#007FB7]" /> اختيار خيار الدفع والالتزام بالحجز
              </h3>

              <div className="space-y-3">
                <label
                  className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition ${
                    paymentMethod === 'full_payment'
                      ? 'border-[#22BC9F] bg-[#22BC9F]/5'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    checked={paymentMethod === 'full_payment'}
                    onChange={() => setPaymentMethod('full_payment')}
                    className="mt-1 accent-[#22BC9F]"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#22BC9F]" />
                      <span className="font-extrabold text-sm text-gray-900">1. دفع كامل المبلغ الآن</span>
                      <span className="bg-[#22BC9F] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        موصى به
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      دفع إجمالي مبلغ التشارك ({formatPrice(totalTasharokPrice)} ريال) ببطاقة الفيزا أو المحفظة الإلكترونية. مسترد بالكامل في حال عدم اكتمال العدد.
                    </p>
                  </div>
                </label>

                <label
                  className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition ${
                    paymentMethod === 'deposit'
                      ? 'border-[#007FB7] bg-[#007FB7]/5'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    checked={paymentMethod === 'deposit'}
                    onChange={() => setPaymentMethod('deposit')}
                    className="mt-1 accent-[#007FB7]"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-[#007FB7]" />
                      <span className="font-extrabold text-sm text-gray-900">2. دفع عربون (%20) لتثبيت الحجز</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      ادفع فقط <strong className="text-[#007FB7]">{formatPrice(depositAmount)} ريال</strong> لتثبيت حجزك في المجموعة، وسدد المبلغ المتبقي {hasServices ? 'عند استلام الخدمة' : 'عند استلام الشحنة'}.
                    </p>
                  </div>
                </label>

                <label
                  className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition ${
                    paymentMethod === 'cash_on_delivery'
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    checked={paymentMethod === 'cash_on_delivery'}
                    onChange={() => setPaymentMethod('cash_on_delivery')}
                    className="mt-1 accent-amber-500"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-amber-600" />
                      <span className="font-extrabold text-sm text-gray-900">3. الدفع عند استلام الخدمة / في الفرع</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      التزام بالحجز بدون دفع أونلاين والدفع كاش عند {hasServices ? 'استلام الخدمة' : 'تسلم المنتج'} من المندوب أو من فرع المورد فور اكتمال المجموعة.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-gray-100 shadow-xl space-y-6">
            <h3 className="font-extrabold text-base text-gray-900 border-b border-gray-100 pb-3">
              المنتجات والخدمات المشمولة في الحجز
            </h3>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3 items-center border-b border-gray-50 pb-2">
                  <div className="relative h-12 w-12 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                    <Image src={item.image_url} alt={item.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1 text-xs">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className="font-bold text-gray-900 line-clamp-1">{item.title}</h4>
                      <ServiceBadge itemType={item.item_type} size="sm" />
                    </div>
                    <p className="text-gray-500">{item.quantity} × {formatPrice(item.tasharok_price)} ريال</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t border-gray-100 pt-3 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>إجمالي سعر التشارك:</span>
                <span className="font-bold text-gray-900">{formatPrice(totalTasharokPrice)} ريال</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>إجمالي وفر المجموعات:</span>
                <span>{formatPrice(totalSavings)} ريال 🎉</span>
              </div>
              {paymentMethod === 'deposit' && (
                <div className="flex justify-between text-[#007FB7] font-bold border-t border-gray-100 pt-2">
                  <span>المبلغ المطلوب دفعه حالياً (العربون):</span>
                  <span className="text-sm">{formatPrice(depositAmount)} ريال</span>
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-2xl font-extrabold text-sm text-white bg-gradient-to-r from-[#22BC9F] to-[#007FB7] shadow-xl shadow-[#22BC9F]/25 hover:opacity-95 transition flex items-center justify-center gap-2"
              >
                {submitting ? 'جاري تأكيد وتأمين الحجز...' : 'تأكيد الحجز والالتزام بالمجموعة 🎉'}
              </button>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
