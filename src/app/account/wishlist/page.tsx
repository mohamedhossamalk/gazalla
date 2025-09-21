'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types/product';

export default function WishlistPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    
    setIsLoggedIn(true);
    
    // In a real app, you would fetch wishlist from the database
    // For now, we'll use sample data
    const sampleWishlist: Product[] = [
      {
        id: '1',
        name: 'Leather Wallet',
        description: 'Genuine leather wallet with multiple card slots',
        price: 49.99,
        category: 'men',
        imageUrl: '/images/wallet.jpg',
        stock: 25
      },
      {
        id: '2',
        name: 'Sunglasses',
        description: 'Stylish sunglasses with UV protection',
        price: 89.99,
        category: 'women',
        imageUrl: '/images/sunglasses.jpg',
        stock: 15
      },
      {
        id: '3',
        name: 'Leather Belt',
        description: 'Premium leather belt with silver buckle',
        price: 39.99,
        category: 'men',
        imageUrl: '/images/belt.jpg',
        stock: 30
      }
    ];
    
    setWishlist(sampleWishlist);
    setLoading(false);
  }, [router]);

  const removeFromWishlist = (productId: string) => {
    setWishlist(wishlist.filter(item => item.id !== productId));
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Wishlist</h1>
            <p className="text-center">Redirecting to login...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Wishlist</h1>
            <Link href="/account" className="text-black hover:underline">
              &larr; Back to Account
            </Link>
          </div>
          
          {loading ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-600">Loading wishlist...</p>
            </div>
          ) : wishlist.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-600">Your wishlist is empty.</p>
              <Link href="/products" className="text-black font-semibold hover:underline mt-4 inline-block">
                Start Shopping &rarr;
              </Link>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map((product) => (
                  <div key={product.id} className="relative">
                    <ProductCard key={product.id} product={product} />
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                      aria-label="Remove from wishlist"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}