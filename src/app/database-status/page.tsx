'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';

interface DatabaseStatus {
  connectionState: string;
  isAvailable: boolean;
  isConnected: boolean;
  usingFallback: boolean;
  isAtlas: boolean;
  message: string;
}

export default function DatabaseStatusPage() {
  const [status, setStatus] = useState<DatabaseStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/database-status');
      const data = await response.json();
      
      if (response.ok) {
        setStatus(data);
      } else {
        setError(data.error || 'Failed to fetch database status');
      }
    } catch (error) {
      setError('An error occurred while fetching database status');
      console.error('Error fetching database status:', error);
    } finally {
      setLoading(false);
    }
  };

  const getConnectionStatusColor = (state: string) => {
    switch (state) {
      case 'connected':
        return 'bg-green-500';
      case 'connecting':
      case 'disconnecting':
        return 'bg-yellow-500';
      default:
        return 'bg-red-500';
    }
  };

  const getConnectionStatusText = (state: string) => {
    switch (state) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting';
      case 'disconnecting':
        return 'Disconnecting';
      default:
        return 'Disconnected';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-foreground">Database Connection Status</h1>
          
          {loading ? (
            <div className="bg-card-background rounded-lg shadow-md p-6 text-center border border-card-border">
              <p className="text-gray-400">Loading database status...</p>
            </div>
          ) : error ? (
            <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded mb-4">
              {error}
            </div>
          ) : status ? (
            <div className="bg-card-background rounded-lg shadow-md p-6 border border-card-border">
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-4 text-foreground">Connection Status</h2>
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full ${getConnectionStatusColor(status.connectionState)} mr-3`}></div>
                  <span className="font-semibold text-foreground">{getConnectionStatusText(status.connectionState)}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="border border-card-border rounded-lg p-4">
                  <h3 className="font-semibold mb-2 text-foreground">Database Availability</h3>
                  <p className={status.isAvailable ? 'text-green-500' : 'text-red-500'}>
                    {status.isAvailable ? 'Available' : 'Not Available'}
                  </p>
                </div>
                
                <div className="border border-card-border rounded-lg p-4">
                  <h3 className="font-semibold mb-2 text-foreground">Connection Status</h3>
                  <p className={status.isConnected ? 'text-green-500' : 'text-red-500'}>
                    {status.isConnected ? 'Connected' : 'Not Connected'}
                  </p>
                </div>
                
                <div className="border border-card-border rounded-lg p-4">
                  <h3 className="font-semibold mb-2 text-foreground">Storage Mode</h3>
                  <p className={status.usingFallback ? 'text-yellow-500' : 'text-green-500'}>
                    {status.usingFallback ? 'In-Memory (Fallback)' : 'Database'}
                  </p>
                </div>
                
                <div className="border border-card-border rounded-lg p-4">
                  <h3 className="font-semibold mb-2 text-foreground">Database Type</h3>
                  <p className={status.isAtlas ? 'text-blue-500' : 'text-gray-400'}>
                    {status.isAtlas ? 'MongoDB Atlas (Cloud)' : 'Local MongoDB'}
                  </p>
                </div>
                
                <div className="border border-card-border rounded-lg p-4 md:col-span-2">
                  <h3 className="font-semibold mb-2 text-foreground">Message</h3>
                  <p className="text-gray-400">{status.message}</p>
                </div>
              </div>
              
              {/* Additional Information */}
              {status.usingFallback && (
                <div className="bg-yellow-900 border-l-4 border-yellow-600 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-200">In-Memory Storage Mode</h3>
                      <div className="mt-2 text-sm text-yellow-300">
                        <p>
                          The application is currently using in-memory storage because MongoDB is not available.
                          All features work correctly, but data will not persist between server restarts.
                        </p>
                        <p className="mt-2">
                          To enable persistent storage, please install MongoDB Community Server:
                        </p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          <li>Download from <a href="https://www.mongodb.com/try/download/community" className="underline text-yellow-400" target="_blank" rel="noopener noreferrer">MongoDB Download Center</a></li>
                          <li>Install MongoDB Community Server</li>
                          <li>Start the MongoDB service</li>
                          <li>Restart the development server</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="font-semibold mb-2 text-foreground">Details</h3>
                <pre className="text-sm text-gray-300 overflow-x-auto">
                  {JSON.stringify(status, null, 2)}
                </pre>
              </div>
              
              <div className="mt-6">
                <button
                  onClick={fetchStatus}
                  className="bg-button-background text-white px-4 py-2 rounded hover:bg-button-hover transition-colors duration-200"
                >
                  Refresh Status
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
