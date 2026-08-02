'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  title: string;
  original_price: number;
  tasharok_price: number;
  target_quantity: number;
  current_reserved_quantity: number;
  image_url: string;
  store_name?: string;
  item_type?: 'product' | 'service';
  service_duration_minutes?: number;
  service_location_type?: string;
  quantity: number;
  payment_method?: 'full_payment' | 'deposit' | 'cash_on_delivery';
  is_direct_buy?: boolean;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Omit<CartItem, 'quantity' | 'is_direct_buy'>, qty?: number, isDirectBuy?: boolean) => void;
  removeFromCart: (productId: string, isDirectBuy?: boolean) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalOriginalPrice: number;
  totalTasharokPrice: number;
  totalSavings: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('tasharok_cart');
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch {
        // Fallback
      }
    }
  }, []);

  const saveCart = (items: CartItem[]) => {
    setCart(items);
    localStorage.setItem('tasharok_cart', JSON.stringify(items));
  };

  const addToCart = (product: Omit<CartItem, 'quantity' | 'is_direct_buy'>, qty: number = 1, isDirectBuy: boolean = false) => {
    const existingIndex = cart.findIndex((item) => item.id === product.id && !!item.is_direct_buy === isDirectBuy);
    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += qty;
      saveCart(updated);
    } else {
      saveCart([...cart, { ...product, quantity: qty, is_direct_buy: isDirectBuy }]);
    }
  };

  const removeFromCart = (productId: string, isDirectBuy: boolean = false) => {
    const updated = cart.filter((item) => !(item.id === productId && !!item.is_direct_buy === isDirectBuy));
    saveCart(updated);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const updated = cart.map((item) => (item.id === productId ? { ...item, quantity } : item));
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const totalOriginalPrice = cart.reduce((acc, item) => acc + item.original_price * item.quantity, 0);
  const totalTasharokPrice = cart.reduce((acc, item) => acc + (item.is_direct_buy ? item.original_price : item.tasharok_price) * item.quantity, 0);
  const totalSavings = totalOriginalPrice - totalTasharokPrice;
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalOriginalPrice,
        totalTasharokPrice,
        totalSavings,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
