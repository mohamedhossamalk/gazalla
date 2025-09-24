'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import AdminSidebar from '@/components/AdminSidebar';
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
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortField, setSortField] = useState<'name' | 'price' | 'stock' | 'category'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    description: '',
    price: 0,
    category: 'men',
    imageUrl: '',
    stock: 0,
  });
  
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Refs for file inputs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  const [imageUploadField, setImageUploadField] = useState<'new' | 'edit' | null>(null);

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
    // Filter and sort products
    let result = [...products];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (filterCategory !== 'all') {
      result = result.filter(product => 
        product.category === filterCategory
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (sortField === 'name') {
        return sortDirection === 'asc' 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
      } else if (sortField === 'price') {
        return sortDirection === 'asc' ? a.price - b.price : b.price - a.price;
      } else if (sortField === 'stock') {
        return sortDirection === 'asc' ? a.stock - b.stock : b.stock - a.stock;
      } else {
        return sortDirection === 'asc' 
          ? a.category.localeCompare(b.category) 
          : b.category.localeCompare(a.category);
      }
    });
    
    setFilteredProducts(result);
  }, [searchTerm, filterCategory, sortField, sortDirection, products]);
  
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
      [name]: name === 'price' || name === 'stock' ? (value === '' ? 0 : Number(value)) : value
    }));
  };
  
  const handleEditProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (editingProduct) {
      setEditingProduct({
        ...editingProduct,
        [name]: name === 'price' || name === 'stock' ? (value === '' ? 0 : Number(value)) : value
      } as Product);
    }
  };
  
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validate required fields
      if (!newProduct.name || !newProduct.description || !newProduct.category) {
        alert('Please fill in all required fields.');
        return;
      }
      
      // Validate price and stock are numbers (and not just 0)
      const price = newProduct.price;
      const stock = newProduct.stock;
      
      if (isNaN(price) || isNaN(stock)) {
        alert('Price and stock must be valid numbers.');
        return;
      }
      
      // Add product via API
      await addProduct(newProduct as Product);
      
      alert('Product added successfully!');
      setNewProduct({
        name: '',
        description: '',
        price: 0,
        category: 'men',
        imageUrl: '',
        stock: 0,
      });
      setShowAddForm(false);
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
      // Validate required fields
      if (!editingProduct.name || !editingProduct.description || !editingProduct.category) {
        alert('Please fill in all required fields.');
        return;
      }
      
      // Validate price and stock are numbers
      const price = parseFloat(editingProduct.price.toString());
      const stock = parseInt(editingProduct.stock.toString());
      
      if (isNaN(price) || isNaN(stock)) {
        alert('Price and stock must be valid numbers.');
        return;
      }
      
      // Update product via API
      await updateProduct(editingProduct.id, {
        ...editingProduct,
        price,
        stock
      });
      
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
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
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
  
  const handleSort = (field: 'name' | 'price' | 'stock' | 'category') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleImageUploadClick = (type: 'new' | 'edit') => {
    setImageUploadField(type);
    if (type === 'new' && fileInputRef.current) {
      fileInputRef.current.click();
    } else if (type === 'edit' && editFileInputRef.current) {
      editFileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // In a real application, you would upload the file to a server here
    // For now, we'll create a local URL for preview purposes
    const imageUrl = URL.createObjectURL(file);
    
    if (imageUploadField === 'new') {
      setNewProduct(prev => ({
        ...prev,
        imageUrl
      }));
    } else if (imageUploadField === 'edit' && editingProduct) {
      setEditingProduct({
        ...editingProduct,
        imageUrl
      });
    }
    
    // Reset the file input
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (editFileInputRef.current) editFileInputRef.current.value = '';
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
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={editFileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      <Header />
      <AdminSidebar />
      <main className="container mx-auto px-4 py-8 ml-0 md:ml-64 mt-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Product Management</h1>
            <p className="text-gray-400">Manage all products in your store</p>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('user');
              router.push('/login');
            }}
            className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-200 w-full md:w-auto"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Controls and Stats */}
          <div className="bg-card-background rounded-xl shadow-md p-6 border border-card-border">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl md:text-2xl font-bold text-foreground">Products ({filteredProducts.length})</h2>
                <div className="flex flex-wrap gap-2">
                  <div className="px-3 py-1 bg-blue-900 text-blue-300 rounded-full text-sm">
                    {products.filter(p => p.category === 'men').length} Men
                  </div>
                  <div className="px-3 py-1 bg-pink-900 text-pink-300 rounded-full text-sm">
                    {products.filter(p => p.category === 'women').length} Women
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="bg-button-background text-white px-4 py-2 rounded-lg hover:bg-button-hover transition-colors duration-200 flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  {showAddForm ? 'Cancel' : 'Add Product'}
                </button>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-auto">
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="pl-4 pr-10 py-2 border border-input-border rounded-lg focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground w-full sm:w-auto"
                  >
                    <option value="all">All Categories</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                  </select>
                </div>
              </div>
              
              <div className="relative w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-input-border rounded-lg focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground w-full"
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

            {/* Add Product Form (Collapsible) */}
            {showAddForm && (
              <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
                <h3 className="text-xl font-bold mb-4 text-foreground">Add New Product</h3>
                <form onSubmit={handleAddProduct}>
                  <div className="mb-4">
                    <label className="block text-foreground mb-2">Product Name</label>
                    <input
                      type="text"
                      name="name"
                      value={newProduct.name}
                      onChange={handleProductChange}
                      className="w-full px-4 py-2 border border-input-border rounded-lg focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-foreground mb-2">Description</label>
                    <textarea
                      name="description"
                      value={newProduct.description}
                      onChange={handleProductChange}
                      className="w-full px-4 py-2 border border-input-border rounded-lg focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground"
                      rows={3}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-foreground mb-2">Price ($)</label>
                      <input
                        type="number"
                        name="price"
                        value={newProduct.price === 0 ? '' : newProduct.price}
                        onChange={handleProductChange}
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-2 border border-input-border rounded-lg focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-foreground mb-2">Stock</label>
                      <input
                        type="number"
                        name="stock"
                        value={newProduct.stock === 0 ? '' : newProduct.stock}
                        onChange={handleProductChange}
                        min="0"
                        className="w-full px-4 py-2 border border-input-border rounded-lg focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-foreground mb-2">Category</label>
                      <select
                        name="category"
                        value={newProduct.category}
                        onChange={handleProductChange}
                        className="w-full px-4 py-2 border border-input-border rounded-lg focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground"
                      >
                        <option value="men">Men</option>
                        <option value="women">Women</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-foreground mb-2">Image URL</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          name="imageUrl"
                          value={newProduct.imageUrl}
                          onChange={handleProductChange}
                          className="flex-1 px-4 py-2 border border-input-border rounded-lg focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground"
                          placeholder="Click to upload or enter URL"
                        />
                        <button
                          type="button"
                          onClick={() => handleImageUploadClick('new')}
                          className="bg-button-background text-white px-4 py-2 rounded-lg hover:bg-button-hover transition-colors duration-200"
                        >
                          Upload
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-button-background text-white py-3 rounded-lg hover:bg-button-hover transition-colors duration-200"
                  >
                    Add Product
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Product List */}
          <div className="bg-card-background rounded-xl shadow-md p-6 border border-card-border">
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent"></div>
                <p className="text-gray-400 mt-4">Loading products...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-card-border">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Product</th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-700"
                        onClick={() => handleSort('category')}
                      >
                        <div className="flex items-center">
                          Category
                          {sortField === 'category' && (
                            <span className="ml-1">
                              {sortDirection === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-700"
                        onClick={() => handleSort('price')}
                      >
                        <div className="flex items-center">
                          Price
                          {sortField === 'price' && (
                            <span className="ml-1">
                              {sortDirection === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-700"
                        onClick={() => handleSort('stock')}
                      >
                        <div className="flex items-center">
                          Stock
                          {sortField === 'stock' && (
                            <span className="ml-1">
                              {sortDirection === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-card-background divide-y divide-card-border">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-800 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {product.imageUrl ? (
                              <img 
                                src={product.imageUrl} 
                                alt={product.name} 
                                className="h-10 w-10 rounded-md object-cover mr-3"
                              />
                            ) : (
                              <div className="bg-gray-700 h-10 w-10 rounded-md mr-3 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                            <div>
                              <div className="text-sm font-medium text-foreground">{product.name}</div>
                              <div className="text-sm text-gray-400 line-clamp-1">{product.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            product.category === 'men' 
                              ? 'bg-blue-900 text-blue-300' 
                              : 'bg-pink-900 text-pink-300'
                          }`}>
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                          ${product.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm font-medium ${
                            product.stock < 5 
                              ? 'text-red-400' 
                              : product.stock < 10 
                                ? 'text-yellow-400' 
                                : 'text-green-400'
                          }`}>
                            {product.stock}
                          </span>
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
                    ))}
                  </tbody>
                </table>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-8">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <p className="text-gray-400">
                      {searchTerm || filterCategory !== 'all' ? 'No products match your search.' : 'No products found.'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Edit Product Modal */}
        {editingProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-card-background rounded-xl shadow-lg p-6 border border-card-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-foreground">Edit Product</h2>
                <button 
                  onClick={cancelEditing}
                  className="text-gray-400 hover:text-foreground"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleUpdateProduct}>
                <div className="mb-4">
                  <label className="block text-foreground mb-2">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editingProduct.name}
                    onChange={handleEditProductChange}
                    className="w-full px-4 py-2 border border-input-border rounded-lg focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-foreground mb-2">Description</label>
                  <textarea
                    name="description"
                    value={editingProduct.description}
                    onChange={handleEditProductChange}
                    className="w-full px-4 py-2 border border-input-border rounded-lg focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground"
                    rows={3}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-foreground mb-2">Price ($)</label>
                    <input
                      type="number"
                      name="price"
                      value={editingProduct.price === 0 ? '' : editingProduct.price}
                      onChange={handleEditProductChange}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 border border-input-border rounded-lg focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-foreground mb-2">Stock</label>
                    <input
                      type="number"
                      name="stock"
                      value={editingProduct.stock === 0 ? '' : editingProduct.stock}
                      onChange={handleEditProductChange}
                      min="0"
                      className="w-full px-4 py-2 border border-input-border rounded-lg focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-foreground mb-2">Category</label>
                    <select
                      name="category"
                      value={editingProduct.category}
                      onChange={handleEditProductChange}
                      className="w-full px-4 py-2 border border-input-border rounded-lg focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground"
                    >
                      <option value="men">Men</option>
                      <option value="women">Women</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-foreground mb-2">Image URL</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="imageUrl"
                        value={editingProduct.imageUrl}
                        onChange={handleEditProductChange}
                        className="flex-1 px-4 py-2 border border-input-border rounded-lg focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground"
                        placeholder="Click to upload or enter URL"
                      />
                      <button
                        type="button"
                        onClick={() => handleImageUploadClick('edit')}
                        className="bg-button-background text-white px-4 py-2 rounded-lg hover:bg-button-hover transition-colors duration-200"
                      >
                        Upload
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-button-background text-white py-3 rounded-lg hover:bg-button-hover transition-colors duration-200"
                  >
                    Update Product
                  </button>
                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="flex-1 bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}