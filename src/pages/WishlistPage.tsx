import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { ProductCard } from "@/components/product/ProductCard";
import { Heart } from "lucide-react";
import { Database } from "@/integrations/supabase/types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type Product = Database['public']['Tables']['products']['Row'] & {
  category?: {
    name: string;
  };
};

export default function WishlistPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
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
      return data as Product[];
    },
    enabled: !!wishlistItems.length,
  });

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="mb-8">
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
          <p className="text-gray-500">
            Add items to your wishlist by clicking the heart icon on products you love
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}
    </div>
  );
}