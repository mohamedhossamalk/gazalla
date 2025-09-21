import { NextResponse } from 'next/server';
import { getOrders, createOrder } from '@/lib/database';

// GET /api/orders - Get all orders
export async function GET(request: Request) {
  try {
    const orders = await getOrders();
    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create a new order
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newOrder = await createOrder(body);
    
    return NextResponse.json(
      { order: newOrder, message: 'Order created successfully' },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}