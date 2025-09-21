'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { fetchProducts, addProduct, updateProduct, deleteProduct } from '@/lib/api';
import { Product } from '@/types/product';

// Define interfaces for our data
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminProductsPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    description: '',
    price: 0,
    category: 'men',
    imageUrl: '',
    stock: 0,
  });
  
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  useEffect(() => {
    // Check if user is logged in and is an admin
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      if (parsedUser.role === 'admin') {
        setIsAdmin(true);
      } else {
        // Redirect non-admin users to the account page
        router.push('/account');
      }
    } else {
      // Redirect unauthenticated users to the login page
      router.push('/login');
    }
  }, [router]);
  
  useEffect(() => {
    if (isAdmin) {
      loadProducts();
    }
  }, [isAdmin]);
  
  useEffect(() => {
    // Filter products based on search term
    if (searchTerm) {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);
  
  const loadProducts = async () => {
    try {
      setLoading(true);
      const fetchedProducts = await fetchProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Failed to load products:', error);
      alert('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value
    }));
  };
  
  const handleEditProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (editingProduct) {
      setEditingProduct({
        ...editingProduct,
        [name]: name === 'price' || name === 'stock' ? Number(value) : value
      });
    }
  };
  
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Add product via API
      await addProduct(newProduct);
      alert('Product added successfully!');
      setNewProduct({
        name: '',
        description: '',
        price: 0,
        category: 'men',
        imageUrl: '',
        stock: 0,
      });
      // Refresh product list
      loadProducts();
    } catch (error) {
      console.error('Failed to add product:', error);
      alert('Failed to add product. Please try again.');
    }
  };
  
  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    
    try {
      // Update product via API
      await updateProduct(editingProduct.id, editingProduct);
      alert('Product updated successfully!');
      setEditingProduct(null);
      // Refresh product list
      loadProducts();
    } catch (error) {
      console.error('Failed to update product:', error);
      alert('Failed to update product. Please try again.');
    }
  };
  
  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }
    
    try {
      // Delete product via API
      await deleteProduct(productId);
      alert('Product deleted successfully!');
      // Refresh product list
      loadProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert('Failed to delete product. Please try again.');
    }
  };
  
  const startEditing = (product: Product) => {
    setEditingProduct(product);
  };
  
  const cancelEditing = () => {
    setEditingProduct(null);
  };
  
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto bg-card-background rounded-lg shadow-md p-8 border border-card-border">
            <h1 className="text-3xl font-bold mb-6 text-center text-foreground">Checking Access...</h1>
            <p className="text-center text-gray-400">Please wait while we verify your credentials.</p>
          </div>
        </main>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto bg-card-background rounded-lg shadow-md p-8 border border-card-border">
            <h1 className="text-3xl font-bold mb-6 text-center text-foreground">Access Denied</h1>
            <p className="text-center text-gray-400 mb-6">You do not have permission to access the admin dashboard.</p>
            <button
              onClick={() => router.push('/account')}
              className="w-full bg-button-background text-white py-3 rounded hover:bg-button-hover transition-colors duration-200"
            >
              Go to Account
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Product Management</h1>
          <button
            onClick={() => {
              localStorage.removeItem('user');
              router.push('/login');
            }}
            className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-200"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add/Edit Product Form */}
          <div className="bg-card-background rounded-lg shadow-md p-6 border border-card-border">
            <h2 className="text-2xl font-bold mb-6 text-foreground">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}>
              <div className="mb-4">
                <label className="block text-foreground mb-2">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={editingProduct ? editingProduct.name : newProduct.name}
                  onChange={editingProduct ? handleEditProductChange : handleProductChange}
                  className="w-full px-4 py-2 border border-input-border rounded focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-foreground mb-2">Description</label>
                <textarea
                  name="description"
                  value={editingProduct ? editingProduct.description : newProduct.description}
                  onChange={editingProduct ? handleEditProductChange : handleProductChange}
                  className="w-full px-4 py-2 border border-input-border rounded focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-foreground mb-2">Price ($)</label>
                  <input
                    type="number"
                    name="price"
                    value={editingProduct ? editingProduct.price : newProduct.price}
                    onChange={editingProduct ? handleEditProductChange : handleProductChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-input-border rounded focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground"
                    required
                  />
                </div>
                <div>
                  <label className="block text-foreground mb-2">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={editingProduct ? editingProduct.stock : newProduct.stock}
                    onChange={editingProduct ? handleEditProductChange : handleProductChange}
                    min="0"
                    className="w-full px-4 py-2 border border-input-border rounded focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-foreground mb-2">Category</label>
                  <select
                    name="category"
                    value={editingProduct ? editingProduct.category : newProduct.category}
                    onChange={editingProduct ? handleEditProductChange : handleProductChange}
                    className="w-full px-4 py-2 border border-input-border rounded focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground"
                  >
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                  </select>
                </div>
                <div>
                  <label className="block text-foreground mb-2">Image URL</label>
                  <input
                    type="text"
                    name="imageUrl"
                    value={editingProduct ? editingProduct.imageUrl : newProduct.imageUrl}
                    onChange={editingProduct ? handleEditProductChange : handleProductChange}
                    className="w-full px-4 py-2 border border-input-border rounded focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-button-background text-white py-3 rounded hover:bg-button-hover transition-colors duration-200"
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
                {editingProduct && (
                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="flex-1 bg-gray-700 text-white py-3 rounded hover:bg-gray-600 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Product List */}
          <div className="bg-card-background rounded-lg shadow-md p-6 border border-card-border">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-foreground">Products</h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-input-border rounded focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground"
                />
                <svg 
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-4">
                <p className="text-gray-400">Loading products...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-card-border">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-card-background divide-y divide-card-border">
                    {filteredProducts.map((product, index) => {
                      // Fallback key using index if product.id is missing
                      const key = product.id || `product-${index}`;

                      return (
                        <tr key={key}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-foreground">{product.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-900 text-blue-300">
                              {product.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                            ${product.price.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                            {product.stock}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => startEditing(product)}
                              className="text-indigo-400 hover:text-indigo-300 mr-3"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-gray-400">
                      {searchTerm ? 'No products match your search.' : 'No products found.'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}