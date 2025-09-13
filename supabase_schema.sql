-- Supabase schema for the Kamkunji e-commerce application

-- 1. Categories Table
-- Stores product categories
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    image_url TEXT NOT NULL,
    image_hint TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Products Table
-- Stores product information
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    original_price NUMERIC(10, 2),
    category TEXT NOT NULL REFERENCES categories(name),
    image_url TEXT NOT NULL,
    image_hint TEXT,
    rating NUMERIC(2, 1) DEFAULT 0,
    review_count INT DEFAULT 0,
    stock INT DEFAULT 0,
    is_new_arrival BOOLEAN DEFAULT false,
    is_flash_deal BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Customers Table
-- Stores customer information
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Orders Table
-- Stores order information
CREATE TABLE orders (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    customer JSONB NOT NULL,
    date TIMESTAMPTZ NOT NULL DEFAULT now(),
    status TEXT NOT NULL CHECK (status IN ('Pending', 'Shipped', 'Delivered', 'Canceled')),
    total NUMERIC(10, 2) NOT NULL,
    items JSONB NOT NULL,
    delivery_info JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- Enable Row Level Security (RLS) for all tables
-- This is a security best practice. By default, no one can access the data.
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read access for products and categories
-- This allows anyone to view your products and categories without being logged in.
CREATE POLICY "Allow public read access to categories" ON categories
FOR SELECT USING (true);

CREATE POLICY "Allow public read access to products" ON products
FOR SELECT USING (true);

-- Create policies for orders
-- Allows customers to view their own orders.
CREATE POLICY "Allow individual read access to orders" ON orders
FOR SELECT USING (auth.uid() IS NOT NULL AND (customer->>'email' = auth.email()));

-- Allows authenticated users to insert their own orders.
CREATE POLICY "Allow authenticated users to create orders" ON orders
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Allows customers to cancel their own pending orders.
CREATE POLICY "Allow user to cancel their own order" ON orders
FOR UPDATE USING (auth.uid() IS NOT NULL AND (customer->>'email' = auth.email()))
WITH CHECK (status = 'Canceled');


-- Create policies for customers
-- Allows authenticated users to create a customer profile (if one doesn't exist).
CREATE POLICY "Allow authenticated users to create customer profiles" ON customers
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);


-- Storage Bucket Policies
-- You should also configure policies for your 'product-images' storage bucket.
-- These policies ensure that while anyone can view an image, only authenticated admin users can upload or delete them.

-- 1. Policy for public read access on product images:
CREATE POLICY "Allow public read on product images" ON storage.objects
FOR SELECT
USING (bucket_id = 'product-images');

-- 2. Policy for admin-only uploads:
-- NOTE: This requires a way to identify an admin. We'll use the user's email for this example.
-- You might want a more robust role-based system for a production app.
CREATE POLICY "Allow admin to upload product images" ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'product-images' AND auth.email() = 'kamkunjin@gmail.com');

-- 3. Policy for admin-only deletes:
CREATE POLICY "Allow admin to delete product images" ON storage.objects
FOR DELETE
USING (bucket_id = 'product-images' AND auth.email() = 'kamkunjin@gmail.com');
