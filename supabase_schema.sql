
-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    original_price NUMERIC(10, 2),
    category_id UUID REFERENCES categories(id),
    image_url TEXT,
    rating NUMERIC(3, 2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    stock INTEGER DEFAULT 0,
    is_new_arrival BOOLEAN DEFAULT false,
    is_flash_deal BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer JSONB,
    status VARCHAR(50) DEFAULT 'Pending',
    total NUMERIC(10, 2) NOT NULL,
    items JSONB,
    delivery_info JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed data for categories
INSERT INTO categories (name, image_url) VALUES
('Electronics', 'https://picsum.photos/seed/1/400/400'),
('Fashion', 'https://picsum.photos/seed/2/400/400'),
('Home & Kitchen', 'https://picsum.photos/seed/3/400/400'),
('Health & Beauty', 'https://picsum.photos/seed/4/400/400'),
('Sports & Outdoors', 'https://picsum.photos/seed/5/400/400'),
('Books & Media', 'https://picsum.photos/seed/6/400/400'),
('Groceries', 'https://picsum.photos/seed/7/400/400'),
('Toys & Games', 'https://picsum.photos/seed/8/400/400'),
('Automotive', 'https://picsum.photos/seed/9/400/400'),
('Baby Products', 'https://picsum.photos/seed/10/400/400'),
('Pet Supplies', 'https://picsum.photos/seed/11/400/400'),
('Office Products', 'https://picsum.photos/seed/12/400/400');

-- Function to get a random category_id
CREATE OR REPLACE FUNCTION get_random_category_id()
RETURNS UUID AS $$
DECLARE
    random_id UUID;
BEGIN
    SELECT id INTO random_id FROM categories ORDER BY random() LIMIT 1;
    RETURN random_id;
END;
$$ LANGUAGE plpgsql;

-- Seed data for products
DO $$
DECLARE
    i INT;
    v_category_id UUID;
BEGIN
    FOR i IN 1..50 LOOP
        v_category_id := get_random_category_id();
        INSERT INTO products (title, description, price, original_price, category_id, image_url, rating, review_count, stock, is_new_arrival, is_flash_deal)
        VALUES (
            'Product ' || i,
            'This is the description for product ' || i || '. It is a high-quality item perfect for your needs.',
            trunc(random() * (200-5+1) + 5) * 100, -- Price between 500 and 20000
            CASE WHEN random() > 0.5 THEN trunc(random() * (250-8+1) + 8) * 100 ELSE NULL END, -- Optional original price
            v_category_id,
            'https://picsum.photos/seed/' || (i + 12) || '/600/400',
            trunc((random() * (5-3) + 3)::numeric, 2), -- Rating between 3.00 and 5.00
            floor(random() * 200 + 1)::int, -- Review count between 1 and 200
            floor(random() * 100)::int, -- Stock between 0 and 99
            CASE WHEN random() > 0.7 THEN true ELSE false END, -- 30% chance of being new arrival
            CASE WHEN random() > 0.7 THEN true ELSE false END -- 30% chance of being flash deal
        );
    END LOOP;
END $$;
