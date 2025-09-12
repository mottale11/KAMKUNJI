
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
}

export interface Category {
  id: string;
  name: string;
  imageUrl: string;
  imageHint: string;
}

export interface Order {
  id:string;
  customer: {
    name: string;
    email: string | null;
  };
  date: string;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Canceled';
  total: number;
  items: {
    productId: string;
    quantity: number;
    price: number;
    title: string;
  }[];
  deliveryInfo: {
    name: string,
    phone: string,
    address: string,
    city: string,
    county: string,
  };
}

    
