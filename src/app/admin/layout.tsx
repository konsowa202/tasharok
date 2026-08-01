'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Store, PackageCheck, Settings, LogOut, Bell, Tags, Megaphone, Sparkles } from 'lucide-react';
import Image from 'next/image';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'نظرة عامة', href: '/admin', icon: LayoutDashboard },
    { name: 'التجار', href: '/admin/merchants', icon: Store },
    { name: 'طلبات الاعتماد', href: '/admin/approvals', icon: PackageCheck },
    { name: 'التصنيفات', href: '/admin/categories', icon: Tags },
    { name: 'تصنيفات الخدمات', href: '/admin/service-categories', icon: Sparkles },
    { name: 'الإعلانات', href: '/admin/ads', icon: Megaphone },
    { name: 'المستخدمين', href: '/admin/users', icon: Users },
    { name: 'الإعدادات', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-arabic overflow-hidden" dir="rtl">
      {/* Sidebar - Clean White Vondera Style */}
      <aside className="w-64 bg-white border-l border-slate-100 flex flex-col shadow-sm z-20">
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

        <div className="px-4 py-4">
          <p className="text-xs font-bold text-slate-400 mb-4 px-2 uppercase tracking-wider">القائمة الرئيسية</p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(`${item.href}/`));
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-bold text-sm ${
                    isActive
                      ? 'bg-[#22BC9F]/10 text-[#1ca38a]'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#22BC9F]' : 'text-slate-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-slate-100">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-bold text-sm text-slate-500 hover:bg-rose-50 hover:text-rose-600"
          >
            <LogOut className="w-5 h-5 text-slate-400" />
            تسجيل الخروج
          </Link>
          
          <div className="mt-4 flex items-center gap-3 px-3">
            <div className="w-10 h-10 rounded-full bg-[#22BC9F]/15 flex items-center justify-center text-[#1ca38a] font-black border-2 border-white shadow-sm">
              AD
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">مدير النظام</p>
              <p className="text-xs text-emerald-500 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                متصل
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8 shrink-0 z-10 shadow-sm">
          <h1 className="text-xl font-bold text-slate-800">
            {navItems.find(i => i.href === pathname)?.name || 'لوحة التحكم'}
          </h1>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200"></div>
            <Link href="/" className="text-sm font-bold text-[#22BC9F] hover:underline">
              عرض المتجر
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-6xl mx-auto w-full pb-20">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
