import { createClient } from '@/lib/supabase/client';
import type { Product, Testimonial, ServiceCategory, Faq } from '@/lib/types';

const FALLBACK_SERVICE_IMAGE = 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&auto=format&fit=crop&q=80';
const FALLBACK_PRODUCT_IMAGE = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80';

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapProductRow(item: any, fallbackImage: string): Product {
  return {
    id: item.id,
    merchant_id: item.merchant_id,
    title: item.title,
    description: item.description,
    original_price: Number(item.original_price),
    tasharok_price: Number(item.tasharok_price),
    target_quantity: item.target_quantity,
    current_reserved_quantity: item.current_reserved_quantity,
    status: item.status,
    item_type: item.item_type,
    image_url: item.image_url || fallbackImage,
    store_name: item.merchant_profiles?.store_name || 'تاجر تشارك',
    category_name: item.service_categories?.name,
    service_duration_minutes: item.service_duration_minutes,
    is_timer_active: item.is_timer_active,
    offer_end_date: item.offer_end_date,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

async function fetchProductsByType(itemType: 'service' | 'product', limit: number, fallbackImage: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from('products')
    .select('*, merchant_profiles(store_name), service_categories(name, icon_name)')
    .eq('status', 'approved')
    .eq('item_type', itemType)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (data && data.length > 0) {
    return data.map((item: any) => mapProductRow(item, fallbackImage));
  }
  return [];
}

export async function fetchFeaturedServices(): Promise<Product[]> {
  try {
    return await fetchProductsByType('service', 12, FALLBACK_SERVICE_IMAGE);
  } catch {
    return [];
  }
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
  try {
    return await fetchProductsByType('product', 6, FALLBACK_PRODUCT_IMAGE);
  } catch {
    return [];
  }
}

export async function fetchCategories(): Promise<ServiceCategory[]> {
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from('service_categories')
      .select('*')
      .eq('is_active', true)
      .eq('is_featured', true)
      .order('display_order', { ascending: true })
      .limit(8);
    return data || [];
  } catch {
    return [];
  }
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from('testimonials')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(4);
    return data || [];
  } catch {
    return [];
  }
}

export async function fetchPartnersMarquee(): Promise<{ store_name: string }[]> {
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from('merchant_profiles')
      .select('store_name')
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(8);
    return data || [];
  } catch {
    return [];
  }
}

export async function fetchFaqs(): Promise<Faq[]> {
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from('faqs')
      .select('*')
      .eq('status', 'active')
      .order('sort_order', { ascending: true })
      .limit(10);
    return data || [];
  } catch {
    return [];
  }
}
