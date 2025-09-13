-- Drop tables in order to avoid foreign key constraint issues
DROP TABLE IF EXISTS "orders" CASCADE;
DROP TABLE IF EXISTS "products" CASCADE;
DROP TABLE IF EXISTS "customers" CASCADE;
DROP TABLE IF EXISTS "categories" CASCADE;

-- Create the categories table first as products will reference it
CREATE TABLE "categories" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" text NOT NULL UNIQUE,
  "image_url" text,
  "image_hint" text,
  "created_at" timestamptz NOT NULL DEFAULT now()
);

-- Create the products table
CREATE TABLE "products" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" text NOT NULL,
  "description" text,
  "price" numeric(10, 2) NOT NULL CHECK (price >= 0),
  "original_price" numeric(10, 2) CHECK (original_price >= 0),
  "category_id" uuid REFERENCES categories(id) ON DELETE CASCADE,
  "image_url" text,
  "image_hint" text,
  "rating" real NOT NULL DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  "review_count" integer NOT NULL DEFAULT 0 CHECK (review_count >= 0),
  "stock" integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  "is_new_arrival" boolean NOT NULL DEFAULT false,
  "is_flash_deal" boolean NOT NULL DEFAULT false,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  -- Add a constraint to ensure original_price is greater than price if it exists
  CONSTRAINT original_price_greater_than_price CHECK (original_price IS NULL OR original_price > price)
);

-- Create the customers table
CREATE TABLE "customers" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" text NOT NULL,
  "email" text NOT NULL UNIQUE,
  "phone" text,
  "created_at" timestamptz NOT NULL DEFAULT now()
);

-- Create the orders table
CREATE TABLE "orders" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "customer" jsonb NOT NULL,
  "status" text NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Shipped', 'Delivered', 'Canceled')),
  "total" numeric(10, 2) NOT NULL CHECK (total >= 0),
  "items" jsonb NOT NULL,
  "delivery_info" jsonb,
  "created_at" timestamptz NOT NULL DEFAULT now()
);

-- Add indexes for performance on frequently queried columns
CREATE INDEX ON "products" ("category_id");
CREATE INDEX ON "products" ("is_new_arrival");
CREATE INDEX ON "products" ("is_flash_deal");
CREATE INDEX ON "orders" ("status");
CREATE INDEX ON "orders" (("customer"->>'email'));


-- Insert sample categories
INSERT INTO "categories" ("name", "image_url", "image_hint") VALUES
('Electronics', 'https://i.pinimg.com/736x/0f/e9/82/0fe982c8df8fd7458173197f2b041394.jpg', 'electronics gadgets'),
('Fashion', 'https://i.pinimg.com/1200x/c5/40/b3/c540b3aeab9aab441cb8b8a155683060.jpg', 'clothing style'),
('Home & Kitchen', 'https://i.pinimg.com/736x/ff/f0/40/fff040a679789be226bb4d2a89b0beea.jpg', 'living room'),
('Books', 'https://i.pinimg.com/736x/88/3d/8a/883d8acb789ea481af8b8a004884db5c.jpg', 'book library'),
('Beauty & Health', 'https://i.pinimg.com/736x/aa/6b/4d/aa6b4d28be3aeb8e06bc3c5b05c5b442.jpg', 'cosmetics makeup'),
('Sports & Outdoors', 'https://i.pinimg.com/736x/5f/e1/88/5fe188d3a45f3c85cfc5e8dd10c35d4b.jpg', 'sports equipment'),
('Toys & Games', 'https://picsum.photos/seed/cat7/600/600', 'kids toys');

-- Note: You may want to populate the products table with some sample data as well.
-- Example of inserting a product (assuming you have the category UUID):
/*
INSERT INTO "products" ("title", "description", "price", "category_id", "image_url", "image_hint", "stock")
VALUES
('Modern Wireless Headphones', 'Experience crystal clear audio with these noise-cancelling wireless headphones. Up to 30 hours of battery life.', 4999.00, (SELECT id FROM categories WHERE name = 'Electronics'), 'https://i.pinimg.com/736x/07/d3/fe/07d3fee8d75f8f150433426164abccce.jpg', 'headphones', 50);
*/
