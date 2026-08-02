-- =============================================================================
-- Tasharok (تشارك) - Supabase Master Database Schema & Seed Data
-- =============================================================================

-- =============================================================================
-- 1. CLEANUP / RESET
-- =============================================================================
DROP TABLE IF EXISTS public.page_views CASCADE;
DROP TABLE IF EXISTS public.advertisements CASCADE;
DROP TABLE IF EXISTS public.negotiation_messages CASCADE;
DROP TABLE IF EXISTS public.negotiations CASCADE;
DROP TABLE IF EXISTS public.admin_merchant_notes CASCADE;
DROP TABLE IF EXISTS public.points_transactions CASCADE;
DROP TABLE IF EXISTS public.system_settings CASCADE;
DROP TABLE IF EXISTS public.reservations CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.merchant_service_locations CASCADE;
DROP TABLE IF EXISTS public.merchant_profiles CASCADE;
DROP TABLE IF EXISTS public.faqs CASCADE;
DROP TABLE IF EXISTS public.testimonials CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.service_categories CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

DROP TRIGGER IF EXISTS tr_on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.update_product_reserved_quantity() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;
DROP FUNCTION IF EXISTS public.is_merchant() CASCADE;

DROP TYPE IF EXISTS public.reservation_status CASCADE;
DROP TYPE IF EXISTS public.payment_method CASCADE;
DROP TYPE IF EXISTS public.product_status CASCADE;
DROP TYPE IF EXISTS public.user_role CASCADE;
DROP TYPE IF EXISTS public.service_location_type CASCADE;
DROP TYPE IF EXISTS public.ad_position CASCADE;
DROP TYPE IF EXISTS public.ad_status CASCADE;
DROP TYPE IF EXISTS public.item_category CASCADE;

-- =============================================================================
-- 2. CREATE CUSTOM ENUM TYPES
-- =============================================================================
CREATE TYPE public.user_role AS ENUM ('admin', 'merchant', 'customer');
CREATE TYPE public.product_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE public.payment_method AS ENUM ('full_payment', 'deposit', 'cash_on_delivery');
CREATE TYPE public.reservation_status AS ENUM ('pending_target', 'target_reached', 'merchant_confirmed', 'shipped', 'cancelled');
CREATE TYPE public.service_location_type AS ENUM ('at_merchant', 'home', 'both');
CREATE TYPE public.ad_position AS ENUM ('intro_banner', 'top_carousel', 'middle_banner', 'bottom_banner');
CREATE TYPE public.ad_status AS ENUM ('pending', 'approved', 'rejected', 'active', 'expired');

