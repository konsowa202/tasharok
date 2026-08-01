'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MousePointer2, CheckCircle2, ShoppingBag, Receipt, Users, MapPin, Building2 } from 'lucide-react';
import Image from 'next/image';

const STEPS = [
  {
    step: 1,
    title: 'اختر الخدمة',
    description: 'تصفح المئات من الخدمات والمنتجات المختارة بعناية من أفضل المزودين في المملكة.',
    color: 'text-[#007FB7]',
    lightColor: 'bg-[#007FB7]/10'
  },
  {
    step: 2,
    title: 'انضم للمجموعة',
    description: 'احجز الخدمة بالسعر المخفض وانضم إلى الآخرين الذين يبحثون عن نفس الخدمة.',
    color: 'text-[#22BC9F]',
    lightColor: 'bg-[#22BC9F]/10'
  },
  {
    step: 3,
    title: 'وفر أكثر',
    description: 'بمجرد اكتمال العدد المطلوب، يحصل الجميع على الخدمة بسعر الجملة المخفض!',
    color: 'text-amber-500',
    lightColor: 'bg-amber-400/10'
  }
];

const MOCK_ITEMS = [
  {
    id: 1,
    title: 'مساج سويدي 60 دقيقة',
    store: 'مؤسسة التقنية السعودية',
    price: '189 ر.س',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 2,
    title: 'آيفون 15 برو ماكس',
    store: 'مؤسسة التقنية السعودية',
    price: '4,299 ر.س',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 3,
    title: 'تنظيف وتلميع الأسنان',
    store: 'مؤسسة التقنية السعودية',
    price: '199 ر.س',
    image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 4,
    title: 'ماكينة قهوة ديلونجي',
    store: 'شركة النخبة للأجهزة',
    price: '2,799 ر.س',
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=600&auto=format&fit=crop'
  }
];

// Custom Hook to avoid Hydration Mismatches by only rendering animations on client
function useIsMounted() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  return isMounted;
}

