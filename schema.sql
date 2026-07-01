-- Run this in your Supabase SQL Editor to create the required tables

-- 1. Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  parent_id UUID REFERENCES categories(id), -- For subcategories e.g. /boys/shirts
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  compare_at_price NUMERIC,
  category_id UUID REFERENCES categories(id),
  featured BOOLEAN DEFAULT FALSE,
  image_url TEXT, -- Primary image
  images JSONB, -- Array of additional image URLs
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Product Variants (for size, color, and stock)
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  size TEXT NOT NULL,
  color TEXT NOT NULL,
  stock INTEGER DEFAULT 0,
  sku TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

-- Create Policies for Public Read Access
CREATE POLICY "Public profiles are viewable by everyone." ON categories FOR SELECT USING (true);
CREATE POLICY "Public profiles are viewable by everyone." ON products FOR SELECT USING (true);
CREATE POLICY "Public profiles are viewable by everyone." ON product_variants FOR SELECT USING (true);

-- Insert dummy categories
INSERT INTO categories (name, slug) VALUES 
('Boys', 'boys'),
('Girls', 'girls'),
('Newborn', 'newborn'),
('Accessories', 'accessories');

-- 4. Coupons
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL, -- 'percentage' or 'fixed'
  discount_value NUMERIC NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access for coupons" ON coupons FOR SELECT USING (true);

-- Insert dummy coupon
INSERT INTO coupons (code, discount_type, discount_value) VALUES 
('WELCOME10', 'percentage', 10),
('FLAT500', 'fixed', 500);
