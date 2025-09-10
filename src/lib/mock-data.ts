import type { Product, Category } from './types';
import { PlaceHolderImages } from './placeholder-images';

const getImage = (id: string) => {
  const img = PlaceHolderImages.find(p => p.id === id);
  if (!img) {
    console.warn(`Image with id '${id}' not found. Using default placeholder.`);
    return { imageUrl: 'https://picsum.photos/seed/default/400/300', imageHint: 'placeholder' };
  }
  return { imageUrl: img.imageUrl, imageHint: img.imageHint };
};

export const mockCategories: Category[] = [
    { id: 'cat1', name: 'Electronics', ...getImage('cat-electronics') },
    { id: 'cat2', name: 'Fashion', ...getImage('cat-fashion') },
    { id: 'cat3', name: 'Home & Living', ...getImage('cat-home') },
    { id: 'cat4', name: 'Books', ...getImage('cat-books') },
    { id: 'cat5', name: 'Beauty', ...getImage('cat-beauty') },
    { id: 'cat6', name: 'Sports', ...getImage('cat-sports') },
];

export const mockProducts: Product[] = [
    {
        id: 'prod1',
        title: 'Smartwatch Series 7',
        description: 'The future of health is on your wrist. Track your workouts, monitor your heart rate, and stay connected.',
        price: 399,
        originalPrice: 429,
        category: 'Electronics',
        ...getImage('prod-smartwatch'),
        rating: 4.8,
        reviewCount: 256,
        stock: 50,
    },
    {
        id: 'prod2',
        title: 'Wireless Noise-Cancelling Headphones',
        description: 'Immerse yourself in music with industry-leading noise cancellation and high-quality audio.',
        price: 279,
        category: 'Electronics',
        ...getImage('prod-headphones'),
        rating: 4.7,
        reviewCount: 512,
        stock: 120,
    },
    {
        id: 'prod3',
        title: 'Ultra-Slim Laptop',
        description: 'Powerful performance in a sleek, lightweight design. Perfect for work and creativity on the go.',
        price: 1299,
        originalPrice: 1499,
        category: 'Electronics',
        ...getImage('prod-laptop'),
        rating: 4.9,
        reviewCount: 128,
        stock: 30,
    },
    {
        id: 'prod4',
        title: 'Classic Cotton T-Shirt',
        description: 'A timeless wardrobe staple made from 100% premium cotton for ultimate comfort.',
        price: 25,
        category: 'Fashion',
        ...getImage('prod-tshirt'),
        rating: 4.5,
        reviewCount: 890,
        stock: 300,
    },
     {
        id: 'prod5',
        title: 'Modern Minimalist Sofa',
        description: 'Elegant and comfortable, this sofa is the perfect centerpiece for any modern living room.',
        price: 899,
        category: 'Home & Living',
        ...getImage('prod-sofa'),
        rating: 4.6,
        reviewCount: 98,
        stock: 15,
    },
    {
        id: 'prod6',
        title: 'The Midnight Library',
        description: 'A captivating novel about choices, regrets, and the infinite possibilities of life.',
        price: 15.99,
        category: 'Books',
        ...getImage('prod-novel'),
        rating: 4.9,
        reviewCount: 1250,
        stock: 200,
    },
    {
        id: 'prod7',
        title: 'LED Desk Lamp with Wireless Charger',
        description: 'Brighten your workspace and charge your phone simultaneously with this versatile desk lamp.',
        price: 45,
        originalPrice: 55,
        category: 'Home & Living',
        ...getImage('prod-lamp'),
        rating: 4.7,
        reviewCount: 340,
        stock: 80,
    },
    {
        id: 'prod8',
        title: 'Slim-Fit Denim Jeans',
        description: 'Crafted for a perfect fit, these jeans offer both style and comfort for everyday wear.',
        price: 69.99,
        category: 'Fashion',
        ...getImage('prod-jeans'),
        rating: 4.4,
        reviewCount: 420,
        stock: 150,
    }
];

export const mockFlashDeals: Product[] = [
    { ...mockProducts[0], price: Math.round(mockProducts[0].price * 0.8) },
    { ...mockProducts[2], price: Math.round(mockProducts[2].price * 0.85) },
    { ...mockProducts[6], price: Math.round(mockProducts[6].price * 0.75) },
    { ...mockProducts[4], price: Math.round(mockProducts[4].price * 0.9) },
];
