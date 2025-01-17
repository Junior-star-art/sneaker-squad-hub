import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { RecentlyViewedProvider } from "@/contexts/RecentlyViewedContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Index from "@/pages/Index";
import { SearchOverlay } from "@/components/search/SearchOverlay";

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <RecentlyViewedProvider>
            <Routes>
              <Route path="/" element={<Index />} />
            </Routes>
            <SearchOverlay 
              open={isSearchOpen} 
              onOpenChange={setIsSearchOpen}
            />
          </RecentlyViewedProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;