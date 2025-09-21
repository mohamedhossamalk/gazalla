'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { useCart } from '@/context/CartContext';
import { createOrder } from '@/lib/api';

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
          <div className="max-w-2xl mx-auto bg-card-background rounded-lg shadow-md p-8 text-center border border-card-border">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <h1 className="text-3xl font-bold mb-4 text-foreground">Order Placed Successfully!</h1>
            <p className="text-gray-400 mb-6">
              Thank you for your order. A confirmation email has been sent to your email address.
            </p>
            <button
              onClick={() => router.push('/')}
              className="bg-button-background text-white px-6 py-3 rounded hover:bg-button-hover transition-colors duration-200"
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
        <h1 className="text-3xl font-bold mb-8 text-foreground">Checkout</h1>
        
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <form onSubmit={handleSubmit} className="bg-card-background rounded-lg shadow-md p-6 mb-6 border border-card-border">
              <h2 className="text-xl font-bold mb-4 text-foreground">Shipping Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-foreground mb-2">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-input-border rounded focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground"
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
                    className="w-full px-4 py-2 border border-input-border rounded focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground"
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
                  className="w-full px-4 py-2 border border-input-border rounded focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground"
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
                  className="w-full px-4 py-2 border border-input-border rounded focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-foreground mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-input-border rounded focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground"
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
                    className="w-full px-4 py-2 border border-input-border rounded focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground"
                    required
                  />
                </div>
              </div>
              
              <h2 className="text-xl font-bold mb-4 text-foreground">Payment Information</h2>
              <div className="mb-6">
                <label className="block text-foreground mb-2">Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-input-border rounded focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-foreground mb-2">Expiry Date</label>
                  <input
                    type="text"
                    name="expiryDate"
                    placeholder="MM/YY"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-input-border rounded focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground"
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
                    className="w-full px-4 py-2 border border-input-border rounded focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground"
                    required
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-button-background text-white py-3 rounded hover:bg-button-hover transition-colors duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </form>
          </div>
          
          <div className="lg:w-1/3">
            <div className="bg-card-background rounded-lg shadow-md p-6 sticky top-8 border border-card-border">
              <h2 className="text-xl font-bold mb-4 text-foreground">Order Summary</h2>
              <div className="max-h-60 overflow-y-auto mb-4">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between mb-2 text-foreground">
                    <span>{item.name} x {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
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
                  <span>Free</span>
                </div>
                <div className="flex justify-between mb-4 text-foreground">
                  <span>Tax</span>
                  <span>${(getTotalPrice() * 0.1).toFixed(2)}</span>
                </div>
                <div className="border-t border-card-border pt-4 flex justify-between font-bold text-lg text-foreground">
                  <span>Total</span>
                  <span>${(getTotalPrice() * 1.1).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}