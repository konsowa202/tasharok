'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { ShieldAlert, ArrowRight, Home } from 'lucide-react';

export default function UnauthorizedPage() {
  const { profile, setDemoUserRole } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-arabic text-right" dir="rtl">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-block mb-4">
          <Image
            src="/logo-04.png"
            alt="تشارك"
            width={200}
            height={60}
            className="h-14 w-auto mx-auto object-contain"
          />
        </Link>
        <div className="bg-red-100 text-red-600 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-4">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">عذراً! ليس لديك صلاحية للوصول هذه الصفحة</h1>
        <p className="text-sm text-gray-600 mb-6">
          نوع حسابك الحالي هو <span className="font-bold text-[#22BC9F]">{profile?.role || 'زائر'}</span>. هذه الصفحة مخصصة للمخولين فقط.
        </p>

        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 mb-6 space-y-3">
          <p className="text-xs text-gray-500 font-medium">⚡ للوصول واستعراض لوحات التحكم في النسخة التجريبية:</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setDemoUserRole('merchant')}
              className="py-2 px-3 bg-[#007FB7]/10 text-[#007FB7] font-bold text-xs rounded-lg hover:bg-[#007FB7] hover:text-white transition"
            >
              التحويل إلى حساب تاجر 🏪
            </button>
            <button
              onClick={() => setDemoUserRole('admin')}
              className="py-2 px-3 bg-purple-100 text-purple-700 font-bold text-xs rounded-lg hover:bg-purple-700 hover:text-white transition"
            >
              التحويل إلى حساب أدمن 🛡️
            </button>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="flex items-center gap-2 bg-[#22BC9F] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md hover:bg-[#1da98f] transition"
          >
            <Home className="w-4 h-4" /> الصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
