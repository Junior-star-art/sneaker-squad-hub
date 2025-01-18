import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { ProductCard } from "@/components/product/ProductCard";
import { Heart } from "lucide-react";
import { Database } from "@/integrations/supabase/types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { useState } from "react";
import CartDrawer from "@/components/CartDrawer";

type Product = Database['public']['Tables']['products']['Row'];

export default function WishlistPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { wishlistItems, loading: wishlistLoading } = useWishlist();
  const [cartOpen, setCartOpen] = useState(false);

  // Only redirect if we're sure there's no user and we're not still loading
  useEffect(() => {
    if (user === null) {
      navigate("/");
    }
  }, [user, navigate]);

  const { data: wishlistProducts, isLoading: productsLoading } = useQuery({
    queryKey: ['wishlist-products', wishlistItems],
    queryFn: async () => {
      if (!wishlistItems?.length) return [];
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(name)
        `)
        .in('id', wishlistItems.map(item => item.product_id));

      if (error) {
        console.error('Error fetching wishlist products:', error);
        return [];
      }
      
      return data || [];
    },
    enabled: Boolean(user) && !wishlistLoading && Array.isArray(wishlistItems),
  });

  // Show loading state while checking authentication
  if (user === undefined) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar onCartClick={() => setCartOpen(true)} />
        <div className="container mx-auto px-4 py-24">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
        <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
      </div>
    );
  }

  // Redirect if no user
  if (!user) return null;

  const isLoading = wishlistLoading || productsLoading;

  return (
    <div className="min-h-screen bg-white">
      <Navbar onCartClick={() => setCartOpen(true)} />
      <div className="container mx-auto px-4 py-24">
        <div className="flex items-center gap-2 mb-8">
          <Heart className="w-6 h-6" />
          <h1 className="text-2xl font-bold">My Wishlist</h1>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading wishlist...</p>
          </div>
        ) : !wishlistProducts?.length ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-4">
              Add items to your wishlist by clicking the heart icon on products you love.
            </p>
            <button
              onClick={() => navigate("/")}
              className="text-nike-red hover:underline"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product}
                onQuickView={() => {}} 
              />
            ))}
          </div>
        )}
      </div>
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </div>
  );
}