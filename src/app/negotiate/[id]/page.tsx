'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { MessageSquare, Send, Store } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';

export default function NegotiatePage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const { user } = useAuth();
  
  const [product, setProduct] = useState<any>(null);
  const [negotiation, setNegotiation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      router.push(`/login?redirect_to=/negotiate/${productId}`);
      return;
    }

    const fetchData = async () => {
      const supabase = createClient();
      
      // Fetch Product
      const { data: prodData } = await supabase
        .from('products')
        .select('*, merchant_profiles(store_name)')
        .eq('id', productId)
        .single();
      
      if (!prodData) {
        setLoading(false);
        return;
      }
      setProduct(prodData);

      // Fetch or Create Negotiation
      let { data: negData } = await supabase
        .from('negotiations')
        .select('*')
        .eq('product_id', productId)
        .eq('customer_id', user.id)
        .single();
        
      if (!negData) {
        const { data: newNeg } = await supabase
          .from('negotiations')
          .insert({
            product_id: productId,
            customer_id: user.id,
            merchant_id: prodData.merchant_id
          })
          .select()
          .single();
        negData = newNeg;
      }
      setNegotiation(negData);

      if (negData) {
        // Fetch Messages
        const { data: msgsData } = await supabase
          .from('negotiation_messages')
          .select('*')
          .eq('negotiation_id', negData.id)
          .order('created_at', { ascending: true });
        
        setMessages(msgsData || []);
      }
      
      setLoading(false);
    };

    fetchData();
  }, [user, productId, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !negotiation || !user) return;

    const supabase = createClient();
    const msg = {
      negotiation_id: negotiation.id,
      sender_id: user.id,
      message: newMessage.trim(),
    };

    setMessages([...messages, { ...msg, created_at: new Date().toISOString(), id: Date.now().toString() }]);
    setNewMessage('');

    await supabase.from('negotiation_messages').insert(msg);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 font-arabic text-right" dir="rtl">
        <Header />
        <div className="flex-1 flex items-center justify-center text-slate-400 font-bold">جاري تحميل المحادثة...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-arabic text-right" dir="rtl">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full flex flex-col h-[calc(100vh-140px)]">
        
        {/* Chat Header */}
        <div className="bg-white p-4 rounded-t-2xl border border-slate-200 border-b-0 flex gap-4 items-center shadow-sm">
          {product?.image_url && (
            <Image src={product.image_url} alt={product.title} width={64} height={64} className="rounded-xl object-cover" />
          )}
          <div className="flex-1">
            <h1 className="font-bold text-slate-800 line-clamp-1">{product?.title}</h1>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <Store className="w-3 h-3" />
              <span>{product?.merchant_profiles?.store_name || 'التاجر'}</span>
              <span>•</span>
              <span className="text-[#007FB7] font-bold">السعر الأصلي: {formatPrice(product?.original_price || 0)} ر.س</span>
            </div>
          </div>
        </div>

        {/* Chat Body */}
        <div className="flex-1 bg-slate-100 border-x border-slate-200 p-4 overflow-y-auto flex flex-col gap-3">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
              <MessageSquare className="w-12 h-12 mb-2 opacity-50" />
              <p>ابدأ التفاوض مع التاجر الآن. اذكر السعر الذي ترغب به!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.sender_id === user?.id;
              return (
                <div key={msg.id} className={`max-w-[75%] rounded-2xl p-3 text-sm ${isMe ? 'bg-[#22BC9F] text-white mr-auto rounded-tr-sm' : 'bg-white text-slate-700 border border-slate-200 ml-auto rounded-tl-sm'}`}>
                  <p>{msg.message}</p>
                  <span className={`text-[10px] block mt-1 ${isMe ? 'text-[#22BC9F]/30 text-white/70' : 'text-slate-400'}`}>
                    {new Date(msg.created_at).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="bg-white p-3 rounded-b-2xl border border-slate-200 shadow-sm">
          <form onSubmit={handleSendMessage} className="flex gap-2 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="اكتب رسالتك للتاجر هنا..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#22BC9F]/50"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="bg-[#007FB7] text-white p-3 rounded-xl hover:bg-[#006A98] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Send className="w-5 h-5 rtl:rotate-180" />
            </button>
          </form>
        </div>

      </main>

      <Footer />
    </div>
  );
}
