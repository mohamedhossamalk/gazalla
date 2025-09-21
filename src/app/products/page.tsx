'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import { fetchProducts } from '@/lib/api';
import { Product } from '@/types/product';

function ProductsContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const products = await fetchProducts(category || undefined);
        // Filter out products without IDs
        const validProducts = products.filter((product: Product) => {
          if (!product.id) {
            console.warn('Found product without ID:', product);
            return false;
          }
          return true;
        });
        setFilteredProducts(validProducts);
      } catch (err) {
        setError('Failed to load products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, [category]);
  
  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Loading products...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-button-background text-white px-6 py-2 rounded hover:bg-button-hover transition-colors duration-200"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          {category === 'men' ? 'Men\'s Collection' : 
           category === 'women' ? 'Women\'s Collection' : 'All Products'}
        </h1>
      </div>
      
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => {
            // Ensure each product has a valid key
            const key = product.id || `product-${index}`;
            // Skip products without IDs
            if (!product.id) {
              return null;
            }
            return (
              <ProductCard key={key} product={product} />
            );
          })}
        </div>
      )}
    </>
  );
}

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<div className="text-center py-12"><p className="text-gray-400">Loading products...</p></div>}>
          <ProductsContent />
        </Suspense>
      </main>
    </div>
  );
}