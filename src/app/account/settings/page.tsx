'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import LoadingSpinner from '@/components/LoadingSpinner';

// Define the user type
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

// Define the form data type
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export default function AccountSettingsPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    setIsLoggedIn(true);
    
    // Initialize form with user data
    if (parsedUser.name) {
      const nameParts = parsedUser.name.split(' ');
      setFormData(prev => ({
        ...prev,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: parsedUser.email || ''
      }));
    }
    
    setLoading(false);
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Basic validation
    if (formData.newPassword && formData.newPassword !== formData.confirmNewPassword) {
      setError('New passwords do not match');
      return;
    }
    
    if (formData.newPassword && formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }
    
    // In a real app, you would send this data to the server to update the user
    // For now, we'll just show a success message
    
    // Update user data in localStorage
    const updatedUser = {
      ...user,
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email
    } as User;
    
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    
    setSuccess('Account information updated successfully');
    
    // Clear password fields
    setFormData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    }));
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto fade-in">
            <h1 className="text-3xl font-bold mb-8 text-foreground">Account Settings</h1>
            <div className="bg-card-background rounded-lg shadow-md p-8 text-center border border-card-border slide-up">
              <div className="flex justify-center mb-6">
                <div className="bg-gray-800 rounded-full p-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-400 mb-6">Redirecting to login...</p>
              <Link 
                href="/login" 
                className="text-button-background hover:underline transition-colors duration-300"
              >
                Click here if you are not redirected
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto fade-in">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-foreground">Account Settings</h1>
            <Link href="/account" className="text-button-background hover:underline transition-colors duration-300 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Account
            </Link>
          </div>
          
          {loading ? (
            <div className="bg-card-background rounded-lg shadow-md p-12 text-center border border-card-border slide-up">
              <LoadingSpinner size="lg" className="mx-auto mb-4" />
              <p className="text-gray-400">Loading account settings...</p>
            </div>
          ) : (
            <div className="bg-card-background rounded-xl shadow-md p-6 border border-card-border slide-up">
              {error && (
                <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded mb-6 animate-shake">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="bg-green-900 border border-green-700 text-green-200 px-4 py-3 rounded mb-6">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {success}
                  </div>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-foreground mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-input-border rounded-lg focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground transition-all duration-300 hover:border-accent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-foreground mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-input-border rounded-lg focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground transition-all duration-300 hover:border-accent"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-foreground mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-input-border rounded-lg focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground transition-all duration-300 hover:border-accent"
                    required
                  />
                </div>
                
                <div className="border-t border-card-border pt-6 mb-6">
                  <h2 className="text-xl font-bold mb-4 text-foreground">Change Password</h2>
                  
                  <div className="mb-4">
                    <label className="block text-foreground mb-2">Current Password</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-input-border rounded-lg focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground transition-all duration-300 hover:border-accent"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-foreground mb-2">New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-input-border rounded-lg focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground transition-all duration-300 hover:border-accent"
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-foreground mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmNewPassword"
                      value={formData.confirmNewPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-input-border rounded-lg focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground transition-all duration-300 hover:border-accent"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-button-background text-white px-6 py-3 rounded-lg hover:bg-button-hover transition-all duration-300 transform hover:scale-[1.02] glow-hover font-semibold"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}