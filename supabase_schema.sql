
-- Drop existing tables to start fresh
DROP TABLE IF EXISTS "orders" CASCADE;
DROP TABLE IF EXISTS "customers" CASCADE;
DROP TABLE IF EXISTS "products" CASCADE;
DROP TABLE IF EXISTS "categories" CASCADE;

-- Create Categories Table
CREATE TABLE "categories" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" character varying NOT NULL,
    "image_url" character varying NOT NULL,
    "created_at" timestamp with time zone DEFAULT now()
);

-- Create Products Table
CREATE TABLE "products" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "title" character varying NOT NULL,
    "description" text,
    "price" numeric(10,2) NOT NULL,
    "original_price" numeric(10,2),
    "category_id" uuid REFERENCES categories(id) ON DELETE SET NULL,
    "image_url" character varying NOT NULL,
    "stock" integer DEFAULT 0,
    "rating" numeric(2,1) DEFAULT 0.0,
    "review_count" integer DEFAULT 0,
    "is_new_arrival" boolean DEFAULT false,
    "is_flash_deal" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT now()
);

-- Create Customers Table
CREATE TABLE "customers" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" text,
    "email" text UNIQUE,
    "phone" text,
    "created_at" timestamp with time zone DEFAULT now()
);

-- Create Orders Table
CREATE TABLE "orders" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "customer" jsonb,
    "status" text,
    "total" numeric(10,2),
    "items" jsonb,
    "delivery_info" jsonb,
    "created_at" timestamp with time zone DEFAULT now()
);

-- Insert sample data into Categories
INSERT INTO "categories" (id, name, image_url) VALUES
('a8d7b3e0-6a1e-4b6f-8a0a-1e9b2c3d4e5f', 'Electronics', 'https://picsum.photos/seed/1/400/400'),
('b5c6a2d9-8f7e-4a3b-9c8d-2e4f5a6b7c8d', 'Fashion', 'https://picsum.photos/seed/2/400/400'),
('c4b5d1e8-7g6d-3b2a-8d7c-3f5e6a7b8c9d', 'Home & Kitchen', 'https://picsum.photos/seed/3/400/400'),
('d3a4c0f7-6h5c-2a1b-7c6b-4g6d7e8f9a0b', 'Sports & Outdoors', 'https://picsum.photos/seed/4/400/400'),
('e2b3d9e6-5i4b-1b9a-6b5a-5h7c8d9e0f1a', 'Books', 'https://picsum.photos/seed/5/400/400'),
('f1a2c8d5-4j3a-0c8b-5a4b-6i8d9e0f1a2b', 'Toys & Games', 'https://picsum.photos/seed/6/400/400'),
('91a2c8d5-4j3a-0c8b-5a4b-6i8d9e0f1a2b', 'Health & Beauty', 'https://picsum.photos/seed/7/400/400'),
('81a2c8d5-4j3a-0c8b-5a4b-6i8d9e0f1a2b', 'Automotive', 'https://picsum.photos/seed/8/400/400');


-- Insert sample data into Products
INSERT INTO "products" (title, description, price, original_price, category_id, image_url, stock, rating, review_count, is_new_arrival, is_flash_deal) VALUES
('Wireless Noise-Cancelling Headphones', 'Experience immersive sound with these comfortable, long-lasting headphones.', 249.99, 299.99, 'a8d7b3e0-6a1e-4b6f-8a0a-1e9b2c3d4e5f', 'https://picsum.photos/seed/101/600/400', 50, 4.8, 120, true, true),
('Men''s Classic Denim Jacket', 'A timeless denim jacket for any casual occasion.', 89.99, null, 'b5c6a2d9-8f7e-4a3b-9c8d-2e4f5a6b7c8d', 'https://picsum.photos/seed/102/600/400', 100, 4.5, 85, true, false),
('Robot Vacuum Cleaner', 'Smart navigation and powerful suction to keep your floors spotless.', 399.99, 450.00, 'c4b5d1e8-7g6d-3b2a-8d7c-3f5e6a7b8c9d', 'https://picsum.photos/seed/103/600/400', 30, 4.7, 95, false, true),
('Professional Yoga Mat', 'Extra-thick, non-slip mat for a comfortable and stable practice.', 39.99, 49.99, 'd3a4c0f7-6h5c-2a1b-7c6b-4g6d7e8f9a0b', 'https://picsum.photos/seed/104/600/400', 200, 4.9, 250, true, false),
('The Midnight Library', 'A novel by Matt Haig, exploring the choices that go into a life well lived.', 15.99, 26.00, 'e2b3d9e6-5i4b-1b9a-6b5a-5h7c8d9e0f1a', 'https://picsum.photos/seed/105/600/400', 150, 4.6, 500, false, false),
('Wooden Building Blocks Set', 'A 100-piece classic wooden block set for endless creative fun.', 29.99, null, 'f1a2c8d5-4j3a-0c8b-5a4b-6i8d9e0f1a2b', 'https://picsum.photos/seed/106/600/400', 80, 4.8, 110, true, true),
('Organic Vitamin C Serum', 'Brighten and rejuvenate your skin with this potent antioxidant serum.', 22.50, 28.00, '91a2c8d5-4j3a-0c8b-5a4b-6i8d9e0f1a2b', 'https://picsum.photos/seed/107/600/400', 120, 4.7, 180, false, false),
('Digital Tire Pressure Gauge', 'Ensure your safety on the road with this easy-to-use digital tire gauge.', 12.99, null, '81a2c8d5-4j3a-0c8b-5a4b-6i8d9e0f1a2b', 'https://picsum.photos/seed/108/600/400', 300, 4.5, 300, false, false),
('4K Smart TV 55-inch', 'Ultra HD smart TV with vibrant colors and seamless streaming.', 599.99, 799.99, 'a8d7b3e0-6a1e-4b6f-8a0a-1e9b2c3d4e5f', 'https://picsum.photos/seed/109/600/400', 25, 4.7, 150, true, false),
('Women''s Summer Maxi Dress', 'Light and airy maxi dress, perfect for warm weather.', 59.99, 75.00, 'b5c6a2d9-8f7e-4a3b-9c8d-2e4f5a6b7c8d', 'https://picsum.photos/seed/110/600/400', 70, 4.6, 90, true, true),
('Air Fryer, 5.8 Quart', 'Cook your favorite meals with less oil. Large capacity for families.', 99.99, 119.99, 'c4b5d1e8-7g6d-3b2a-8d7c-3f5e6a7b8c9d', 'https://picsum.photos/seed/111/600/400', 60, 4.8, 400, false, true),
('Adjustable Dumbbell Set', 'Space-saving dumbbell set, adjustable from 5 to 52.5 lbs.', 349.99, null, 'd3a4c0f7-6h5c-2a1b-7c6b-4g6d7e8f9a0b', 'https://picsum.photos/seed/112/600/400', 15, 4.9, 180, false, false);
