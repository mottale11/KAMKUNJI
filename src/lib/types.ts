
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  imageUrl: string;
  imageHint: string;
  rating: number;
  reviewCount: number;
  stock?: number;
  isNewArrival?: boolean;
  isFlashDeal?: boolean;
  created_at?: string;
}

export interface Category {
  id: string;
  name: string;
  imageUrl: string;
  imageHint: string;
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
