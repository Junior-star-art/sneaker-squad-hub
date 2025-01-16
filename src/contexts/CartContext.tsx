import React, { createContext, useContext, useState } from "react";

type CartItem = {
  id: number;
  name: string;
  price: string;
  image: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  savedItems: CartItem[];
  addItem: (product: Omit<CartItem, "quantity">) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  saveForLater: (id: number) => void;
  moveToCart: (id: number) => void;
  removeSavedItem: (id: number) => void;
  total: string;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [savedItems, setSavedItems] = useState<CartItem[]>([]);

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

  const removeItem = (id: number) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== id)
    );
  };

  const updateQuantity = (id: number, quantity: number) => {
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

  const saveForLater = (id: number) => {
    const itemToSave = items.find((item) => item.id === id);
    if (itemToSave) {
      setSavedItems((current) => [...current, itemToSave]);
      removeItem(id);
    }
  };

  const moveToCart = (id: number) => {
    const itemToMove = savedItems.find((item) => item.id === id);
    if (itemToMove) {
      addItem(itemToMove);
      removeSavedItem(id);
    }
  };

  const removeSavedItem = (id: number) => {
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