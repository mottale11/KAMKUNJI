-- Drop tables if they exist to start fresh
DROP TABLE IF EXISTS "orders" CASCADE;
DROP TABLE IF EXISTS "customers" CASCADE;
DROP TABLE IF EXISTS "products" CASCADE;
DROP TABLE IF EXISTS "categories" CASCADE;

-- Create Categories Table
CREATE TABLE "categories" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" varchar NOT NULL,
  "image_url" varchar,
  "created_at" timestamp DEFAULT now()
);

-- Create Products Table
CREATE TABLE "products" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "title" varchar NOT NULL,
  "description" text,
  "price" numeric NOT NULL,
  "original_price" numeric,
  "category_id" uuid,
  "image_url" varchar,
  "stock" int DEFAULT 0,
  "rating" numeric DEFAULT 0,
  "review_count" int DEFAULT 0,
  "is_new_arrival" boolean DEFAULT false,
  "is_flash_deal" boolean DEFAULT false,
  "created_at" timestamp DEFAULT now(),
  CONSTRAINT "fk_category"
    FOREIGN KEY("category_id") 
    REFERENCES "categories"("id")
    ON DELETE SET NULL
);

-- Create Customers Table
CREATE TABLE "customers" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" varchar,
  "email" varchar UNIQUE,
  "phone" varchar,
  "created_at" timestamp DEFAULT now()
);

-- Create Orders Table
CREATE TABLE "orders" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "customer" jsonb,
  "status" varchar,
  "total" numeric,
  "items" jsonb,
  "delivery_info" jsonb,

  "created_at" timestamp DEFAULT now()
);

-- Indexes for performance
CREATE INDEX "idx_products_category_id" ON "products" ("category_id");
CREATE INDEX "idx_products_is_new_arrival" ON "products" ("is_new_arrival");
CREATE INDEX "idx_products_is_flash_deal" ON "products" ("is_flash_deal");
CREATE INDEX "idx_orders_created_at" ON "orders" ("created_at");


-- Seed Categories
INSERT INTO "categories" ("name", "image_url") VALUES
('Electronics', 'https://picsum.photos/seed/101/400/400'),
('Fashion', 'https://picsum.photos/seed/102/400/400'),
('Home & Kitchen', 'https://picsum.photos/seed/103/400/400'),
('Sports & Outdoors', 'https://picsum.photos
/seed/104/400/400'),
('Books', 'https://picsum.photos/seed/105/400/400'),
('Health & Beauty', 'https://picsum.photos/seed/106/400/400'),
('Toys & Games', 'https://picsum.photos/seed/107/400/400'),
('Automotive', 'https://picsum.photos/seed/108/400/400');

-- Seed Products
DO $$
DECLARE
    electronics_id uuid;
    fashion_id uuid;
    home_id uuid;
    sports_id uuid;
    books_id uuid;
    beauty_id uuid;
BEGIN
    SELECT id INTO electronics_id FROM categories WHERE name = 'Electronics';
    SELECT id INTO fashion_id FROM categories WHERE name = 'Fashion';
    SELECT id INTO home_id FROM categories WHERE name = 'Home & Kitchen';
    SELECT id INTO sports_id FROM categories WHERE name = 'Sports & Outdoors';
    SELECT id INTO books_id FROM categories WHERE name = 'Books';
    SELECT id INTO beauty_id FROM categories WHERE name = 'Health & Beauty';

    INSERT INTO "products" ("title", "description", "price", "original_price", "category_id", "image_url", "stock", "rating", "review_count", "is_new_arrival", "is_flash_deal") VALUES
    ('4K Smart TV', 'A 55-inch 4K UHD Smart TV with HDR and streaming apps.', 65000, 75000, electronics_id, 'https://picsum.photos/seed/201/600/400', 15, 4.7, 120, true, true),
    ('Noise-Cancelling Headphones', 'Wireless over-ear headphones with adaptive noise cancellation.', 35000, 40000, electronics_id, 'https://picsum.photos/seed/202/600/400', 25, 4.8, 250, true, false),
    ('Men''s Leather Jacket', 'Classic biker jacket made from genuine leather.', 12000, 15000, fashion_id, 'https://picsum.photos/seed/203/600/400', 30, 4.5, 80, false, true),
    ('Women''s Summer Dress', 'A light and airy floral print summer dress.', 4500, null, fashion_id, 'https://picsum.photos/seed/204/600/400', 50, 4.6, 95, true, false),
    ('Espresso Machine', 'A semi-automatic espresso machine for barista-quality coffee at home.', 28000, 32000, home_id, 'https://picsum.photos/seed/205/600/400', 20, 4.9, 180, false, true),
    ('Air Fryer', 'A 5.8-quart air fryer for healthier, crispy cooking.', 9500, 11000, home_id, 'https://picsum.photos/seed/206/600/400', 40, 4.7, 300, true, false),
    ('Yoga Mat', 'A non-slip, eco-friendly yoga mat for all types of practice.', 3500, null, sports_id, 'https://picsum.photos/seed/207/600/400', 100, 4.8, 150, false, false),
    ('The Silent Patient', 'A gripping psychological thriller by Alex Michaelides.', 1800, 2200, books_id, 'https://picsum.photos/seed/208/600/400', 80, 4.6, 5000, false, false),
    ('Vitamin C Serum', 'A potent antioxidant serum for brighter, smoother skin.', 2500, 3000, beauty_id, 'https://picsum.photos/seed/209/600/400', 60, 4.7, 450, true, true),
    ('Gaming Mouse', 'An ergonomic RGB gaming mouse with programmable buttons.', 6000, 7500, electronics_id, 'https://picsum.photos/seed/210/600/400', 45, 4.8, 320, true, false),
    ('Running Shoes', 'Lightweight and cushioned running shoes for men and women.', 8500, null, fashion_id, 'https://picsum.photos/seed/211/600/400', 70, 4.6, 210, true, false),
    ('Blender', 'A high-speed blender for smoothies, soups, and more.', 12500, 15000, home_id, 'https://picsum.photos/seed/212/600/400', 35, 4.7, 180, false, true);
END $$;
