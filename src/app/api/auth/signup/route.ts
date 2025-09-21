import { NextResponse } from 'next/server';
import { createUser, getUserByEmail } from '@/lib/database';

// POST /api/auth/signup - User registration
export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, password, adminKey } = await request.json();
    
    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }
    
    // Determine user role - admin if correct admin key is provided
    const role = adminKey === 'GAZALLA_ADMIN_2025' ? 'admin' : 'customer';
    
    // Create new user
    const newUser = await createUser({
      name: `${firstName} ${lastName}`,
      email,
      password, // In a real app, this should be hashed
      role
    });
    
    // Remove password from response
    // Handle both MongoDB objects and plain objects
    const userObject = newUser.toObject ? newUser.toObject() : newUser;
    const { password: omittedPassword, ...userWithoutPassword } = userObject;
    
    return NextResponse.json(
      { user: userWithoutPassword, message: 'Registration successful' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
}