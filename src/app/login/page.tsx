'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth, UserRole } from '@/context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Store, UserCheck, ArrowLeft, KeyRound, Mail } from 'lucide-react';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect_to') || '/';

  const { login, setDemoUserRole, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    if (!email) {
      setErrorMsg('يرجى إدخال البريد الإلكتروني');
      setSubmitting(false);
      return;
    }

    const res = await login(email, password);
    setSubmitting(false);

    if (res.success) {
      if (redirectTo.startsWith('/admin')) {
        router.push('/admin');
      } else if (redirectTo.startsWith('/merchant')) {
        router.push('/merchant');
      } else {
        router.push(redirectTo);
      }
    } else {
      setErrorMsg(res.error || 'فشل تسجيل الدخول');
    }
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    setDemoUserRole(role);
    if (role === 'admin') router.push('/admin');
    else if (role === 'merchant') router.push('/merchant');
    else router.push(redirectTo !== '/' ? redirectTo : '/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-arabic" dir="rtl">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-block">
          <Image
            src="/logo-04.png"
            alt="تشارك - Tasharok"
            width={220}
            height={70}
            className="h-16 w-auto mx-auto object-contain"
            priority
          />
        </Link>
        <h2 className="mt-4 text-3xl font-extrabold text-gray-900">تسجيل الدخول إلى منصة تشارك</h2>
        <p className="mt-2 text-sm text-gray-600">
          انضم إلى الشراء الجماعي واحصل على أفضل الأسعار التجارية
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {/* DEMO ROLE QUICK SELECTOR BANNER */}
        <div className="bg-gradient-to-r from-[#22BC9F]/10 to-[#007FB7]/10 p-4 rounded-xl mb-6 border border-[#22BC9F]/30 shadow-sm text-center">
          <p className="text-xs font-bold text-gray-800 mb-2">⚡ تجربة سريعة (اختر نوع الحساب للتجربة فوراً):</p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('customer')}
              className="flex items-center justify-center gap-1 py-2 px-2 bg-white text-[#22BC9F] border border-[#22BC9F] rounded-lg text-xs font-semibold hover:bg-[#22BC9F] hover:text-white transition"
            >
              <UserCheck className="w-4 h-4" /> عميل
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('merchant')}
              className="flex items-center justify-center gap-1 py-2 px-2 bg-white text-[#007FB7] border border-[#007FB7] rounded-lg text-xs font-semibold hover:bg-[#007FB7] hover:text-white transition"
            >
              <Store className="w-4 h-4" /> تاجر
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('admin')}
              className="flex items-center justify-center gap-1 py-2 px-2 bg-white text-purple-700 border border-purple-700 rounded-lg text-xs font-semibold hover:bg-purple-700 hover:text-white transition"
            >
              <ShieldCheck className="w-4 h-4" /> أدمن
            </button>
          </div>
        </div>

        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl sm:px-10 border border-gray-100">
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 text-sm rounded-lg text-right">
              {errorMsg}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                البريد الإلكتروني
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pr-10 pl-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22BC9F] focus:border-transparent text-sm text-right text-gray-900"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                كلمة المرور
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                  <KeyRound className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pr-10 pl-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22BC9F] focus:border-transparent text-sm text-right text-gray-900"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={submitting || isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-[#22BC9F] hover:bg-[#1fa98f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#22BC9F] transition duration-200"
              >
                {submitting ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ليس لديك حساب بعد؟{' '}
              <Link href="/signup" className="font-bold text-[#007FB7] hover:underline">
                إنشاء حساب جديد
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">جاري التحميل...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}
