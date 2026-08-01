'use client';

import React, { useState } from 'react';
import { Settings, Save, Shield, Bell, CreditCard, User } from 'lucide-react';

export default function AdminSettings() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    siteName: 'تشارك - منصة الشراء الجماعي',
    contactEmail: 'support@tasharok.com',
    commissionRate: '5',
    autoApprove: false,
    enableNotifications: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  const tabs = [
    { id: 'general', label: 'عام', icon: Settings },
    { id: 'security', label: 'الأمان', icon: Shield },
    { id: 'notifications', label: 'الإشعارات', icon: Bell },
    { id: 'payments', label: 'المدفوعات', icon: CreditCard },
  ];

  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="space-y-6 font-arabic animate-in fade-in duration-500 max-w-4xl" dir="rtl">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900">إعدادات المنصة</h1>
        <p className="text-sm text-slate-500 font-medium mt-1">إدارة الإعدادات العامة للمنصة والتكوين</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <nav className="flex md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0 hide-scrollbar">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                    isActive 
                      ? 'bg-indigo-50 text-[#4F46E5]' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#4F46E5]' : 'text-slate-400'}`} />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
            
            {activeTab === 'general' && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-800 mb-4">الإعدادات العامة</h2>
                  <div className="grid grid-cols-1 gap-6">
                    
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">اسم المنصة</label>
                      <input 
                        type="text" 
                        name="siteName"
                        value={formData.siteName}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">البريد الإلكتروني للدعم</label>
                      <input 
                        type="email" 
                        name="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                        dir="ltr"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">نسبة عمولة المنصة (%)</label>
                      <input 
                        type="number" 
                        name="commissionRate"
                        value={formData.commissionRate}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                      />
                    </div>

                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-4">التفضيلات</h2>
                  
                  <label className="flex items-center gap-3 p-4 border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-50 transition">
                    <input 
                      type="checkbox" 
                      name="autoApprove"
                      checked={formData.autoApprove}
                      onChange={handleChange}
                      className="w-5 h-5 rounded border-slate-300 text-[#4F46E5] focus:ring-[#4F46E5]"
                    />
                    <div>
                      <p className="font-bold text-slate-800 text-sm">الموافقة التلقائية على التجار</p>
                      <p className="text-xs text-slate-500 mt-0.5">تخطي المراجعة اليدوية للتجار الجدد.</p>
                    </div>
                  </label>
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                  {success && (
                    <span className="text-sm font-bold text-emerald-500 bg-emerald-50 px-3 py-1.5 rounded-lg flex items-center gap-2">
                      تم الحفظ بنجاح!
                    </span>
                  )}
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="mr-auto bg-[#4F46E5] hover:bg-[#4338CA] text-white px-6 py-2.5 rounded-xl font-bold transition flex items-center gap-2 shadow-sm disabled:opacity-70"
                  >
                    {loading ? 'جاري الحفظ...' : (
                      <>
                        <Save className="w-4 h-4" /> حفظ التغييرات
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {activeTab !== 'general' && (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <Settings className="w-12 h-12 mb-4 text-slate-200" />
                <h3 className="font-bold text-slate-600 mb-2">قريباً</h3>
                <p className="text-sm">هذا القسم قيد التطوير حالياً.</p>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
