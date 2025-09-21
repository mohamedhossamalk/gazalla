import { connectToDatabase, isDatabaseAvailable } from './mongodb';
import Product from '@/models/Product';
import Order from '@/models/Order';
import User from '@/models/User';
import { Product as ProductType } from '@/types/product';
import { IOrder } from '@/models/Order';
import { IUser } from '@/models/User';

// Define interfaces for our data models
interface InMemoryProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stock: number;
}

interface InMemoryOrder {
  _id: string;
  // Add specific properties as needed
  [key: string]: unknown;
}

interface InMemoryUser {
  _id: string;
  // Add specific properties as needed
  [key: string]: unknown;
}

// In-memory storage for when MongoDB is not available
const inMemoryProducts: InMemoryProduct[] = [
  {
    _id: '1',
    name: 'Leather Wallet',
    description: 'Genuine leather wallet with multiple card slots',
    price: 49.99,
    category: 'men',
    imageUrl: '/images/wallet.jpg',
    stock: 25
  },
  {
    _id: '2',
    name: 'Sunglasses',
    description: 'Stylish sunglasses with UV protection',
    price: 89.99,
    category: 'women',
    imageUrl: '/images/sunglasses.jpg',
    stock: 15
  },
  {
    _id: '3',
    name: 'Leather Belt',
    description: 'Premium leather belt with silver buckle',
    price: 39.99,
    category: 'men',
    imageUrl: '/images/belt.jpg',
    stock: 30
  }
];

const inMemoryOrders: InMemoryOrder[] = [];
const inMemoryUsers: InMemoryUser[] = [];

// Product functions
export const getProducts = async () => {
  if (isDatabaseAvailable()) {
    try {
      await connectToDatabase();
      const products = await Product.find({});
      // Transform MongoDB documents to match Product type
      return products.map(product => ({
        id: product._id.toString(),
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        imageUrl: product.imageUrl || '',
        stock: product.stock
      }));
    } catch (error) {
      console.error('Failed to connect to MongoDB, using in-memory storage:', error);
      // Transform in-memory products to match Product type
      return inMemoryProducts.map(product => ({
        id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        imageUrl: product.imageUrl || '',
        stock: product.stock
      }));
    }
  } else {
    // Transform in-memory products to match Product type
    return inMemoryProducts.map(product => ({
      id: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      imageUrl: product.imageUrl || '',
      stock: product.stock
    }));
  }
};

export const getProductById = async (id: string) => {
  if (isDatabaseAvailable()) {
    try {
      await connectToDatabase();
      const product = await Product.findById(id);
      if (!product) return null;
      
      // Transform MongoDB document to match Product type
      return {
        id: product._id.toString(),
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        imageUrl: product.imageUrl || '',
        stock: product.stock
      };
    } catch (error) {
      console.error('Failed to connect to MongoDB, using in-memory storage:', error);
      const product = inMemoryProducts.find(product => product._id === id);
      if (!product) return null;
      
      // Transform in-memory product to match Product type
      return {
        id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        imageUrl: product.imageUrl || '',
        stock: product.stock
      };
    }
  } else {
    const product = inMemoryProducts.find(product => product._id === id);
    if (!product) return null;
    
    // Transform in-memory product to match Product type
    return {
      id: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      imageUrl: product.imageUrl || '',
      stock: product.stock
    };
  }
};

export const getProductsByCategory = async (category: string) => {
  if (isDatabaseAvailable()) {
    try {
      await connectToDatabase();
      const products = await Product.find({ category });
      // Transform MongoDB documents to match Product type
      return products.map(product => ({
        id: product._id.toString(),
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        imageUrl: product.imageUrl || '',
        stock: product.stock
      }));
    } catch (error) {
      console.error('Failed to connect to MongoDB, using in-memory storage:', error);
      // Transform in-memory products to match Product type
      return inMemoryProducts
        .filter(product => product.category === category)
        .map(product => ({
          id: product._id,
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          imageUrl: product.imageUrl || '',
          stock: product.stock
        }));
    }
  } else {
    // Transform in-memory products to match Product type
    return inMemoryProducts
      .filter(product => product.category === category)
      .map(product => ({
        id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        imageUrl: product.imageUrl || '',
        stock: product.stock
      }));
  }
};

