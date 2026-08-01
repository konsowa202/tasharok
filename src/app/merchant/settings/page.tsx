'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Save, Shield, Store, MapPin, CreditCard } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase/client';

export default function MerchantSettings() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();
  const supabase = createClient();
  
  const [storeName, setStoreName] = useState('');
  const [commercialRecord, setCommercialRecord] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('merchant_profiles')
        .select('store_name, commercial_record')
        .eq('merchant_id', user.id)
        .single();
        
      if (data) {
        setStoreName(data.store_name || '');
        setCommercialRecord(data.commercial_record || '');
      }
    };
    fetchProfile();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    
    await supabase
      .from('merchant_profiles')
      .update({
        store_name: storeName,
        commercial_record: commercialRecord
      })
      .eq('merchant_id', user.id);
      
    setLoading(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-500" dir="ltr">
      
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-xl font-black text-slate-900">Store Settings</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Manage your store profile and configurations</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="px-6 py-2 bg-[#4F46E5] text-white rounded-xl text-sm font-bold shadow-sm hover:bg-[#4338CA] transition flex items-center gap-2 disabled:opacity-70"
        >
          <Save className="w-4 h-4" />
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-sm font-bold flex items-center gap-2">
          <Shield className="w-4 h-4" /> Store profile updated successfully!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Settings Navigation */}
        <div className="md:col-span-1 space-y-2">
          <button className="w-full text-left px-4 py-3 bg-[#4F46E5] text-white rounded-xl font-bold text-sm shadow-sm flex items-center gap-3">
            <Store className="w-4 h-4" /> Store Profile
          </button>
          <button className="w-full text-left px-4 py-3 bg-white text-slate-600 hover:bg-slate-50 rounded-xl font-bold text-sm border border-slate-100 shadow-sm flex items-center gap-3 transition">
            <MapPin className="w-4 h-4 text-slate-400" /> Addresses
          </button>
          <button className="w-full text-left px-4 py-3 bg-white text-slate-600 hover:bg-slate-50 rounded-xl font-bold text-sm border border-slate-100 shadow-sm flex items-center gap-3 transition">
            <CreditCard className="w-4 h-4 text-slate-400" /> Payouts
          </button>
        </div>

        {/* Settings Form */}
        <div className="md:col-span-3 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
          <form className="space-y-8" onSubmit={handleSave}>
            
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Business Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Store Name</label>
                  <input 
                    type="text" 
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all bg-slate-50" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Commercial Record</label>
                  <input 
                    type="text" 
                    value={commercialRecord}
                    onChange={(e) => setCommercialRecord(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all bg-slate-50" 
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Store Policies</h3>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Return Policy</label>
                <textarea 
                  rows={4}
                  defaultValue="Standard 14-day return policy applies." 
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all bg-slate-50" 
                />
              </div>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
