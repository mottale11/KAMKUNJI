import type { Product, Category, Order } from './types';
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
        price: 39900,
        originalPrice: 42900,
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
        price: 27900,
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
        price: 129900,
        originalPrice: 149900,
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
        price: 2500,
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
        price: 89900,
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
        price: 1599,
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
        price: 4500,
        originalPrice: 5500,
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
        price: 6999,
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

export const mockOrders: Order[] = [
    {
        id: 'ORD001',
        customer: { name: 'Olivia Martin', email: 'olivia.martin@email.com' },
        date: '2023-11-23',
        status: 'Shipped',
        total: 42400.00,
        items: [
            { productId: 'prod1', quantity: 1, price: 39900, title: 'Smartwatch Series 7' },
        ],
        deliveryInfo: {
            name: 'Olivia Martin',
            phone: '123-456-7890',
            address: '123 Main St',
            city: 'San Francisco',
            county: 'CA'
        },
        createdAt: '2023-11-23T10:00:00Z'
    },
    {
        id: 'ORD002',
        customer: { name: 'Jackson Lee', email: 'jackson.lee@email.com' },
        date: '2023-11-22',
        status: 'Delivered',
        total: 27900.00,
        items: [{ productId: 'prod2', quantity: 1, price: 27900, title: 'Wireless Noise-Cancelling Headphones' }],
         deliveryInfo: {
            name: 'Jackson Lee',
            phone: '123-456-7890',
            address: '456 Oak Ave',
            city: 'New York',
            county: 'NY'
        },
        createdAt: '2023-11-22T10:00:00Z'
    },
    {
        id: 'ORD003',
        customer: { name: 'Isabella Nguyen', email: 'isabella.nguyen@email.com' },
        date: '2023-11-21',
        status: 'Pending',
        total: 132400.00,
        items: [{ productId: 'prod3', quantity: 1, price: 129900, title: 'Ultra-Slim Laptop' }],
        deliveryInfo: {
            name: 'Isabella Nguyen',
            phone: '123-456-7890',
            address: '789 Pine Rd',
            city: 'Austin',
            county: 'TX'
        },
        createdAt: '2023-11-21T10:00:00Z'
    },
    {
        id: 'ORD004',
        customer: { name: 'William Kim', email: 'will@email.com' },
        date: '2023-11-20',
        status: 'Delivered',
        total: 5000.00,
        items: [{ productId: 'prod4', quantity: 2, price: 2500, title: 'Classic Cotton T-Shirt' }],
        deliveryInfo: {
            name: 'William Kim',
            phone: '123-456-7890',
            address: '101 Maple Ln',
            city: 'Chicago',
            county: 'IL'
        },
        createdAt: '2023-11-20T10:00:00Z'
    },
    {
        id: 'ORD005',
        customer: { name: 'Sofia Davis', email: 'sofia.davis@email.com' },
        date: '2023-11-19',
        status: 'Canceled',
        total: 89900.00,
        items: [{ productId: 'prod5', quantity: 1, price: 89900, title: 'Modern Minimalist Sofa' }],
        deliveryInfo: {
            name: 'Sofia Davis',
            phone: '123-456-7890',
            address: '212 Birch Blvd',
            city: 'Los Angeles',
            county: 'CA'
        },
        createdAt: '2023-11-19T10:00:00Z'
    }
];
