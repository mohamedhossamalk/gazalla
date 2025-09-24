'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';

export default function CartPage() {
  const router = useRouter();
  const { cart, removeItem, updateQuantity, getTotalPrice, refreshCart } = useCart();
  
  const handleCheckout = () => {
    router.push('/checkout');
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8 fade-in">
          <h1 className="text-3xl font-bold text-foreground">Your Cart</h1>
          <button 
            onClick={refreshCart}
            className="bg-gray-700 text-foreground px-4 py-2 rounded-lg hover:bg-gray-600 transition-all duration-300 flex items-center transform hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
        
        {cart.length === 0 ? (
          <div className="text-center py-12 fade-in">
            <div className="bg-card-background rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Your cart is empty</h2>
            <p className="text-gray-400 mb-6 text-lg">Looks like you haven&apos;t added anything to your cart yet</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={() => router.push('/products')}
                className="bg-button-background text-white px-6 py-3 rounded-lg hover:bg-button-hover transition-all duration-300 transform hover:scale-105 glow-hover"
              >
                Continue Shopping
              </button>
              <Link 
                href="/products" 
                className="bg-gray-800 text-foreground px-6 py-3 rounded-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 border border-card-border"
              >
                Browse Products
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <div className="bg-card-background rounded-xl shadow-md overflow-hidden border border-card-border fade-in">
                <div className="p-4 bg-gray-800 border-b border-card-border">
                  <h2 className="font-bold text-foreground">Items in your cart ({cart.reduce((total, item) => total + item.quantity, 0)})</h2>
                </div>
                {cart.map((item) => {
                  // Skip items without IDs
                  if (!item.id) {
                    console.warn('Cart item missing ID:', item);
                    return null;
                  }
                  
                  return (
                    <div key={item.id} className="flex items-center p-6 border-b border-card-border last:border-b-0 slide-up">
                      <div className="bg-gray-700 w-24 h-24 flex items-center justify-center mr-6 rounded-lg">
                        <Image 
                          src="/image/WhatsApp_Image_2025-09-17_at_02.47.45_de6dbebb-removebg-preview.png" 
                          alt={item.name} 
                          width={96}
                          height={96}
                          className="object-contain rounded-lg"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-foreground">{item.name}</h3>
                        <p className="text-gray-400">${item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center mr-6">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className={`bg-gray-700 text-foreground px-3 py-1 rounded-l-lg hover:bg-gray-600 transition-colors duration-200 ${item.quantity <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          -
                        </button>
                        <span className="bg-gray-800 px-4 py-1 text-foreground">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="bg-gray-700 text-foreground px-3 py-1 rounded-r-lg hover:bg-gray-600 transition-colors duration-200"
                        >
                          +
                        </button>
                      </div>
                      <div className="font-semibold mr-6 text-foreground">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-400 transition-colors duration-200 transform hover:scale-110"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="lg:w-1/3">
              <div className="bg-card-background rounded-xl shadow-md p-6 sticky top-8 border border-card-border slide-up animate-delay-300">
                <h2 className="text-xl font-bold mb-4 text-foreground">Order Summary</h2>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-foreground">
                    <span>Subtotal</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-foreground">
                    <span>Shipping</span>
                    <span className="text-green-400">Free</span>
                  </div>
                  <div className="flex justify-between text-foreground">
                    <span>Tax</span>
                    <span>${(getTotalPrice() * 0.1).toFixed(2)}</span>
                  </div>
                </div>
                <div className="border-t border-card-border pt-4 flex justify-between font-bold text-lg mb-6 text-foreground">
                  <span>Total</span>
                  <span className="text-xl">${(getTotalPrice() * 1.1).toFixed(2)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-button-background text-white py-3 rounded-lg hover:bg-button-hover transition-all duration-300 transform hover:scale-[1.02] glow-hover font-semibold"
                >
                  Proceed to Checkout
                </button>
                
                <div className="mt-6 pt-6 border-t border-card-border">
                  <div className="flex items-center text-gray-400 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 104 0 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>International shipping</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}