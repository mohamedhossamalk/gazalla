// This file is no longer needed since we're using the API
// But we'll keep it for now to avoid breaking existing components
import { Product } from '@/types/product';

export const products: Product[] = [
  {
    id: '1',
    name: 'Luxury Watch',
    description: 'Elegant watch for formal occasions',
    price: 299.99,
    category: 'men',
    imageUrl: '/images/watch.jpg',
    stock: 15,
  },
  {
    id: '2',
    name: 'Designer Sunglasses',
    description: 'Stylish sunglasses with UV protection',
    price: 149.99,
    category: 'men',
    imageUrl: '/images/sunglasses.jpg',
    stock: 25,
  },
  {
    id: '3',
    name: 'Leather Wallet',
    description: 'Genuine leather wallet with multiple card slots',
    price: 89.99,
    category: 'men',
    imageUrl: '/images/wallet.jpg',
    stock: 30,
  },
  {
    id: '4',
    name: 'Gold Necklace',
    description: 'Beautiful gold necklace for special occasions',
    price: 199.99,
    category: 'women',
    imageUrl: '/images/necklace.jpg',
    stock: 20,
  },
  {
    id: '5',
    name: 'Diamond Earrings',
    description: 'Sparkling diamond earrings for evening wear',
    price: 399.99,
    category: 'women',
    imageUrl: '/images/earrings.jpg',
    stock: 10,
  },
  {
    id: '6',
    name: 'Designer Handbag',
    description: 'Luxury handbag with premium materials',
    price: 249.99,
    category: 'women',
    imageUrl: '/images/handbag.jpg',
    stock: 12,
  },
];