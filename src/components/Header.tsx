'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import {
  ShoppingCart,
  User,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  Package,
} from 'lucide-react';
import Image from 'next/image';

export default function Header() {
  const { user, profile, logout } = useAuth();
  const { cartCount } = useCart();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'الخدمات', href: '/search?type=service', icon: Sparkles },
    { name: 'المنتجات', href: '/search?type=product', icon: Package },
    { name: 'كيف يعمل', href: '/#how-it-works', icon: null },
    { name: 'للموردين', href: '/signup?role=merchant', icon: null },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 font-arabic ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm'
          : 'bg-transparent'
      }`}
      dir="rtl"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="shrink-0 relative w-32 h-12 md:w-40 md:h-16 flex items-center justify-center">
          <Image
            src="/logo-04.png"
            alt="Tasharok Logo"
            fill
            className="object-contain"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 font-bold text-slate-700 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="hover:text-[#22BC9F] transition-colors flex items-center gap-2"
            >
              {item.icon && <item.icon className="w-4 h-4" />}
              {item.name}
            </Link>
          ))}
        </nav>

        {/* User Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden md:block">
            <span className="text-sm font-bold text-slate-700 hover:text-[#22BC9F] cursor-pointer ml-2">
              English
            </span>
          </div>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 rounded-full transition-colors font-bold text-slate-700 border border-slate-200 shadow-sm bg-white/80"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">حسابي</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isDropdownOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2">
                  <div className="px-4 py-3 border-b border-slate-50 mb-2">
                    <p className="font-bold text-slate-900">{profile?.full_name}</p>
                    <p className="text-xs text-slate-500 capitalize">{profile?.role}</p>
                  </div>

                  {profile?.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 text-slate-700 font-bold text-sm"
                    >
                      <LayoutDashboard className="w-4 h-4" /> لوحة الإدارة
                    </Link>
                  )}

                  {profile?.role === 'merchant' && (
                    <Link
                      href="/merchant"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 text-slate-700 font-bold text-sm"
                    >
                      <LayoutDashboard className="w-4 h-4" /> لوحة التاجر
                    </Link>
                  )}

                  {profile?.role === 'customer' ? (
                    <>
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 text-slate-700 font-bold text-sm"
                      >
                        <User className="w-4 h-4" /> الملف الشخصي
                      </Link>
                      <Link
                        href="/search"
                        className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 text-slate-700 font-bold text-sm"
                      >
                        <Sparkles className="w-4 h-4 text-[#22BC9F]" /> تصفح العروض
                      </Link>
                    </>
                  ) : (
                    <Link
                      href={profile?.role === 'admin' ? '/admin' : '/merchant'}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 text-slate-700 font-bold text-sm"
                    >
                      <User className="w-4 h-4" /> إعدادات الحساب
                    </Link>
                  )}

                  <div className="border-t border-slate-100 mt-2 pt-2">
                    <button
                      onClick={() => logout()}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-rose-50 text-rose-600 text-right font-bold text-sm"
                    >
                      <LogOut className="w-4 h-4" /> تسجيل الخروج
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-[#007FB7] hover:bg-[#006a99] text-white px-6 py-2.5 rounded-full font-bold text-sm transition-colors shadow-sm"
            >
              تسجيل الدخول
            </Link>
          )}

          {/* Cart Icon */}
          <Link
            href="/cart"
            className="relative p-2.5 text-slate-700 hover:bg-white/80 rounded-full transition-colors group bg-white/60 border border-slate-100"
          >
            <ShoppingCart className="w-6 h-6 group-hover:text-[#22BC9F] transition-colors" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#22BC9F] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-lg">
          <nav className="flex flex-col p-4 gap-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                {item.icon && <item.icon className="w-5 h-5 text-[#22BC9F]" />}
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
