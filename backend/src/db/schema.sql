-- PostgreSQL Schema for Store App

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  title VARCHAR(180) NOT NULL,
  subtitle VARCHAR(255),
  price INTEGER NOT NULL,
  discount_price INTEGER,
  is_clothing BOOLEAN DEFAULT true,
  category VARCHAR(80) NOT NULL DEFAULT 'Clothing',
  sizes TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  stock INTEGER DEFAULT 20,
  image_url TEXT NOT NULL,
  crop_meta JSONB DEFAULT '{"zoom": 1, "panX": 0, "panY": 0}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS coupons (
  id SERIAL PRIMARY KEY,
  code VARCHAR(40) UNIQUE NOT NULL,
  discount_percent INTEGER NOT NULL CHECK (discount_percent BETWEEN 1 AND 90),
  active BOOLEAN DEFAULT true,
  description VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS campaigns (
  id SERIAL PRIMARY KEY,
  active BOOLEAN DEFAULT true,
  badge VARCHAR(60) DEFAULT 'SEASONAL DROP',
  headline VARCHAR(255) NOT NULL,
  subtext TEXT,
  promo_code VARCHAR(40),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(40) PRIMARY KEY,
  customer_name VARCHAR(140) NOT NULL,
  phone VARCHAR(40) NOT NULL,
  address TEXT NOT NULL,
  area VARCHAR(60) NOT NULL,
  items JSONB NOT NULL,
  coupon_code VARCHAR(40),
  discount_amount INTEGER DEFAULT 0,
  delivery_fee INTEGER DEFAULT 60,
  total INTEGER NOT NULL,
  payment_method VARCHAR(20) DEFAULT 'COD',
  bkash_payment_id VARCHAR(120),
  bkash_trx_id VARCHAR(120),
  payment_status VARCHAR(30) DEFAULT 'UNPAID_COD',
  status VARCHAR(30) DEFAULT 'Pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

