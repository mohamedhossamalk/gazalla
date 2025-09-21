'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { useCart } from '@/context/CartContext';

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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Your Cart</h1>
          <button 
            onClick={refreshCart}
            className="bg-gray-700 text-foreground px-4 py-2 rounded hover:bg-gray-600 transition-colors duration-200 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
        
        {cart.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-6">Your cart is empty</p>
            <button 
              onClick={() => router.push('/products')}
              className="bg-button-background text-white px-6 py-3 rounded hover:bg-button-hover transition-colors duration-200"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <div className="bg-card-background rounded-lg shadow-md overflow-hidden border border-card-border">
                {cart.map(item => {
                  // Skip items without IDs
                  if (!item.id) {
                    console.warn('Cart item missing ID:', item);
                    return null;
                  }
                  
                  return (
                    <div key={item.id} className="flex items-center p-6 border-b border-card-border last:border-b-0">
                      <div className="bg-gray-700 w-24 h-24 flex items-center justify-center mr-6">
                        <span className="text-gray-300">Image</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-foreground">{item.name}</h3>
                        <p className="text-gray-400">${item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center mr-6">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="bg-gray-700 text-foreground px-3 py-1 rounded-l hover:bg-gray-600"
                        >
                          -
                        </button>
                        <span className="bg-gray-800 px-4 py-1 text-foreground">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="bg-gray-700 text-foreground px-3 py-1 rounded-r hover:bg-gray-600"
                        >
                          +
                        </button>
                      </div>
                      <div className="font-semibold mr-6 text-foreground">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-400"
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
              <div className="bg-card-background rounded-lg shadow-md p-6 sticky top-8 border border-card-border">
                <h2 className="text-xl font-bold mb-4 text-foreground">Order Summary</h2>
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
                <div className="border-t border-card-border pt-4 flex justify-between font-bold text-lg mb-6 text-foreground">
                  <span>Total</span>
                  <span>${(getTotalPrice() * 1.1).toFixed(2)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-button-background text-white py-3 rounded hover:bg-button-hover transition-colors duration-200"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}