-- =============================================================================
-- 3. CREATE TABLES
-- =============================================================================
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role public.user_role NOT NULL DEFAULT 'customer',
    full_name TEXT NOT NULL,
    phone TEXT,
    points_balance INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.merchant_profiles (
    merchant_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    store_name TEXT NOT NULL,
    commercial_record TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.merchant_service_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES public.merchant_profiles(merchant_id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    address TEXT NOT NULL,
    phone TEXT,
    is_default BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    image_url TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.service_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    icon_name TEXT,
    image_url TEXT,
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES public.merchant_profiles(merchant_id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    original_price NUMERIC(10, 2) NOT NULL CHECK (original_price > 0),
    tasharok_price NUMERIC(10, 2) NOT NULL CHECK (tasharok_price > 0 AND tasharok_price < original_price),
    target_quantity INT NOT NULL CHECK (target_quantity > 0),
    current_reserved_quantity INT NOT NULL DEFAULT 0 CHECK (current_reserved_quantity >= 0),
    status public.product_status NOT NULL DEFAULT 'pending',
    image_url TEXT,
    item_type TEXT NOT NULL DEFAULT 'product' CHECK (item_type IN ('product', 'service')),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    service_category_id UUID REFERENCES public.service_categories(id) ON DELETE SET NULL,
    service_duration_minutes INT,
    service_location_type public.service_location_type DEFAULT 'at_merchant',
    service_booking_notes TEXT,
    service_includes TEXT[],
    admin_notes TEXT,
    offer_end_date TIMESTAMPTZ,
    is_timer_active BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    payment_method public.payment_method NOT NULL,
    status public.reservation_status NOT NULL DEFAULT 'pending_target',
    preferred_date DATE,
    preferred_time TEXT,
    booking_notes TEXT,
    fulfillment_status TEXT NOT NULL DEFAULT 'pending' CHECK (fulfillment_status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.page_views (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
    viewer_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    channel text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    PRIMARY KEY (id)
);

CREATE TABLE public.advertisements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID REFERENCES public.merchant_profiles(merchant_id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    image_url TEXT NOT NULL,
    link_url TEXT,
    position public.ad_position NOT NULL DEFAULT 'top_carousel',
    status public.ad_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    avatar_url TEXT,
    status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_point_rate NUMERIC(10, 2) NOT NULL DEFAULT 1.0, 
    service_point_rate NUMERIC(10, 2) NOT NULL DEFAULT 2.0, 
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.points_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount INT NOT NULL,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('earned', 'spent', 'adjusted')),
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.admin_merchant_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES public.merchant_profiles(merchant_id) ON DELETE CASCADE,
    admin_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    note TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.negotiations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    merchant_id UUID NOT NULL REFERENCES public.merchant_profiles(merchant_id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.negotiation_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    negotiation_id UUID NOT NULL REFERENCES public.negotiations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 4. INDEXES FOR PERFORMANCE
-- =============================================================================
CREATE INDEX idx_products_merchant_id ON public.products(merchant_id);
CREATE INDEX idx_products_status ON public.products(status);
CREATE INDEX idx_products_item_type ON public.products(item_type);
CREATE INDEX idx_products_category_id ON public.products(category_id);
CREATE INDEX idx_products_service_category_id ON public.products(service_category_id);
CREATE INDEX idx_service_categories_active_order ON public.service_categories(is_active, display_order);
CREATE INDEX idx_merchant_locations_merchant_id ON public.merchant_service_locations(merchant_id);
CREATE INDEX idx_reservations_customer_id ON public.reservations(customer_id);
CREATE INDEX idx_reservations_product_id ON public.reservations(product_id);
CREATE INDEX idx_reservations_status ON public.reservations(status);
CREATE INDEX idx_page_views_product_id ON public.page_views(product_id);

-- =============================================================================
-- 5. HELPER SECURITY FUNCTIONS & TRIGGERS
-- =============================================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_merchant()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'merchant');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.update_product_reserved_quantity()
RETURNS TRIGGER AS $$
DECLARE
    v_new_reserved INT;
    v_target INT;
BEGIN
    UPDATE public.products
    SET current_reserved_quantity = current_reserved_quantity + NEW.quantity
    WHERE id = NEW.product_id
    RETURNING current_reserved_quantity, target_quantity INTO v_new_reserved, v_target;

    IF v_new_reserved >= v_target THEN
        UPDATE public.reservations
        SET status = 'target_reached'
        WHERE product_id = NEW.product_id AND status = 'pending_target';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER tr_update_reserved_quantity
AFTER INSERT ON public.reservations
FOR EACH ROW EXECUTE FUNCTION public.update_product_reserved_quantity();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, phone, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
        NEW.raw_user_meta_data->>'phone',
        COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'customer')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER tr_on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchant_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchant_service_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advertisements ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id OR public.is_admin());
CREATE POLICY "Admins have full access to profiles" ON public.profiles FOR ALL USING (public.is_admin());

-- Merchant Profiles
CREATE POLICY "Public read access to merchant profiles" ON public.merchant_profiles FOR SELECT USING (true);
CREATE POLICY "Merchants can manage own merchant profile" ON public.merchant_profiles FOR ALL USING (auth.uid() = merchant_id OR public.is_admin()) WITH CHECK (auth.uid() = merchant_id OR public.is_admin());

-- Merchant Service Locations
CREATE POLICY "Public read access to merchant service locations" ON public.merchant_service_locations FOR SELECT USING (true);
CREATE POLICY "Merchants can manage own service locations" ON public.merchant_service_locations FOR ALL USING (auth.uid() = merchant_id OR public.is_admin()) WITH CHECK (auth.uid() = merchant_id OR public.is_admin());

-- Categories & Service Categories
CREATE POLICY "Public read access to categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL USING (public.is_admin());
CREATE POLICY "Public read access to service categories" ON public.service_categories FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Admins can manage service categories" ON public.service_categories FOR ALL USING (public.is_admin());

-- Products
CREATE POLICY "Public can view approved products" ON public.products FOR SELECT USING (status = 'approved' OR merchant_id = auth.uid() OR public.is_admin());
CREATE POLICY "Merchants can insert own products" ON public.products FOR INSERT WITH CHECK (auth.uid() = merchant_id OR public.is_admin());
CREATE POLICY "Merchants can update own products" ON public.products FOR UPDATE USING (auth.uid() = merchant_id OR public.is_admin()) WITH CHECK (auth.uid() = merchant_id OR public.is_admin());
CREATE POLICY "Admins have full access to products" ON public.products FOR ALL USING (public.is_admin());

-- Reservations
CREATE POLICY "Users can view relevant reservations" ON public.reservations FOR SELECT USING (customer_id = auth.uid() OR EXISTS (SELECT 1 FROM public.products p WHERE p.id = reservations.product_id AND p.merchant_id = auth.uid()) OR public.is_admin());
CREATE POLICY "Customers can create reservations" ON public.reservations FOR INSERT WITH CHECK (customer_id = auth.uid());
CREATE POLICY "Merchants and Admins can update reservations" ON public.reservations FOR UPDATE USING (EXISTS (SELECT 1 FROM public.products p WHERE p.id = reservations.product_id AND p.merchant_id = auth.uid()) OR public.is_admin()) WITH CHECK (EXISTS (SELECT 1 FROM public.products p WHERE p.id = reservations.product_id AND p.merchant_id = auth.uid()) OR public.is_admin());

-- Page Views
CREATE POLICY "Anyone can insert page views" ON public.page_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Merchants view own product stats" ON public.page_views FOR SELECT USING (EXISTS (SELECT 1 FROM public.products p WHERE p.id = page_views.product_id AND p.merchant_id = auth.uid()) OR public.is_admin());

-- Advertisements
CREATE POLICY "Ads are viewable by everyone" ON public.advertisements FOR SELECT USING (true);
CREATE POLICY "Merchants can insert own ads" ON public.advertisements FOR INSERT WITH CHECK (auth.uid() = merchant_id);
CREATE POLICY "Merchants can update own ads" ON public.advertisements FOR UPDATE USING (auth.uid() = merchant_id);
CREATE POLICY "Merchants can delete own ads" ON public.advertisements FOR DELETE USING (auth.uid() = merchant_id);

-- Testimonials & FAQs
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Testimonials viewable by everyone" ON public.testimonials FOR SELECT USING (status = 'approved' OR public.is_admin());
CREATE POLICY "FAQs viewable by everyone" ON public.faqs FOR SELECT USING (status = 'active' OR public.is_admin());

-- Points & Settings
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.points_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Settings viewable by everyone" ON public.system_settings FOR SELECT USING (true);
CREATE POLICY "Admins manage settings" ON public.system_settings FOR ALL USING (public.is_admin());
CREATE POLICY "Users view own points history" ON public.points_transactions FOR SELECT USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "Admins manage points history" ON public.points_transactions FOR ALL USING (public.is_admin());

-- Admin Merchant Notes
ALTER TABLE public.admin_merchant_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Merchants view own notes" ON public.admin_merchant_notes FOR SELECT USING (merchant_id = auth.uid() OR public.is_admin());
CREATE POLICY "Admins manage merchant notes" ON public.admin_merchant_notes FOR ALL USING (public.is_admin());

-- Negotiations
ALTER TABLE public.negotiations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.negotiation_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Customers view own negotiations" ON public.negotiations FOR SELECT USING (customer_id = auth.uid() OR merchant_id = auth.uid() OR public.is_admin());
CREATE POLICY "Customers insert negotiations" ON public.negotiations FOR INSERT WITH CHECK (customer_id = auth.uid());
CREATE POLICY "Merchants and Admins update negotiations" ON public.negotiations FOR UPDATE USING (merchant_id = auth.uid() OR public.is_admin());
CREATE POLICY "Participants view messages" ON public.negotiation_messages FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.negotiations n WHERE n.id = negotiation_messages.negotiation_id AND (n.customer_id = auth.uid() OR n.merchant_id = auth.uid())) 
    OR public.is_admin()
);
CREATE POLICY "Participants insert messages" ON public.negotiation_messages FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.negotiations n WHERE n.id = negotiation_messages.negotiation_id AND (n.customer_id = auth.uid() OR n.merchant_id = auth.uid() OR public.is_admin()))
);

