import { useState } from "react";
import { Menu, X, Search, ShoppingBag, UserRound, Home, Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { SearchOverlay } from "./search/SearchOverlay";
import { AuthForms } from "./auth/AuthForms";
import { useAuth } from "@/contexts/AuthContext";

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
                  <HoverCardContent className="w-80 p-4">
                    <div className="space-y-4">
                      <h3 className="font-bold text-lg">Bag</h3>
                      {items.length === 0 ? (
                        <p>There are no items in your bag.</p>
                      ) : (
                        <>
                          {items.slice(0, 2).map((item) => (
                            <div key={item.id} className="flex items-center gap-4">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-16 w-16 object-cover"
                              />
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  Qty: {item.quantity}
                                </p>
                              </div>
                            </div>
                          ))}
                          {items.length > 2 && (
                            <p className="text-sm text-muted-foreground">
                              +{items.length - 2} more items
                            </p>
                          )}
                          <div className="border-t pt-4">
                            <div className="flex justify-between mb-2">
                              <span>Subtotal</span>
                              <span className="font-medium">{total}</span>
                            </div>
                            <div className="flex justify-between mb-4">
                              <span>Estimated Delivery & Handling</span>
                              <span>Free</span>
                            </div>
                            <Button onClick={onCartClick} className="w-full rounded-full">
                              Go to Checkout
                            </Button>
                          </div>
                        </>
                      )}
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-2">Favourites</h4>
                        <p className="text-sm text-gray-600">
                          Want to view your favourites?{" "}
                          <button className="text-black underline" onClick={() => setShowRegister(true)}>
                            Join us
                          </button>{" "}
                          or{" "}
                          <button className="text-black underline" onClick={() => setShowRegister(true)}>
                            Sign in
                          </button>
                        </p>
                      </div>
                    </div>
                  </HoverCardContent>
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

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="#" className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-nike-red">
                New & Featured
              </Link>
              <Link to="#" className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-nike-red">
                Men
              </Link>
              <Link to="#" className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-nike-red">
                Women
              </Link>
              <Link to="#" className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-nike-red">
                Kids
              </Link>
            </div>
          </div>
        )}

        <SearchOverlay open={showSearch} onOpenChange={setShowSearch} />
      </nav>

      {/* Bottom Navigation for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-top z-50">
        <div className="flex justify-around items-center h-16 px-4">
          <Button variant="ghost" size="icon" className="flex flex-col items-center" onClick={() => navigate("/")}>
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </Button>
          <Button variant="ghost" size="icon" className="flex flex-col items-center" onClick={() => setShowSearch(true)}>
            <Search className="h-5 w-5" />
            <span className="text-xs mt-1">Search</span>
          </Button>
          <Button variant="ghost" size="icon" className="flex flex-col items-center" onClick={() => navigate("/wishlist")}>
            <Heart className="h-5 w-5" />
            <span className="text-xs mt-1">Wishlist</span>
          </Button>
          <Button variant="ghost" size="icon" className="flex flex-col items-center" onClick={onCartClick}>
            <div className="relative">
              <ShoppingBag className="h-5 w-5" />
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-nike-red text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </div>
            <span className="text-xs mt-1">Cart</span>
          </Button>
          <Button variant="ghost" size="icon" className="flex flex-col items-center" onClick={() => setShowRegister(true)}>
            <UserRound className="h-5 w-5" />
            <span className="text-xs mt-1">Account</span>
          </Button>
        </div>
      </div>
    </>
  );
};

export default Navbar;