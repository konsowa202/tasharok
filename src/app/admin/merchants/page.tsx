'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Store, Phone, Calendar, User, LogIn, Search, Filter, MoreHorizontal, ArrowUpRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

type Merchant = {
  merchant_id: string;
  store_name: string;
  commercial_record: string;
  created_at: string;
  profiles: {
    full_name: string;
    phone: string;
  } | null;
};

export default function AdminMerchants() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { impersonateMerchant } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchMerchants = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('merchant_profiles')
        .select(`
          merchant_id, store_name, commercial_record, created_at,
          profiles(full_name, phone)
        `)
        .order('created_at', { ascending: false });

      if (data) {
        setMerchants(data as unknown as Merchant[]);
      }
      setLoading(false);
    };

    fetchMerchants();
  }, []);

  const handleImpersonate = async (merchantId: string) => {
    if(confirm('هل أنت متأكد من رغبتك بتسجيل الدخول بهوية هذا التاجر؟')) {
      const { success, error } = await impersonateMerchant(merchantId);
      if (success) {
        router.push('/merchant');
      } else {
        alert(error);
      }
    }
  };

  const filteredMerchants = merchants.filter(m => 
    m.store_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 font-arabic animate-in fade-in duration-500" dir="rtl">
      
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex gap-10">
          <div>
            <p className="text-xs text-slate-500 font-bold mb-1">إجمالي التجار</p>
            <p className="text-xl font-black text-slate-800 flex items-center gap-2">
              {merchants.length} 
              <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center">
                <ArrowUpRight className="w-3 h-3 mr-1" /> 12%
              </span>
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold mb-1">نشط هذا الأسبوع</p>
            <p className="text-xl font-black text-[#4F46E5]">{Math.max(1, Math.floor(merchants.length * 0.8))}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-[#4F46E5] text-white rounded-lg text-sm font-bold shadow-sm hover:bg-[#4338CA] transition">
            + إضافة تاجر
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="البحث عن التجار..." 
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

      {/* Merchants Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 font-bold">جاري تحميل التجار...</div>
        ) : filteredMerchants.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-bold">لم يتم العثور على تجار.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 text-xs tracking-wider">
                  <th className="px-6 py-4 font-bold border-b border-slate-100">اسم المتجر</th>
                  <th className="px-6 py-4 font-bold border-b border-slate-100">المالك</th>
                  <th className="px-6 py-4 font-bold border-b border-slate-100">التواصل</th>
                  <th className="px-6 py-4 font-bold border-b border-slate-100">تاريخ الانضمام</th>
                  <th className="px-6 py-4 font-bold border-b border-slate-100 text-left">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMerchants.map((merchant) => {
                  const d = new Date(merchant.created_at);
                  return (
                    <tr key={merchant.merchant_id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg">
                            {merchant.store_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <Link href={`/admin/merchants/${merchant.merchant_id}`} className="font-bold text-slate-900 hover:text-indigo-600 transition">
                              {merchant.store_name}
                            </Link>
                            <div className="text-xs text-slate-400 flex items-center gap-1">
                              <Store className="w-3 h-3" />
                              سجل تجاري: {merchant.commercial_record || 'غير متوفر'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-slate-700 flex items-center gap-2">
                           {merchant.profiles?.full_name || 'غير معروف'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-600 flex items-center gap-2">
                          <Phone className="w-4 h-4 text-slate-400" /> 
                          <span dir="ltr">{merchant.profiles?.phone || 'لا يوجد هاتف'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-600 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-400" /> 
                          {d.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-left">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleImpersonate(merchant.merchant_id)}
                            className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 opacity-0 group-hover:opacity-100"
                            title="تسجيل الدخول كتاجر"
                          >
                            <LogIn className="w-3.5 h-3.5" /> دخول
                          </button>
                          <Link href={`/admin/merchants/${merchant.merchant_id}`} className="bg-slate-50 text-slate-600 hover:bg-slate-100 px-3 py-1.5 rounded-lg text-xs font-bold transition">
                            التقرير
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
