export interface Product {
  id: string;
  merchant_id: string;
  title: string;
  description: string;
  original_price: number;
  tasharok_price: number;
  target_quantity: number;
  current_reserved_quantity: number;
  status: 'pending' | 'approved' | 'rejected';
  image_url: string;
  category?: string;
  store_name?: string;
  item_type?: 'product' | 'service';
  service_category_id?: string;
  service_category_name?: string;
  service_duration_minutes?: number;
  service_location_type?: 'at_merchant' | 'home' | 'both';
  service_booking_notes?: string;
  service_includes?: string[];
  created_at?: string;
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    merchant_id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    title: 'آيفون 15 برو ماكس 256 جيجابايت - تيتانيوم طبيعي',
    description:
      'شريحة A17 Pro الاحترافية مع نظام كاميرات زوم 5x وشاشة Super Retina XDR. احصل عليه بسعر الجملة التجاري عند اكتمال المجموعة.',
    original_price: 5199,
    tasharok_price: 4299,
    target_quantity: 10,
    current_reserved_quantity: 8,
    status: 'approved',
    image_url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80',
    category: 'إلكترونيات',
    store_name: 'مؤسسة التقنية السعودية',
    item_type: 'product',
    created_at: new Date().toISOString(),
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    merchant_id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    title: 'شاشة سامسونج ذكية 65 بوصة 4K QLED Smart TV',
    description:
      'تلفزيون سامسونج ذكي بدقة 4K الفائقة مع محرك تباين كوانتوم وصوت سينمائي Dolby Atmos شاملة الضمان الرسمي سنتين والتوصيل.',
    original_price: 4499,
    tasharok_price: 3299,
    target_quantity: 8,
    current_reserved_quantity: 6,
    status: 'approved',
    image_url: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&auto=format&fit=crop&q=80',
    category: 'أجهزة منزلية',
    store_name: 'شركة النخبة للأجهزة',
    item_type: 'product',
    created_at: new Date().toISOString(),
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    merchant_id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    title: 'سماعات سوني عازلة للضوضاء Sony WH-1000XM5',
    description:
      'سماعات سوني الفاخرة بالعزل الصوتي الذكي وبطارية تدوم حتى 30 ساعة. خصم تجميعي استثنائي مباشر من المورد.',
    original_price: 1499,
    tasharok_price: 999,
    target_quantity: 12,
    current_reserved_quantity: 11,
    status: 'approved',
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    category: 'إلكترونيات',
    store_name: 'مؤسسة التقنية السعودية',
    item_type: 'product',
    created_at: new Date().toISOString(),
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    merchant_id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    title: 'ماكينة قهوة ديلونجي إيليتا اتوماتيكية احترافية',
    description:
      'تحضير الإسبريسو والكابتشينو بلمسة واحدة مع طاحونة مدمجة ونظام تبخير الحليب التلقائي.',
    original_price: 3899,
    tasharok_price: 2799,
    target_quantity: 6,
    current_reserved_quantity: 5,
    status: 'approved',
    image_url: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&auto=format&fit=crop&q=80',
    category: 'أجهزة مطبخ',
    store_name: 'شركة النخبة للأجهزة',
    item_type: 'product',
    created_at: new Date().toISOString(),
  },
  {
    id: '55555555-5555-5555-5555-555555555555',
    merchant_id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    title: 'ماك بوك اير 15 بوصة مع شريحة Apple M2',
    description:
      'لابتوب أبل بشاشة Liquid Retina فائقة النقاء، ذاكرة 16GB وهارد SSD سعة 512GB، تصميم نحيف جداً وخفيف الوزن.',
    original_price: 5899,
    tasharok_price: 4699,
    target_quantity: 5,
    current_reserved_quantity: 2,
    status: 'approved',
    image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
    category: 'كمبيوتر ولابتوب',
    store_name: 'مؤسسة التقنية السعودية',
    item_type: 'product',
    created_at: new Date().toISOString(),
  },
];

