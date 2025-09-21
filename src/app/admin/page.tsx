'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Link from 'next/link';
import { fetchUsers, fetchProducts, fetchOrders } from '@/lib/api';

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
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

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

      setStats({
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue
      });
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
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/admin/users" className="bg-card-background rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border border-card-border">
            <div className="flex items-center">
              <div className="bg-blue-900 p-3 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">User Management</h3>
                <p className="text-gray-400">Manage users and roles</p>
              </div>
            </div>
          </Link>
          
          <Link href="/admin/products" className="bg-card-background rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border border-card-border">
            <div className="flex items-center">
              <div className="bg-green-900 p-3 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Product Management</h3>
                <p className="text-gray-400">Add, edit, and delete products</p>
              </div>
            </div>
          </Link>
          
          <Link href="/admin/orders" className="bg-card-background rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border border-card-border">
            <div className="flex items-center">
              <div className="bg-purple-900 p-3 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Order Management</h3>
                <p className="text-gray-400">View and manage orders</p>
              </div>
            </div>
          </Link>
        </div>
        
        <div className="bg-card-background rounded-lg shadow-md p-6 border border-card-border">
          <h2 className="text-2xl font-bold mb-4 text-foreground">Quick Stats</h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-800 p-4 rounded-lg animate-pulse">
                <p className="text-sm text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-foreground">Loading...</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg animate-pulse">
                <p className="text-sm text-gray-400">Total Products</p>
                <p className="text-2xl font-bold text-foreground">Loading...</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg animate-pulse">
                <p className="text-sm text-gray-400">Total Orders</p>
                <p className="text-2xl font-bold text-foreground">Loading...</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg animate-pulse">
                <p className="text-sm text-gray-400">Revenue</p>
                <p className="text-2xl font-bold text-foreground">Loading...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalUsers.toLocaleString()}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Total Products</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalProducts.toLocaleString()}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Total Orders</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalOrders.toLocaleString()}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Revenue</p>
                <p className="text-2xl font-bold text-foreground">${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}