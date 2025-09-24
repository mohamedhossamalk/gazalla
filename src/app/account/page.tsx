'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Link from 'next/link';

// Define the user type
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  role: string;
}

export default function AccountPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  
  // Check if user is logged in on component mount
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
      setIsLoggedIn(true);
    } else {
      // Redirect to login page if not logged in
      router.push('/login');
    }
  }, [router]);
  
  const handleLogout = () => {
    // Remove user data from localStorage
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    // Redirect to login page
    router.push('/login');
  };
  
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto fade-in">
            <h1 className="text-3xl font-bold mb-8 text-foreground">My Account</h1>
            <div className="bg-card-background rounded-lg shadow-md p-8 text-center border border-card-border slide-up">
              <div className="flex justify-center mb-6">
                <div className="bg-gray-800 rounded-full p-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-400 mb-6">Redirecting to login...</p>
              <Link 
                href="/login" 
                className="text-button-background hover:underline transition-colors duration-300"
              >
                Click here if you are not redirected
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto fade-in">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4 lg:mb-0">My Account</h1>
            <button
              onClick={handleLogout}
              className="flex items-center text-red-400 hover:text-red-300 transition-colors duration-300 px-4 py-2 rounded-lg border border-red-900 hover:bg-red-900 hover:bg-opacity-20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
              </svg>
              Logout
            </button>
          </div>
          
          <div className="bg-card-background rounded-xl shadow-md p-6 mb-8 border border-card-border slide-up">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="bg-gray-800 rounded-full p-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-foreground mb-2">Welcome, {user?.name || 'User'}!</h2>
                <p className="text-gray-400 mb-4">Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}</p>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-accent bg-opacity-20 text-accent">
                  <span className="capitalize font-medium">{user?.role || 'customer'}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Link href="/account/orders" className="border border-card-border rounded-xl p-6 text-center hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-1 float-hover">
              <div className="flex justify-center mb-4">
                <div className="bg-gray-800 rounded-full p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
              </div>
              <h3 className="font-bold text-lg mb-2 text-foreground">Order History</h3>
              <p className="text-gray-400 mb-4">View your past orders</p>
              <span className="text-button-background font-semibold hover:underline transition-colors duration-300">
                View Orders →
              </span>
            </Link>
            
            <Link href="/account/wishlist" className="border border-card-border rounded-xl p-6 text-center hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-1 float-hover">
              <div className="flex justify-center mb-4">
                <div className="bg-gray-800 rounded-full p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="font-bold text-lg mb-2 text-foreground">Wishlist</h3>
              <p className="text-gray-400 mb-4">Your saved items</p>
              <span className="text-button-background font-semibold hover:underline transition-colors duration-300">
                View Wishlist →
              </span>
            </Link>
            
            <Link href="/account/settings" className="border border-card-border rounded-xl p-6 text-center hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-1 float-hover">
              <div className="flex justify-center mb-4">
                <div className="bg-gray-800 rounded-full p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="font-bold text-lg mb-2 text-foreground">Account Settings</h3>
              <p className="text-gray-400 mb-4">Update your information</p>
              <span className="text-button-background font-semibold hover:underline transition-colors duration-300">
                Manage Account →
              </span>
            </Link>
          </div>
          
          <div className="bg-card-background rounded-xl shadow-md p-6 border border-card-border slide-up">
            <h2 className="text-xl font-bold mb-4 text-foreground">Account Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Name</p>
                <p className="font-semibold text-foreground">{user?.name || 'Not provided'}</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Email</p>
                <p className="font-semibold text-foreground">{user?.email || 'Not provided'}</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Member Since</p>
                <p className="font-semibold text-foreground">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Not available'}
                </p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Account Type</p>
                <p className="font-semibold text-foreground capitalize">{user?.role || 'customer'}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}