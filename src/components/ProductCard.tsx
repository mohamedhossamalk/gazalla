'use client';

import { Product } from '@/types/product';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import Link from 'next/link';
import { useState } from 'react';

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Validate that product has an ID
    if (!product.id) {
      console.error('Cannot add product to cart without ID:', product);
      return;
    }
    
    try {
      // Add to local cart context
      addItem({ ...product, quantity: 1 });
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      // Even if API fails, we still add to local cart
      addItem({ ...product, quantity: 1 });
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
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

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  // Ensure product has an ID for rendering
  if (!product.id) {
    console.error('ProductCard rendered with product missing ID:', product);
    return null;
  }

  return (
    <div className="border border-card-border rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-card-background transform hover:-translate-y-1 group">
      <div className="relative">
        <Link href={`/products/${product.id}`} className="block">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 h-64 flex items-center justify-center transition-all duration-300 group-hover:from-gray-700 group-hover:to-gray-800 relative overflow-hidden">
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent"></div>
              </div>
            )}
            
            {imageError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-400 text-sm">Image not available</span>
              </div>
            ) : (
              <>
                <img 
                  src={product.imageUrl || '/images/placeholder.jpg'} 
                  alt={product.name} 
                  className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-300"></div>
              </>
            )}
            
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-white font-semibold text-lg bg-black bg-opacity-50 px-4 py-2 rounded-lg">
                View Details
              </span>
            </div>
          </div>
        </Link>
        
        <button
          onClick={handleToggleWishlist}
          className="absolute top-3 right-3 bg-black bg-opacity-50 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-opacity-70 transition-all duration-300 transform hover:scale-110 z-10"
          aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isInWishlist(product.id) ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 animate-pulse" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          )}
        </button>
        
        {product.stock < 5 && product.stock > 0 && (
          <div className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Only {product.stock} left!
          </div>
        )}
        
        {product.stock === 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Out of Stock
          </div>
        )}
      </div>
      
      <div className="p-4">
        <Link href={`/products/${product.id}`} className="block">
          <h3 className="font-bold text-lg mb-1 text-foreground group-hover:text-accent transition-colors duration-300 line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-400 text-sm mb-3 line-clamp-2 min-h-[2.5rem]">
          {product.description}
        </p>
        
        <div className="flex justify-between items-center mt-4">
          <span className="font-bold text-xl text-foreground">${product.price.toFixed(2)}</span>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg ${
              product.stock === 0 
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                : 'bg-button-background text-white hover:bg-button-hover'
            }`}
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}