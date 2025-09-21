'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import PlatformIllustration from '@/components/PlatformIllustration';
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
  const [isLoading, setIsLoading] = useState(true);
  
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
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProducts();
  }, []);
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="gradient-bg text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjAuNSIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybikiLz48L3N2Zz4=')] opacity-20 animate-move-bg"></div>
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center justify-between">
              <div className="lg:w-1/2 text-center lg:text-left z-10 mb-10 lg:mb-0">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 slide-up animate-delay-100">GAZALLA Accessories</h1>
                <p className="text-xl mb-8 max-w-lg mx-auto lg:mx-0 slide-up animate-delay-300">
                  Discover our premium collection of accessories for men and women
                </p>
                <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 slide-up animate-delay-500">
                  <Link 
                    href="/products" 
                    className="bg-button-background text-white px-8 py-3 rounded-full font-semibold hover:bg-button-hover transition-all duration-300 transform hover:scale-105 glow-hover"
                  >
                    Shop Now
                  </Link>
                  {user && user.role === 'admin' && (
                    <Link 
                      href="/admin" 
                      className="bg-gray-800 text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 glow-hover"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                </div>
              </div>
              
              {/* Platform Illustration */}
              <div className="lg:w-1/2 flex justify-center z-10 slide-up animate-delay-700">
                <img 
                  src="/image/WhatsApp_Image_2025-09-17_at_02.47.45_de6dbebb-removebg-preview.png" 
                  alt="GAZALLA" 
                  className="w-64 h-64 object-contain"
                />
              </div>
            </div>
          </div>
          
          {/* Floating elements for visual effect */}
          <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-accent bg-opacity-20 blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 rounded-full bg-button-background bg-opacity-20 blur-xl animate-pulse animate-delay-1000"></div>
        </section>

        {/* Featured Products */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground slide-up">Featured Products</h2>
            {productsError && (
              <div className="bg-yellow-900 border-l-4 border-yellow-500 text-yellow-200 p-4 mb-6 slide-up animate-delay-100" role="alert">
                <p>Warning: Could not load products from database. Showing sample products instead.</p>
              </div>
            )}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((index) => (
                  <div key={index} className="border border-card-border rounded-lg overflow-hidden shadow-md bg-card-background animate-pulse">
                    <div className="bg-gray-700 h-64"></div>
                    <div className="p-4">
                      <div className="h-6 bg-gray-700 rounded mb-2"></div>
                      <div className="h-4 bg-gray-700 rounded mb-4"></div>
                      <div className="h-10 bg-gray-700 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {featuredProducts.map((product, index) => (
                  <div key={product.id} className="slide-up animate-delay-{index * 100}">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Categories */}
        <section className="py-20 bg-gradient-to-b from-background to-card-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 slide-up">Shop by Category</h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto slide-up animate-delay-100">
                Discover our curated collections designed for every style and occasion
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Men's Collection Card */}
              <div className="group relative rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-700 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-blue-900 to-indigo-900 opacity-95"></div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-black opacity-80"></div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSIxMCIgZmlsbD0iIzNmODJmNiIgZmlsbC1vcGFjaXR5PSIwLjEiLz48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxMCIgZmlsbD0iIzNiODJmNiIgZmlsbC1vcGFjaXR5PSIwLjA1Ii8+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iMTAiIGZpbGw9IiM4YjVjZjYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjxjaXJjbGUgY3g9IjcwIiBjeT0iNzAiIHI9IjEwIiBmaWxsPSIjM2I4MmY2IiBmaWxsLW9wYWNpdHk9IjAuMDUiLz48Y2lyY2xlIGN4PSI5MCIgY3k9IjkwIiByPSIxMCIgZmlsbD0iIzhiNWNmNiIgZmlsbC1vcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')] opacity-30"></div>
                
                <div className="relative h-[500px] flex flex-col justify-end p-8 md:p-12 z-10">
                  <div className="mb-6 transform transition-all duration-500 group-hover:translate-y-[-10px]">
                    <div className="w-20 h-20 rounded-2xl bg-white bg-opacity-10 backdrop-blur-sm flex items-center justify-center mb-6 border border-white border-opacity-20">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-3">Men&apos;s Collection</h3>
                    <p className="text-gray-200 text-lg max-w-md">
                      Sophisticated accessories crafted for the modern gentleman
                    </p>
                  </div>
                  
                  <div className="flex items-center transform transition-all duration-500 group-hover:translate-y-[-5px]">
                    <Link 
                      href="/products?category=men" 
                      className="inline-flex items-center bg-white text-slate-900 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg z-20 relative"
                    >
                      Explore Collection
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                  
                  <div className="absolute top-8 right-8 z-20">
                    <span className="inline-block bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-full">
                      New Arrivals
                    </span>
                  </div>
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70 z-5"></div>
              </div>
              
              {/* Women's Collection Card */}
              <div className="group relative rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-700 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-purple-900 to-pink-900 opacity-95"></div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-black opacity-80"></div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSIxMCIgZmlsbD0iI2VjNDg5OSIgZmlsbC1vcGFjaXR5PSIwLjEiLz48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxMCIgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjA1Ii8+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iMTAiIGZpbGw9IiNmNTllMGIiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjxjaXJjbGUgY3g9IjcwIiBjeT0iNzAiIHI9IjEwIiBmaWxsPSIjZWM0ODk5IiBmaWxsLW9wYWNpdHk9IjAuMDUiLz48Y2lyY2xlIGN4PSI5MCIgY3k9IjkwIiByPSIxMCIgZmlsbD0iI2Y1OWUwYiIgZmlsbC1vcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')] opacity-30"></div>
                
                <div className="relative h-[500px] flex flex-col justify-end p-8 md:p-12 z-10">
                  <div className="mb-6 transform transition-all duration-500 group-hover:translate-y-[-10px]">
                    <div className="w-20 h-20 rounded-2xl bg-white bg-opacity-10 backdrop-blur-sm flex items-center justify-center mb-6 border border-white border-opacity-20">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                      </svg>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-3">Women&apos;s Collection</h3>
                    <p className="text-gray-200 text-lg max-w-md">
                      Elegant accessories designed for the contemporary woman
                    </p>
                  </div>
                  
                  <div className="flex items-center transform transition-all duration-500 group-hover:translate-y-[-5px]">
                    <Link 
                      href="/products?category=women" 
                      className="inline-flex items-center bg-white text-slate-900 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg z-20 relative"
                    >
                      Explore Collection
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                  
                  <div className="absolute top-8 right-8 z-20">
                    <span className="inline-block bg-pink-500 text-white text-sm font-semibold px-4 py-2 rounded-full">
                      Trending Now
                    </span>
                  </div>
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70 z-5"></div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-header-background text-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="slide-up">
              <h3 className="text-xl font-bold mb-4">GAZALLA</h3>
              <p className="text-gray-400 mb-4">
                Premium accessories for the modern individual.
              </p>
              <Link href="/about" className="text-button-background hover:text-accent transition-colors duration-300">
                Learn more about us
              </Link>
            </div>
            <div className="slide-up animate-delay-100">
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/products?category=men" className="hover:text-white transition-colors duration-300">Men</Link></li>
                <li><Link href="/products?category=women" className="hover:text-white transition-colors duration-300">Women</Link></li>
                <li><Link href="/products" className="hover:text-white transition-colors duration-300">All Products</Link></li>
              </ul>
            </div>
            <div className="slide-up animate-delay-200">
              <h4 className="font-semibold mb-4">Help</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors duration-300">Contact Us</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors duration-300">FAQs</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors duration-300">Shipping</Link></li>
              </ul>
            </div>
            <div className="slide-up animate-delay-300">
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Email: info@gazalla.com</li>
                <li>Phone: +1 (555) 123-4567</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-card-border mt-8 pt-8 text-center text-gray-400 slide-up animate-delay-500">
            <p>&copy; {new Date().getFullYear()} GAZALLA. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}