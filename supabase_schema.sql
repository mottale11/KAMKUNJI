
-- 1. Drop existing tables if they exist to ensure a clean slate.
DROP TABLE IF EXISTS "orders" CASCADE;
DROP TABLE IF EXISTS "products" CASCADE;
DROP TABLE IF EXISTS "customers" CASCADE;
DROP TABLE IF EXISTS "categories" CASCADE;

-- 2. Create Categories Table
-- This table will store product categories. 'id' is the primary key.
CREATE TABLE "categories" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" text NOT NULL,
    "image_url" text NOT NULL,
    "created_at" timestamptz DEFAULT now() NOT NULL
);

-- 3. Create Products Table
-- This table stores all product information. It links to the categories table.
CREATE TABLE "products" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "title" text NOT NULL,
    "description" text,
    "price" numeric(10, 2) NOT NULL,
    "original_price" numeric(10, 2),
    "category_id" uuid REFERENCES "categories"("id") ON DELETE SET NULL,
    "image_url" text,
    "rating" numeric(3, 2) DEFAULT 0,
    "review_count" integer DEFAULT 0,
    "stock" integer DEFAULT 0,
    "is_new_arrival" boolean DEFAULT false,
    "is_flash_deal" boolean DEFAULT false,
    "created_at" timestamptz DEFAULT now() NOT NULL
);

-- 4. Create Customers Table
-- Stores customer information. This is separate from Supabase's auth.users table.
CREATE TABLE "customers" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" text NOT NULL,
    "email" text UNIQUE NOT NULL,
    "phone" text,
    "created_at" timestamptz DEFAULT now() NOT NULL
);

-- 5. Create Orders Table
-- Stores order information, linking customer details and items purchased in a JSONB field.
CREATE TABLE "orders" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "customer" jsonb,
    "status" text CHECK (status IN ('Pending', 'Shipped', 'Delivered', 'Canceled')),
    "total" numeric(10, 2) NOT NULL,
    "items" jsonb,
    "delivery_info" jsonb,
    "created_at" timestamptz DEFAULT now() NOT NULL
);

-- 6. Insert Sample Data into Categories
-- Populating the categories table with a variety of common e-commerce categories.
INSERT INTO "categories" ("name", "image_url") VALUES
('Electronics', 'https://picsum.photos/seed/electronics/300/300'),
('Fashion', 'https://picsum.photos/seed/fashion/300/300'),
('Home & Kitchen', 'https://picsum.photos/seed/kitchen/300/300'),
('Sports & Outdoors', 'https://picsum.photos/seed/sports/300/300'),
('Books', 'https://picsum.photos/seed/books/300/300'),
('Health & Beauty', 'https://picsum.photos/seed/beauty/300/300'),
('Toys & Games', 'https://picsum.photos/seed/toys/300/300'),
('Automotive', 'https://picsum.photos/seed/automotive/300/300'),
('Groceries', 'https://picsum.photos/seed/groceries/300/300'),
('Pet Supplies', 'https://picsum.photos/seed/pets/300/300'),
('Computers', 'https://picsum.photos/seed/computers/300/300'),
('Garden & Tools', 'https://picsum.photos/seed/garden/300/300');

-- 7. Add Indexes for Performance
-- Creating indexes on frequently queried columns to improve database performance.
CREATE INDEX idx_products_category_id ON "products" ("category_id");
CREATE INDEX idx_orders_customer_email ON "orders" ((customer->>'email'));
CREATE INDEX idx_orders_status ON "orders" ("status");

