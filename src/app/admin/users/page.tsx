'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { fetchUsers, addUser, deleteUser } from '@/lib/api';

// Define interfaces for our data
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface NewUserForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [newUser, setNewUser] = useState<NewUserForm>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'customer'
  });

  useEffect(() => {
    // Check if user is logged in and is an admin
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setCurrentUser(parsedUser);
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
      loadUsers();
    }
  }, [isAdmin]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const fetchedUsers = await fetchUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Failed to load users:', error);
      alert('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Combine first and last name
      const userData = {
        name: `${newUser.firstName} ${newUser.lastName}`,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role,
        createdAt: new Date().toISOString()
      };
      
      // Add user via API
      await addUser(userData);
      alert('User added successfully!');
      setNewUser({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'customer'
      });
      // Refresh user list
      loadUsers();
    } catch (error) {
      console.error('Failed to add user:', error);
      alert('Failed to add user. Please try again.');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      // Delete user via API
      await deleteUser(userId);
      alert('User deleted successfully!');
      // Refresh user list
      loadUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Failed to delete user. Please try again.');
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!currentUser) {
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
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
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
          {/* Add User Form */}
          <div className="bg-card-background rounded-lg shadow-md p-6 border border-card-border">
            <h2 className="text-2xl font-bold mb-6 text-foreground">Add New User</h2>
            <form onSubmit={handleAddUser}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div key="firstName">
                  <label className="block text-foreground mb-2">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={newUser.firstName}
                    onChange={handleUserChange}
                    className="w-full px-4 py-2 border border-input-border rounded focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground"
                    required
                  />
                </div>
                <div key="lastName">
                  <label className="block text-foreground mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={newUser.lastName}
                    onChange={handleUserChange}
                    className="w-full px-4 py-2 border border-input-border rounded focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground"
                    required
                  />
                </div>
              </div>
              <div className="mb-4" key="email">
                <label className="block text-foreground mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleUserChange}
                  className="w-full px-4 py-2 border border-input-border rounded focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground"
                  required
                />
              </div>
              <div className="mb-4" key="password">
                <label className="block text-foreground mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleUserChange}
                  className="w-full px-4 py-2 border border-input-border rounded focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground"
                  required
                />
              </div>
              <div className="mb-6" key="role">
                <label className="block text-foreground mb-2">Role</label>
                <select
                  name="role"
                  value={newUser.role}
                  onChange={handleUserChange}
                  className="w-full px-4 py-2 border border-input-border rounded focus:outline-none focus:ring-2 focus:ring-input-focus bg-input-background text-foreground"
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-button-background text-white py-3 rounded hover:bg-button-hover transition-colors duration-200"
              >
                Add User
              </button>
            </form>
          </div>

          {/* User List */}
          <div className="bg-card-background rounded-lg shadow-md p-6 border border-card-border">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-foreground">Users</h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search users..."
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
              <div className="text-center py-4" key="loading">
                <p className="text-gray-400">Loading users...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-card-border">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-card-background divide-y divide-card-border">
                    {filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-foreground">{user.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === 'admin' 
                              ? 'bg-purple-900 text-purple-300' 
                              : 'bg-green-900 text-green-300'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredUsers.length === 0 && (
                  <div className="text-center py-4" key="no-users">
                    <p className="text-gray-400">
                      {searchTerm ? 'No users match your search.' : 'No users found.'}
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
