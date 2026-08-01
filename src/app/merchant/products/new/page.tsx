'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { PlusCircle, Image as ImageIcon, Save, ArrowRight, Upload } from 'lucide-react';
import Link from 'next/link';

export default function AddProductPage() {
  const router = useRouter();
  const { user } = useAuth();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    original_price: '',
    tasharok_price: '',
    target_quantity: '',
    item_type: 'product'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    let uploadedImageUrl = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80';

    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) {
        alert('حدث خطأ أثناء رفع الصورة: ' + uploadError.message);
        setLoading(false);
        return;
      }

      if (uploadData) {
        const { data } = supabase.storage.from('products').getPublicUrl(filePath);
        uploadedImageUrl = data.publicUrl;
      }
    }

    const { error } = await supabase.from('products').insert([
      {
        merchant_id: user.id,
        title: formData.title,
        description: formData.description,
        original_price: parseFloat(formData.original_price),
        tasharok_price: parseFloat(formData.tasharok_price),
        target_quantity: parseInt(formData.target_quantity, 10),
        image_url: uploadedImageUrl,
        status: 'pending',
        item_type: formData.item_type
      }
    ]);

    if (!error) {
      router.push('/merchant/products');
    } else {
      alert('حدث خطأ أثناء إضافة المنتج. تأكد من صحة البيانات.');
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 font-arabic animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/merchant/products" className="w-10 h-10 bg-white rounded-full flex items-center justify-center soft-shadow-sm hover:bg-slate-50 transition border border-slate-100">
          <ArrowRight className="w-5 h-5 text-slate-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <PlusCircle className="w-6 h-6 text-[#22BC9F]" /> إضافة منتج جديد
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">سيتم إرسال المنتج للمراجعة من قبل الإدارة قبل النشر</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl soft-shadow-md border border-slate-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">المعلومات الأساسية</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-1">
                <label className="text-sm font-bold text-slate-700">نوع العنصر <span className="text-red-500">*</span></label>
                <select 
                  name="item_type"
                  value={formData.item_type}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#22BC9F]/50 transition appearance-none"
                >
                  <option value="product">منتج ملموس</option>
                  <option value="service">خدمة (مساج، تبييض، إلخ)</option>
                </select>
              </div>

              <div className="space-y-2 md:col-span-1">
                <label className="text-sm font-bold text-slate-700">اسم المنتج / الخدمة <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#22BC9F]/50 transition"
                  placeholder="مثال: آيفون 15 أو جلسة مساج"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-slate-700">الوصف</label>
                <textarea 
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#22BC9F]/50 transition resize-none"
                  placeholder="اكتب وصفاً دقيقاً ومميزات المنتج أو الخدمة..."
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">التسعير والمجموعة المستهدفة</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">السعر الأصلي (ريال) <span className="text-red-500">*</span></label>
                <input 
                  type="number" 
                  name="original_price"
                  required
                  min="1"
                  value={formData.original_price}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#22BC9F]/50 transition"
                  placeholder="مثال: 5000"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">سعر التشارك (ريال) <span className="text-red-500">*</span></label>
                <input 
                  type="number" 
                  name="tasharok_price"
                  required
                  min="1"
                  value={formData.tasharok_price}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-[#22BC9F]/30 rounded-xl px-4 py-3 text-sm font-bold text-[#22BC9F] focus:outline-none focus:ring-2 focus:ring-[#22BC9F]/50 transition"
                  placeholder="مثال: 4200"
                />
                <p className="text-xs text-slate-400">يجب أن يكون أقل من السعر الأصلي</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">الكمية المستهدفة <span className="text-red-500">*</span></label>
                <input 
                  type="number" 
                  name="target_quantity"
                  required
                  min="2"
                  value={formData.target_quantity}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-[#007FB7]/30 rounded-xl px-4 py-3 text-sm font-bold text-[#007FB7] focus:outline-none focus:ring-2 focus:ring-[#007FB7]/50 transition"
                  placeholder="مثال: 10"
                />
                <p className="text-xs text-slate-400">الحد الأدنى للصفقة</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">صورة المنتج</h3>
            
            <div className="space-y-2">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-slate-300 border-dashed rounded-2xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition relative overflow-hidden">
                  {preview ? (
                    <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-10 h-10 text-slate-400 mb-3" />
                      <p className="mb-2 text-sm text-slate-500 font-bold">اضغط لرفع صورة</p>
                      <p className="text-xs text-slate-400">PNG, JPG, JPEG (الحد الأقصى 2MB)</p>
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden" 
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
            <Link 
              href="/merchant/products"
              className="px-6 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
            >
              إلغاء
            </Link>
            <button 
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-xl font-bold text-white bg-[#22BC9F] hover:bg-[#1ca38a] transition flex items-center gap-2 soft-shadow-sm disabled:opacity-70"
            >
              <Save className="w-4 h-4" />
              {loading ? 'جاري الحفظ...' : 'حفظ وإرسال للمراجعة'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
