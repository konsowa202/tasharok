'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, Check, X, Trash2, Megaphone } from 'lucide-react';
import Image from 'next/image';

interface Ad {
  id: string;
  merchant_id: string | null;
  title: string;
  image_url: string;
  link_url: string;
  position: 'top_carousel' | 'middle_banner' | 'bottom_banner';
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'expired';
}

const positionLabels: Record<string, string> = {
  'intro_banner': 'بانر الهوية الافتتاحي',
  'top_carousel': 'شريط الإعلانات العلوي (سلايدر)',
  'middle_banner': 'بانر وسط الصفحة',
  'bottom_banner': 'بانر أسفل الصفحة'
};

export default function AdminAdsPage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newLink, setNewLink] = useState('');
  const [newPosition, setNewPosition] = useState<'top_carousel'|'middle_banner'|'bottom_banner'>('top_carousel');

  const fetchAds = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase.from('advertisements').select('*').order('created_at', { ascending: false });
    if (data) setAds(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleAddSystemAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newImage) return;

    const supabase = createClient();
    const { error } = await supabase.from('advertisements').insert([{
      title: newTitle,
      image_url: newImage,
      link_url: newLink,
      position: newPosition,
      status: 'active' // System ads are active immediately
    }]);

    if (!error) {
      setNewTitle(''); setNewImage(''); setNewLink('');
      fetchAds();
    }
  };

  const updateStatus = async (id: string, status: string) => {
    const supabase = createClient();
    const { error } = await supabase.from('advertisements').update({ status }).eq('id', id);
    if (!error) {
      fetchAds();
    }
  };

  const deleteAd = async (id: string) => {
    if(!confirm('هل أنت متأكد من الحذف؟')) return;
    const supabase = createClient();
    const { error } = await supabase.from('advertisements').delete().eq('id', id);
    if (!error) fetchAds();
  };

  const pendingAds = ads.filter(a => a.status === 'pending');
  const activeAds = ads.filter(a => ['active', 'approved'].includes(a.status));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">إدارة الإعلانات البانر</h1>
      </div>

      {/* Requests Section */}
      <section>
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-amber-500" />
          طلبات التجار الجديدة ({pendingAds.length})
        </h2>
        
        {pendingAds.length === 0 ? (
          <div className="bg-white p-6 rounded-2xl text-center text-gray-500 border border-gray-100">
            لا توجد طلبات إعلانات معلقة حالياً
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingAds.map(ad => (
              <div key={ad.id} className="bg-white rounded-2xl p-4 border border-amber-200 flex gap-4">
                <div className="w-32 h-24 relative rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  <Image src={ad.image_url} alt={ad.title} fill className="object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900">{ad.title}</h3>
                    <p className="text-xs text-gray-500">المكان: {positionLabels[ad.position] || ad.position}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => updateStatus(ad.id, 'approved')} className="flex-1 bg-emerald-500 text-white text-xs py-1.5 rounded-lg font-bold hover:bg-emerald-600 flex items-center justify-center gap-1">
                      <Check className="w-4 h-4"/> قبول
                    </button>
                    <button onClick={() => updateStatus(ad.id, 'rejected')} className="flex-1 bg-red-50 text-red-600 text-xs py-1.5 rounded-lg font-bold hover:bg-red-100 flex items-center justify-center gap-1">
                      <X className="w-4 h-4"/> رفض
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>


      {/* Add System Ad */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-4">إضافة إعلان نظام (نشط مباشرة)</h2>
        <form onSubmit={handleAddSystemAd} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">عنوان الإعلان</label>
            <input type="text" required value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#4F46E5] focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">رابط الصورة URL</label>
            <input type="url" required value={newImage} onChange={(e) => setNewImage(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#4F46E5] focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">المكان</label>
            <select value={newPosition} onChange={(e: any) => setNewPosition(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#4F46E5] focus:outline-none">
              <option value="intro_banner">بانر الهوية الافتتاحي (أعلى الصفحة)</option>
              <option value="top_carousel">سلايدر أعلى الصفحة</option>
              <option value="middle_banner">بنر منتصف الصفحة</option>
            </select>
          </div>
          <button type="submit" className="bg-[#4F46E5] text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 flex items-center justify-center gap-2 h-[42px]">
            <Plus className="w-5 h-5" /> نشر الإعلان
          </button>
        </form>
      </section>

      {/* Active Ads List */}
      <section>
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          الإعلانات النشطة حالياً
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeAds.map(ad => (
              <div key={ad.id} className="bg-white rounded-2xl p-4 border border-gray-200 flex flex-col gap-3 group relative">
                <button onClick={() => deleteAd(ad.id)} className="absolute top-2 left-2 z-10 bg-red-50 text-red-500 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-4 h-4"/>
                </button>
                <div className="w-full h-32 relative rounded-lg overflow-hidden bg-gray-100">
                  <Image src={ad.image_url} alt={ad.title} fill className="object-cover" />
                  <div className="absolute top-2 right-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded">
                    {positionLabels[ad.position] || ad.position}
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 line-clamp-1">{ad.title}</h3>
                  <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full font-bold">نشط</span>
                </div>
              </div>
            ))}
        </div>
      </section>

    </div>
  );
}
