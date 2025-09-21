'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { fetchProductById } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Product } from '@/types/product';
import React from 'react';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { addItem } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Unwrap the params Promise using React.use
  const resolvedParams = React.use(params);
  
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        // Ensure we have a valid product ID
        const productId = resolvedParams?.id;
        if (!productId) {
          throw new Error('Invalid product ID');
        }
        const fetchedProduct = await fetchProductById(productId);
        setProduct(fetchedProduct);
      } catch (err) {
        setError('Failed to load product');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    if (resolvedParams) {
      loadProduct();
    }
  }, [resolvedParams]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-gray-400">Loading product...</p>
          </div>
        </main>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-foreground mb-4">{error || 'Product Not Found'}</h1>
            <button 
              onClick={() => router.push('/products')}
              className="bg-button-background text-white px-6 py-3 rounded hover:bg-button-hover transition-colors duration-200"
            >
              Back to Products
            </button>
          </div>
        </main>
      </div>
    );
  }
  
  const handleAddToCart = () => {
    // Ensure the product has a valid ID before adding to cart
    if (product && product.id) {
      addItem({ ...product, quantity });
      router.push('/cart');
    } else {
      console.error('Cannot add product to cart: missing ID', product);
    }
  };
  
  const handleToggleWishlist = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Product Image */}
          <div className="md:w-1/2">
            <div className="bg-gray-700 h-96 md:h-[500px] flex items-center justify-center rounded-lg">
              <span className="text-gray-300">Product Image</span>
            </div>
          </div>
          
          {/* Product Info */}
          <div className="md:w-1/2">
            <h1 className="text-3xl font-bold text-foreground mb-4">{product.name}</h1>
            <p className="text-2xl font-semibold text-foreground mb-6">${product.price.toFixed(2)}</p>
            <p className="text-gray-400 mb-8">{product.description}</p>
            
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-2 text-foreground">Quantity</h2>
              <div className="flex items-center">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="bg-gray-700 text-foreground px-4 py-2 rounded-l hover:bg-gray-600"
                >
                  -
                </button>
                <span className="bg-gray-800 px-4 py-2 text-foreground">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="bg-gray-700 text-foreground px-4 py-2 rounded-r hover:bg-gray-600"
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                className="bg-button-background text-white px-6 py-3 rounded hover:bg-button-hover transition-colors duration-200 flex-1"
              >
                Add to Cart
              </button>
              <button
                onClick={handleToggleWishlist}
                className={`px-6 py-3 rounded border transition-colors duration-200 flex items-center ${
                  isInWishlist(product.id)
                    ? 'bg-red-900 border-red-700 text-red-200'
                    : 'bg-card-background border-card-border text-foreground hover:bg-gray-700'
                }`}
              >
                {isInWishlist(product.id) ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    In Wishlist
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Add to Wishlist
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}