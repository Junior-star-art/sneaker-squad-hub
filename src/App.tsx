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
import Blog from "@/pages/Blog";
import StyleGuide from "@/pages/StyleGuide";
import Sustainability from "@/pages/Sustainability";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Toaster } from "@/components/ui/toaster";

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
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/style-guide" element={<StyleGuide />} />
                  <Route path="/sustainability" element={<Sustainability />} />
                  <Route 
                    path="/order/success" 
                    element={
                      <ProtectedRoute>
                        <OrderSuccess />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/orders" 
                    element={
                      <ProtectedRoute>
                        <OrderHistory />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/wishlist" 
                    element={
                      <ProtectedRoute>
                        <WishlistPage />
                      </ProtectedRoute>
                    } 
                  />
                </Routes>
                <SearchOverlay 
                  open={isSearchOpen} 
                  onOpenChange={setIsSearchOpen}
                />
                <Toaster />
              </RecentlyViewedProvider>
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;