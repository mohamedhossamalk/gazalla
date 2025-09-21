export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'men' | 'women';
  imageUrl: string;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}