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

type SavedCartItemResponse = {
  product_id: string;
  size: string | null;
  quantity: number;
  products: {
    id: string;
    name: string;
    price: number;
    images: string[];
  };
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'shopping-cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [savedItems, setSavedItems] = useState<CartItem[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load cart data on mount and when user changes
  useEffect(() => {
    loadCartData();
  }, [user]);

  // Sync cart data with backend whenever it changes
  useEffect(() => {
    if (user) {
      syncCartWithBackend();
    }
  }, [items, user]);

  const loadCartData = async () => {
    if (user) {
      // Load from Supabase for authenticated users
      try {
        const { data, error } = await supabase
          .from('saved_cart_items')
          .select(`
            product_id,
            size,
            quantity,
            products (
              id,
              name,
              price,
              images
            )
          `)
          .eq('user_id', user.id);

        if (error) throw error;

        if (data) {
          const formattedItems = (data as SavedCartItemResponse[]).map(item => ({
            id: item.products.id,
            name: item.products.name,
            price: item.products.price,
            image: item.products.images[0] || '/placeholder.svg',
            quantity: item.quantity,
            size: item.size || undefined
          }));

          setItems(formattedItems);
        }
      } catch (error) {
        console.error('Error loading cart items:', error);
        toast({
          title: "Error",
          description: "Failed to load your cart. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      // Load from localStorage for non-authenticated users
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        try {
          const { items: storedItems, savedItems: storedSavedItems } = JSON.parse(storedCart);
          setItems(storedItems || []);
          setSavedItems(storedSavedItems || []);
        } catch (error) {
          console.error('Error parsing stored cart:', error);
        }
      }
    }
  };

  const syncCartWithBackend = async () => {
    if (!user) return;

    try {
      // First, delete all existing items for this user
      await supabase
        .from('saved_cart_items')
        .delete()
        .eq('user_id', user.id);

      // Then insert all current items
      const cartItems = items.map(item => ({
        user_id: user.id,
        product_id: item.id,
        quantity: item.quantity,
        size: item.size
      }));

      if (cartItems.length > 0) {
        const { error } = await supabase
          .from('saved_cart_items')
          .insert(cartItems);

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error syncing cart:', error);
    }
  };

  // Persist cart data whenever it changes
  useEffect(() => {
    if (!user) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ items, savedItems }));
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

    try {
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
        total,
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
