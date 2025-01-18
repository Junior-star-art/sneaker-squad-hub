import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ProductCard } from "@/components/product/ProductCard";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const WishlistPage = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to view your wishlist",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [user, authLoading, navigate, toast]);

  const { data: wishlistItems, isLoading: wishlistLoading } = useQuery({
    queryKey: ["wishlist", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data: items, error } = await supabase
        .from("wishlist_items")
        .select(`
          product_id,
          products (
            id,
            name,
            description,
            price,
            images,
            stock
          )
        `)
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching wishlist:", error);
        throw error;
      }

      return items;
    },
    enabled: !!user,
    meta: {
      onError: (error: Error) => {
        toast({
          title: "Error loading wishlist",
          description: "There was a problem loading your wishlist. Please try again later.",
          variant: "destructive",
        });
      }
    }
  });

  if (authLoading || wishlistLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null; // Will be redirected by useEffect
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
        
        {wishlistItems?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">Your wishlist is empty</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {wishlistItems?.map((item) => (
              item.products && (
                <ProductCard
                  key={item.product_id}
                  product={{
                    id: item.products.id,
                    name: item.products.name,
                    description: item.products.description || "",
                    price: item.products.price,
                    images: item.products.images || [],
                    stock: item.products.stock || 0,
                  }}
                />
              )
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default WishlistPage;