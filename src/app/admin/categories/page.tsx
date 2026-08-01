'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, Trash2, Edit } from 'lucide-react';
import Image from 'next/image';

interface Category {
  id: string;
  name: string;
  image_url: string;
}

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCatName, setNewCatName] = useState('');
  const [newCatImage, setNewCatImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.from('categories').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setCategories(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName || !newCatImage) return;

    setIsSubmitting(true);
    const supabase = createClient();
    
    const { error } = await supabase.from('categories').insert([
      { name: newCatName, image_url: newCatImage }
    ]);

    setIsSubmitting(false);

    if (!error) {
      setNewCatName('');
      setNewCatImage('');
      fetchCategories();
    } else {
      alert('خطأ أثناء الإضافة: ' + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا التصنيف؟ (قد تتأثر المنتجات المرتبطة به)')) return;
    
    const supabase = createClient();
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (!error) {
      setCategories(categories.filter(c => c.id !== id));
    } else {
      alert('خطأ أثناء الحذف: ' + error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">إدارة التصنيفات</h1>
      </div>

      {/* Add New Category Form */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-4">إضافة تصنيف جديد</h2>
        <form onSubmit={handleAddCategory} className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">اسم التصنيف</label>
            <input
              type="text"
              required
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#4F46E5] focus:outline-none"
              placeholder="مثال: إلكترونيات"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">رابط الصورة (URL)</label>
            <input
              type="url"
              required
              value={newCatImage}
              onChange={(e) => setNewCatImage(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#4F46E5] focus:outline-none"
              placeholder="https://..."
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#4F46E5] text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 flex items-center gap-2 disabled:opacity-50 h-[42px]"
          >
            <Plus className="w-5 h-5" /> أضف
          </button>
        </form>
      </div>

      {/* Categories List */}
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
                <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden relative">
                  <Image src={cat.image_url} alt={cat.name} fill className="object-contain mix-blend-multiply" />
                </div>
                <span className="font-bold text-gray-800">{cat.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
