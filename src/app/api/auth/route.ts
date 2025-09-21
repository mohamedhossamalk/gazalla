import { NextResponse } from 'next/server';
import { getUserByEmail } from '@/lib/database';

// POST /api/auth/login - User login
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    // Find user by email
    const user = await getUserByEmail(email);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // In a real app, you would securely compare hashed passwords
    // For demo purposes, we'll just check the password directly
    if (user.password !== password) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // In a real app, you would generate a JWT token here
    // For demo purposes, we'll just return the user data
    // Handle both MongoDB objects and plain objects
    const userObject = user.toObject ? user.toObject() : user;
    const { password: omittedPassword, ...userWithoutPassword } = userObject;
    
    return NextResponse.json(
      { user: userWithoutPassword, message: 'Login successful' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    );
  }
}