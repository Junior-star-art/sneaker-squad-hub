import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { Heart, Search, ShoppingCart, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { CartSheet } from "@/components/cart/CartSheet";
import { useState } from "react";
import { SearchOverlay } from "@/components/search/SearchOverlay";

export function Navbar() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold">
            SneakerHub
          </Link>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(true)}
              title="Search"
            >
              <Search className="h-5 w-5" />
            </Button>

            {user && (
              <>
                <Link to="/wishlist">
                  <Button variant="ghost" size="icon" title="Wishlist">
                    <Heart className="h-5 w-5" />
                    {wishlistItems.length > 0 && (
                      <Badge
                        variant="secondary"
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
                      >
                        {wishlistItems.length}
                      </Badge>
                    )}
                  </Button>
                </Link>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsCartOpen(true)}
                  title="Cart"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartItems.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
                    >
                      {cartItems.length}
                    </Badge>
                  )}
                </Button>

                <Link to="/orders">
                  <Button variant="ghost" size="icon" title="Orders">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <CartSheet open={isCartOpen} onOpenChange={setIsCartOpen} />
      <SearchOverlay open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </nav>
  );
}