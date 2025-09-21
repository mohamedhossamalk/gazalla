'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Transfer guest cart to user cart if needed
        const guestCart = localStorage.getItem('cart_guest');
        if (guestCart) {
          try {
            const parsedGuestCart = JSON.parse(guestCart);
            if (parsedGuestCart.length > 0) {
              // Save guest cart as user cart
              const userCartKey = `cart_${data.user.id || data.user.email}`;
              localStorage.setItem(userCartKey, guestCart);
              // Clear guest cart
              localStorage.removeItem('cart_guest');
            }
          } catch (e) {
            console.error('Failed to transfer guest cart', e);
          }
        }
        
        // Store user data in localStorage (in a real app, you'd use secure cookies or JWT)
        localStorage.setItem('user', JSON.stringify(data.user));
        // Redirect to account page
        router.push('/account');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center text-foreground">Login</h1>
          
          <div className="bg-card-background rounded-lg shadow-md p-6 border border-card-border">
            {error && (
              <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-foreground mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  className="w-full px-4 py-2 border border-input-border rounded focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-foreground mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  className="w-full px-4 py-2 border border-input-border rounded focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-button-background text-white py-3 rounded hover:bg-button-hover transition-colors duration-200 disabled:opacity-50"
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="text-button-background font-semibold hover:underline">
                  Register here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}