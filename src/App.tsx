import { AuthProvider } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { CartProvider } from "@/contexts/CartContext";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import { useState } from "react";

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <AuthProvider>
      <CartProvider>
        <Navbar onCartClick={() => setIsCartOpen(true)} />
        <SearchOverlay 
          open={isSearchOpen} 
          onOpenChange={setIsSearchOpen}
        />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;