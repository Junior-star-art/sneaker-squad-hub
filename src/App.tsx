import { AuthProvider } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { CartProvider } from "@/contexts/CartContext";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import { RecentlyViewedProvider } from "@/contexts/RecentlyViewedContext";
import { useState } from "react";

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <AuthProvider>
      <CartProvider>
        <RecentlyViewedProvider>
          <Navbar onCartClick={() => setIsCartOpen(true)} />
          <SearchOverlay 
            open={isSearchOpen} 
            onOpenChange={setIsSearchOpen}
          />
        </RecentlyViewedProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;