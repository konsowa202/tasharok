'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { MapPin, PlusCircle, Trash2, Phone, Star, X, Store } from 'lucide-react';

type Branch = {
  id: string;
  name: string;
  city: string;
  address: string;
  phone?: string | null;
  is_default: boolean;
  created_at?: string;
};

const MOCK_BRANCHES: Branch[] = [
  { id: 'demo-branch-1', name: 'الفرع الرئيسي', city: 'الرياض', address: 'حي العليا، طريق الملك فهد', phone: '0112345678', is_default: true },
  { id: 'demo-branch-2', name: 'فرع جدة', city: 'جدة', address: 'حي الروضة، شارع الأمير سلطان', phone: '0123456789', is_default: false },
];

const EMPTY_FORM = { name: '', city: '', address: '', phone: '', is_default: false };

export default function MerchantLocations() {
  const { user, isDemoMode } = useAuth();
  const supabase = createClient();

  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const fetchBranches = async () => {
    if (!user) return;
    setLoading(true);
    if (isDemoMode) {
      setBranches(MOCK_BRANCHES);
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from('merchant_service_locations')
      .select('*')
      .eq('merchant_id', user.id)
      .order('created_at', { ascending: true });

    if (data) setBranches(data as Branch[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchBranches();
  }, [user, isDemoMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);

    const makeDefault = formData.is_default || branches.length === 0;

    if (isDemoMode) {
      const newBranch: Branch = {
        id: `demo-branch-${Date.now()}`,
        name: formData.name,
        city: formData.city,
        address: formData.address,
        phone: formData.phone || null,
        is_default: makeDefault,
      };
      setBranches(prev => [
        ...(makeDefault ? prev.map(b => ({ ...b, is_default: false })) : prev),
        newBranch,
      ]);
      setFormData(EMPTY_FORM);
      setShowForm(false);
      setIsSubmitting(false);
      return;
    }

    if (makeDefault) {
      await supabase
        .from('merchant_service_locations')
        .update({ is_default: false })
        .eq('merchant_id', user.id);
    }

    const { error } = await supabase.from('merchant_service_locations').insert([
      {
        merchant_id: user.id,
        name: formData.name,
        city: formData.city,
        address: formData.address,
        phone: formData.phone || null,
        is_default: makeDefault,
      },
    ]);

    setIsSubmitting(false);

    if (!error) {
      setFormData(EMPTY_FORM);
      setShowForm(false);
      fetchBranches();
    } else {
      alert('حدث خطأ أثناء إضافة الفرع.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الفرع؟')) return;
    if (isDemoMode) {
      setBranches(prev => prev.filter(b => b.id !== id));
      return;
    }
    const { error } = await supabase.from('merchant_service_locations').delete().eq('id', id);
    if (!error) {
      setBranches(prev => prev.filter(b => b.id !== id));
    } else {
      alert('حدث خطأ أثناء الحذف.');
    }
  };

  const handleSetDefault = async (id: string) => {
    if (isDemoMode) {
      setBranches(prev => prev.map(b => ({ ...b, is_default: b.id === id })));
      return;
    }
    if (!user) return;
    await supabase
      .from('merchant_service_locations')
      .update({ is_default: false })
      .eq('merchant_id', user.id);
    const { error } = await supabase
      .from('merchant_service_locations')
      .update({ is_default: true })
      .eq('id', id);
    if (!error) {
      setBranches(prev => prev.map(b => ({ ...b, is_default: b.id === id })));
    } else {
      alert('حدث خطأ أثناء تعيين الفرع الرئيسي.');
    }
  };

  return (
    <div className="space-y-6 font-arabic animate-in fade-in duration-500" dir="rtl">

      {/* Header & Stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100 gap-4 sm:gap-0">
        <div className="flex gap-10">
          <div>
            <p className="text-xs text-slate-500 font-bold mb-1">إجمالي الفروع</p>
            <p className="text-xl font-black text-slate-800">{branches.length}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold mb-1">الفرع الرئيسي</p>
            <p className="text-xl font-black text-[#22BC9F]">
              {branches.find(b => b.is_default)?.name || '—'}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-[#22BC9F] text-white rounded-xl text-sm font-bold shadow-sm hover:bg-[#1ca38a] transition"
        >
          {showForm ? <X className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
          {showForm ? 'إلغاء' : 'إضافة فرع'}
        </button>
      </div>

      {/* Add Branch Form */}
      {showForm && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">إضافة فرع جديد</h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">اسم الفرع <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#22BC9F]/50 transition"
                  placeholder="مثال: فرع الرياض - العليا"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">المدينة <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#22BC9F]/50 transition"
                  placeholder="مثال: الرياض"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">العنوان <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#22BC9F]/50 transition"
                  placeholder="مثال: حي العليا، طريق الملك فهد"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">رقم الهاتف</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#22BC9F]/50 transition"
                  placeholder="مثال: 0112345678"
                />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 cursor-pointer w-fit">
              <input
                type="checkbox"
                name="is_default"
                checked={formData.is_default}
                onChange={handleChange}
                className="w-4 h-4 rounded accent-[#22BC9F]"
              />
              تعيين كفرع رئيسي
            </label>
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 rounded-xl font-bold text-white bg-[#22BC9F] hover:bg-[#1ca38a] transition flex items-center gap-2 shadow-sm disabled:opacity-70"
              >
                <PlusCircle className="w-4 h-4" />
                {isSubmitting ? 'جاري الحفظ...' : 'حفظ الفرع'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Branches List */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col min-h-[300px]">
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-slate-400 font-bold">جاري تحميل البيانات...</div>
        ) : branches.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-[#22BC9F]/10 flex items-center justify-center mb-4">
              <MapPin className="w-10 h-10 text-[#22BC9F]" />
            </div>
            <p className="text-slate-500 font-bold mb-2">لا توجد فروع حالياً.</p>
            <p className="text-sm text-slate-400 mb-6">أضف فروعك ليتمكن العملاء من معرفة مواقع استلام الخدمات.</p>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-6 py-3 bg-[#22BC9F] text-white rounded-xl text-sm font-bold shadow-sm hover:bg-[#1ca38a] transition"
            >
              <PlusCircle className="w-4 h-4" /> أضف فرعك الأول
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {branches.map((branch) => (
              <div key={branch.id} className={`rounded-2xl p-5 border relative transition hover:-translate-y-0.5 ${branch.is_default ? 'border-[#22BC9F]/40 bg-[#22BC9F]/5' : 'border-slate-100 bg-slate-50/50'}`}>
                {branch.is_default && (
                  <span className="absolute top-4 left-4 bg-[#22BC9F] text-white text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3" /> الفرع الرئيسي
                  </span>
                )}
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${branch.is_default ? 'bg-[#22BC9F]/15 text-[#22BC9F]' : 'bg-white text-slate-400 border border-slate-100'}`}>
                    <Store className="w-5 h-5" />
                  </div>
                  <h3 className="font-black text-slate-800 text-sm">{branch.name}</h3>
                </div>
                <div className="space-y-1.5 text-xs font-bold text-slate-500 mb-4">
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {branch.city} — {branch.address}
                  </p>
                  {branch.phone && (
                    <p className="flex items-center gap-1.5" dir="ltr">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {branch.phone}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                  {!branch.is_default && (
                    <button
                      onClick={() => handleSetDefault(branch.id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-[#007FB7] bg-[#007FB7]/10 hover:bg-[#007FB7]/20 rounded-lg transition"
                    >
                      <Star className="w-3 h-3" /> تعيين كرئيسي
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(branch.id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-lg transition mr-auto"
                  >
                    <Trash2 className="w-3 h-3" /> حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
