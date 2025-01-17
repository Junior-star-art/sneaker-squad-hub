import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "@/lib/supabase";

type CartItem = {
  id: string;
  name: string;
  price: string;
  image: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  savedItems: CartItem[];
  addItem: (product: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  saveForLater: (id: string) => void;
  moveToCart: (id: string) => void;
  removeSavedItem: (id: string) => void;
  total: string;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [savedItems, setSavedItems] = useState<CartItem[]>([]);
  const { user } = useAuth();

  // Load cart items when user changes
  useEffect(() => {
    if (user) {
      loadUserCart();
    } else {
      // Clear cart when user logs out
      setItems([]);
      setSavedItems([]);
    }
  }, [user]);

  const loadUserCart = async () => {
    if (!user) return;

    try {
      const { data: cartData, error: cartError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('saved_for_later', false);

      const { data: savedData, error: savedError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('saved_for_later', true);

      if (cartError) throw cartError;
      if (savedError) throw savedError;

      setItems(cartData || []);
      setSavedItems(savedData || []);
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const addItem = (product: Omit<CartItem, "quantity">) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);
      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...currentItems, { ...product, quantity: 1 }];
    });
  };

  const removeItem = (id: string) => { // Changed from number to string
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== id)
    );
  };

  const updateQuantity = (id: string, quantity: number) => { // Changed from number to string
    if (quantity === 0) {
      removeItem(id);
      return;
    }
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const saveForLater = (id: string) => { // Changed from number to string
    const itemToSave = items.find((item) => item.id === id);
    if (itemToSave) {
      setSavedItems((current) => [...current, itemToSave]);
      removeItem(id);
    }
  };

  const moveToCart = (id: string) => { // Changed from number to string
    const itemToMove = savedItems.find((item) => item.id === id);
    if (itemToMove) {
      addItem(itemToMove);
      removeSavedItem(id);
    }
  };

  const removeSavedItem = (id: string) => { // Changed from number to string
    setSavedItems((current) => current.filter((item) => item.id !== id));
  };

  const total = items
    .reduce((sum, item) => {
      const price = parseFloat(item.price.replace("$", ""));
      return sum + price * item.quantity;
    }, 0)
    .toLocaleString("en-US", { style: "currency", currency: "USD" });

  return (
    <CartContext.Provider
      value={{ 
        items, 
        savedItems, 
        addItem, 
        removeItem, 
        updateQuantity, 
        saveForLater, 
        moveToCart, 
        removeSavedItem, 
        total 
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
