'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Megaphone, Plus, Image as ImageIcon, Send } from 'lucide-react';
import Image from 'next/image';

interface Ad {
  id: string;
  title: string;
  image_url: string;
  position: string;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'expired';
}

const positionLabels: Record<string, string> = {
  'intro_banner': 'بانر الهوية الافتتاحي',
  'top_carousel': 'شريط الإعلانات العلوي (سلايدر)',
  'middle_banner': 'بانر وسط الصفحة',
  'bottom_banner': 'بانر أسفل الصفحة'
};

export default function MerchantAdsPage() {
  const { user } = useAuth();
  const [myAds, setMyAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newLink, setNewLink] = useState('');
  const [newPosition, setNewPosition] = useState<'top_carousel'|'middle_banner'>('top_carousel');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchAds = async () => {
      if (!user) return;
      setLoading(true);
      const supabase = createClient();
      const { data } = await supabase.from('advertisements').select('*').eq('merchant_id', user.id).order('created_at', { ascending: false });
      if (data) setMyAds(data);
      setLoading(false);
    };
    fetchAds();
  }, [user]);

  const handleSubmitAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newTitle || !newImage) return;

    setIsSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.from('advertisements').insert([{
      merchant_id: user.id,
      title: newTitle,
      image_url: newImage,
      link_url: newLink,
      position: newPosition,
      status: 'pending'
    }]);
    
    setIsSubmitting(false);

    if (!error) {
      setNewTitle(''); setNewImage(''); setNewLink('');
      alert('تم إرسال طلب الإعلان للإدارة للمراجعة.');
      // Refresh list
      const { data } = await supabase.from('advertisements').select('*').eq('merchant_id', user.id).order('created_at', { ascending: false });
      if (data) setMyAds(data);
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending': return <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-bold">قيد المراجعة</span>;
      case 'approved': 
      case 'active': return <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-xs font-bold">نشط</span>;
      case 'rejected': return <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-bold">مرفوض</span>;
      default: return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-bold">{status}</span>;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">حملاتي الإعلانية</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Request Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#22BC9F]" />
              طلب إعلان جديد
            </h2>
            <form onSubmit={handleSubmitAd} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">عنوان الإعلان</label>
                <input type="text" required value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#22BC9F] focus:outline-none" placeholder="اكتب عنوان جذاب.." />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">رابط صورة البنر (URL)</label>
                <input type="url" required value={newImage} onChange={(e) => setNewImage(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#22BC9F] focus:outline-none" placeholder="https://..." />
                {newImage && (
                  <div className="mt-2 w-full h-24 relative rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                    <Image src={newImage} alt="Preview" fill className="object-cover" onError={() => setNewImage('')} />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">رابط المنتج المستهدف</label>
                <input type="text" value={newLink} onChange={(e) => setNewLink(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#22BC9F] focus:outline-none" placeholder="/product/123" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">موضع الإعلان</label>
                <select value={newPosition} onChange={(e: any) => setNewPosition(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#22BC9F] focus:outline-none">
                  <option value="intro_banner">بانر الهوية الافتتاحي (أعلى الصفحة)</option>
                  <option value="top_carousel">السلايدر الرئيسي (أعلى الصفحة)</option>
                  <option value="middle_banner">بنر وسط الصفحة</option>
                </select>
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full bg-[#22BC9F] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#1da087] flex items-center justify-center gap-2 disabled:opacity-50">
                <Send className="w-5 h-5" /> إرسال الطلب للإدارة
              </button>
            </form>
          </div>
        </div>

        {/* My Ads List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full">
            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-gray-500" />
              سجل الإعلانات
            </h2>
            
            {loading ? (
              <div className="text-center py-8 text-gray-500">جاري التحميل...</div>
            ) : myAds.length === 0 ? (
              <div className="text-center py-16 text-gray-400 flex flex-col items-center">
                <ImageIcon className="w-16 h-16 mb-4 opacity-50" />
                <p>لم تقم بطلب أي إعلان بعد.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myAds.map(ad => (
                  <div key={ad.id} className="border border-gray-100 rounded-xl p-4 flex gap-4 hover:shadow-md transition-shadow">
                    <div className="w-32 h-24 relative rounded-lg overflow-hidden bg-gray-50 shrink-0">
                      <Image src={ad.image_url} alt={ad.title} fill className="object-cover" />
                    </div>
                    <div className="flex flex-col justify-between flex-1">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg mb-1">{ad.title}</h3>
                        <p className="text-sm text-gray-500">الموضع: {positionLabels[ad.position] || ad.position}</p>
                      </div>
                      <div className="flex justify-between items-end">
                        {getStatusBadge(ad.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
