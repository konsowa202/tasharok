'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { formatPrice } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Store, TrendingUp, Package, Users, ArrowUpRight, ArrowDownRight, Phone, Calendar } from 'lucide-react';
import Image from 'next/image';

export default function MerchantReport({ params }: { params: { id: string } }) {
  const [merchant, setMerchant] = useState<any>(null);
  const [stats, setStats] = useState({
    totalSales: 0,
    activeProducts: 0,
    totalOrders: 0,
    conversion: 4.8
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const fetchMerchantData = async () => {
      setLoading(true);
      
      // 1. Fetch Merchant Profile
      const { data: merchantData } = await supabase
        .from('merchant_profiles')
        .select(`
          *,
          profiles(full_name, phone)
        `)
        .eq('merchant_id', params.id)
        .single();
        
      if (merchantData) setMerchant(merchantData);

      // 2. Fetch Products
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('merchant_id', params.id);

      const activeProducts = products?.filter(p => p.status === 'approved') || [];
      
      // 3. Fetch Reservations for this merchant's products
      let totalSales = 0;
      let totalOrders = 0;
      let groupedData: Record<string, number> = {};

      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' });
        groupedData[dateStr] = 0;
      }

      if (products && products.length > 0) {
        const productIds = products.map(p => p.id);
        const { data: reservations } = await supabase
          .from('reservations')
          .select('*, products(tasharok_price)')
          .in('product_id', productIds);

        if (reservations) {
          totalOrders = reservations.length;
          reservations.forEach(res => {
            const price = res.products?.tasharok_price || 0;
            totalSales += (price * res.quantity);
            
            const d = new Date(res.created_at);
            const dateStr = d.toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' });
            if (groupedData[dateStr] !== undefined) {
              groupedData[dateStr] += res.quantity;
            }
          });
        }
      }

      setStats({
        totalSales,
        activeProducts: activeProducts.length,
        totalOrders,
        conversion: 4.8
      });

      const formattedChartData = Object.keys(groupedData).map(key => ({
        name: key,
        'الحجوزات': groupedData[key]
      }));
      setChartData(formattedChartData);
      
      // Top products mock based on current reservations
      if (products) {
         setTopProducts(products.sort((a,b) => b.current_reserved_quantity - a.current_reserved_quantity).slice(0, 3));
      }

      setLoading(false);
    };

    fetchMerchantData();
  }, [params.id]);

  if (loading) return <div className="flex justify-center items-center py-20 text-slate-400 font-bold" dir="rtl">جاري تحميل تقرير التاجر...</div>;
  if (!merchant) return <div className="flex justify-center items-center py-20 text-slate-400 font-bold" dir="rtl">التاجر غير موجود</div>;

  const statCards = [
    { label: 'إجمالي المبيعات', value: formatPrice(stats.totalSales) + ' ريال', trend: '+15.2%', positive: true, icon: TrendingUp },
    { label: 'العناصر النشطة', value: stats.activeProducts.toString(), trend: '+2', positive: true, icon: Package },
    { label: 'إجمالي الحجوزات', value: stats.totalOrders.toString(), trend: '+12.5%', positive: true, icon: Users },
    { label: 'معدل التحويل', value: stats.conversion + '%', trend: '-0.4%', positive: false, icon: Store },
  ];

  return (
    <div className="space-y-6 font-arabic animate-in fade-in duration-500" dir="rtl">
      
      {/* Merchant Header Info */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl opacity-50 -mr-10 -mt-10 pointer-events-none"></div>
        
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-[#4F46E5] flex items-center justify-center font-black text-3xl shadow-inner border border-indigo-100">
            {merchant.store_name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">{merchant.store_name}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-slate-500 font-medium">
              <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" /> <span dir="ltr">{merchant.profiles?.phone}</span></span>
              <span className="flex items-center gap-1.5"><Store className="w-4 h-4" /> سجل تجاري: {merchant.commercial_record || 'غير متوفر'}</span>
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> انضم {new Date(merchant.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short' })}</span>
            </div>
          </div>
        </div>
        
        <div className="relative z-10 flex flex-col items-end">
           <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-sm font-bold border border-emerald-100 mb-2">تاجر نشط</span>
           <p className="text-xs text-slate-400 font-bold">المالك: {merchant.profiles?.full_name}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm relative overflow-hidden transition-transform hover:-translate-y-1">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm text-slate-500 font-semibold">{stat.label}</p>
                <div className={`p-2 rounded-lg ${stat.positive ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <h3 className="text-2xl font-black text-slate-800">{stat.value}</h3>
                <span className={`text-xs font-bold flex items-center gap-0.5 ${stat.positive ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {stat.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.trend}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 lg:col-span-2">
          <h2 className="text-lg font-bold text-slate-900 mb-6">أداء الحجوزات للمتجر</h2>
          <div className="h-72 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 0, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', textAlign: 'right' }}
                  itemStyle={{ color: '#4F46E5', fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="الحجوزات" stroke="#4F46E5" strokeWidth={3} dot={{ r: 4, fill: '#4F46E5', strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 mb-4">أفضل العناصر أداءً</h2>
          
          <div className="space-y-4 overflow-y-auto max-h-[300px] custom-scrollbar pr-2">
            {topProducts.length === 0 ? (
              <div className="text-center text-slate-400 font-bold py-10">لا توجد منتجات نشطة.</div>
            ) : (
              topProducts.map(product => (
                <div key={product.id} className="flex gap-4 p-3 rounded-xl border border-slate-50 hover:bg-slate-50 transition">
                  <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden relative shrink-0">
                    <Image src={product.image_url} alt={product.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800 text-sm line-clamp-1 mb-1">{product.title}</h4>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500 font-medium">{product.current_reserved_quantity} حجز</span>
                      <span className="text-sm font-black text-[#4F46E5]">{formatPrice(product.tasharok_price)} ريال</span>
                    </div>
                    {/* Progress bar miniature */}
                    <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                      <div 
                        className="bg-[#4F46E5] h-1.5 rounded-full" 
                        style={{ width: `${Math.min(100, (product.current_reserved_quantity / product.target_quantity) * 100)}%` }}
                      ></div>
                    </div>
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
