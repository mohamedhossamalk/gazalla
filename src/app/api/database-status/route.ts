import { NextResponse } from 'next/server';
import { isDatabaseAvailable } from '@/lib/mongodb';
import mongoose from 'mongoose';

// GET /api/database-status - Get database connection status
export async function GET() {
  try {
    const isAvailable = isDatabaseAvailable();
    let isConnected = false;
    let connectionState = 'disconnected';
    let isAtlas = false;
    
    if (isAvailable && mongoose.connection) {
      isConnected = mongoose.connection.readyState === 1; // 1 means connected
      connectionState = mongoose.connection.readyState === 1 
        ? 'connected' 
        : mongoose.connection.readyState === 2 
          ? 'connecting' 
          : mongoose.connection.readyState === 3 
            ? 'disconnecting' 
            : 'disconnected';
            
      // Check if we're using MongoDB Atlas
      const uri = process.env.MONGODB_URI || '';
      isAtlas = uri.includes('mongodb+srv');
    }
    
    return NextResponse.json({
      isAvailable,
      isConnected,
      connectionState,
      usingFallback: !isAvailable,
      isAtlas,
      message: isAvailable 
        ? isConnected 
          ? isAtlas 
            ? 'Connected to MongoDB Atlas' 
            : 'Connected to local MongoDB'
          : 'Database is available but not connected'
        : 'Using in-memory storage as fallback'
    });
  } catch (error) {
    return NextResponse.json({
      isAvailable: false,
      isConnected: false,
      connectionState: 'error',
      usingFallback: true,
      isAtlas: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Error checking database status'
    }, { status: 500 });
  }
}