
-- Drop existing tables to start fresh
DROP TABLE IF EXISTS "orders";
DROP TABLE IF EXISTS "products";
DROP TABLE IF EXISTS "customers";
DROP TABLE IF EXISTS "categories";

-- Create Categories Table
CREATE TABLE categories (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    image_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create Products Table
CREATE TABLE products (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    original_price REAL,
    category_id uuid REFERENCES categories(id),
    category TEXT, -- Denormalized for convenience
    stock INTEGER DEFAULT 0,
    rating REAL DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    image_url TEXT NOT NULL,
    is_new_arrival BOOLEAN DEFAULT false,
    is_flash_deal BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create Customers Table
-- Note: This table is for storing customer-specific data not in auth.users
CREATE TABLE customers (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create Orders Table
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    customer JSONB,
    status TEXT NOT NULL CHECK (status IN ('Pending', 'Shipped', 'Delivered', 'Canceled')),
    total REAL NOT NULL,
    items JSONB,
    delivery_info JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);


-- Insert Sample Categories
INSERT INTO categories (name, image_url) VALUES
('Electronics', 'https://picsum.photos/seed/electronics/600/600'),
('Fashion', 'https://picsum.photos/seed/fashion/600/600'),
('Home & Kitchen', 'https://picsum.photos/seed/home/600/600'),
('Books', 'https://picsum.photos/seed/books/600/600'),
('Sports & Outdoors', 'https://picsum.photos/seed/sports/600/600'),
('Toys & Games', 'https://picsum.photos/seed/toys/600/600'),
('Health & Beauty', 'https://picsum.photos/seed/beauty/600/600'),
('Automotive', 'https://picsum.photos/seed/automotive/600/600'),
('Garden & Tools', 'https://picsum.photos/seed/garden/600/600'),
('Groceries', 'https://picsum.photos/seed/groceries/600/600'),
('Pet Supplies', 'https://picsum.photos/seed/pets/600/600'),
('Handmade', 'https://picsum.photos/seed/handmade/600/600');

-- Example of how to add a sample product (optional, can be done via app)
-- INSERT INTO products (title, description, price, category_id, image_url, stock, category)
-- SELECT
--     'Sample Laptop',
--     'A great laptop for all your needs.',
--     1200.00,
--     c.id,
--     'https://picsum.photos/seed/laptop/600/400',
--     50,
--     'Electronics'
-- FROM categories c WHERE c.name = 'Electronics';

