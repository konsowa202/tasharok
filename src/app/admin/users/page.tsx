'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Users, Phone, Calendar, Search, Filter, MoreHorizontal, Mail } from 'lucide-react';

type UserProfile = {
  id: string;
  full_name: string;
  phone: string;
  role: string;
  created_at: string;
};

export default function AdminUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const supabase = createClient();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        setUsers(data as UserProfile[]);
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u => 
    u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.phone?.includes(searchQuery)
  );

  return (
    <div className="space-y-6 font-arabic animate-in fade-in duration-500" dir="rtl">
      
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex gap-10">
          <div>
            <p className="text-xs text-slate-500 font-bold mb-1">إجمالي المستخدمين</p>
            <p className="text-xl font-black text-slate-800">{users.length}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold mb-1">التجار</p>
            <p className="text-xl font-black text-[#4F46E5]">{users.filter(u => u.role === 'merchant').length}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold mb-1">المشترين</p>
            <p className="text-xl font-black text-emerald-500">{users.filter(u => u.role === 'customer').length}</p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="البحث بالاسم أو الهاتف..." 
            className="w-full pr-10 pl-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 flex items-center gap-2 transition">
            <Filter className="w-4 h-4" /> تصفية
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 font-bold">جاري تحميل المستخدمين...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-bold">لم يتم العثور على مستخدمين.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 text-xs tracking-wider">
                  <th className="px-6 py-4 font-bold border-b border-slate-100">المستخدم</th>
                  <th className="px-6 py-4 font-bold border-b border-slate-100">التواصل</th>
                  <th className="px-6 py-4 font-bold border-b border-slate-100">الدور</th>
                  <th className="px-6 py-4 font-bold border-b border-slate-100">تاريخ الانضمام</th>
                  <th className="px-6 py-4 font-bold border-b border-slate-100 text-left">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => {
                  const d = new Date(user.created_at);
                  const isMerchant = user.role === 'merchant';
                  return (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${isMerchant ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
                            {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{user.full_name || 'غير معروف'}</div>
                            <div className="text-xs text-slate-400 flex items-center gap-1">
                              ID: {user.id.substring(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-600 flex items-center gap-2">
                          <Phone className="w-4 h-4 text-slate-400" /> 
                          <span dir="ltr">{user.phone || 'لا يوجد هاتف'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          isMerchant ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        }`}>
                          {isMerchant ? 'تاجر' : 'مشتري'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-600 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-400" /> 
                          {d.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-left">
                        <button className="p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded-lg transition inline-flex">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