-- =============================================================================
-- 7. STORAGE BUCKET (Products)
-- =============================================================================
INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true) ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'products' );

DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK ( bucket_id = 'products' );

DROP POLICY IF EXISTS "Users can update their own uploads" ON storage.objects;
CREATE POLICY "Users can update their own uploads" ON storage.objects FOR UPDATE TO authenticated USING ( bucket_id = 'products' AND auth.uid() = owner ) WITH CHECK ( bucket_id = 'products' AND auth.uid() = owner );

DROP POLICY IF EXISTS "Users can delete their own uploads" ON storage.objects;
CREATE POLICY "Users can delete their own uploads" ON storage.objects FOR DELETE TO authenticated USING ( bucket_id = 'products' AND auth.uid() = owner );

-- =============================================================================
-- 8. SEED DATA
-- =============================================================================

-- System Settings
INSERT INTO public.system_settings (product_point_rate, service_point_rate) VALUES (1.0, 2.0);

-- Auth Users (Fixed for FK constraints)
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud)
VALUES 
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '00000000-0000-0000-0000-000000000000', 'admin@tasharok.sa', '$2a$10$abcdefghijklmnopqrstuu', NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"إدارة منصة تشارك السعودية","role":"admin"}', NOW(), NOW(), 'authenticated', 'authenticated'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '00000000-0000-0000-0000-000000000000', 'merchant1@tasharok.sa', '$2a$10$abcdefghijklmnopqrstuu', NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"مؤسسة التقنية السعودية للجملة","role":"merchant"}', NOW(), NOW(), 'authenticated', 'authenticated'),
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', '00000000-0000-0000-0000-000000000000', 'merchant2@tasharok.sa', '$2a$10$abcdefghijklmnopqrstuu', NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"شركة النخبة للأجهزة المنزلية","role":"merchant"}', NOW(), NOW(), 'authenticated', 'authenticated'),
    ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', '00000000-0000-0000-0000-000000000000', 'customer1@tasharok.sa', '$2a$10$abcdefghijklmnopqrstuu', NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"سعود العتيبي","role":"customer"}', NOW(), NOW(), 'authenticated', 'authenticated'),
    ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', '00000000-0000-0000-0000-000000000000', 'customer2@tasharok.sa', '$2a$10$abcdefghijklmnopqrstuu', NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"محمد المطيري","role":"customer"}', NOW(), NOW(), 'authenticated', 'authenticated'),
    ('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', '00000000-0000-0000-0000-000000000000', 'customer3@tasharok.sa', '$2a$10$abcdefghijklmnopqrstuu', NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"عبد الله القحطاني","role":"customer"}', NOW(), NOW(), 'authenticated', 'authenticated'),
    ('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', '00000000-0000-0000-0000-000000000000', 'customer4@tasharok.sa', '$2a$10$abcdefghijklmnopqrstuu', NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"فهد الدوسري","role":"customer"}', NOW(), NOW(), 'authenticated', 'authenticated')
ON CONFLICT (id) DO NOTHING;

