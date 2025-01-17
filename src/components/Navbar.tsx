import { useState } from "react";
import { Menu, X, Search, ShoppingBag } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SearchOverlay } from "./search/SearchOverlay";

type NavbarProps = {
  onCartClick: () => void;
};

const Navbar = ({ onCartClick }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const { items, total } = useCart();

  return (
    <nav className="fixed top-0 w-full bg-white z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="flex-shrink-0">
              <img
                className="h-8 w-auto"
                src="https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg"
                alt="Nike"
              />
            </a>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <a href="#" className="text-gray-900 hover:text-nike-red px-3 py-2 text-sm font-medium">
                New & Featured
              </a>
              <a href="#" className="text-gray-900 hover:text-nike-red px-3 py-2 text-sm font-medium">
                Men
              </a>
              <a href="#" className="text-gray-900 hover:text-nike-red px-3 py-2 text-sm font-medium">
                Women
              </a>
              <a href="#" className="text-gray-900 hover:text-nike-red px-3 py-2 text-sm font-medium">
                Kids
              </a>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Dialog open={showRegister} onOpenChange={setShowRegister}>
              <DialogTrigger asChild>
                <Button variant="ghost" className="text-sm font-medium">
                  Register
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg"
                      alt="Nike"
                      className="h-6"
                    />
                    <img
                      src="https://upload.wikimedia.org/wikipedia/en/3/37/Jumpman_logo.svg"
                      alt="Jordan"
                      className="h-6"
                    />
                  </div>
                  <h2 className="text-2xl font-bold">Enter your email to join us or sign in.</h2>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>South Africa</span>
                    <button className="underline">Change</button>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Email" />
                  </div>
                  <p className="text-sm text-gray-600">
                    By continuing, I agree to Nike's{" "}
                    <a href="#" className="underline">
                      Privacy Policy
                    </a>{" "}
                    and{" "}
                    <a href="#" className="underline">
                      Terms of Use
                    </a>
                    .
                  </p>
                  <Button className="w-full rounded-full">Continue</Button>
                  <Button variant="outline" className="w-full rounded-full">
                    Sign in with Google
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="hover:text-nike-red"
                onClick={() => setShowSearch(true)}
              >
                <Search className="h-5 w-5" />
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
            <div className="md:hidden flex items-center">
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
            <a href="#" className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-nike-red">
              New & Featured
            </a>
            <a href="#" className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-nike-red">
              Men
            </a>
            <a href="#" className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-nike-red">
              Women
            </a>
            <a href="#" className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-nike-red">
              Kids
            </a>
            <Button 
              variant="ghost" 
              className="w-full text-left px-3 py-2 text-base font-medium"
              onClick={() => setShowRegister(true)}
            >
              Register
            </Button>
          </div>
        </div>
      )}

      <SearchOverlay open={showSearch} onOpenChange={setShowSearch} />
    </nav>
  );
};

export default Navbar;
