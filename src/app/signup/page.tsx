'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, UserRole } from '@/context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { User, Store, Phone, Mail, KeyRound, Building2 } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { signup, isLoading } = useAuth();

  const [role, setRole] = useState<UserRole>('customer');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [storeName, setStoreName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    if (!email || !fullName) {
      setErrorMsg('يرجى كتابة كافة البيانات المطلوبة');
      setSubmitting(false);
      return;
    }

    if (role === 'merchant' && !storeName) {
      setErrorMsg('يرجى إدخال اسم المتجر التجاري');
      setSubmitting(false);
      return;
    }

    const res = await signup(email, password, fullName, phone, role, storeName);
    setSubmitting(false);

    if (res.success) {
      if (res.message) {
        // Account created but email confirmation is required before login
        setSuccessMsg(res.message);
      } else if (role === 'merchant') router.push('/merchant');
      else router.push('/');
    } else {
      setErrorMsg(res.error || 'حدث خطأ أثناء الإنشاء');
    }
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
        <h2 className="mt-4 text-3xl font-extrabold text-gray-900">إنشاء حساب جديد في تشارك</h2>
        <p className="mt-2 text-sm text-gray-600">
          انضم إلينا وابدأ تجربة التشارك التجاري الفريدة
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl sm:px-10 border border-gray-100">
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 text-sm rounded-lg text-right">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 border border-green-200 text-sm rounded-lg text-right">
              {successMsg}{' '}
              <Link href="/login" className="font-bold underline">
                الانتقال لتسجيل الدخول
              </Link>
            </div>
          )}

          {/* Role selector tabs */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">نوع الحساب</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('customer')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-bold transition ${
                  role === 'customer'
                    ? 'border-[#22BC9F] bg-[#22BC9F]/10 text-[#22BC9F]'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <User className="w-5 h-5" /> عميل (مشترٍ)
              </button>
              <button
                type="button"
                onClick={() => setRole('merchant')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-bold transition ${
                  role === 'merchant'
                    ? 'border-[#007FB7] bg-[#007FB7]/10 text-[#007FB7]'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Store className="w-5 h-5" /> تاجر (مورّد)
              </button>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الاسم بالكامل</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                  <User className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="block w-full pr-10 pl-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22BC9F] text-sm text-right text-gray-900"
                  placeholder="أحمد محمد"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pr-10 pl-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22BC9F] text-sm text-right text-gray-900"
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                  <Phone className="h-5 w-5" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="block w-full pr-10 pl-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22BC9F] text-sm text-right text-gray-900"
                  placeholder="+20 100 000 0000"
                />
              </div>
            </div>

            {role === 'merchant' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">اسم المتجر / الشركة</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    required={role === 'merchant'}
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="block w-full pr-10 pl-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007FB7] text-sm text-right text-gray-900"
                    placeholder="متجر التقنية العالمية"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                  <KeyRound className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pr-10 pl-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22BC9F] text-sm text-right text-gray-900"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting || isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-[#007FB7] hover:bg-[#006896] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#007FB7] transition duration-200"
              >
                {submitting ? 'جاري الإنشاء...' : 'إنشاء الحساب'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              لديك حساب بالفعل؟{' '}
              <Link href="/login" className="font-bold text-[#22BC9F] hover:underline">
                تسجيل الدخول
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
