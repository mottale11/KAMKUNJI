-- Create categories table
CREATE TABLE categories (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    image_url TEXT,
    image_hint TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create products table
CREATE TABLE products (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    original_price NUMERIC(10, 2),
    category TEXT REFERENCES categories(name),
    image_url TEXT,
    image_hint TEXT,
    rating NUMERIC(2, 1),
    review_count INTEGER,
    stock INTEGER,
    is_new_arrival BOOLEAN NOT NULL DEFAULT FALSE,
    is_flash_deal BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create customers table
CREATE TABLE customers (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    customer JSONB,
    status TEXT,
    total NUMERIC(10, 2),
    items JSONB,
    delivery_info JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pre-populate categories
INSERT INTO categories (name, image_url, image_hint) VALUES
('Electronics', 'https://i.pinimg.com/736x/0f/e9/82/0fe982c8df8fd7458173197f2b041394.jpg', 'electronics gadgets'),
('Fashion', 'https://i.pinimg.com/1200x/c5/40/b3/c540b3aeab9aab441cb8b8a155683060.jpg', 'clothing style'),
('Home & Living', 'https://i.pinimg.com/736x/ff/f0/40/fff040a679789be226bb4d2a89b0beea.jpg', 'living room'),
('Books', 'https://i.pinimg.com/736x/88/3d/8a/883d8acb789ea481af8b8f004884db5c.jpg', 'book library'),
('Beauty', 'https://i.pinimg.com/736x/aa/6b/4d/aa6b4d28be3aeb8e06bc3c5b05c5b442.jpg', 'cosmetics makeup'),
('Sports', 'https://i.pinimg.com/736x/5f/e1/88/5fe188d3a45f3c85cfc5e8dd10c35d4b.jpg', 'sports equipment');
