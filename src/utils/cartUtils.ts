
import { supabase } from "@/integrations/supabase/client";
import { CartItem, SavedCartItemResponse } from "@/types/cart";

const CART_STORAGE_KEY = 'shopping-cart';

export const loadCartFromStorage = () => {
  const storedCart = localStorage.getItem(CART_STORAGE_KEY);
  if (storedCart) {
    try {
      return JSON.parse(storedCart);
    } catch (error) {
      console.error('Error parsing stored cart:', error);
      return { items: [], savedItems: [] };
    }
  }
  return { items: [], savedItems: [] };
};

export const saveCartToStorage = (items: CartItem[], savedItems: CartItem[]) => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ items, savedItems }));
};

export const loadCartFromSupabase = async (userId: string) => {
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
    .eq('user_id', userId);

  if (error) throw error;

  if (data) {
    return (data as unknown as SavedCartItemResponse[]).map(item => ({
      id: item.products.id,
      name: item.products.name,
      price: item.products.price,
      image: item.products.images[0] || '/placeholder.svg',
      quantity: item.quantity,
      size: item.size || undefined
    }));
  }

  return [];
};

export const syncCartWithSupabase = async (userId: string, items: CartItem[]) => {
  // First, delete all existing items for this user
  await supabase
    .from('saved_cart_items')
    .delete()
    .eq('user_id', userId);

  // Then insert all current items
  const cartItems = items.map(item => ({
    user_id: userId,
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
};

export const calculateTotal = (items: CartItem[]) => {
  return items
    .reduce((sum, item) => {
      // Ensure price is treated as a number
      const price = typeof item.price === 'string' 
        ? parseFloat(item.price.replace(/[^0-9.-]+/g, '')) 
        : item.price;
      
      return sum + (price * item.quantity);
    }, 0)
    .toLocaleString("en-US", { style: "currency", currency: "USD" });
};
