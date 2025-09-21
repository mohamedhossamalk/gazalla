'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import { fetchProducts } from '@/lib/api';
import { Product } from '@/types/product';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    // Fetch products
    const loadProducts = async () => {
      try {
        const products = await fetchProducts();
        setFeaturedProducts(products.slice(0, 3));
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setProductsError(err instanceof Error ? err.message : 'Unknown error');
        // Use fallback products
        setFeaturedProducts([
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
        ] as Product[]);
      }
    };
    
    loadProducts();
  }, []);
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-gray-900 to-black text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Luxury Accessories</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Discover our premium collection of accessories for men and women
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/products" 
                className="bg-button-background text-white px-8 py-3 rounded-full font-semibold hover:bg-button-hover transition-colors duration-300"
              >
                Shop Now
              </Link>
              {user && user.role === 'admin' && (
                <Link 
                  href="/admin" 
                  className="bg-gray-800 text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-700 transition-colors duration-300"
                >
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Featured Products</h2>
            {productsError && (
              <div className="bg-yellow-900 border-l-4 border-yellow-500 text-yellow-200 p-4 mb-6" role="alert">
                <p>Warning: Could not load products from database. Showing sample products instead.</p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 bg-card-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Shop by Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative h-96 rounded-lg overflow-hidden">
                <div className="bg-gray-700 h-full flex items-center justify-center">
                  <span className="text-gray-300">Men&apos;s Collection</span>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <Link 
                    href="/products?category=men" 
                    className="bg-button-background text-white px-6 py-3 rounded-full font-semibold hover:bg-button-hover transition-colors duration-300"
                  >
                    Shop Men
                  </Link>
                </div>
              </div>
              <div className="relative h-96 rounded-lg overflow-hidden">
                <div className="bg-gray-700 h-full flex items-center justify-center">
                  <span className="text-gray-300">Women&apos;s Collection</span>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <Link 
                    href="/products?category=women" 
                    className="bg-button-background text-white px-6 py-3 rounded-full font-semibold hover:bg-button-hover transition-colors duration-300"
                  >
                    Shop Women
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-header-background text-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">GAZALLA</h3>
              <p className="text-gray-400">
                Premium accessories for the modern individual.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/products?category=men" className="hover:text-white">Men</Link></li>
                <li><Link href="/products?category=women" className="hover:text-white">Women</Link></li>
                <li><Link href="/products" className="hover:text-white">All Products</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Help</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white">Contact Us</Link></li>
                <li><Link href="#" className="hover:text-white">FAQs</Link></li>
                <li><Link href="#" className="hover:text-white">Shipping</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Email: info@gazalla.com</li>
                <li>Phone: +1 (555) 123-4567</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-card-border mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} GAZALLA. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
