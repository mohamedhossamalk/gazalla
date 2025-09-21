import { NextResponse } from 'next/server';
import { getProducts, getProductsByCategory, addProduct } from '@/lib/database';

// GET /api/products - Get all products
// GET /api/products?category=men - Get products by category
export async function GET(request: Request) {
  try {
    // Parse URL correctly
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    
    let products;
    if (category) {
      products = await getProductsByCategory(category);
    } else {
      products = await getProducts();
    }
    
    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a new product
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newProduct = await addProduct(body);
    
    return NextResponse.json(
      { product: newProduct, message: 'Product created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/products:', error);
    return NextResponse.json(
      { error: 'Failed to create product', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}