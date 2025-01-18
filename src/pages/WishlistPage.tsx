import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { ProductCard } from "@/components/product/ProductCard";
import { Heart } from "lucide-react";
import { Database } from "@/integrations/supabase/types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type Product = Database['public']['Tables']['products']['Row'];

export default function WishlistPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { wishlistItems } = useWishlist();

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  const { data: wishlistProducts, isLoading } = useQuery({
    queryKey: ['wishlist-products', wishlistItems],
    queryFn: async () => {
      if (!wishlistItems.length) return [];
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(name)
        `)
        .in('id', wishlistItems.map(item => item.product_id));

      if (error) throw error;
      return data || [];
    },
    enabled: !!wishlistItems.length,
  });

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="flex items-center gap-2 mb-8">
        <Heart className="w-6 h-6" />
        <h1 className="text-2xl font-bold">My Wishlist</h1>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p>Loading wishlist...</p>
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
  );
}