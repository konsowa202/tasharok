'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Truck, CheckCircle2, Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight, Copy, Trash2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';

type Order = {
  id: string;
  quantity: number;
  payment_method: string;
  status: string;
  created_at: string;
  products: {
    title: string;
    image_url: string;
    tasharok_price: number;
  } | null;
  profiles: {
    full_name: string;
    phone: string;
  } | null;
};

const TABS = [
  { id: 'all', label: 'الكل' },
  { id: 'pending_target', label: 'بانتظار الهدف' },
  { id: 'target_reached', label: 'الهدف مكتمل' },
  { id: 'merchant_confirmed', label: 'قيد التجهيز' },
  { id: 'shipped', label: 'تم الشحن' },
  { id: 'cancelled', label: 'ملغي' },
];

export default function MerchantOrders() {
  const { user } = useAuth();
  const supabase = createClient();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');

  const fetchOrders = async () => {
    if (!user) return;
    setLoading(true);
    
    const { data: products } = await supabase
      .from('products')
      .select('id')
      .eq('merchant_id', user.id);

    if (products && products.length > 0) {
      const productIds = products.map(p => p.id);
      
      const { data } = await supabase
        .from('reservations')
        .select(`
          id, quantity, payment_method, status, created_at,
          products(title, image_url, tasharok_price),
          profiles!inner(full_name, phone)
        `)
        .in('product_id', productIds)
        .order('created_at', { ascending: false });

      if (data) {
        setOrders(data as unknown as Order[]);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    await supabase.from('reservations').update({ status: newStatus }).eq('id', id);
    fetchOrders();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_target':
        return <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-lg text-xs font-bold border border-amber-100/50">بانتظار الهدف</span>;
      case 'target_reached':
        return <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold border border-blue-100/50">بانتظار التأكيد</span>;
      case 'merchant_confirmed':
        return <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-xs font-bold border border-indigo-100/50">قيد التجهيز</span>;
      case 'shipped':
        return <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-xs font-bold border border-emerald-100/50">تم الشحن</span>;
      case 'cancelled':
        return <span className="bg-rose-50 text-rose-600 px-3 py-1 rounded-lg text-xs font-bold border border-rose-100/50">ملغي</span>;
      default:
        return null;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesTab = activeTab === 'all' || order.status === activeTab;
    const matchesSearch = search === '' || 
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.profiles?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      order.products?.title?.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-500" dir="ltr">
      
      {/* Top Header stats area */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex gap-10">
          <div>
            <p className="text-xs text-slate-500 font-bold mb-1">Total orders</p>
            <p className="text-xl font-black text-slate-800">{orders.length}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold mb-1">Total sales</p>
            <p className="text-xl font-black text-[#007FB7]">
              {formatPrice(orders.reduce((acc, o) => acc + ((o.products?.tasharok_price || 0) * o.quantity), 0))}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50">
            Hide Analytics
          </button>
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50">
            Export Report
          </button>
          <button className="px-4 py-2 bg-[#4F46E5] text-white rounded-lg text-sm font-bold shadow-sm hover:bg-[#4338CA]">
            Create Order
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
        {/* Toolbar: Tabs & Search */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
          <div className="flex space-x-6 space-x-reverse" dir="rtl">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-sm font-bold pb-4 -mb-4 border-b-2 transition-colors ${
                  activeTab === tab.id ? 'border-[#4F46E5] text-[#4F46E5]' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-4 pr-10 py-1.5 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/50 text-sm w-48 shadow-inner"
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
          <div className="p-12 text-center text-slate-400 font-bold" dir="rtl">جاري تحميل البيانات...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-bold" dir="rtl">لا توجد طلبات.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left" dir="ltr">
              <thead>
                <tr className="bg-white text-slate-400 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-bold border-b border-slate-100">
                    <input type="checkbox" className="rounded border-slate-300 text-[#4F46E5] focus:ring-[#4F46E5]" />
                  </th>
                  <th className="px-6 py-4 font-bold border-b border-slate-100"># Order ID</th>
                  <th className="px-6 py-4 font-bold border-b border-slate-100">Products</th>
                  <th className="px-6 py-4 font-bold border-b border-slate-100">Owner</th>
                  <th className="px-6 py-4 font-bold border-b border-slate-100">Total</th>
                  <th className="px-6 py-4 font-bold border-b border-slate-100">Date</th>
                  <th className="px-6 py-4 font-bold border-b border-slate-100 text-center">Status</th>
                  <th className="px-6 py-4 font-bold border-b border-slate-100 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => {
                  const totalAmount = (order.products?.tasharok_price || 0) * order.quantity;
                  const date = new Date(order.created_at);
                  return (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-4">
                        <input type="checkbox" className="rounded border-slate-300 text-[#4F46E5] focus:ring-[#4F46E5]" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-700">#{order.id.slice(0,5)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3" dir="rtl">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 overflow-hidden relative shrink-0">
                            {order.products?.image_url && (
                              <Image src={order.products.image_url} alt={order.products.title} fill className="object-cover" />
                            )}
                          </div>
                          <div className="font-bold text-slate-800 text-xs line-clamp-1 w-32">{order.products?.title}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-700 text-sm" dir="rtl">{order.profiles?.full_name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-black text-slate-800 text-sm">{formatPrice(totalAmount)} <span className="text-xs text-slate-400">SAR</span></div>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-500">
                        <div>{date.toLocaleDateString('en-US')}</div>
                      </td>
                      <td className="px-6 py-4 text-center" dir="rtl">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-1.5 text-slate-400 hover:text-[#4F46E5] bg-slate-50 hover:bg-indigo-50 rounded-lg transition border border-slate-200">
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          {order.status === 'target_reached' && (
                            <button 
                              onClick={() => handleUpdateStatus(order.id, 'merchant_confirmed')}
                              className="p-1.5 text-indigo-500 hover:text-white bg-indigo-50 hover:bg-indigo-500 rounded-lg transition border border-indigo-200"
                              title="تأكيد وتجهيز"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {order.status === 'merchant_confirmed' && (
                            <button 
                              onClick={() => handleUpdateStatus(order.id, 'shipped')}
                              className="p-1.5 text-emerald-500 hover:text-white bg-emerald-50 hover:bg-emerald-500 rounded-lg transition border border-emerald-200"
                              title="تم الشحن"
                            >
                              <Truck className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button className="p-1.5 text-slate-400 hover:text-rose-500 bg-slate-50 hover:bg-rose-50 rounded-lg transition border border-slate-200">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination mock */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-slate-100 gap-2">
          <button className="p-1 rounded-md text-slate-400 border border-slate-200 hover:bg-slate-50"><ChevronLeft className="w-4 h-4" /></button>
          <button className="p-1 rounded-md text-slate-400 border border-slate-200 hover:bg-slate-50"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  );
}
