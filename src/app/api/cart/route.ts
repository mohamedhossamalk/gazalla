import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/database';
import { CartItem } from '@/types/product';

// GET /api/cart - Get cart items (in a real app, this would be tied to a user session)
export async function GET(request: Request) {
  try {
    // For demo purposes, we'll return an empty cart
    // In a real application, you would retrieve the cart from the database based on user session
    return NextResponse.json({ cart: [] }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

// POST /api/cart - Add item to cart
export async function POST(request: Request) {
  try {
    const { productId, quantity } = await request.json();
    
    // Get product information
    const products = await getProducts();
    const product = products.find(p => p.id === productId);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Create cart item
    const cartItem: CartItem = {
      ...product,
      quantity: quantity || 1
    };
    
    // In a real app, you would save this to the database
    // For demo, we'll just return the item
    return NextResponse.json(
      { cartItem, message: 'Item added to cart' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}