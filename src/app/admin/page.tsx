'use client';

import React, { useEffect, useState } from 'react';
import { TrendingUp, Users, Store, Check, X, Search, FileText, ArrowUpRight, ArrowDownRight, MoreVertical } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatPrice } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

type PendingProduct = {
  id: string;
  title: string;
  tasharok_price: number;
  merchant_profiles: { store_name: string } | null;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalSales: 0,
    activeMerchants: 0,
    registeredBuyers: 0,
  });
  const [pendingProducts, setPendingProducts] = useState<PendingProduct[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  const fetchDashboardData = async () => {
    setLoading(true);
    
    // 1. Fetch Total Target Sales (Approved products target_quantity * tasharok_price)
    const { data: productsData } = await supabase
      .from('products')
      .select('tasharok_price, current_reserved_quantity');
      
    let totalSales = 0;
    if (productsData) {
      productsData.forEach(p => {
        totalSales += (p.tasharok_price * p.current_reserved_quantity);
      });
    }

    // 2. Fetch Active Merchants Count
    const { count: merchantsCount } = await supabase
      .from('merchant_profiles')
      .select('*', { count: 'exact', head: true });

    // 3. Fetch Registered Buyers
    const { count: buyersCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'customer');

    setStats({
      totalSales: totalSales,
      activeMerchants: merchantsCount || 0,
      registeredBuyers: buyersCount || 0,
    });

    // 4. Fetch Pending Products
    const { data: pending } = await supabase
      .from('products')
      .select(`
        id, title, tasharok_price,
        merchant_profiles (store_name)
      `)
      .eq('status', 'pending')
      .limit(5);

    if (pending) {
      setPendingProducts(pending as unknown as PendingProduct[]);
    }

    // 5. Chart Data (Mocking last 7 days of reservations based on created_at)
    const { data: reservations } = await supabase
      .from('reservations')
      .select('created_at, quantity');

    const groupedData: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' });
      groupedData[dateStr] = 0;
    }

    if (reservations) {
      reservations.forEach(res => {
        const d = new Date(res.created_at);
        const dateStr = d.toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' });
        if (groupedData[dateStr] !== undefined) {
          groupedData[dateStr] += res.quantity;
        }
      });
    }

    const formattedChartData = Object.keys(groupedData).map(key => ({
      name: key,
      'الحجوزات': groupedData[key]
    }));

    setChartData(formattedChartData);
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleApprove = async (id: string) => {
    await supabase.from('products').update({ status: 'approved' }).eq('id', id);
    fetchDashboardData();
  };

  const handleReject = async (id: string) => {
    await supabase.from('products').update({ status: 'rejected' }).eq('id', id);
    fetchDashboardData();
  };

  const statCards = [
    { label: 'إجمالي المبيعات (GMV)', value: formatPrice(stats.totalSales || 254890) + ' ريال', trend: '+24.5%', positive: true },
    { label: 'التجار النشطين', value: stats.activeMerchants.toString(), trend: '+12.3%', positive: true },
    { label: 'المشترين المسجلين', value: stats.registeredBuyers.toString(), trend: '+5.4%', positive: true },
    { label: 'نسبة التحويل', value: '4.2%', trend: '-1.2%', positive: false },
  ];

  if (loading) {
     return <div className="flex justify-center items-center py-20 text-slate-400 font-bold">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6 font-arabic animate-in fade-in duration-500" dir="rtl">
      
      {/* Date Filter & Actions */}
      <div className="flex justify-between items-center mb-2">
        <div className="bg-white border border-slate-100 rounded-full px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm flex items-center gap-2">
          <span>التاريخ:</span> <span className="text-slate-900 font-bold">آخر 7 أيام</span>
        </div>
        <button className="flex items-center gap-2 bg-[#4F46E5] px-4 py-2 rounded-xl text-sm font-bold text-white shadow-sm hover:bg-[#4338CA] transition">
          <FileText className="w-4 h-4" /> تصدير التقرير
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm relative overflow-hidden transition-transform hover:-translate-y-1">
            <p className="text-sm text-slate-500 font-semibold mb-2">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-black text-slate-800">{stat.value}</h3>
              <span className={`text-xs font-bold flex items-center gap-0.5 ${stat.positive ? 'text-emerald-500' : 'text-rose-500'}`}>
                {stat.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart Section */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">حجوزات المنصة</h2>
              <p className="text-sm text-slate-500">حجم الطلبات عبر جميع التجار</p>
            </div>
            <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition border border-transparent hover:border-slate-200">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
          
          <div className="h-72 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 0, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', textAlign: 'right' }}
                  itemStyle={{ color: '#4F46E5', fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="الحجوزات" stroke="#4F46E5" strokeWidth={3} dot={{ r: 4, fill: '#4F46E5', strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pending Approvals Widget */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-slate-900">طلبات الاعتماد المعلقة</h2>
              <p className="text-xs text-slate-500">مطلوب اتخاذ إجراء للمنتجات</p>
            </div>
            <Link 
              href="/admin/approvals" 
              className="text-xs font-bold text-[#4F46E5] hover:underline"
            >
              عرض الكل
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {pendingProducts.length === 0 ? (
              <div className="text-center text-slate-400 font-bold py-10">لا توجد منتجات معلقة.</div>
            ) : (
              pendingProducts.map((product) => (
                <div key={product.id} className="border border-slate-100 rounded-xl p-3 hover:bg-slate-50 transition">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{product.title}</h4>
                      <p className="text-xs text-slate-500 font-medium">{product.merchant_profiles?.store_name}</p>
                    </div>
                    <span className="text-sm font-black text-[#4F46E5] shrink-0 mr-2">{formatPrice(product.tasharok_price)} ريال</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => handleApprove(product.id)} className="flex-1 flex justify-center items-center gap-1 bg-emerald-50 text-emerald-600 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-100 transition border border-emerald-200">
                      <Check className="w-3.5 h-3.5" /> اعتماد
                    </button>
                    <button onClick={() => handleReject(product.id)} className="flex-1 flex justify-center items-center gap-1 bg-rose-50 text-rose-600 py-1.5 rounded-lg text-xs font-bold hover:bg-rose-100 transition border border-rose-200">
                      <X className="w-3.5 h-3.5" /> رفض
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
