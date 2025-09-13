
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  original_price?: number | null;
  category: string;
  image_url: string;
  rating: number;
  review_count: number;
  stock: number;
  is_new_arrival?: boolean;
  is_flash_deal?: boolean;
  created_at?: string;
  category_id?: string;
  categoryName?: string;
}

export interface Category {
  id: string; // This is a UUID string
  name: string;
  image_url: string;
  created_at?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  created_at?: string;
  totalSpent?: number;
}

export interface Order {
  id: string;
  customer: {
    name: string;
    email: string | null;
  };
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Canceled';
  total: number;
  items: {
    productId: string;
    quantity: number;
    price: number;
    title: string;
  }[];
  delivery_info: {
    name: string;
    phone: string;
    address: string;
    city: string;
    county: string;
  };
  created_at: string;
}
