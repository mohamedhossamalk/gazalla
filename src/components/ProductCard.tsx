'use client';

import { Product } from '@/types/product';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import Link from 'next/link';
import { addToCart } from '@/lib/api';

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const handleAddToCart = async () => {
    // Validate that product has an ID
    if (!product.id) {
      console.error('Cannot add product to cart without ID:', product);
      return;
    }
    
    try {
      // Add to local cart context
      addItem({ ...product, quantity: 1 });
      
      // Also send to API (in a real app, you might want to handle this differently)
      await addToCart(product.id, 1);
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      // Even if API fails, we still add to local cart
      addItem({ ...product, quantity: 1 });
    }
  };

  const handleToggleWishlist = () => {
    // Validate that product has an ID
    if (!product.id) {
      console.error('Cannot add product to wishlist without ID:', product);
      return;
    }
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  // Ensure product has an ID for rendering
  if (!product.id) {
    console.error('ProductCard rendered with product missing ID:', product);
    return null;
  }

  return (
    <div className="border border-card-border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-card-background">
      <div className="relative">
        <Link href={`/products/${product.id}`}>
          <div className="bg-gray-700 h-64 flex items-center justify-center">
            <span className="text-gray-300">Product Image</span>
          </div>
        </Link>
        <button
          onClick={handleToggleWishlist}
          className="absolute top-2 right-2 bg-gray-800 rounded-full p-2 shadow-md hover:bg-gray-700"
          aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isInWishlist(product.id) ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          )}
        </button>
      </div>
      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-lg mb-1 text-foreground">{product.name}</h3>
        </Link>
        <p className="text-gray-400 text-sm mb-2 line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="font-bold text-lg text-foreground">${product.price.toFixed(2)}</span>
          <button
            onClick={handleAddToCart}
            className="bg-button-background text-white px-4 py-2 rounded hover:bg-button-hover transition-colors duration-200"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}