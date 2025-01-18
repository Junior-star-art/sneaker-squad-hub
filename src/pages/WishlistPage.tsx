import { Navbar } from "@/components/Navbar";
import { useWishlist } from "@/contexts/WishlistContext";
import { Product } from "@/types/product";
import { ProductCard } from "@/components/product/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export default function WishlistPage() {
  const { wishlistItems } = useWishlist();

  const { data: products, isLoading } = useQuery({
    queryKey: ['wishlist-products', wishlistItems],
    queryFn: async () => {
      if (!wishlistItems.length) return [];
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category (
            id,
            name,
            slug,
            description
          )
        `)
        .in('id', wishlistItems.map(item => item.product_id));
      
      if (error) throw error;
      return data as Product[];
    },
    enabled: wishlistItems.length > 0
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white h-96 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
        {!products?.length ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Your wishlist is empty</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product}
                onQuickView={() => {}} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}