import { useState } from "react";
import { Menu, X, Search, ShoppingBag, UserRound, Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  HoverCard,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { SearchOverlay } from "./search/SearchOverlay";
import { AuthForms } from "./auth/AuthForms";
import { useAuth } from "@/contexts/AuthContext";
import { MobileMenu } from "./navbar/MobileMenu";
import { CartPreview } from "./navbar/CartPreview";
import { MobileNavigation } from "./navbar/MobileNavigation";

type NavbarProps = {
  onCartClick: () => void;
};

export const Navbar = ({ onCartClick }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const { items, total } = useCart();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <nav className="fixed top-0 w-full bg-white z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0">
                <img
                  className="h-8 w-auto"
                  src="https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg"
                  alt="Nike"
                />
              </Link>
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                <Link to="#" className="text-gray-900 hover:text-nike-red px-3 py-2 text-sm font-medium">
                  New & Featured
                </Link>
                <Link to="#" className="text-gray-900 hover:text-nike-red px-3 py-2 text-sm font-medium">
                  Men
                </Link>
                <Link to="#" className="text-gray-900 hover:text-nike-red px-3 py-2 text-sm font-medium">
                  Women
                </Link>
                <Link to="#" className="text-gray-900 hover:text-nike-red px-3 py-2 text-sm font-medium">
                  Kids
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Dialog open={showRegister} onOpenChange={setShowRegister}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-sm font-medium">
                    <UserRound className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  {user ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">Welcome, {user.full_name || 'Member'}</h2>
                        <Button variant="ghost" onClick={signOut}>Sign Out</Button>
                      </div>
                    </div>
                  ) : (
                    <AuthForms />
                  )}
                </DialogContent>
              </Dialog>
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:text-nike-red"
                  onClick={() => setShowSearch(true)}
                >
                  <Search className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:text-nike-red"
                  onClick={() => navigate("/wishlist")}
                >
                  <Heart className="h-5 w-5" />
                </Button>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <div className="relative">
                      <ShoppingBag 
                        className="h-5 w-5 text-gray-900 cursor-pointer hover:text-nike-red" 
                        onClick={onCartClick}
                      />
                      {items.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-nike-red text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                          {items.length}
                        </span>
                      )}
                    </div>
                  </HoverCardTrigger>
                  <CartPreview 
                    items={items}
                    total={total}
                    onCartClick={onCartClick}
                    onAuthClick={() => setShowRegister(true)}
                  />
                </HoverCard>
              </div>
              <div className="md:hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-900 hover:text-nike-red focus:outline-none"
                >
                  {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <MobileMenu isOpen={isOpen} />

        <SearchOverlay open={showSearch} onOpenChange={setShowSearch} />
      </nav>

      <MobileNavigation 
        itemsCount={items.length}
        onSearchClick={() => setShowSearch(true)}
        onCartClick={onCartClick}
        onAuthClick={() => setShowRegister(true)}
      />
    </>
  );
};

export default Navbar;