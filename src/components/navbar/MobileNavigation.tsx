import { Button } from "@/components/ui/button";
import { Home, Search, Heart, ShoppingBag, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MobileNavigationProps {
  itemsCount: number;
  onSearchClick: () => void;
  onCartClick: () => void;
  onAuthClick: () => void;
}

export const MobileNavigation = ({ 
  itemsCount, 
  onSearchClick, 
  onCartClick, 
  onAuthClick 
}: MobileNavigationProps) => {
  const navigate = useNavigate();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-top z-50">
      <div className="flex justify-around items-center h-16 px-4">
        <Button variant="ghost" size="icon" className="flex flex-col items-center" onClick={() => navigate("/")}>
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">Home</span>
        </Button>
        <Button variant="ghost" size="icon" className="flex flex-col items-center" onClick={onSearchClick}>
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
            {itemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-nike-red text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {itemsCount}
              </span>
            )}
          </div>
          <span className="text-xs mt-1">Cart</span>
        </Button>
        <Button variant="ghost" size="icon" className="flex flex-col items-center" onClick={onAuthClick}>
          <UserRound className="h-5 w-5" />
          <span className="text-xs mt-1">Account</span>
        </Button>
      </div>
    </div>
  );
};