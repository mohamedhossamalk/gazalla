'use client';

import React, { createContext, useContext, useReducer, ReactNode, useEffect, useState, useCallback } from 'react';
import { CartItem } from '@/types/product';

type CartAction =
  | { type: 'ADD_ITEM'; item: CartItem }
  | { type: 'REMOVE_ITEM'; id: string }
  | { type: 'UPDATE_QUANTITY'; id: string; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_CART'; cart: CartItem[] };

interface CartContextType {
  cart: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  refreshCart: () => void; // Add refresh function to the context type
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartItem[], action: CartAction): CartItem[] => {
  switch (action.type) {
    case 'ADD_ITEM':
      // Ensure the item has a valid ID
      if (!action.item.id) {
        console.warn('Cart item missing ID:', action.item);
        return state;
      }
      
      const existingItem = state.find(item => item.id === action.item.id);
      if (existingItem) {
        return state.map(item =>
          item.id === action.item.id
            ? { ...item, quantity: item.quantity + action.item.quantity }
            : item
        );
      }
      return [...state, action.item];
    
    case 'REMOVE_ITEM':
      return state.filter(item => item.id !== action.id);
    
    case 'UPDATE_QUANTITY':
      return state.map(item =>
        item.id === action.id
          ? { ...item, quantity: action.quantity > 0 ? action.quantity : 0 }
          : item
      ).filter(item => item.quantity > 0);
    
    case 'CLEAR_CART':
      return [];
    
    case 'SET_CART':
      return action.cart;
    
    default:
      return state;
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [mounted, setMounted] = useState(false);
  const [cart, dispatch] = useReducer(cartReducer, []);

  // Function to manually refresh cart from localStorage
  const refreshCart = useCallback(() => {
    if (typeof window !== 'undefined' && mounted) {
      // Check if user is logged in
      const userData = localStorage.getItem('user');
      let userId = 'guest';
      
      if (userData) {
        try {
          const user = JSON.parse(userData);
          userId = user.id || user.email || 'guest';
        } catch (e) {
          console.error('Failed to parse user data', e);
          return;
        }
      }
      
      // Load cart for this user
      const cartKey = `cart_${userId}`;
      const savedCart = localStorage.getItem(cartKey);
      
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          // Validate that all items have IDs
          const validCart = parsedCart.filter((item: CartItem) => {
            if (!item.id) {
              console.warn('Found cart item without ID:', item);
              return false;
            }
            return true;
          });
          
          // Only update if the cart content has actually changed
          const currentCartString = JSON.stringify(cart);
          const newCartString = JSON.stringify(validCart);
          
          if (currentCartString !== newCartString) {
            dispatch({ type: 'SET_CART', cart: validCart });
          }
        } catch (e) {
          console.error('Failed to parse cart from localStorage during manual refresh', e);
        }
      }
    }
  }, [cart, mounted]);

  // Initialize cart based on user login status
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      // Check if user is logged in
      const userData = localStorage.getItem('user');
      let userId = 'guest';
      
      if (userData) {
        try {
          const user = JSON.parse(userData);
          userId = user.id || user.email || 'guest';
        } catch (e) {
          console.error('Failed to parse user data', e);
        }
      }
      
      // Load cart for this user
      const cartKey = `cart_${userId}`;
      const savedCart = localStorage.getItem(cartKey);
      
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          // Validate that all items have IDs
          const validCart = parsedCart.filter((item: CartItem) => {
            if (!item.id) {
              console.warn('Found cart item without ID:', item);
              return false;
            }
            return true;
          });
          
          if (validCart.length !== parsedCart.length) {
            // Save the cleaned cart back to localStorage
            localStorage.setItem(cartKey, JSON.stringify(validCart));
          }
          
          dispatch({ type: 'SET_CART', cart: validCart });
        } catch (e) {
          console.error('Failed to parse cart from localStorage', e);
        }
      }
    }
  }, []);

  // Auto-refresh cart from localStorage at regular intervals
  useEffect(() => {
    if (typeof window !== 'undefined' && mounted) {
      // Check if user is logged in
      const userData = localStorage.getItem('user');
      let userId = 'guest';
      
      if (userData) {
        try {
          const user = JSON.parse(userData);
          userId = user.id || user.email || 'guest';
        } catch (e) {
          console.error('Failed to parse user data', e);
        }
      }
      
      // Set up interval to refresh cart data
      const cartKey = `cart_${userId}`;
      const intervalId = setInterval(() => {
        const savedCart = localStorage.getItem(cartKey);
        
        if (savedCart) {
          try {
            const parsedCart = JSON.parse(savedCart);
            // Validate that all items have IDs
            const validCart = parsedCart.filter((item: CartItem) => {
              if (!item.id) {
                console.warn('Found cart item without ID:', item);
                return false;
              }
              return true;
            });
            
            // Only update if the cart content has actually changed
            const currentCartString = JSON.stringify(cart);
            const newCartString = JSON.stringify(validCart);
            
            if (currentCartString !== newCartString) {
              dispatch({ type: 'SET_CART', cart: validCart });
            }
          } catch (e) {
            console.error('Failed to parse cart from localStorage during auto-refresh', e);
          }
        }
      }, 5000); // Refresh every 5 seconds
      
      // Clean up interval on component unmount
      return () => clearInterval(intervalId);
    }
  }, [cart, mounted]);

  // Save cart to localStorage whenever it changes, but only after mounting
  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      // Check if user is logged in
      const userData = localStorage.getItem('user');
      let userId = 'guest';
      
      if (userData) {
        try {
          const user = JSON.parse(userData);
          userId = user.id || user.email || 'guest';
        } catch (e) {
          console.error('Failed to parse user data', e);
        }
      }
      
      // Save cart for this user
      const cartKey = `cart_${userId}`;
      
      // Ensure all items in cart have IDs before saving
      const validCart = cart.filter(item => {
        if (!item.id) {
          console.warn('Found cart item without ID:', item);
          return false;
        }
        return true;
      });
      
      if (validCart.length !== cart.length) {
        // Update state with valid items only
        dispatch({ type: 'CLEAR_CART' });
        validCart.forEach(item => {
          dispatch({ type: 'ADD_ITEM', item });
        });
      } else {
        localStorage.setItem(cartKey, JSON.stringify(cart));
      }
    }
  }, [cart, mounted]);

  const addItem = (item: CartItem) => {
    // Validate item has ID before adding
    if (!item.id) {
      console.error('Cannot add item to cart without ID:', item);
      return;
    }
    dispatch({ type: 'ADD_ITEM', item });
  };

  const removeItem = (id: string) => {
    if (!id) {
      console.error('Cannot remove item from cart without ID');
      return;
    }
    dispatch({ type: 'REMOVE_ITEM', id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (!id) {
      console.error('Cannot update item quantity without ID');
      return;
    }
    dispatch({ type: 'UPDATE_QUANTITY', id, quantity });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        refreshCart, // Add refresh function to the provider value
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};