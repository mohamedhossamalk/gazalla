'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showAdminKey, setShowAdminKey] = useState(false);
  
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminKey: '',
  });
  
  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (registerData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: registerData.firstName,
          lastName: registerData.lastName,
          email: registerData.email,
          password: registerData.password,
          adminKey: registerData.adminKey,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Transfer guest cart to new user cart
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
        
        setSuccess(true);
        // Optionally redirect to login page after a delay
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred during registration');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (success) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-center text-foreground">Registration Successful</h1>
            
            <div className="bg-card-background rounded-lg shadow-md p-6 text-center border border-card-border">
              <div className="text-green-500 text-5xl mb-4">✓</div>
              <h2 className="text-xl font-bold mb-4 text-foreground">Welcome to GAZALLA!</h2>
              <p className="text-gray-400 mb-6">
                Your account has been created successfully. You can now log in to your account.
              </p>
              <p className="text-gray-400">
                Redirecting to login page...
              </p>
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
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center text-foreground">Register</h1>
          
          <div className="bg-card-background rounded-lg shadow-md p-6 border border-card-border">
            {error && (
              <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            
            <form onSubmit={handleRegister}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-foreground mb-2">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={registerData.firstName}
                    onChange={handleRegisterChange}
                    className="w-full px-4 py-2 border border-input-border rounded focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground"
                    required
                  />
                </div>
                <div>
                  <label className="block text-foreground mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={registerData.lastName}
                    onChange={handleRegisterChange}
                    className="w-full px-4 py-2 border border-input-border rounded focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-foreground mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  className="w-full px-4 py-2 border border-input-border rounded focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-foreground mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  className="w-full px-4 py-2 border border-input-border rounded focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-foreground mb-2">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={registerData.confirmPassword}
                  onChange={handleRegisterChange}
                  className="w-full px-4 py-2 border border-input-border rounded focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground"
                  required
                />
              </div>
              
              {/* Admin key field - hidden by default */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-foreground">Admin Key (Optional)</label>
                  <button
                    type="button"
                    onClick={() => setShowAdminKey(!showAdminKey)}
                    className="text-sm text-gray-400 hover:text-gray-200"
                  >
                    {showAdminKey ? 'Hide' : 'Show'}
                  </button>
                </div>
                {showAdminKey && (
                  <input
                    type="password"
                    name="adminKey"
                    value={registerData.adminKey}
                    onChange={handleRegisterChange}
                    placeholder="Enter admin key to create admin account"
                    className="w-full px-4 py-2 border border-input-border rounded focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground"
                  />
                )}
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-button-background text-white py-3 rounded hover:bg-button-hover transition-colors duration-200 disabled:opacity-50"
              >
                {isLoading ? 'Registering...' : 'Register'}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Already have an account?{' '}
                <Link href="/login" className="text-button-background font-semibold hover:underline">
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}