export const addProduct = async (product: Omit<ProductType, 'id'>) => {
  if (isDatabaseAvailable()) {
    try {
      await connectToDatabase();
      const newProduct = new Product(product);
      const savedProduct = await newProduct.save();
      
      // Transform MongoDB document to match Product type
      return {
        id: savedProduct._id.toString(),
        name: savedProduct.name,
        description: savedProduct.description,
        price: savedProduct.price,
        category: savedProduct.category,
        imageUrl: savedProduct.imageUrl || '',
        stock: savedProduct.stock
      };
    } catch (error) {
      console.error('Failed to connect to MongoDB, using in-memory storage:', error);
      const newProduct = { 
        ...product, 
        _id: Date.now().toString(),
        imageUrl: 'image' in product ? (product as unknown as { image: string }).image : product.imageUrl || ''
      } as InMemoryProduct;
      inMemoryProducts.push(newProduct);
      
      // Transform in-memory product to match Product type
      return {
        id: newProduct._id,
        name: newProduct.name,
        description: newProduct.description,
        price: newProduct.price,
        category: newProduct.category,
        imageUrl: newProduct.imageUrl || '',
        stock: newProduct.stock
      };
    }
  } else {
    const newProduct = { 
      ...product, 
      _id: Date.now().toString(),
      imageUrl: 'image' in product ? (product as unknown as { image: string }).image : product.imageUrl || ''
    } as InMemoryProduct;
    inMemoryProducts.push(newProduct);
    
    // Transform in-memory product to match Product type
    return {
      id: newProduct._id,
      name: newProduct.name,
      description: newProduct.description,
      price: newProduct.price,
      category: newProduct.category,
      imageUrl: newProduct.imageUrl || '',
      stock: newProduct.stock
    };
  }
};

export const updateProduct = async (id: string, updates: Partial<ProductType>) => {
  if (isDatabaseAvailable()) {
    try {
      await connectToDatabase();
      const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true });
      if (!updatedProduct) return null;
      
      // Transform MongoDB document to match Product type
      return {
        id: updatedProduct._id.toString(),
        name: updatedProduct.name,
        description: updatedProduct.description,
        price: updatedProduct.price,
        category: updatedProduct.category,
        imageUrl: updatedProduct.imageUrl || '',
        stock: updatedProduct.stock
      };
    } catch (error) {
      console.error('Failed to connect to MongoDB, using in-memory storage:', error);
      const index = inMemoryProducts.findIndex(product => product._id === id);
      if (index !== -1) {
        // Handle the case where updates might contain 'image' instead of 'imageUrl'
        const updateWithImageUrl = { ...updates };
        if ('image' in updates && !updates.imageUrl) {
          (updateWithImageUrl as unknown as { imageUrl: string }).imageUrl = (updates as unknown as { image: string }).image;
          delete (updateWithImageUrl as unknown as { image?: string }).image;
        }
        
        inMemoryProducts[index] = { ...inMemoryProducts[index], ...updateWithImageUrl };
        
        // Transform in-memory product to match Product type
        return {
          id: inMemoryProducts[index]._id,
          name: inMemoryProducts[index].name,
          description: inMemoryProducts[index].description,
          price: inMemoryProducts[index].price,
          category: inMemoryProducts[index].category,
          imageUrl: inMemoryProducts[index].imageUrl || '',
          stock: inMemoryProducts[index].stock
        };
      }
      return null;
    }
  } else {
    const index = inMemoryProducts.findIndex(product => product._id === id);
    if (index !== -1) {
      // Handle the case where updates might contain 'image' instead of 'imageUrl'
      const updateWithImageUrl = { ...updates };
      if ('image' in updates && !updates.imageUrl) {
        (updateWithImageUrl as unknown as { imageUrl: string }).imageUrl = (updates as unknown as { image: string }).image;
        delete (updateWithImageUrl as unknown as { image?: string }).image;
      }
      
      inMemoryProducts[index] = { ...inMemoryProducts[index], ...updateWithImageUrl };
      
      // Transform in-memory product to match Product type
      return {
        id: inMemoryProducts[index]._id,
        name: inMemoryProducts[index].name,
        description: inMemoryProducts[index].description,
        price: inMemoryProducts[index].price,
        category: inMemoryProducts[index].category,
        imageUrl: inMemoryProducts[index].imageUrl || '',
        stock: inMemoryProducts[index].stock
      };
    }
    return null;
  }
};

export const deleteProduct = async (id: string) => {
  if (isDatabaseAvailable()) {
    try {
      await connectToDatabase();
      const deletedProduct = await Product.findByIdAndDelete(id);
      if (!deletedProduct) return null;
      
      // Transform MongoDB document to match Product type
      return {
        id: deletedProduct._id.toString(),
        name: deletedProduct.name,
        description: deletedProduct.description,
        price: deletedProduct.price,
        category: deletedProduct.category,
        imageUrl: deletedProduct.imageUrl || '',
        stock: deletedProduct.stock
      };
    } catch (error) {
      console.error('Failed to connect to MongoDB, using in-memory storage:', error);
      const index = inMemoryProducts.findIndex(product => product._id === id);
      if (index !== -1) {
        const deletedProduct = inMemoryProducts.splice(index, 1);
        
        // Transform in-memory product to match Product type
        return {
          id: deletedProduct[0]._id,
          name: deletedProduct[0].name,
          description: deletedProduct[0].description,
          price: deletedProduct[0].price,
          category: deletedProduct[0].category,
          imageUrl: deletedProduct[0].imageUrl || '',
          stock: deletedProduct[0].stock
        };
      }
      return null;
    }
  } else {
    const index = inMemoryProducts.findIndex(product => product._id === id);
    if (index !== -1) {
      const deletedProduct = inMemoryProducts.splice(index, 1);
      
      // Transform in-memory product to match Product type
      return {
        id: deletedProduct[0]._id,
        name: deletedProduct[0].name,
        description: deletedProduct[0].description,
        price: deletedProduct[0].price,
        category: deletedProduct[0].category,
        imageUrl: deletedProduct[0].imageUrl || '',
        stock: deletedProduct[0].stock
      };
    }
    return null;
  }
};

