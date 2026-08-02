'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Coins, Package, Clock, ShieldCheck } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [pointsHistory, setPointsHistory] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchProfileData = async () => {
      const supabase = createClient();
      
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      setProfile(profileData);

      const { data: pointsData } = await supabase
        .from('points_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      setPointsHistory(pointsData || []);

      const { data: resData } = await supabase
        .from('reservations')
        .select('*, products(title, image_url)')
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false });

      setReservations(resData || []);
      setLoading(false);
    };

    fetchProfileData();
  }, [user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 font-arabic text-right" dir="rtl">
        <Header />
        <div className="flex-1 flex items-center justify-center text-slate-400 font-bold">
          جاري التحميل...
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-arabic text-right" dir="rtl">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Sidebar / Info */}
        <div className="md:col-span-4 lg:col-span-3 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
            <div className="w-20 h-20 bg-[#22BC9F]/10 text-[#22BC9F] rounded-full mx-auto flex items-center justify-center mb-4">
              <span className="text-2xl font-black">{profile?.full_name?.charAt(0) || 'U'}</span>
            </div>
            <h2 className="text-lg font-black text-slate-800">{profile?.full_name}</h2>
            <p className="text-sm text-slate-500 font-medium mb-6">{profile?.phone}</p>
            
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-xl p-4 flex flex-col items-center">
              <Coins className="w-8 h-8 text-amber-500 mb-2" />
              <span className="text-xs text-amber-700 font-bold mb-1">رصيد النقاط</span>
              <span className="text-2xl font-black text-amber-600">{profile?.points_balance || 0}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-8 lg:col-span-9 space-y-8">
          
          {/* Reservations */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
              <Package className="w-5 h-5 text-[#007FB7]" /> طلباتي وحجوزاتي
            </h3>
            
            {reservations.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8 bg-slate-50 rounded-xl">لا توجد طلبات سابقة.</p>
            ) : (
              <div className="space-y-4">
                {reservations.map((res) => (
                  <div key={res.id} className="flex gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                    <img src={res.products?.image_url} alt={res.products?.title} className="w-20 h-20 object-cover rounded-lg" />
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800 text-sm mb-1">{res.products?.title}</h4>
                      <p className="text-xs text-slate-500 mb-2">تاريخ الطلب: {new Date(res.created_at).toLocaleDateString('ar-SA')}</p>
                      <span className="bg-[#22BC9F]/10 text-[#22BC9F] px-2 py-1 rounded text-[10px] font-bold">
                        {res.status === 'pending_target' ? 'بانتظار اكتمال المجموعة' : res.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Points History */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" /> سجل النقاط
            </h3>
            
            {pointsHistory.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8 bg-slate-50 rounded-xl">لا يوجد سجل للنقاط بعد.</p>
            ) : (
              <div className="space-y-4">
                {pointsHistory.map((txn) => (
                  <div key={txn.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{txn.description}</h4>
                      <p className="text-xs text-slate-500">{new Date(txn.created_at).toLocaleDateString('ar-SA')}</p>
                    </div>
                    <span className={`font-black text-sm ${txn.transaction_type === 'earned' ? 'text-emerald-600' : 'text-red-500'}`}>
                      {txn.transaction_type === 'earned' ? '+' : '-'}{txn.amount}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
