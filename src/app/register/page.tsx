'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import PlatformIllustration from '@/components/PlatformIllustration';

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
          <div className="max-w-md mx-auto fade-in">
            <h1 className="text-3xl font-bold mb-8 text-center text-foreground">Registration Successful</h1>
            
            <div className="bg-card-background rounded-lg shadow-md p-8 text-center border border-card-border slide-up">
              <div className="w-20 h-20 bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-4 text-foreground">Welcome to GAZALLA!</h2>
              <p className="text-gray-400 mb-6">
                Your account has been created successfully. You can now log in to your account.
              </p>
              <div className="bg-gray-800 rounded-lg p-4 mb-6">
                <p className="text-gray-300 text-sm">
                  Redirecting to login page in 2 seconds...
                </p>
              </div>
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
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Illustration Section */}
            <div className="lg:w-1/2 flex flex-col items-center justify-center p-8 bg-card-background rounded-xl border border-card-border slide-up">
              <PlatformIllustration size="md" className="mb-6" />
              <h2 className="text-2xl font-bold text-foreground mb-4">Join Our Community</h2>
              <p className="text-gray-400 text-center mb-6">
                Create an account to enjoy exclusive benefits, personalized recommendations, and faster checkout.
              </p>
              <div className="space-y-4 w-full max-w-sm">
                <div className="flex items-center">
                  <div className="bg-accent rounded-full p-2 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-300">Exclusive member discounts</p>
                </div>
                <div className="flex items-center">
                  <div className="bg-accent rounded-full p-2 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-300">Personalized recommendations</p>
                </div>
                <div className="flex items-center">
                  <div className="bg-accent rounded-full p-2 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-300">Faster checkout process</p>
                </div>
              </div>
            </div>
            
            {/* Registration Form Section */}
            <div className="lg:w-1/2">
              <h1 className="text-3xl font-bold mb-8 text-center text-foreground">Create Account</h1>
              
              <div className="bg-card-background rounded-lg shadow-md p-6 border border-card-border slide-up animate-delay-300">
                {error && (
                  <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded mb-4 animate-shake">
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
                        className="w-full px-4 py-3 border border-input-border rounded-lg focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground transition-all duration-300 hover:border-accent"
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
                        className="w-full px-4 py-3 border border-input-border rounded-lg focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground transition-all duration-300 hover:border-accent"
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
                      className="w-full px-4 py-3 border border-input-border rounded-lg focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground transition-all duration-300 hover:border-accent"
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
                      className="w-full px-4 py-3 border border-input-border rounded-lg focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground transition-all duration-300 hover:border-accent"
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
                      className="w-full px-4 py-3 border border-input-border rounded-lg focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground transition-all duration-300 hover:border-accent"
                      required
                    />
                  </div>
                  
                  {/* Admin key field - hidden by default */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-foreground">Admin Key (Optional)</label>
                      <button
                        type="button"
                        onClick={() => setShowAdminKey(!showAdminKey)}
                        className="text-sm text-gray-400 hover:text-gray-200 transition-colors duration-300"
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
                        className="w-full px-4 py-3 border border-input-border rounded-lg focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground transition-all duration-300 hover:border-accent"
                      />
                    )}
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-button-background text-white py-3 rounded-lg hover:bg-button-hover transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 glow-hover font-semibold"
                  >
                    {isLoading ? 'Registering...' : 'Create Account'}
                  </button>
                </form>
                
                <div className="mt-6 text-center">
                  <p className="text-gray-400">
                    Already have an account?{' '}
                    <Link href="/login" className="text-button-background font-semibold hover:underline transition-colors duration-300">
                      Login here
                    </Link>
                  </p>
                </div>
                
                <div className="mt-6 pt-6 border-t border-card-border">
                  <p className="text-gray-400 text-center text-sm">
                    By creating an account, you agree to our{' '}
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