// Order functions
export const getOrders = async () => {
  if (isDatabaseAvailable()) {
    try {
      await connectToDatabase();
      return await Order.find({});
    } catch (error) {
      console.error('Failed to connect to MongoDB, using in-memory storage:', error);
      return inMemoryOrders;
    }
  } else {
    return inMemoryOrders;
  }
};

export const getOrderById = async (id: string) => {
  if (isDatabaseAvailable()) {
    try {
      await connectToDatabase();
      return await Order.findById(id);
    } catch (error) {
      console.error('Failed to connect to MongoDB, using in-memory storage:', error);
      return inMemoryOrders.find(order => order._id === id);
    }
  } else {
    return inMemoryOrders.find(order => order._id === id);
  }
};

export const createOrder = async (order: Partial<IOrder>) => {
  if (isDatabaseAvailable()) {
    try {
      await connectToDatabase();
      const newOrder = new Order(order);
      return await newOrder.save();
    } catch (error) {
      console.error('Failed to connect to MongoDB, using in-memory storage:', error);
      const newOrder = { ...order, _id: Date.now().toString() };
      inMemoryOrders.push(newOrder);
      return newOrder;
    }
  } else {
    const newOrder = { ...order, _id: Date.now().toString() };
    inMemoryOrders.push(newOrder);
    return newOrder;
  }
};

export const deleteOrder = async (id: string) => {
  if (isDatabaseAvailable()) {
    try {
      await connectToDatabase();
      return await Order.findByIdAndDelete(id);
    } catch (error) {
      console.error('Failed to connect to MongoDB, using in-memory storage:', error);
      const index = inMemoryOrders.findIndex(order => order._id === id);
      if (index !== -1) {
        const deletedOrder = inMemoryOrders.splice(index, 1);
        return deletedOrder[0];
      }
      return null;
    }
  } else {
    const index = inMemoryOrders.findIndex(order => order._id === id);
    if (index !== -1) {
      const deletedOrder = inMemoryOrders.splice(index, 1);
      return deletedOrder[0];
    }
    return null;
  }
};

// User functions
export const getUsers = async () => {
  if (isDatabaseAvailable()) {
    try {
      await connectToDatabase();
      return await User.find({});
    } catch (error) {
      console.error('Failed to connect to MongoDB, using in-memory storage:', error);
      return inMemoryUsers;
    }
  } else {
    return inMemoryUsers;
  }
};

export const getUserByEmail = async (email: string) => {
  if (isDatabaseAvailable()) {
    try {
      await connectToDatabase();
      return await User.findOne({ email });
    } catch (error) {
      console.error('Failed to connect to MongoDB, using in-memory storage:', error);
      return inMemoryUsers.find(user => user.email === email);
    }
  } else {
    return inMemoryUsers.find(user => user.email === email);
  }
};

export const getUserById = async (id: string) => {
  if (isDatabaseAvailable()) {
    try {
      await connectToDatabase();
      return await User.findById(id);
    } catch (error) {
      console.error('Failed to connect to MongoDB, using in-memory storage:', error);
      return inMemoryUsers.find(user => user._id === id);
    }
  } else {
    return inMemoryUsers.find(user => user._id === id);
  }
};

export const createUser = async (userData: Partial<IUser>) => {
  if (isDatabaseAvailable()) {
    try {
      await connectToDatabase();
      const newUser = new User(userData);
      return await newUser.save();
    } catch (error) {
      console.error('Failed to connect to MongoDB, using in-memory storage:', error);
      const newUser = { ...userData, _id: Date.now().toString(), toObject: function() { return this; } };
      inMemoryUsers.push(newUser);
      return newUser;
    }
  } else {
    const newUser = { ...userData, _id: Date.now().toString(), toObject: function() { return this; } };
    inMemoryUsers.push(newUser);
    return newUser;
  }
};

export const deleteUser = async (id: string) => {
  if (isDatabaseAvailable()) {
    try {
      await connectToDatabase();
      return await User.findByIdAndDelete(id);
    } catch (error) {
      console.error('Failed to connect to MongoDB, using in-memory storage:', error);
      const index = inMemoryUsers.findIndex(user => user._id === id);
      if (index !== -1) {
        const deletedUser = inMemoryUsers.splice(index, 1);
        return deletedUser[0];
      }
      return null;
    }
  } else {
    const index = inMemoryUsers.findIndex(user => user._id === id);
    if (index !== -1) {
      const deletedUser = inMemoryUsers.splice(index, 1);
      return deletedUser[0];
    }
    return null;
  }
};