'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { useCart } from '@/context/CartContext';
import { createOrder } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getTotalPrice, clearCart } = useCart();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  if (cart.length === 0 && !orderPlaced) {
    router.push('/cart');
    return null;
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Create order object
      const orderData = {
        userId: 'guest', // In a real app, this would be the actual user ID
        status: 'pending',
        createdAt: new Date().toISOString(),
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
        },
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
        },
        items: cart.map(item => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        total: getTotalPrice() * 1.1, // Including tax
      };
      
      // Send order to API
      await createOrder(orderData);
      
      // Clear cart and show success message
      setOrderPlaced(true);
      clearCart();
    } catch (err) {
      setError('Failed to place order. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto bg-card-background rounded-xl shadow-md p-8 text-center border border-card-border fade-in">
            <div className="w-20 h-20 bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-4 text-foreground">Order Placed Successfully!</h1>
            <p className="text-gray-400 mb-6 text-lg">
              Thank you for your order. A confirmation email has been sent to your email address.
            </p>
            <div className="bg-gray-800 rounded-lg p-4 mb-6">
              <p className="text-gray-300">
                Order ID: <span className="font-mono text-accent">#{Math.floor(Math.random() * 1000000)}</span>
              </p>
            </div>
            <button
              onClick={() => router.push('/')}
              className="bg-button-background text-white px-6 py-3 rounded-lg hover:bg-button-hover transition-all duration-300 transform hover:scale-105 glow-hover font-semibold"
            >
              Continue Shopping
            </button>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-foreground">Secure Checkout</h1>
        
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6 animate-shake">
            {error}
          </div>
        )}
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <form onSubmit={handleSubmit} className="bg-card-background rounded-xl shadow-md p-6 mb-6 border border-card-border slide-up">
              <h2 className="text-xl font-bold mb-6 text-foreground pb-2 border-b border-card-border">Shipping Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-foreground mb-2">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-input-border rounded-lg focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground transition-all duration-300 hover:border-accent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-foreground mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-input-border rounded-lg focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground transition-all duration-300 hover:border-accent"
                    required
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-foreground mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-input-border rounded-lg focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground transition-all duration-300 hover:border-accent"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-foreground mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-input-border rounded-lg focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground transition-all duration-300 hover:border-accent"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-foreground mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-input-border rounded-lg focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground transition-all duration-300 hover:border-accent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-foreground mb-2">ZIP Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-input-border rounded-lg focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground transition-all duration-300 hover:border-accent"
                    required
                  />
                </div>
              </div>
              
              <h2 className="text-xl font-bold mb-6 text-foreground pb-2 border-b border-card-border mt-8">Payment Information</h2>
              <div className="mb-6">
                <label className="block text-foreground mb-2">Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-3 border border-input-border rounded-lg focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground transition-all duration-300 hover:border-accent"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-foreground mb-2">Expiry Date</label>
                  <input
                    type="text"
                    name="expiryDate"
                    placeholder="MM/YY"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-input-border rounded-lg focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground transition-all duration-300 hover:border-accent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-foreground mb-2">CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    placeholder="123"
                    className="w-full px-4 py-3 border border-input-border rounded-lg focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground transition-all duration-300 hover:border-accent"
                    required
                  />
                </div>
              </div>
              
              <div className="flex items-center mb-6 p-4 bg-gray-800 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-gray-300 text-sm">Your payment information is securely encrypted</span>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-button-background text-white py-3 rounded-lg hover:bg-button-hover transition-all duration-300 transform hover:scale-[1.02] glow-hover font-semibold ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <LoadingSpinner size="sm" className="mr-2" />
                    Processing Order...
                  </div>
                ) : 'Place Order'}
              </button>
            </form>
          </div>
          
          <div className="lg:w-1/3">
            <div className="bg-card-background rounded-xl shadow-md p-6 sticky top-8 border border-card-border slide-up animate-delay-300">
              <h2 className="text-xl font-bold mb-4 text-foreground">Order Summary</h2>
              <div className="max-h-60 overflow-y-auto mb-4 pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between mb-3 pb-3 border-b border-card-border last:border-b-0">
                    <div>
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-foreground">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-card-border pt-4">
                <div className="flex justify-between mb-2 text-foreground">
                  <span>Subtotal</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2 text-foreground">
                  <span>Shipping</span>
                  <span className="text-green-400">Free</span>
                </div>
                <div className="flex justify-between mb-4 text-foreground">
                  <span>Tax</span>
                  <span>${(getTotalPrice() * 0.1).toFixed(2)}</span>
                </div>
                <div className="border-t border-card-border pt-4 flex justify-between font-bold text-lg text-foreground">
                  <span>Total</span>
                  <span className="text-xl">${(getTotalPrice() * 1.1).toFixed(2)}</span>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-card-border">
                <div className="flex items-center text-gray-400 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>30-day return policy</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Estimated delivery: 3-5 business days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}