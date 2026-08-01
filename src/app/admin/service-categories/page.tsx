'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, Trash2, Sparkles } from 'lucide-react';

interface ServiceCategory {
  id: string;
  name: string;
  icon_name?: string | null;
  display_order: number;
  is_active: boolean;
}

const MOCK_CATEGORIES: ServiceCategory[] = [
  { id: 'demo-sc-1', name: 'صالونات التجميل', icon_name: 'scissors', display_order: 1, is_active: true },
  { id: 'demo-sc-2', name: 'الصحة والعيادات', icon_name: 'heart-pulse', display_order: 2, is_active: true },
  { id: 'demo-sc-3', name: 'الصيانة المنزلية', icon_name: 'wrench', display_order: 3, is_active: false },
];

export default function ServiceCategoriesAdminPage() {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMock, setIsMock] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('');
  const [newCatOrder, setNewCatOrder] = useState('0');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from('service_categories')
      .select('*')
      .order('display_order', { ascending: true });
    if (!error && data) {
      setCategories(data);
      setIsMock(false);
    } else {
      setCategories(MOCK_CATEGORIES);
      setIsMock(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;

    setIsSubmitting(true);

    if (isMock) {
      setCategories(prev => [
        ...prev,
        {
          id: `demo-sc-${Date.now()}`,
          name: newCatName,
          icon_name: newCatIcon || null,
          display_order: parseInt(newCatOrder, 10) || 0,
          is_active: true,
        },
      ]);
      setNewCatName('');
      setNewCatIcon('');
      setNewCatOrder('0');
      setIsSubmitting(false);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.from('service_categories').insert([
      {
        name: newCatName,
        icon_name: newCatIcon || null,
        display_order: parseInt(newCatOrder, 10) || 0,
        is_active: true,
      },
    ]);

    setIsSubmitting(false);

    if (!error) {
      setNewCatName('');
      setNewCatIcon('');
      setNewCatOrder('0');
      fetchCategories();
    } else {
      alert('خطأ أثناء الإضافة: ' + error.message);
    }
  };

  const handleToggleActive = async (cat: ServiceCategory) => {
    if (isMock) {
      setCategories(prev => prev.map(c => (c.id === cat.id ? { ...c, is_active: !c.is_active } : c)));
      return;
    }
    const supabase = createClient();
    const { error } = await supabase
      .from('service_categories')
      .update({ is_active: !cat.is_active })
      .eq('id', cat.id);
    if (!error) {
      setCategories(prev => prev.map(c => (c.id === cat.id ? { ...c, is_active: !c.is_active } : c)));
    } else {
      alert('خطأ أثناء التحديث: ' + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا التصنيف؟ (قد تتأثر الخدمات المرتبطة به)')) return;

    if (isMock) {
      setCategories(prev => prev.filter(c => c.id !== id));
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.from('service_categories').delete().eq('id', id);
    if (!error) {
      setCategories(categories.filter(c => c.id !== id));
    } else {
      alert('خطأ أثناء الحذف: ' + error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">تصنيفات الخدمات</h1>
        {isMock && (
          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
            بيانات تجريبية (يرجى تنفيذ ملف SQL أولاً)
          </span>
        )}
      </div>

      {/* Add New Service Category Form */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-4">إضافة تصنيف خدمة جديد</h2>
        <form onSubmit={handleAddCategory} className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[180px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">اسم التصنيف</label>
            <input
              type="text"
              required
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#22BC9F] focus:outline-none"
              placeholder="مثال: صالونات التجميل"
            />
          </div>
          <div className="flex-1 min-w-[180px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">اسم الأيقونة (lucide)</label>
            <input
              type="text"
              value={newCatIcon}
              onChange={(e) => setNewCatIcon(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#22BC9F] focus:outline-none"
              placeholder="مثال: scissors"
              dir="ltr"
            />
          </div>
          <div className="w-32">
            <label className="block text-sm font-medium text-gray-700 mb-1">ترتيب العرض</label>
            <input
              type="number"
              value={newCatOrder}
              onChange={(e) => setNewCatOrder(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#22BC9F] focus:outline-none"
              dir="ltr"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#22BC9F] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#1ca38a] flex items-center gap-2 disabled:opacity-50 h-[42px]"
          >
            <Plus className="w-5 h-5" /> أضف
          </button>
        </form>
      </div>

      {/* Service Categories List */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        {loading ? (
          <div className="text-center py-8 text-gray-500">جاري التحميل...</div>
        ) : categories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">لا توجد تصنيفات بعد. (يرجى تنفيذ ملف SQL أولاً)</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <div key={cat.id} className="border border-gray-200 rounded-xl p-4 flex flex-col items-center gap-3 relative group">
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="absolute top-2 left-2 p-1.5 bg-red-50 text-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  title="حذف"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="w-16 h-16 bg-[#22BC9F]/10 rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-[#22BC9F]" />
                </div>
                <span className="font-bold text-gray-800">{cat.name}</span>
                <div className="flex items-center gap-2 text-xs text-gray-400 font-bold" dir="ltr">
                  <span>{cat.icon_name || '—'}</span>
                  <span>·</span>
                  <span>#{cat.display_order}</span>
                </div>
                <button
                  onClick={() => handleToggleActive(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
                    cat.is_active
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100'
                      : 'bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  {cat.is_active ? 'نشط' : 'غير نشط'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