// Step 1: Animated UI for Searching and Selecting a Service
const Step1UI = () => (
  <div className="w-full h-full bg-slate-50/50 rounded-[3rem] p-6 relative overflow-hidden flex flex-col shadow-inner">
    {/* Search Bar */}
    <div className="w-full h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center px-4 gap-3 mb-6">
      <Search className="w-5 h-5 text-[#22BC9F]" />
      <div className="text-sm font-bold text-slate-400">ابحث عن خدمات ومنتجات...</div>
    </div>

    {/* Grid of Cards */}
    <div className="grid grid-cols-2 gap-3 flex-1">
      {MOCK_ITEMS.map((item, index) => (
        <motion.div 
          key={item.id}
          animate={{ 
            scale: index === 1 ? [1, 1.05, 1] : 1, 
            borderColor: index === 1 ? ['#f1f5f9', '#22BC9F', '#f1f5f9'] : '#f1f5f9' 
          }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
          className="bg-white p-2 rounded-2xl border-2 border-slate-100 shadow-sm flex flex-col gap-2 relative overflow-hidden"
        >
          <div className="w-full aspect-[4/3] relative rounded-xl overflow-hidden bg-slate-100">
            <Image src={item.image} alt={item.title} fill className="object-cover" />
          </div>
          <div className="px-1">
            <h4 className="text-[10px] font-black text-slate-800 line-clamp-1 mb-1">{item.title}</h4>
            <div className="text-[10px] font-bold text-[#007FB7]">{item.price}</div>
          </div>
        </motion.div>
      ))}
    </div>

    {/* Animated Mouse Cursor targeting the second item */}
    <motion.div
      animate={{ 
        x: [0, -60, -60, 0], 
        y: [0, 40, 40, 0],
        scale: [1, 1, 0.8, 1] 
      }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-1/3 left-1/2 z-20 text-[#007FB7] drop-shadow-lg"
    >
      <MousePointer2 className="w-8 h-8 fill-[#007FB7]/30" />
    </motion.div>
  </div>
);

// Step 2: Animated UI for Joining a Group (Progress Bar filling)
const Step2UI = () => (
  <div className="w-full h-full bg-slate-50/50 rounded-[3rem] p-6 relative overflow-hidden flex items-center justify-center shadow-inner">
    <div className="w-full max-w-xs bg-white rounded-3xl shadow-xl border border-slate-100 p-5 relative z-10">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 relative rounded-2xl overflow-hidden border border-slate-100 shadow-sm shrink-0">
          <Image src={MOCK_ITEMS[1].image} alt="آيفون 15 برو ماكس" fill className="object-cover" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-black text-slate-900 mb-1 leading-tight">آيفون 15 برو ماكس</h4>
          <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
            <Building2 className="w-3 h-3" /> مؤسسة التقنية السعودية
          </p>
        </div>
      </div>

      {/* Progress Section */}
      <div className="mb-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[11px] font-bold text-slate-500">حالة المجموعة</span>
          <motion.span 
            animate={{ color: ['#64748b', '#22BC9F', '#64748b'] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="text-[11px] font-black bg-white px-2 py-0.5 rounded-md shadow-sm border border-slate-100"
          >
            10 / 10 اكتملت!
          </motion.span>
        </div>
        
        <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
          <motion.div 
            animate={{ width: ['20%', '100%', '20%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="h-full bg-gradient-to-r from-[#007FB7] to-[#22BC9F] rounded-full"
          />
        </div>
      </div>

      {/* Avatars joining */}
      <div className="flex justify-center -space-x-3 -space-x-reverse mb-6 h-8">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0, x: -20 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0, 1, 1, 0], x: [-20, 0, 0, -20] }}
            transition={{ duration: 4, repeat: Infinity, delay: i * 0.2 }}
            className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white z-10 flex items-center justify-center overflow-hidden shadow-sm"
          >
            <Image src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" width={32} height={32} />
          </motion.div>
        ))}
      </div>

      <motion.button 
        animate={{ backgroundColor: ['#f8fafc', '#22BC9F', '#f8fafc'], color: ['#475569', '#ffffff', '#475569'], borderColor: ['#e2e8f0', '#22BC9F', '#e2e8f0'] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="w-full py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 border shadow-sm"
      >
        <CheckCircle2 className="w-5 h-5" />
        تم الانضمام بنجاح
      </motion.button>
    </div>
    
    {/* Background glow (optimized for mobile) */}
    <div className="absolute inset-0 bg-gradient-radial from-[#22BC9F]/5 to-transparent z-0" />
  </div>
);

// Step 3: Animated UI for Saving (Receipt with discount)
const Step3UI = () => (
  <div className="w-full h-full bg-slate-50/50 rounded-[3rem] relative overflow-hidden flex items-center justify-center shadow-inner">
    
    <div className="w-full max-w-[240px] bg-white shadow-2xl rounded-2xl relative z-10">
      {/* Receipt Top */}
      <div className="p-5 border-b-2 border-dashed border-slate-200 text-center">
        <div className="w-14 h-14 bg-[#007FB7]/10 rounded-full flex items-center justify-center mx-auto mb-3 text-[#007FB7]">
          <Receipt className="w-7 h-7" />
        </div>
        <h4 className="font-black text-slate-900 text-sm mb-1">فاتورة تشارك</h4>
        <p className="text-[10px] text-slate-400 font-bold">آيفون 15 برو ماكس</p>
      </div>

      {/* Receipt Body */}
      <div className="p-5 space-y-4">
        <div className="flex justify-between items-center text-xs font-bold text-slate-600">
          <span>السعر الأساسي</span>
          <span>5,199 ر.س</span>
        </div>
        
        {/* Animated Discount Row */}
        <motion.div 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="flex justify-between items-center bg-emerald-50 p-2.5 rounded-xl border border-emerald-100"
        >
          <span className="text-[11px] font-black text-emerald-600">خصم التشارك (17%)</span>
          <span className="text-[11px] font-black text-emerald-700">- 900 ر.س</span>
        </motion.div>
        
        <div className="pt-3 border-t border-slate-100 flex justify-between items-end">
          <span className="text-sm font-black text-slate-800 mb-1">الإجمالي</span>
          <div className="text-right">
            <div className="text-[10px] text-slate-400 line-through font-bold">
              5,199 ر.س
            </div>
            <motion.div 
              animate={{ color: ['#1e293b', '#22BC9F', '#1e293b'] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="text-xl font-black text-[#1E293B]"
            >
              4,299 ر.س
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Sawtooth bottom effect for receipt */}
      <div className="absolute -bottom-2 left-0 right-0 h-4 bg-transparent flex justify-around overflow-hidden">
         {[...Array(10)].map((_, i) => (
           <div key={i} className="w-4 h-4 bg-white rotate-45 translate-y-2 shadow-sm" />
         ))}
      </div>
    </div>
  </div>
);

export default function HowItWorks() {
  const isMounted = useIsMounted();
  const animations = [Step1UI, Step2UI, Step3UI];

  return (
    <section className="py-24 relative overflow-hidden bg-white">
      <div className="text-center mb-20 max-w-3xl mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-50px" }}
          className="font-display text-4xl lg:text-5xl font-black text-[#1E293B] mb-6"
        >
          كيف يعمل <span className="text-[#22BC9F]">تشارك</span>؟
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-50px" }}
          transition={{ delay: 0.1 }}
          className="text-slate-500 font-medium text-lg"
        >
          مفهوم جديد كلياً يعتمد على القوة الشرائية للمجموعة. خطوات بسيطة تفصلك عن توفير حقيقي.
        </motion.p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32">
        {STEPS.map((step, i) => {
          const AnimationUI = animations[i];
          const isEven = i % 2 === 0;
          
          return (
            <div 
              key={step.step}
              className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-24 ${isEven ? 'lg:flex-row-reverse' : ''}`}
            >
              {/* Text Content */}
              <motion.div 
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, margin: "-100px" }}
                transition={{ duration: 0.6, type: "spring" }}
                className="w-full lg:w-1/2 space-y-6 text-center lg:text-right"
              >
                <div className={`w-20 h-20 rounded-[2rem] ${step.lightColor} ${step.color} flex items-center justify-center text-4xl font-black mx-auto lg:mx-0 shadow-inner`}>
                  {step.step}
                </div>
                <h3 className="text-3xl font-black text-slate-800">{step.title}</h3>
                <p className="text-xl text-slate-500 leading-relaxed font-medium">
                  {step.description}
                </p>
              </motion.div>

              {/* High Fidelity UI Mockup */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
                className="w-full lg:w-1/2 aspect-square max-w-md mx-auto relative shadow-2xl rounded-[3rem] bg-white border-4 border-slate-50 p-2"
              >
                {/* Only render animations on client to prevent Hydration errors */}
                {isMounted ? <AnimationUI /> : <div className="w-full h-full bg-slate-50 rounded-[3rem]" />}
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
