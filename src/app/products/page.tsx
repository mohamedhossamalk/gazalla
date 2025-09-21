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
  const search = searchParams.get('search');
  
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'createdAt'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const products = await fetchProducts(category || undefined);
        
        // Filter by search term if provided
        let filtered = products;
        if (search) {
          filtered = products.filter((product: Product) => 
            product.name.toLowerCase().includes(search.toLowerCase()) ||
            product.description.toLowerCase().includes(search.toLowerCase())
          );
        }
        
        // Filter out products without IDs
        const validProducts = filtered.filter((product: Product) => {
          if (!product.id) {
            console.warn('Found product without ID:', product);
            return false;
          }
          return true;
        });
        
        // Sort products
        const sortedProducts = [...validProducts].sort((a, b) => {
          if (sortBy === 'name') {
            return sortOrder === 'asc' 
              ? a.name.localeCompare(b.name) 
              : b.name.localeCompare(a.name);
          } else if (sortBy === 'price') {
            return sortOrder === 'asc' 
              ? a.price - b.price 
              : b.price - a.price;
          } else {
            // Assuming products have a createdAt field
            const dateA = new Date(a.createdAt || '').getTime();
            const dateB = new Date(b.createdAt || '').getTime();
            return sortOrder === 'asc' 
              ? dateA - dateB 
              : dateB - dateA;
          }
        });
        
        setFilteredProducts(sortedProducts);
      } catch (err) {
        setError('Failed to load products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, [category, search, sortBy, sortOrder]);
  
  const handleSortChange = (newSortBy: 'name' | 'price' | 'createdAt') => {
    if (newSortBy === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
        <p className="text-gray-400 mt-4">Loading products...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-6 max-w-md mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-700 text-white px-6 py-2 rounded hover:bg-red-600 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {category === 'men' ? 'Men\'s Collection' : 
             category === 'women' ? 'Women\'s Collection' : 'All Products'}
          </h1>
          <p className="text-gray-400 mt-2">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
          </p>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <span className="text-foreground mr-2">Sort by:</span>
            <div className="relative">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'createdAt')}
                className="bg-card-background border border-card-border text-foreground rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="name">Name</option>
                <option value="price">Price</option>
                <option value="createdAt">Newest</option>
              </select>
            </div>
          </div>
          
          <button 
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="flex items-center bg-card-background border border-card-border text-foreground rounded-lg px-4 py-2 hover:bg-gray-700 transition-colors duration-200"
          >
            {sortOrder === 'asc' ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                </svg>
                Ascending
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
                Descending
              </>
            )}
          </button>
        </div>
      </div>
      
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-card-background border border-card-border rounded-xl p-8 max-w-md mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-bold text-foreground mb-2">No products found</h3>
            <p className="text-gray-400 mb-6">
              {search 
                ? `No products match your search for "${search}". Try different keywords.` 
                : 'There are currently no products in this category.'}
            </p>
            <button 
              onClick={() => window.location.href = '/products'}
              className="bg-button-background text-white px-6 py-2 rounded hover:bg-button-hover transition-colors duration-200"
            >
              View All Products
            </button>
          </div>
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
        <Suspense fallback={
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
            <p className="text-gray-400 mt-4">Loading products...</p>
          </div>
        }>
          <ProductsContent />
        </Suspense>
      </main>
    </div>
  );
}