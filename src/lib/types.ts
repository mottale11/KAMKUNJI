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
