'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  Truck,
  Headphones,
  Users,
  Sparkles,
  Package,
  Globe,
  MessageCircle,
  MapPin,
  Phone,
} from 'lucide-react';

export default function Footer() {
  const valueProps = [
    {
      icon: Users,
      title: 'تجمع القوة الشرائية',
      desc: 'تخفيضات حقيقية بجمع المجموعات',
      color: 'bg-[#22BC9F]/20 text-[#22BC9F]',
    },
    {
      icon: ShieldCheck,
      title: 'موردون معتمدون',
      desc: 'كل تاجر ومقدم خدمة موثق',
      color: 'bg-[#007FB7]/20 text-[#007FB7]',
    },
    {
      icon: Truck,
      title: 'استلام مرن',
      desc: 'توصيل أو استلام من الفرع',
      color: 'bg-amber-500/20 text-amber-500',
    },
    {
      icon: Headphones,
      title: 'دعم متواصل',
      desc: 'خدمة عملاء على مدار الساعة',
      color: 'bg-purple-500/20 text-purple-500',
    },
  ];

  return (
    <footer className="bg-slate-900 text-slate-300 font-arabic pt-16 pb-8 mt-auto" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Proposition Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-12 border-b border-slate-800">
          {valueProps.map((prop) => (
            <div
              key={prop.title}
              className="flex flex-col items-center text-center p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50"
            >
              <div
                className={`w-12 h-12 rounded-2xl ${prop.color} flex items-center justify-center mb-3`}
              >
                <prop.icon className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-white text-sm mb-1">{prop.title}</h4>
              <p className="text-xs text-slate-400">{prop.desc}</p>
            </div>
          ))}
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 py-12 text-right">
          {/* Logo & About */}
          <div className="space-y-4">
            <Image
              src="/logo-07.png"
              alt="تشارك - Tasharok"
              width={140}
              height={140}
              className="h-20 w-auto object-contain bg-white/5 p-2 rounded-2xl"
            />
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              منصة تشارك السعودية: منصة الشراء الجماعي الأولى للخدمات والمنتجات. احصل على
              خدماتك اليومية بأسعار الجملة عند اكتمال العدد المطلوب.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-[#22BC9F] hover:text-white transition-colors"
              >
                <Globe className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-[#007FB7] hover:text-white transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-bold text-white mb-6 md:border-r-2 md:border-[#22BC9F] md:pr-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#22BC9F]" /> الخدمات
            </h3>
            <ul className="space-y-3 text-xs">
              <li>
                <Link href="/search?type=service&category=مساج" className="hover:text-[#22BC9F] transition">
                  مساج واسترخاء
                </Link>
              </li>
              <li>
                <Link href="/search?type=service&category=أسنان" className="hover:text-[#22BC9F] transition">
                  عناية بالأسنان
                </Link>
              </li>
              <li>
                <Link href="/search?type=service&category=تجميل" className="hover:text-[#22BC9F] transition">
                  صالونات وتجميل
                </Link>
              </li>
              <li>
                <Link href="/search?type=service&category=سيارات" className="hover:text-[#22BC9F] transition">
                  عناية بالسيارات
                </Link>
              </li>
              <li>
                <Link href="/search?type=service" className="hover:text-[#22BC9F] transition">
                  كل الخدمات
                </Link>
              </li>
            </ul>
          </div>

          {/* Products & Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white mb-6 md:border-r-2 md:border-[#007FB7] md:pr-2 flex items-center gap-2">
              <Package className="w-4 h-4 text-[#007FB7]" /> روابط سريعة
            </h3>
            <ul className="space-y-3 text-xs">
              <li>
                <Link href="/search?type=product" className="hover:text-[#007FB7] transition">
                  المنتجات
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-[#007FB7] transition">
                  الصفحة الرئيسية
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-[#007FB7] transition">
                  سلة الحجوزات
                </Link>
              </li>
              <li>
                <Link href="/signup?role=merchant" className="hover:text-[#007FB7] transition">
                  سجل كمقدم خدمة
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#007FB7] transition">
                  تسجيل الدخول
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold text-white mb-6 md:border-r-2 md:border-[#22BC9F] md:pr-2 flex items-center">
              تواصل معنا
            </h3>
            <div className="space-y-4 text-xs text-slate-400">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#22BC9F]" />
                الرياض، المملكة العربية السعودية
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#22BC9F]" />
                <span dir="ltr">+966 50 000 0000</span>
              </p>
              <p className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#22BC9F]" />
                support@tasharok.sa
              </p>
            </div>
            <div className="pt-6">
              <span className="inline-block px-4 py-1.5 bg-[#22BC9F]/10 text-[#22BC9F] text-[10px] font-bold rounded-full border border-[#22BC9F]/20">
                منصة مرخصة ورسمية 🇸🇦
              </span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col-reverse md:flex-row justify-between items-center gap-4 text-xs text-slate-500 text-center md:text-right">
          <p>© {new Date().getFullYear()} تشارك (Tasharok). جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-6 mb-2 md:mb-0">
            <Link href="#" className="hover:text-white transition">شروط الاستخدام</Link>
            <Link href="#" className="hover:text-white transition">سياسة الخصوصية</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
