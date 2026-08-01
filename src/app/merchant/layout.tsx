'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Store, Package, ShoppingBag, BarChart3, Settings, Search, Globe, ChevronDown, Bell, Megaphone, Sparkles, MapPin } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

export default function MerchantLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { profile, merchantProfile } = useAuth();

  const navItems = [
    { name: 'الرئيسية', href: '/merchant', icon: Store },
    { name: 'الطلبات', href: '/merchant/orders', icon: ShoppingBag },
    { name: 'العروض', href: '/merchant/products', icon: Package },
    { name: 'خدماتي', href: '/merchant/services', icon: Sparkles },
    { name: 'فروعي', href: '/merchant/locations', icon: MapPin },
    { name: 'الإعلانات', href: '/merchant/ads', icon: Megaphone },
    { name: 'التقارير', href: '/merchant/analytics', icon: BarChart3 },
    { name: 'الإعدادات', href: '/merchant/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#F8F9FB] font-arabic overflow-hidden" dir="rtl">
      {/* Sidebar - White clean design */}
      <aside className="w-64 bg-white border-l border-slate-100 flex flex-col z-20">
        <div className="p-6 flex items-center justify-center border-b border-slate-50 h-24 overflow-hidden">
          <div className="w-full h-full relative">
            <Image 
              src="/logo-04.png" 
              alt="Tasharok Logo" 
              fill
              className="object-contain scale-[1.5]"
            />
          </div>
        </div>

        <div className="px-6 mb-4">
          <p className="text-xs font-bold text-slate-400 mb-2">القائمة الرئيسية</p>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-bold text-sm ${
                  isActive
                    ? 'bg-gradient-to-l from-[#22BC9F]/10 to-[#007FB7]/10 text-[#007FB7] border border-[#22BC9F]/10'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#22BC9F]' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8 z-10 shrink-0">
          <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
            <span className="text-slate-400">لوحة التحكم</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-800 font-bold">{navItems.find(i => i.href === pathname)?.name || 'صفحة'}</span>
          </div>

          <div className="flex items-center gap-6">
            <button className="text-slate-400 hover:text-slate-600 transition">
              <Search className="w-5 h-5" />
            </button>
            <button className="text-slate-400 hover:text-slate-600 transition relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
            </button>
            <div className="h-6 w-px bg-slate-200"></div>
            <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1.5 rounded-lg transition">
              <Globe className="w-5 h-5 text-slate-400" />
              <span className="text-sm font-bold text-slate-600">AR</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>
            <div className="flex items-center gap-3 bg-slate-50 py-1.5 px-3 rounded-full border border-slate-100 cursor-pointer">
              <div className="w-7 h-7 bg-[#22BC9F]/10 text-[#007FB7] rounded-full flex items-center justify-center text-xs font-black">
                {merchantProfile?.store_name?.charAt(0) || 'م'}
              </div>
              <span className="text-sm font-bold text-slate-700 max-w-[100px] truncate">
                {merchantProfile?.store_name || 'متجري'}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
