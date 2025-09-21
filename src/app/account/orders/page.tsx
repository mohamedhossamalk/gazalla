'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';

// Define types for our order data
interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  items: OrderItem[];
}

export default function OrderHistoryPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    
    setIsLoggedIn(true);
    
    // In a real app, you would fetch orders from the database
    // For now, we'll use sample data
    const sampleOrders: Order[] = [
      {
        id: 'ORD-001',
        date: '2023-06-15',
        total: 129.99,
        status: 'Delivered',
        items: [
          { name: 'Leather Wallet', quantity: 1, price: 49.99 },
          { name: 'Sunglasses', quantity: 1, price: 79.99 }
        ]
      },
      {
        id: 'ORD-002',
        date: '2023-05-22',
        total: 39.99,
        status: 'Delivered',
        items: [
          { name: 'Leather Belt', quantity: 1, price: 39.99 }
        ]
      }
    ];
    
    setOrders(sampleOrders);
    setLoading(false);
  }, [router]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Order History</h1>
            <p className="text-center">Redirecting to login...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Order History</h1>
            <Link href="/account" className="text-black hover:underline">
              ← Back to Account
            </Link>
          </div>
          
          {loading ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-600">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-600">You haven&apos;t placed any orders yet.</p>
              <Link href="/products" className="text-black font-semibold hover:underline mt-4 inline-block">
                Start Shopping →
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-bold">Order #{order.id}</h2>
                      <p className="text-gray-600">Placed on {new Date(order.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${order.total.toFixed(2)}</p>
                      <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-800">
                        {order.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="font-semibold mb-2">Items:</h3>
                    <ul className="space-y-2">
                      {order.items.map((item, index) => (
                        <li key={index} className="flex justify-between">
                          <span>{item.quantity} x {item.name}</span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}