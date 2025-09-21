'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useEffect, useState } from 'react';

// Define the user type
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function Header() {
  const { cart } = useCart();
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    setMounted(true);
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setIsLoggedIn(true);
    }
  }, []);
  
  // Calculate total items in cart
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="bg-header-background shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-10">
          <Link href="/" className="text-2xl font-bold text-foreground">
            GAZALLA
          </Link>
          <nav className="hidden md:flex space-x-8">
            <Link href="/products?category=men" className="text-foreground hover:text-gray-300">
              Men
            </Link>
            <Link href="/products?category=women" className="text-foreground hover:text-gray-300">
              Women
            </Link>
            <Link href="/products" className="text-foreground hover:text-gray-300">
              All Products
            </Link>
            {/* Show Admin link only to admin users */}
            {user && user.role === 'admin' && (
              <Link href="/admin" className="text-foreground hover:text-gray-300">
                Admin
              </Link>
            )}
            {/* Database Status Link - Only show in development */}
            {process.env.NODE_ENV === 'development' && (
              <Link href="/database-status" className="text-foreground hover:text-gray-300">
                DB Status
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center space-x-6">
          <Link href="/cart" className="relative text-foreground hover:text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {mounted && totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          {isLoggedIn ? (
            <Link href="/account" className="text-foreground hover:text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
          ) : (
            <Link href="/login" className="text-foreground hover:text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
          )}

        </div>
      </div>
    </header>
  );
}