import { AuthProvider } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { CartProvider } from "@/contexts/CartContext";
import { SearchOverlay } from "@/components/search/SearchOverlay";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Navbar onCartClick={() => {}} />
        <SearchOverlay />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