export const MOCK_SERVICES: Product[] = [
  {
    id: '77777777-7777-7777-7777-777777777777',
    merchant_id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    title: 'جلسة مساج استرخائي 60 دقيقة',
    description:
      'جلسة تدليك استرخائي متكاملة للتخلص من التوتر وضغوط العمل. يتم التفعيل عند اكتمال حجوزات المجموعة.',
    original_price: 350,
    tasharok_price: 149,
    target_quantity: 20,
    current_reserved_quantity: 14,
    status: 'approved',
    image_url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&auto=format&fit=crop&q=80',
    category: 'مساج واسترخاء',
    store_name: 'سبا النخبة',
    item_type: 'service',
    service_duration_minutes: 60,
    service_location_type: 'at_merchant',
    service_booking_notes: 'يرجى الحضور قبل الموعد بـ 15 دقيقة. يفضل ارتداء ملابس مريحة.',
    service_includes: ['تدليك استرخائي كامل', 'زيوت عطرية طبيعية', 'مشروب ترحيبي'],
    created_at: new Date().toISOString(),
  },
  {
    id: '88888888-8888-8888-8888-888888888888',
    merchant_id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    title: 'تبييض أسنان احترافي بالليزر',
    description:
      'جلسة تبييض أسنان متكاملة في أفضل عيادات الأسنان، تشمل تنظيف الجير وتلميع الأسنان.',
    original_price: 1200,
    tasharok_price: 499,
    target_quantity: 15,
    current_reserved_quantity: 11,
    status: 'approved',
    image_url: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&auto=format&fit=crop&q=80',
    category: 'عناية بالأسنان',
    store_name: 'مركز الابتسامة',
    item_type: 'service',
    service_duration_minutes: 45,
    service_location_type: 'at_merchant',
    service_booking_notes: 'تجنب تناول المشروبات الملونة لمدة 24 ساعة بعد الجلسة.',
    service_includes: ['فحص أسنان', 'تنظيف الجير', 'تبييض بالليزر', 'تلميع'],
    created_at: new Date().toISOString(),
  },
  {
    id: '99999999-9999-9999-9999-999999999999',
    merchant_id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    title: 'باقة العناية الملكية للسيارات (تلميع نانو سيراميك)',
    description:
      'تلميع داخلي وخارجي للسيارة مع وضع طبقة نانو سيراميك أصلية لحماية الطلاء.',
    original_price: 2500,
    tasharok_price: 1199,
    target_quantity: 10,
    current_reserved_quantity: 7,
    status: 'approved',
    image_url: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=800&auto=format&fit=crop&q=80',
    category: 'عناية بالسيارات',
    store_name: 'كار كير برو',
    item_type: 'service',
    service_duration_minutes: 180,
    service_location_type: 'at_merchant',
    service_booking_notes: 'الخدمة تستغرق 3 ساعات. يمكن الانتظار في الصالة المخصصة.',
    service_includes: ['غسيل خارجي', 'تنظيف داخلي', 'تلميع كامل', 'طبقة نانو سيراميك'],
    created_at: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0000-000000000000',
    merchant_id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    title: 'اشتراك نادي رياضي لمدة 3 أشهر',
    description:
      'اشتراك شامل في نادي رياضي متكامل يشمل السباحة والحديد والجاكوزي مع مدرب شخصي لأول أسبوع.',
    original_price: 1800,
    tasharok_price: 699,
    target_quantity: 25,
    current_reserved_quantity: 19,
    status: 'approved',
    image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
    category: 'نوادي رياضية',
    store_name: 'فيت ناشن',
    item_type: 'service',
    service_duration_minutes: 90,
    service_location_type: 'at_merchant',
    service_booking_notes: 'يتم تفعيل الاشتراك خلال 48 ساعة من اكتمال المجموعة.',
    service_includes: ['دخول غير محدود', 'سباحة', 'جاكوزي', 'مدرب شخصي أول أسبوع'],
    created_at: new Date().toISOString(),
  },
];
