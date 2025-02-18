
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { CartItem, CartContextType } from "@/types/cart";
import {
  loadCartFromStorage,
  saveCartToStorage,
  loadCartFromSupabase,
  syncCartWithSupabase,
  calculateTotal
} from "@/utils/cartUtils";

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [savedItems, setSavedItems] = useState<CartItem[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load cart data on mount and when user changes
  useEffect(() => {
    const loadCartData = async () => {
      if (user) {
        try {
          const cartItems = await loadCartFromSupabase(user.id);
          setItems(cartItems);
        } catch (error) {
          console.error('Error loading cart items:', error);
          toast({
            title: "Error",
            description: "Failed to load your cart. Please try again.",
            variant: "destructive",
          });
        }
      } else {
        const { items: storedItems, savedItems: storedSavedItems } = loadCartFromStorage();
        setItems(storedItems);
        setSavedItems(storedSavedItems);
      }
    };

    loadCartData();
  }, [user, toast]);

  // Sync cart data with backend whenever it changes
  useEffect(() => {
    if (user) {
      syncCartWithSupabase(user.id, items).catch(error => {
        console.error('Error syncing cart:', error);
      });
    }
  }, [items, user]);

  // Persist cart data to localStorage for non-authenticated users
  useEffect(() => {
    if (!user) {
      saveCartToStorage(items, savedItems);
    }
  }, [items, savedItems, user]);

  const addItem = (product: Omit<CartItem, "quantity">) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => 
        item.id === product.id && item.size === product.size
      );

      const newItems = existingItem
        ? currentItems.map((item) =>
            item.id === product.id && item.size === product.size
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...currentItems, { ...product, quantity: 1 }];

      return newItems;
    });

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const removeItem = (id: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== id)
    );
  };

  const updateQuantity = (id: string, quantity: number) => {
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

  const saveForLater = async (id: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save items for later",
        variant: "destructive",
      });
      return;
    }

    const itemToSave = items.find((item) => item.id === id);
    if (!itemToSave) return;

    setSavedItems((current) => [...current, itemToSave]);
    removeItem(id);
    
    toast({
      title: "Saved for Later",
      description: "Item has been saved to your list",
    });
  };

  const moveToCart = async (id: string) => {
    const itemToMove = savedItems.find((item) => item.id === id);
    if (!itemToMove) return;

    addItem(itemToMove);
    setSavedItems((current) => current.filter((item) => item.id !== id));
    
    toast({
      title: "Moved to Cart",
      description: "Item has been moved to your cart",
    });
  };

  const removeSavedItem = async (id: string) => {
    setSavedItems((current) => current.filter((item) => item.id !== id));
    
    toast({
      title: "Removed",
      description: "Item has been removed from your saved list",
    });
  };

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
        total: calculateTotal(items),
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
