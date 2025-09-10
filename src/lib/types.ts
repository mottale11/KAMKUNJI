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
}

export interface Category {
  id: string;
  name: string;
  imageUrl: string;
  imageHint: string;
}

export interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
  };
  date: string;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Canceled';
  total: number;
  items: {
    productId: string;
    quantity: number;
  }[];
  deliveryInfo: {
    address: string;
    city: string;
    state: string;
    zip: string;
  };
}
