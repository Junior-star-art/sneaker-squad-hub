import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { RecentlyViewedProvider } from "@/contexts/RecentlyViewedContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Index from "@/pages/Index";
import OrderSuccess from "@/pages/OrderSuccess";
import OrderHistory from "@/pages/OrderHistory";
import WishlistPage from "@/pages/WishlistPage";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient();

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <RecentlyViewedProvider>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/order/success" element={<OrderSuccess />} />
                  <Route path="/orders" element={<OrderHistory />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                </Routes>
                <SearchOverlay 
                  open={isSearchOpen} 
                  onOpenChange={setIsSearchOpen}
                />
              </RecentlyViewedProvider>
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;