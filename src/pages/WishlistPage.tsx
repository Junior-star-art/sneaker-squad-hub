import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const WishlistPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Redirect if not authenticated
  if (!user) {
    navigate("/");
    return null;
  }

  const { data: wishlistItems, isLoading: wishlistLoading } = useQuery({
    queryKey: ["wishlist", user?.id],
    queryFn: async () => {
      const { data: items, error } = await supabase
        .from("wishlist_items")
        .select("*, product:products(*)");
      
      if (error) {
        console.error("Error fetching wishlist:", error);
        throw error;
      }
      
      return items;
    },
    enabled: !!user,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar onCartClick={() => setIsCartOpen(true)} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
        
        {wishlistLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : !wishlistItems?.length ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">Your wishlist is empty</p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item: any) => (
              <div
                key={item.id}
                className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <img
                  src={item.product.images?.[0] || "/placeholder.svg"}
                  alt={item.product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{item.product.name}</h3>
                  <p className="text-gray-600 mt-1">
                    ${item.product.price.toFixed(2)}
                  </p>
                  <button
                    onClick={() => navigate("/")}
                    className="mt-4 w-full bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
                  >
                    View Product
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      
      <CartDrawer open={isCartOpen} onOpenChange={setIsCartOpen} />
    </div>
  );
};

export default WishlistPage;