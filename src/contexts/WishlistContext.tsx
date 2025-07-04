import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  loading: boolean;
}

interface WishlistItem {
  id: string;
  product_id: string;
  user_id: string;
  created_at: string;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchWishlistItems();
    } else {
      setWishlistItems([]);
      setLoading(false);
    }
  }, [user]);

  const fetchWishlistItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('wishlist_items')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setWishlistItems(data || []);
    } catch (error: any) {
      console.error('Error fetching wishlist:', error);
      toast({
        title: "Error fetching wishlist",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add items to your wishlist",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from('wishlist_items')
        .insert([{ 
          product_id: productId,
          user_id: user.id 
        }]);

      if (error) throw error;

      await fetchWishlistItems();
      
      toast({
        title: "Added to wishlist",
        description: "Item has been added to your wishlist",
      });
    } catch (error: any) {
      console.error('Error adding to wishlist:', error);
      toast({
        title: "Error adding to wishlist",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('product_id', productId)
        .eq('user_id', user.id);

      if (error) throw error;

      await fetchWishlistItems();
      
      toast({
        title: "Removed from wishlist",
        description: "Item has been removed from your wishlist",
      });
    } catch (error: any) {
      console.error('Error removing from wishlist:', error);
      toast({
        title: "Error removing from wishlist",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.product_id === productId);
  };

  return (
    <WishlistContext.Provider 
      value={{ 
        wishlistItems, 
        addToWishlist, 
        removeFromWishlist, 
        isInWishlist,
        loading 
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};