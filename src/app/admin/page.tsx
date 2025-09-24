'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import AdminSidebar from '@/components/AdminSidebar';
import Link from 'next/link';
import { fetchUsers, fetchProducts, fetchOrders } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Product } from '@/types/product';
import Image from 'next/image';

// Define types for our data
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: 0,
    lowStockProducts: 0,
    pendingOrders: 0,
    newUsersThisMonth: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);

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
      loadStats();
    }
  }, [isAdmin]);

  const loadStats = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [users, products, orders] = await Promise.all([
        fetchUsers(),
        fetchProducts(),
        fetchOrders()
      ]);

      // Calculate statistics
      const totalUsers = users.length;
      const totalProducts = products.length;
      const totalOrders = orders.length;
      
      // Calculate total revenue from orders
      const totalRevenue = orders.reduce((sum: number, order: Order) => {
        return sum + (order.total || 0);
      }, 0);

      // Calculate recent orders (last 7 days)
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const recentOrdersCount = orders.filter((order: Order) => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= oneWeekAgo;
      }).length;

      // Calculate low stock products (stock < 5)
      const lowStockProducts = products.filter((product: Product) => {
        return product.stock < 5;
      }).length;

      // Calculate pending orders
      const pendingOrders = orders.filter((order: Order) => {
        return order.status === 'pending';
      }).length;

      // Calculate new users this month
      const firstDayOfMonth = new Date();
      firstDayOfMonth.setDate(1);
      firstDayOfMonth.setHours(0, 0, 0, 0);
      
      const newUsersThisMonth = users.filter((user: User) => {
        const userDate = new Date(user.createdAt);
        return userDate >= firstDayOfMonth;
      }).length;

      setStats({
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        recentOrders: recentOrdersCount,
        lowStockProducts,
        pendingOrders,
        newUsersThisMonth
      });

      // Get 5 most recent orders for display
      const sortedOrders = [...orders].sort((a: Order, b: Order) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      setRecentOrders(sortedOrders.slice(0, 5));

      // Get low stock products for display
      const sortedLowStock = [...products]
        .filter((product: Product) => product.stock < 10)
        .sort((a: Product, b: Product) => a.stock - b.stock)
        .slice(0, 5);
      setLowStockProducts(sortedLowStock);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto bg-card-background rounded-lg shadow-md p-8 border border-card-border fade-in">
            <h1 className="text-3xl font-bold mb-6 text-center text-foreground">Checking Access...</h1>
            <LoadingSpinner size="lg" className="mx-auto mb-4" />
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
          <div className="max-w-md mx-auto bg-card-background rounded-lg shadow-md p-8 border border-card-border fade-in">
            <h1 className="text-3xl font-bold mb-6 text-center text-foreground">Access Denied</h1>
            <p className="text-center text-gray-400 mb-6">You do not have permission to access the admin dashboard.</p>
            <button
              onClick={() => router.push('/account')}
              className="w-full bg-button-background text-white py-3 rounded hover:bg-button-hover transition-all duration-300 transform hover:scale-105 glow-hover"
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
      <AdminSidebar />
      <main className="container mx-auto px-4 py-8 ml-0 md:ml-64 mt-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-gray-400">Welcome back, {user?.name}</p>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('user');
              router.push('/login');
            }}
            className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-600 transition-all duration-300 transform hover:scale-105 w-full md:w-auto"
          >
            Logout
          </button>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-card-background rounded-xl shadow-md p-6 border border-card-border hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center">
              <div className="bg-blue-900 p-3 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Users</p>
                {loading ? (
                  <div className="h-6 w-16 bg-gray-700 rounded animate-pulse"></div>
                ) : (
                  <p className="text-2xl font-bold text-foreground">{stats.totalUsers.toLocaleString()}</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-card-background rounded-xl shadow-md p-6 border border-card-border hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center">
              <div className="bg-green-900 p-3 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Products</p>
                {loading ? (
                  <div className="h-6 w-16 bg-gray-700 rounded animate-pulse"></div>
                ) : (
                  <p className="text-2xl font-bold text-foreground">{stats.totalProducts.toLocaleString()}</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-card-background rounded-xl shadow-md p-6 border border-card-border hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center">
              <div className="bg-purple-900 p-3 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Orders</p>
                {loading ? (
                  <div className="h-6 w-16 bg-gray-700 rounded animate-pulse"></div>
                ) : (
                  <p className="text-2xl font-bold text-foreground">{stats.totalOrders.toLocaleString()}</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-card-background rounded-xl shadow-md p-6 border border-card-border hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center">
              <div className="bg-yellow-900 p-3 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Revenue</p>
                {loading ? (
                  <div className="h-6 w-20 bg-gray-700 rounded animate-pulse"></div>
                ) : (
                  <p className="text-2xl font-bold text-foreground">${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* New Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-card-background rounded-xl shadow-md p-6 border border-card-border hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center">
              <div className="bg-indigo-900 p-3 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-400">Pending Orders</p>
                {loading ? (
                  <div className="h-6 w-16 bg-gray-700 rounded animate-pulse"></div>
                ) : (
                  <p className="text-2xl font-bold text-foreground">{stats.pendingOrders.toLocaleString()}</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-card-background rounded-xl shadow-md p-6 border border-card-border hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center">
              <div className="bg-red-900 p-3 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-400">Low Stock Items</p>
                {loading ? (
                  <div className="h-6 w-16 bg-gray-700 rounded animate-pulse"></div>
                ) : (
                  <p className="text-2xl font-bold text-foreground">{stats.lowStockProducts.toLocaleString()}</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-card-background rounded-xl shadow-md p-6 border border-card-border hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center">
              <div className="bg-teal-900 p-3 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-400">New Users (Month)</p>
                {loading ? (
                  <div className="h-6 w-16 bg-gray-700 rounded animate-pulse"></div>
                ) : (
                  <p className="text-2xl font-bold text-foreground">{stats.newUsersThisMonth.toLocaleString()}</p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-card-background rounded-xl shadow-md p-6 border border-card-border mb-8">
              <h2 className="text-2xl font-bold mb-6 text-foreground">Quick Actions</h2>
              <div className="grid grid-cols-1 gap-4">
                <Link href="/admin/users" className="flex items-center p-4 rounded-lg border border-card-border hover:bg-gray-800 transition-all duration-300 transform hover:scale-[1.02]">
                  <div className="bg-blue-900 p-2 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Manage Users</h3>
                    <p className="text-sm text-gray-400">Add or remove users</p>
                  </div>
                </Link>
                
                <Link href="/admin/products" className="flex items-center p-4 rounded-lg border border-card-border hover:bg-gray-800 transition-all duration-300 transform hover:scale-[1.02]">
                  <div className="bg-green-900 p-2 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Manage Products</h3>
                    <p className="text-sm text-gray-400">Add or edit products</p>
                  </div>
                </Link>
                
                <Link href="/admin/orders" className="flex items-center p-4 rounded-lg border border-card-border hover:bg-gray-800 transition-all duration-300 transform hover:scale-[1.02]">
                  <div className="bg-purple-900 p-2 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Manage Orders</h3>
                    <p className="text-sm text-gray-400">View and process orders</p>
                  </div>
                </Link>
                
                <Link href="/admin/products" className="flex items-center p-4 rounded-lg border border-card-border hover:bg-gray-800 transition-all duration-300 transform hover:scale-[1.02]">
                  <div className="bg-yellow-900 p-2 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Add New Product</h3>
                    <p className="text-sm text-gray-400">Create a new product</p>
                  </div>
                </Link>
              </div>
            </div>
            
            {/* Low Stock Products */}
            <div className="bg-card-background rounded-xl shadow-md p-6 border border-card-border">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-foreground">Low Stock Products</h2>
                <Link href="/admin/products" className="text-button-background hover:text-accent transition-colors duration-300 text-sm">
                  View All
                </Link>
              </div>
              
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg animate-pulse">
                      <div className="flex items-center">
                        <div className="bg-gray-700 rounded-md h-10 w-10 mr-3"></div>
                        <div>
                          <div className="h-4 bg-gray-700 rounded w-20 mb-2"></div>
                          <div className="h-3 bg-gray-700 rounded w-12"></div>
                        </div>
                      </div>
                      <div className="h-6 w-8 bg-gray-700 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : lowStockProducts.length > 0 ? (
                <div className="space-y-4">
                  {lowStockProducts.map((product: Product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-200">
                      <div className="flex items-center">
                        {product.imageUrl ? (
                          <Image 
                            src={product.imageUrl} 
                            alt={product.name} 
                            width={40}
                            height={40}
                            className="rounded-md object-cover mr-3"
                          />
                        ) : (
                          <div className="bg-gray-700 h-10 w-10 rounded-md mr-3 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-foreground truncate max-w-[120px]">{product.name}</p>
                          <p className="text-sm text-gray-400">{product.category}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${
                        product.stock === 0 
                          ? 'bg-red-900 text-red-300' 
                          : product.stock < 3 
                            ? 'bg-orange-900 text-orange-300' 
                            : 'bg-yellow-900 text-yellow-300'
                      }`}>
                        {product.stock} left
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-400">All products are well stocked!</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Recent Orders and Activity */}
          <div className="lg:col-span-2">
            <div className="bg-card-background rounded-xl shadow-md p-6 border border-card-border mb-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-foreground">Recent Orders</h2>
                <Link href="/admin/orders" className="text-button-background hover:text-accent transition-colors duration-300">
                  View All
                </Link>
              </div>
              
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg animate-pulse">
                      <div className="flex items-center">
                        <div className="bg-gray-700 rounded-full h-10 w-10 mr-4"></div>
                        <div>
                          <div className="h-4 bg-gray-700 rounded w-24 mb-2"></div>
                          <div className="h-3 bg-gray-700 rounded w-16"></div>
                        </div>
                      </div>
                      <div className="h-4 bg-gray-700 rounded w-16"></div>
                    </div>
                  ))}
                </div>
              ) : recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-200 gap-3">
                      <div className="flex items-center">
                        <div className="bg-purple-900 p-2 rounded-full mr-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">Order #{order.id.substring(0, 8)}...</p>
                          <p className="text-sm text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-normal gap-4">
                        <p className="font-semibold text-foreground">${order.total.toFixed(2)}</p>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          order.status === 'pending' 
                            ? 'bg-yellow-900 text-yellow-300' 
                            : order.status === 'processing' 
                              ? 'bg-blue-900 text-blue-300' 
                              : order.status === 'shipped' 
                                ? 'bg-indigo-900 text-indigo-300' 
                                : order.status === 'delivered' 
                                  ? 'bg-green-900 text-green-300' 
                                  : 'bg-red-900 text-red-300'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-gray-400">No recent orders</p>
                </div>
              )}
            </div>
            
            {/* Activity Summary */}
            <div className="bg-card-background rounded-xl shadow-md p-6 border border-card-border">
              <h2 className="text-2xl font-bold mb-6 text-foreground">Activity Summary</h2>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Orders This Week</span>
                    <span className="font-semibold text-foreground">{stats.recentOrders}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-button-background h-2 rounded-full" 
                      style={{ width: `${Math.min(100, (stats.recentOrders / 20) * 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Product Stock Status</span>
                    <span className="font-semibold text-foreground">
                      {stats.lowStockProducts === 0 ? 'Good' : `${stats.lowStockProducts} low`}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        stats.lowStockProducts === 0 
                          ? 'bg-green-500' 
                          : stats.lowStockProducts < 5 
                            ? 'bg-yellow-500' 
                            : 'bg-red-500'
                      }`} 
                      style={{ width: `${Math.min(100, (stats.lowStockProducts / 10) * 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">User Growth</span>
                    <span className="font-semibold text-foreground">+{stats.newUsersThisMonth}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-teal-500 h-2 rounded-full" 
                      style={{ width: `${Math.min(100, (stats.newUsersThisMonth / 50) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}