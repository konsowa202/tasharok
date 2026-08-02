export interface Product {
  id: string;
  merchant_id: string;
  title: string;
  description: string;
  original_price: number;
  tasharok_price: number;
  target_quantity: number;
  current_reserved_quantity: number;
  status: string;
  image_url: string;
  item_type: 'product' | 'service';
  store_name?: string;
  category_name?: string;
  service_duration_minutes?: number;
  service_location_type?: 'at_merchant' | 'home' | 'both';
  is_timer_active?: boolean;
  offer_end_date?: string | null;
}

export interface ServiceCategory {
  id?: string;
  name: string;
  icon_name?: string;
  image_url?: string;
  display_order?: number;
  is_active?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar_url: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
}