-- Profiles
INSERT INTO public.profiles (id, role, full_name, phone, created_at)
VALUES 
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'admin', 'إدارة منصة تشارك السعودية', '+966 50 111 2222', NOW()),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'merchant', 'مؤسسة التقنية السعودية للجملة', '+966 55 333 4444', NOW()),
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'merchant', 'شركة النخبة للأجهزة المنزلية', '+966 54 555 6666', NOW()),
    ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'customer', 'سعود العتيبي', '+966 56 777 8888', NOW()),
    ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'customer', 'محمد المطيري', '+966 57 888 9999', NOW()),
    ('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'customer', 'عبد الله القحطاني', '+966 58 999 0000', NOW()),
    ('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', 'customer', 'فهد الدوسري', '+966 59 000 1111', NOW())
ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, phone = EXCLUDED.phone;

-- Merchant Profiles
INSERT INTO public.merchant_profiles (merchant_id, store_name, commercial_record, is_featured, created_at)
VALUES 
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'مؤسسة التقنية السعودية', 'CR-1010892041', true, NOW()),
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'شركة النخبة للأجهزة', 'CR-1010774920', true, NOW())
ON CONFLICT (merchant_id) DO UPDATE SET store_name = EXCLUDED.store_name, commercial_record = EXCLUDED.commercial_record, is_featured = EXCLUDED.is_featured;

