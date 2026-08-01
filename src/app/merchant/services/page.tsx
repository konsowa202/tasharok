'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/lib/utils';
import { Sparkles, PlusCircle, Edit, Trash2, Search, Share2, Package } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import ServiceBadge from '@/components/ui/ServiceBadge';

type Service = {
  id: string;
  title: string;
  description?: string;
  tasharok_price: number;
  original_price: number;
  target_quantity: number;
  current_reserved_quantity: number;
  status: string;
  image_url: string;
  item_type: 'service';
  service_category_id?: string;
  service_duration_minutes?: number;
  service_location_type?: 'at_merchant' | 'home' | 'both';
  created_at: string;
  service_categories?: {
    id: string;
    name: string;
    icon_name?: string;
  } | null;
};

const LOCATION_LABELS: Record<string, string> = {
  at_merchant: 'في الفرع',
  home: 'منزل العميل',
  both: 'الفرع أو المنزل',
};

export default function MerchantServices() {
  const { user } = useAuth();
  const supabase = createClient();
  
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchServices = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from('products')
      .select('*, service_categories(id, name, icon_name)')
      .eq('merchant_id', user.id)
      .eq('item_type', 'service')
      .order('created_at', { ascending: false });

    if (data) setServices(data as unknown as Service[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchServices();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الخدمة؟')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) {
      setServices(prev => prev.filter(s => s.id !== id));
    } else {
      alert('حدث خطأ أثناء الحذف.');
    }
  };

  const handleShare = (id: string) => {
    const url = `${window.location.origin}/product/${id}`;
    navigator.clipboard.writeText(url);
    alert('تم نسخ رابط الخدمة');
  };

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

  const filteredServices = services.filter(service => 
    search === '' || service.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-arabic animate-in fade-in duration-500" dir="rtl">
      
      {/* Header & Stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100 gap-4 sm:gap-0">
        <div className="flex gap-10">
          <div>
            <p className="text-xs text-slate-500 font-bold mb-1">إجمالي الخدمات</p>
            <p className="text-xl font-black text-slate-800">{services.length}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold mb-1">نشط</p>
            <p className="text-xl font-black text-[#22BC9F]">
              {services.filter(s => s.status === 'approved').length}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <input 
              type="text" 
              placeholder="البحث عن خدمة..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-10 pl-4 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#22BC9F]/50 text-sm w-56 shadow-inner"
            />
            <Search className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
          </div>
          <Link 
            href="/merchant/services/new"
            className="flex items-center gap-2 px-4 py-2 bg-[#22BC9F] text-white rounded-xl text-sm font-bold shadow-sm hover:bg-[#1ca38a] transition"
          >
            <PlusCircle className="w-4 h-4" /> إضافة خدمة
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col min-h-[400px]">
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-slate-400 font-bold">جاري تحميل البيانات...</div>
        ) : filteredServices.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-[#22BC9F]/10 flex items-center justify-center mb-4">
              <Sparkles className="w-10 h-10 text-[#22BC9F]" />
            </div>
            <p className="text-slate-500 font-bold mb-2">لا توجد خدمات حالياً.</p>
            <p className="text-sm text-slate-400 mb-6">ابدأ بتقديم خدماتك للعملاء واحصل على حجوزات أكثر.</p>
            <Link 
              href="/merchant/services/new"
              className="flex items-center gap-2 px-6 py-3 bg-[#22BC9F] text-white rounded-xl text-sm font-bold shadow-sm hover:bg-[#1ca38a] transition"
            >
              <PlusCircle className="w-4 h-4" /> أضف خدمتك الأولى
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-white text-slate-400 text-xs tracking-wider">
                  <th className="px-6 py-4 font-bold border-b border-slate-100">الخدمة</th>
                  <th className="px-6 py-4 font-bold border-b border-slate-100 text-center">النوع</th>
                  <th className="px-6 py-4 font-bold border-b border-slate-100">التصنيف</th>
                  <th className="px-6 py-4 font-bold border-b border-slate-100">السعر</th>
                  <th className="px-6 py-4 font-bold border-b border-slate-100">الحجوزات / الهدف</th>
                  <th className="px-6 py-4 font-bold border-b border-slate-100">الموقع</th>
                  <th className="px-6 py-4 font-bold border-b border-slate-100 text-center">الحالة</th>
                  <th className="px-6 py-4 font-bold border-b border-slate-100 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredServices.map((service) => (
                  <tr key={service.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden relative shrink-0">
                          {service.image_url ? (
                            <Image src={service.image_url} alt={service.title} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300"><Package className="w-6 h-6"/></div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 text-sm">{service.title}</div>
                          {service.service_duration_minutes && (
                            <div className="text-xs text-slate-400 mt-0.5">{service.service_duration_minutes} دقيقة</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <ServiceBadge itemType="service" />
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-600">
                        {service.service_categories?.name || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-black text-slate-800">{formatPrice(service.tasharok_price)} <span className="text-xs text-slate-400">ريال</span></div>
                      {service.original_price > service.tasharok_price && (
                        <div className="text-xs text-slate-400 line-through mt-0.5">{formatPrice(service.original_price)} ريال</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 max-w-[100px]">
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden" dir="ltr">
                            <div 
                              className="h-full rounded-full transition-all duration-1000 ease-out bg-[#22BC9F]"
                              style={{ width: `${Math.min(Math.round((service.current_reserved_quantity / service.target_quantity) * 100), 100)}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-xs font-bold text-slate-600" dir="ltr">
                          {service.current_reserved_quantity}/{service.target_quantity}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-500">
                      {service.service_location_type ? LOCATION_LABELS[service.service_location_type] : '—'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(service.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-1.5 text-slate-400 hover:text-[#007FB7] bg-slate-50 hover:bg-[#007FB7]/10 rounded-lg transition border border-slate-200" title="تعديل">
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleShare(service.id)}
                          className="p-1.5 text-slate-400 hover:text-[#22BC9F] bg-slate-50 hover:bg-[#22BC9F]/10 rounded-lg transition border border-slate-200" 
                          title="مشاركة الرابط"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(service.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-500 bg-slate-50 hover:bg-rose-50 rounded-lg transition border border-slate-200" 
                          title="حذف"
                        >
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
      </div>
    </div>
  );
}
