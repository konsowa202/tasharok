'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQS = [
  {
    question: 'كيف أستفيد من الشراء الجماعي؟',
    answer:
      'ببساطة، عندما يحجز عدد معين من الأشخاص نفس الخدمة أو المنتج، يحصل الجميع على خصم كبير يصل إلى 70%. نحن نجمع الطلبات لنتفاوض على أفضل سعر من المزودين.'
  },
  {
    question: 'متى يتم تأكيد الحجز وحصولي على الخدمة؟',
    answer:
      'بمجرد اكتمال العدد المطلوب للمجموعة، سيتم تأكيد الحجز تلقائياً وسحب المبلغ، وسنرسل لك تفاصيل موعدك أو شحنتك فوراً.'
  },
  {
    question: 'ماذا لو لم يكتمل العدد المطلوب؟',
    answer:
      'إذا انتهى وقت المجموعة ولم يكتمل العدد، سيتم إلغاء الحجز تلقائياً ولن يتم سحب أي مبلغ من بطاقتك الائتمانية.'
  },
  {
    question: 'هل يمكنني الإلغاء بعد الحجز؟',
    answer:
      'نعم، يمكنك الإلغاء مجاناً في أي وقت قبل اكتمال المجموعة. بعد اكتمال المجموعة وتأكيد الحجز، تخضع عملية الإلغاء لسياسة المزود.'
  }
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Decorative BG element */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
        className="absolute -top-40 -right-40 w-96 h-96 border-[40px] border-[#22BC9F]/5 rounded-full pointer-events-none"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl lg:text-5xl font-black text-[#1E293B] mb-4">
            الأسئلة الشائعة
          </h2>
          <p className="text-slate-500 font-medium text-lg">كل ما تحتاج معرفته عن تشارك</p>
        </motion.div>

        <div className="space-y-4">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;

            return (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden ${
                  isOpen ? 'border-[#22BC9F] shadow-lg shadow-[#22BC9F]/10' : 'border-slate-200 shadow-sm'
                }`}
              >
                <button
                  className="w-full px-8 py-6 flex items-center justify-between text-right gap-4 focus:outline-none"
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                >
                  <span className={`font-black text-lg transition-colors ${isOpen ? 'text-[#22BC9F]' : 'text-[#1E293B]'}`}>
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      isOpen ? 'bg-[#22BC9F]/10 text-[#22BC9F]' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </motion.div>
                </button>
                
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    >
                      <div className="px-8 pb-6 text-slate-500 font-medium leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