-- Categories
INSERT INTO public.categories (name, image_url) VALUES
('إلكترونيات', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80'),
('أجهزة منزلية', 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=400&q=80'),
('عطور وتجميل', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80'),
('عام', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80'),
('أجهزة لابتوب', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop'),
('قطع كمبيوتر', 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=400&fit=crop'),
('هواتف ذكية', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop'),
('شبكات مؤسسات', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=400&fit=crop'),
('أجهزة لوحية', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop'),
('تخزين', 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=400&fit=crop'),
('كاميرات وعدسات', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop'),
('ألعاب فيديو', 'https://images.unsplash.com/photo-1605901309584-818e25960b8f?w=400&h=400&fit=crop'),
('عطور', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop')
ON CONFLICT (name) DO NOTHING;

-- Service Categories
INSERT INTO public.service_categories (name, icon_name, image_url, display_order, is_active, is_featured)
VALUES
    ('مساج واسترخاء',      'Flower2',     'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&auto=format&fit=crop&q=80', 1, true, true),
    ('عناية بالأسنان',     'Smile',       'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&auto=format&fit=crop&q=80', 2, true, true),
    ('صالونات وتجميل',     'Scissors',    'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop&q=80', 3, true, true),
    ('عناية بالسيارات',    'Car',         'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=800&auto=format&fit=crop&q=80', 4, true, true),
    ('نوادي رياضية',       'Dumbbell',    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80', 5, true, true),
    ('حمام مغربي وبخار',   'Droplets',    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80', 6, true, true),
    ('فحوصات طبية',        'Stethoscope', 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&auto=format&fit=crop&q=80', 7, true, true),
    ('جلسات تجميلية',      'Sparkles',    'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80', 8, true, true)
ON CONFLICT (name) DO UPDATE SET icon_name = EXCLUDED.icon_name, image_url = EXCLUDED.image_url, display_order = EXCLUDED.display_order, is_active = EXCLUDED.is_active, is_featured = EXCLUDED.is_featured;

-- Products & Services
INSERT INTO public.products (id, merchant_id, title, description, original_price, tasharok_price, target_quantity, current_reserved_quantity, status, image_url, item_type, category_id, service_category_id, service_duration_minutes, service_location_type, service_booking_notes, service_includes, created_at)
VALUES 
    -- Physical Products
    ('11111111-1111-1111-1111-111111111111', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'آيفون 15 برو ماكس 256 جيجابايت - تيتانيوم طبيعي', 'شريحة A17 Pro الاحترافية مع نظام كاميرات زوم 5x وشاشة Super Retina XDR. احصل عليه بسعر الجملة التجاري عند اكتمال المجموعة.', 5199.00, 4299.00, 10, 8, 'approved', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80', 'product', (SELECT id FROM public.categories WHERE name = 'هواتف ذكية'), NULL, NULL, NULL, NULL, NULL, NOW()),
    ('22222222-2222-2222-2222-222222222222', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'شاشة سامسونج ذكية 65 بوصة 4K QLED Smart TV', 'تلفزيون سامسونج ذكي بدقة 4K الفائقة مع محرك تباين كوانتوم وصوت سينمائي Dolby Atmos شاملة الضمان الرسمي سنتين والتوصيل.', 4499.00, 3299.00, 8, 6, 'approved', 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&auto=format&fit=crop&q=80', 'product', (SELECT id FROM public.categories WHERE name = 'أجهزة منزلية'), NULL, NULL, NULL, NULL, NULL, NOW()),
    ('33333333-3333-3333-3333-333333333333', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'سماعات سوني عازلة للضوضاء Sony WH-1000XM5', 'سماعات سوني الفاخرة بالعزل الصوتي الذكي وبطارية تدوم حتى 30 ساعة. خصم تجميعي استثنائي مباشر من المورد.', 1499.00, 999.00, 12, 11, 'approved', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80', 'product', (SELECT id FROM public.categories WHERE name = 'إلكترونيات'), NULL, NULL, NULL, NULL, NULL, NOW()),
    ('44444444-4444-4444-4444-444444444444', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'ماكينة قهوة ديلونجي إيليتا اتوماتيكية احترافية', 'تحضير الإسبريسو والكابتشينو بلمسة واحدة مع طاحونة مدمجة ونظام تبخير الحليب التلقائي.', 3899.00, 2799.00, 6, 5, 'approved', 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&auto=format&fit=crop&q=80', 'product', (SELECT id FROM public.categories WHERE name = 'أجهزة منزلية'), NULL, NULL, NULL, NULL, NULL, NOW()),
    ('55555555-5555-5555-5555-555555555555', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'ماك بوك اير 15 بوصة مع شريحة Apple M2', 'لابتوب أبل بشاشة Liquid Retina فائقة النقاء، ذاكرة 16GB وهارد SSD سعة 512GB، تصميم نحيف جداً وخفيف الوزن.', 5899.00, 4699.00, 5, 2, 'approved', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80', 'product', (SELECT id FROM public.categories WHERE name = 'أجهزة لابتوب'), NULL, NULL, NULL, NULL, NULL, NOW()),
    ('66666666-6666-6666-6666-666666666666', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'كنبة صالون مودرن فاخرة 4 مقاعد - رمادي مريح', 'تصميم كلاسيكي مودرن بقماش مخملي عالي الجودة وهيكل خشب زان متين. قيد المراجعة والموافقة من الإدارة.', 3299.00, 2199.00, 10, 1, 'pending', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80', 'product', (SELECT id FROM public.categories WHERE name = 'عام'), NULL, NULL, NULL, NULL, NULL, NOW()),
    
    -- Services
    ('20000000-0000-4000-8000-000000000001', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'مساج سويدي 60 دقيقة', 'استمتع بجلسة مساج سويدي احترافية تذيب التوتر وتجدد طاقتك بالكامل. يقوم بها معالجون معتمدون باستخدام زيوت طبيعية فاخرة في أجواء هادئة ومريحة. العرض يُفعّل عند اكتمال حجوزات المجموعة.', 400.00, 189.00, 15, 10, 'approved', 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&auto=format&fit=crop&q=80', 'service', NULL, (SELECT id FROM public.service_categories WHERE name = 'مساج واسترخاء'), 60, 'at_merchant', 'يُرجى الحجز قبل 24 ساعة على الأقل. الحضور قبل الموعد بـ 10 دقائق.', ARRAY['جلسة مساج سويدي كاملة 60 دقيقة', 'زيوت عطرية طبيعية', 'غرفة خاصة هادئة', 'مشروبات ساخنة بعد الجلسة'], NOW()),
    ('20000000-0000-4000-8000-000000000002', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'مساج تايلندي علاجي 90 دقيقة', 'جلسة مساج تايلندي أصيلة تجمع بين الإطالة والضغط على نقاط الطاقة لتحسين المرونة وتخفيف آلام الظهر والمفاصل. مثالية لمن يعانون من الجلوس الطويل وضغوط العمل اليومية.', 550.00, 249.00, 12, 7, 'approved', 'https://images.unsplash.com/photo-1519824145371-296894a0daa9?w=800&auto=format&fit=crop&q=80', 'service', NULL, (SELECT id FROM public.service_categories WHERE name = 'مساج واسترخاء'), 90, 'at_merchant', 'يُفضل ارتداء ملابس مريحة. غير مناسب للحوامل أو من أجروا عمليات جراحية حديثاً.', ARRAY['جلسة مساج تايلندي 90 دقيقة', 'معالج تايلندي معتمد', 'إطالات وضغط علاجي', 'استشارة سريعة قبل الجلسة', 'شاي أعشاب مجاني'], NOW()),
    ('20000000-0000-4000-8000-000000000003', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'تبييض أسنان بالليزر', 'احصل على ابتسامة مشرقة خلال جلسة واحدة مع أحدث أجهزة تبييض الأسنان بالليزر. يُجريها أطباء أسنان مرخصون في عيادة مجهزة بالكامل مع نتائج تدوم طويلاً.', 1500.00, 649.00, 20, 14, 'approved', 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&auto=format&fit=crop&q=80', 'service', NULL, (SELECT id FROM public.service_categories WHERE name = 'عناية بالأسنان'), 60, 'at_merchant', 'تجنب القهوة والتدخين لمدة 48 ساعة بعد الجلسة للحصول على أفضل نتيجة.', ARRAY['جلسة تبييض بالليزر كاملة', 'فحص وتقييم أولي مجاني', 'حماية اللثة أثناء الجلسة', 'جل مهدئ بعد التبييض'], NOW()),
    ('20000000-0000-4000-8000-000000000004', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'تنظيف وتلميع الأسنان مع إزالة الجير', 'جلسة تنظيف شاملة لإزالة الجير والتصبغات مع تلميع احترافي يعيد لأسنانك لمعانها الطبيعي. تتم على يد أخصائيين باستخدام أجهزة حديثة لطيفة على اللثة.', 450.00, 199.00, 25, 18, 'approved', 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format&fit=crop&q=80', 'service', NULL, (SELECT id FROM public.service_categories WHERE name = 'عناية بالأسنان'), 45, 'at_merchant', 'يُنصح بإجراء التنظيف كل 6 أشهر. الحجز المسبق إلزامي.', ARRAY['إزالة الجير بالكامل', 'تلميع الأسنان', 'فحص سريع للثة والأسنان', 'نصائح عناية يومية من الطبيب'], NOW()),
    ('20000000-0000-4000-8000-000000000005', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'قص وسشوار نسائي', 'جددي إطلالتك مع قصة شعر عصرية على يد كوافيرات محترفات، متبوعة بسشوار وتصفيف أنيق يناسب ذوقك ومناسباتك. تجربة راقية في صالون نسائي مميز بخصوصية تامة.', 300.00, 129.00, 20, 12, 'approved', 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop&q=80', 'service', NULL, (SELECT id FROM public.service_categories WHERE name = 'صالونات وتجميل'), 90, 'at_merchant', 'الصالون نسائي بالكامل. يُفضل إحضار صورة للقصة المطلوبة.', ARRAY['غسيل الشعر', 'قصة على يد كوافيرة خبيرة', 'سشوار وتصفيف كامل', 'استشارة مجانية لاختيار القصة'], NOW()),
    ('20000000-0000-4000-8000-000000000006', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'صبغة شعر كاملة مع بروتين معالج', 'صبغة شعر كاملة بألوان عصرية باستخدام منتجات عالمية آمنة، مع جلسة بروتين معالج يحمي الشعر ويمنحه نعومة ولمعاناً يدوم لأسابيع.', 800.00, 349.00, 15, 6, 'approved', 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800&auto=format&fit=crop&q=80', 'service', NULL, (SELECT id FROM public.service_categories WHERE name = 'صالونات وتجميل'), 180, 'at_merchant', 'اختبار حساسية إلزامي قبل 48 ساعة من الموعد. الجلسة قد تستغرق حتى 3 ساعات.', ARRAY['صبغة كاملة بمنتجات عالمية', 'جلسة بروتين معالج', 'غسيل وتصفيف نهائي', 'ضمان جودة اللون لمدة أسبوعين', 'استشارة اختيار اللون'], NOW()),
    ('20000000-0000-4000-8000-000000000007', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'تلميع خارجي + نانو سيراميك للسيارة', 'أعد لسيارتك بريق الوكالة مع تلميع خارجي احترافي وطبقة نانو سيراميك أصلية تحمي الطلاء من الخدوش والأتربة والأشعة لمدة تصل إلى 3 سنوات.', 2200.00, 999.00, 10, 4, 'approved', 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=800&auto=format&fit=crop&q=80', 'service', NULL, (SELECT id FROM public.service_categories WHERE name = 'عناية بالسيارات'), 240, 'at_merchant', 'تستغرق الخدمة حوالي 4 ساعات. يُفضل ترك السيارة واستلامها في نفس اليوم.', ARRAY['تلميع خارجي متعدد المراحل', 'طبقة نانو سيراميك أصلية', 'إزالة الخدوش السطحية', 'تنظيف الجنوط والإطارات', 'ضمان على الطبقة 3 سنوات'], NOW()),
    ('20000000-0000-4000-8000-000000000008', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'غسيل وتعقيم داخلي شامل للسيارة', 'غسيل داخلي عميق بالبخار يشمل المقاعد والسقف والأرضيات مع تعقيم كامل يقضي على البكتيريا والروائح. خدمة متنقلة متاحة عند باب منزلك أو في المركز.', 350.00, 149.00, 30, 22, 'approved', 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=800&auto=format&fit=crop&q=80', 'service', NULL, (SELECT id FROM public.service_categories WHERE name = 'عناية بالسيارات'), 120, 'both', 'الخدمة المتنقلة متاحة داخل الرياض فقط. يُرجى إخلاء السيارة من الأغراض الشخصية.', ARRAY['غسيل داخلي بالبخار', 'تنظيف المقاعد والسقف والأرضيات', 'تعقيم كامل ضد البكتيريا', 'تلميع التابلوه والبلاستيك', 'معطر داخلي فاخر'], NOW()),
    ('20000000-0000-4000-8000-000000000009', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'اشتراك نادي رياضي 3 أشهر', 'اشتراك 3 أشهر في نادي رياضي متكامل يشمل صالة الحديد والأجهزة الكارديو وحصص اللياقة الجماعية. ابدأ رحلتك نحو اللياقة بأفضل سعر جماعي في السوق.', 1200.00, 549.00, 25, 19, 'approved', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80', 'service', NULL, (SELECT id FROM public.service_categories WHERE name = 'نوادي رياضية'), NULL, 'at_merchant', 'يبدأ الاشتراك من أول زيارة. إحضار الهوية الوطنية عند التسجيل.', ARRAY['دخول غير محدود لصالة الحديد', 'أجهزة كارديو حديثة', 'حصص لياقة جماعية', 'خزانة خاصة مجانية'], NOW()),
    ('20000000-0000-4000-8000-000000000010', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'اشتراك نادي رياضي 6 أشهر شامل المسبح', 'اشتراك 6 أشهر شامل كل مرافق النادي: صالة الحديد، المسبح، الساونا والجاكوزي، مع خطة تدريب مبدئية من مدرب معتمد. التزام أطول يعني نتائج أفضل وتوفيراً أكبر.', 2000.00, 899.00, 20, 15, 'approved', 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&auto=format&fit=crop&q=80', 'service', NULL, (SELECT id FROM public.service_categories WHERE name = 'نوادي رياضية'), NULL, 'at_merchant', 'يشمل الاشتراك جميع الفروع. تقييم لياقة مجاني عند الاشتراك.', ARRAY['دخول غير محدود لجميع المرافق', 'مسبح أولمبي', 'ساونا وجاكوزي', 'خطة تدريب مبدئية مع مدرب', 'تقييم لياقة مجاني'], NOW()),
    ('20000000-0000-4000-8000-000000000011', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'حمام مغربي ملكي', 'تجربة حمام مغربي ملكية فاخرة بالصابون البلدي والكيس المغربي الأصلي، تشمل تقشيراً عميقاً وترطيباً بالزيوت الطبيعية لتنعمي ببشرة ناعمة كالحرير.', 500.00, 229.00, 15, 11, 'approved', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80', 'service', NULL, (SELECT id FROM public.service_categories WHERE name = 'حمام مغربي وبخار'), 90, 'at_merchant', 'يُفضل عدم وضع كريمات قبل الجلسة. جميع الأدوات معقمة وللاستخدام الواحد.', ARRAY['حمام مغربي بالصابون البلدي', 'تقشير بالكيس المغربي', 'ترطيب بالزيوت الطبيعية', 'غرفة بخار خاصة', 'مشروب مغربي تقليدي'], NOW()),
    ('20000000-0000-4000-8000-000000000012', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'جلسة بخار وساونا مع تقشير الجسم', 'جلسة استرخاء متكاملة تجمع بين الساونا والبخار لتنقية المسام وإزالة السموم، مع تقشير لكامل الجسم يترك بشرتك متجددة ومشرقة.', 350.00, 159.00, 18, 8, 'approved', 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800&auto=format&fit=crop&q=80', 'service', NULL, (SELECT id FROM public.service_categories WHERE name = 'حمام مغربي وبخار'), 75, 'at_merchant', 'شرب ماء كافٍ قبل الجلسة. غير مناسبة لمرضى الضغط غير المنتظم.', ARRAY['جلسة ساونا وبخار', 'تقشير كامل للجسم', 'كمادات أعشاب منعشة', 'مناشف وأدوات معقمة'], NOW()),
    ('20000000-0000-4000-8000-000000000013', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'فحص دوري شامل (تحاليل + استشارة طبية)', 'باقة فحص دوري شاملة تغطي أكثر من 40 تحليلاً مخبرياً أساسياً مع استشارة طبية لمناقشة النتائج. اطمئن على صحتك وصحة عائلتك بسعر جماعي لا يُفوّت.', 900.00, 399.00, 20, 13, 'approved', 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&auto=format&fit=crop&q=80', 'service', NULL, (SELECT id FROM public.service_categories WHERE name = 'فحوصات طبية'), 60, 'at_merchant', 'الصيام 8-10 ساعات مطلوب قبل سحب العينة. النتائج خلال 48 ساعة عبر التطبيق.', ARRAY['أكثر من 40 تحليلاً شاملاً', 'صورة دم كاملة ووظائف كلى وكبد', 'تحليل سكر ودهنيات', 'استشارة طبية لمناقشة النتائج', 'تقرير إلكتروني مفصل'], NOW()),
    ('20000000-0000-4000-8000-000000000014', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'تحليل فيتامينات ومعادن شامل', 'تحليل متخصص يقيس مستوى أهم الفيتامينات والمعادن في الجسم مثل فيتامين د والحديد والزنك، لاكتشاف أي نقص مبكراً وتحسين طاقتك ومناعتك.', 600.00, 269.00, 25, 16, 'approved', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80', 'service', NULL, (SELECT id FROM public.service_categories WHERE name = 'فحوصات طبية'), 30, 'at_merchant', 'لا يتطلب صياماً. يُفضل تجنب المكملات الغذائية 24 ساعة قبل التحليل.', ARRAY['قياس فيتامين د و B12', 'تحليل الحديد والفيريتين', 'قياس الزنك والمغنيسيوم', 'استشارة قصيرة مع النتائج'], NOW()),
    ('20000000-0000-4000-8000-000000000015', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'جلسة فيشل هيدرا للبشرة', 'جلسة فيشل هيدرا الأشهر عالمياً لتنظيف البشرة بعمق وترطيبها وتغذيتها بالسيرومات الفاخرة. نتيجة فورية: بشرة مشرقة ونضرة من أول جلسة.', 650.00, 289.00, 18, 10, 'approved', 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80', 'service', NULL, (SELECT id FROM public.service_categories WHERE name = 'جلسات تجميلية'), 60, 'at_merchant', 'تجنبي المكياج لمدة 12 ساعة بعد الجلسة. مناسبة لجميع أنواع البشرة.', ARRAY['تنظيف عميق بتقنية هيدرا', 'تقشير لطيف للبشرة', 'سيروم ترطيب وتغذية', 'ماسك مهدئ', 'واقي شمس بعد الجلسة'], NOW()),
    ('20000000-0000-4000-8000-000000000016', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'باقة العناية بالبشرة (تنظيف عميق + ترطيب مكثف)', 'باقة متكاملة للعناية بالبشرة تشمل تنظيفاً عميقاً وإزالة الرؤوس السوداء وترطيباً مكثفاً بالكولاجين، لتستعيد بشرتك حيويتها وإشراقها الطبيعي.', 450.00, 199.00, 20, 9, 'approved', 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&auto=format&fit=crop&q=80', 'service', NULL, (SELECT id FROM public.service_categories WHERE name = 'جلسات تجميلية'), 75, 'at_merchant', 'يُنصح بتكرار الجلسة شهرياً للحصول على أفضل النتائج.', ARRAY['تنظيف عميق للبشرة', 'إزالة الرؤوس السوداء', 'ترطيب مكثف بالكولاجين', 'مساج للوجه محفز للدورة الدموية'], NOW())
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, tasharok_price = EXCLUDED.tasharok_price, original_price = EXCLUDED.original_price, current_reserved_quantity = EXCLUDED.current_reserved_quantity, status = EXCLUDED.status, item_type = EXCLUDED.item_type, category_id = EXCLUDED.category_id, service_category_id = EXCLUDED.service_category_id, service_duration_minutes = EXCLUDED.service_duration_minutes, service_location_type = EXCLUDED.service_location_type, service_booking_notes = EXCLUDED.service_booking_notes, service_includes = EXCLUDED.service_includes;

-- Reservations
INSERT INTO public.reservations (id, customer_id, product_id, quantity, payment_method, status, created_at)
VALUES 
    ('aaaa1111-aaaa-1111-aaaa-111111111111', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', '11111111-1111-1111-1111-111111111111', 2, 'full_payment', 'pending_target', NOW() - INTERVAL '2 days'),
    ('bbbb2222-bbbb-2222-bbbb-222222222222', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', '11111111-1111-1111-1111-111111111111', 3, 'deposit', 'pending_target', NOW() - INTERVAL '1 day'),
    ('cccc3333-cccc-3333-cccc-333333333333', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', '33333333-3333-3333-3333-333333333333', 4, 'cash_on_delivery', 'pending_target', NOW() - INTERVAL '12 hours'),
    ('dddd4444-dddd-4444-dddd-444444444444', '10eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', '22222222-2222-2222-2222-222222222222', 2, 'full_payment', 'pending_target', NOW() - INTERVAL '3 hours')
ON CONFLICT (id) DO NOTHING;

-- Advertisements
INSERT INTO public.advertisements (title, image_url, link_url, position, status) VALUES
('وفر 15% على التطبيق', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=400&fit=crop', '#', 'top_carousel', 'active'),
('شحن مجاني عالمياً', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&h=400&fit=crop', '#deals', 'top_carousel', 'active'),
('اكتشف أحدث الإلكترونيات', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&h=400&fit=crop', '#', 'top_carousel', 'active'),
('أجهزة المطبخ بأسعار الجملة', 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&h=400&fit=crop', '#', 'top_carousel', 'active'),
('تخفيضات العودة للمدارس', 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=1200&h=400&fit=crop', '#', 'top_carousel', 'active'),
('خصم إضافي للطلاب', 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&h=400&fit=crop', '#', 'top_carousel', 'active'),
('تشكيلة الصيف الجديدة', 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1200&h=400&fit=crop', '#', 'middle_banner', 'active');

-- Testimonials
INSERT INTO public.testimonials (name, role, content, rating, avatar_url) VALUES
('أحمد العتيبي', 'عميل', 'وفر لي تشارك أكثر من 50% على جلسة المساج، والتجربة كانت سهلة وآمنة. أنصح الجميع بالتجربة.', 5, 'https://i.pravatar.cc/150?u=ahmad'),
('نورة السالم', 'مقدمة خدمة', 'منصة رائعة ساعدتني في زيادة عدد العملاء بشكل ملحوظ. التحويلات منتظمة والدعم ممتاز.', 5, 'https://i.pravatar.cc/150?u=noura'),
('خالد الشمري', 'تاجر', 'بعت منتجاتي بكميات كبيرة بفضل تشارك. الواجهة سهلة والعملاء يثقون بالمنصة.', 4, 'https://i.pravatar.cc/150?u=khaled'),
('فاطمة الزهراني', 'عميلة', 'أحب فكرة الشراء الجماعي للخدمات. وفرت كثير في عيادة الأسنان والنتيجة كانت ممتازة.', 5, 'https://i.pravatar.cc/150?u=fatima');

-- FAQs
INSERT INTO public.faqs (question, answer, sort_order) VALUES
('كيف تعمل منصة تشارك؟', 'تجمع المنصة بين العملاء المهتمين بنفس الخدمة أو المنتج للحصول على خصم الشراء الجماعي (أسعار الجملة). كلما زاد عدد المشتركين، قل السعر!', 1),
('هل الدفع آمن؟', 'نعم، نستخدم بوابات دفع موثوقة ومحلية، ولا يتم تحويل المبلغ للتاجر إلا بعد تأكيد تقديم الخدمة أو استلام المنتج.', 2),
('ماذا يحدث إذا لم يكتمل العدد المطلوب؟', 'إذا لم يكتمل العدد خلال الوقت المحدد للعرض، يتم استرجاع المبلغ بالكامل إلى محفظتك أو حسابك البنكي تلقائياً.', 3),
('كيف أستطيع تقديم خدماتي كتاجر؟', 'يمكنك التسجيل كتاجر من خلال صفحة "انضم إلينا"، وبعد التحقق من السجل التجاري يمكنك البدء في إضافة عروضك مباشرة.', 4);

