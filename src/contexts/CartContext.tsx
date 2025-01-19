import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
};

type CartContextType = {
  items: CartItem[];
  savedItems: CartItem[];
  addItem: (product: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  saveForLater: (id: string) => Promise<void>;
  moveToCart: (id: string) => Promise<void>;
  removeSavedItem: (id: string) => Promise<void>;
  total: string;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [savedItems, setSavedItems] = useState<CartItem[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadSavedItems();
    } else {
      setSavedItems([]);
    }
  }, [user]);

  const loadSavedItems = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('saved_cart_items')
        .select(`
          *,
          product:products(
            id,
            name,
            price,
            images
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const formattedItems = data.map(item => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        image: item.product.images?.[0] || '/placeholder.svg',
        quantity: 1,
        size: item.size
      }));

      setSavedItems(formattedItems);
    } catch (error) {
      console.error('Error loading saved items:', error);
      toast({
        title: "Error",
        description: "Failed to load saved items",
        variant: "destructive",
      });
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

    try {
      const { error } = await supabase
        .from('saved_cart_items')
        .insert({
          user_id: user.id,
          product_id: id,
          size: itemToSave.size
        });

      if (error) {
        if (error.code === '23505') { // Unique violation
          toast({
            title: "Already Saved",
            description: "This item is already in your saved items",
          });
          return;
        }
        throw error;
      }

      setSavedItems((current) => [...current, itemToSave]);
      removeItem(id);
      
      toast({
        title: "Saved for Later",
        description: "Item has been saved to your list",
      });
    } catch (error) {
      console.error('Error saving item:', error);
      toast({
        title: "Error",
        description: "Failed to save item for later",
        variant: "destructive",
      });
    }
  };

  const moveToCart = async (id: string) => {
    const itemToMove = savedItems.find((item) => item.id === id);
    if (!itemToMove) return;

    try {
      const { error } = await supabase
        .from('saved_cart_items')
        .delete()
        .eq('user_id', user?.id)
        .eq('product_id', id);

      if (error) throw error;

      addItem(itemToMove);
      setSavedItems((current) => current.filter((item) => item.id !== id));
      
      toast({
        title: "Moved to Cart",
        description: "Item has been moved to your cart",
      });
    } catch (error) {
      console.error('Error moving item to cart:', error);
      toast({
        title: "Error",
        description: "Failed to move item to cart",
        variant: "destructive",
      });
    }
  };

  const removeSavedItem = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('saved_cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', id);

      if (error) throw error;

      setSavedItems((current) => current.filter((item) => item.id !== id));
      
      toast({
        title: "Removed",
        description: "Item has been removed from your saved list",
      });
    } catch (error) {
      console.error('Error removing saved item:', error);
      toast({
        title: "Error",
        description: "Failed to remove saved item",
        variant: "destructive",
      });
    }
  };

  const total = items
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
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