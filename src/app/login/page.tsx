'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import LoadingSpinner from '@/components/LoadingSpinner';
import PlatformIllustration from '@/components/PlatformIllustration';

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
        <div className="max-w-4xl mx-auto fade-in">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Illustration Section */}
            <div className="lg:w-1/2 flex flex-col items-center justify-center p-8 bg-card-background rounded-xl border border-card-border slide-up">
              <PlatformIllustration size="md" className="mb-6" />
              <h2 className="text-2xl font-bold text-foreground mb-4">Welcome Back</h2>
              <p className="text-gray-400 text-center mb-6">
                Sign in to access your personalized shopping experience and exclusive member benefits.
              </p>
              <div className="grid grid-cols-3 gap-4 w-full max-w-xs">
                <div className="bg-gray-800 p-3 rounded-lg text-center">
                  <div className="text-accent font-bold">10K+</div>
                  <div className="text-gray-400 text-sm">Products</div>
                </div>
                <div className="bg-gray-800 p-3 rounded-lg text-center">
                  <div className="text-accent font-bold">50K+</div>
                  <div className="text-gray-400 text-sm">Members</div>
                </div>
                <div className="bg-gray-800 p-3 rounded-lg text-center">
                  <div className="text-accent font-bold">24/7</div>
                  <div className="text-gray-400 text-sm">Support</div>
                </div>
              </div>
            </div>
            
            {/* Login Form Section */}
            <div className="lg:w-1/2">
              <h1 className="text-3xl font-bold mb-8 text-center text-foreground">Login to Your Account</h1>
              
              <div className="bg-card-background rounded-lg shadow-md p-6 border border-card-border slide-up animate-delay-300">
                {error && (
                  <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded mb-4 animate-shake">
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
                      className="w-full px-4 py-3 border border-input-border rounded-lg focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground transition-all duration-300 hover:border-accent"
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
                      className="w-full px-4 py-3 border border-input-border rounded-lg focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground transition-all duration-300 hover:border-accent"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-button-background text-white py-3 rounded-lg hover:bg-button-hover transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 glow-hover font-semibold"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <LoadingSpinner size="sm" className="mr-2" />
                        Logging in...
                      </div>
                    ) : 'Login'}
                  </button>
                </form>
                
                <div className="mt-6 text-center">
                  <p className="text-gray-400">
                    Don&apos;t have an account?{' '}
                    <Link href="/register" className="text-button-background font-semibold hover:underline transition-colors duration-300">
                      Register here
                    </Link>
                  </p>
                </div>
                
                <div className="mt-6 pt-6 border-t border-card-border">
                  <p className="text-gray-400 text-center text-sm">
                    By logging in, you agree to our{' '}
                    <Link href="#" className="text-button-background hover:underline">Terms of Service</Link>
                    {' '}and{' '}
                    <Link href="#" className="text-button-background hover:underline">Privacy Policy</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}