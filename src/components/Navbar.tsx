import { useState } from "react";
import { Menu, X, Search, ShoppingBag } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

type NavbarProps = {
  onCartClick: () => void;
};

const Navbar = ({ onCartClick }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
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
          <div className="flex items-center">
            <div className="hidden md:flex items-center space-x-4">
              <Search className="h-5 w-5 text-gray-900 cursor-pointer hover:text-nike-red" />
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
                      <div className="flex justify-between mb-4">
                        <span>Total</span>
                        <span className="font-medium">{total}</span>
                      </div>
                      <Button onClick={onCartClick} className="w-full">
                        View Cart
                      </Button>
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
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;