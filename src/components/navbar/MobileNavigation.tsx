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
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-[0_-1px_3px_rgba(0,0,0,0.1)] z-50">
      <div className="flex justify-around items-center h-16 px-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="flex flex-col items-center relative group touch-none"
          onClick={() => navigate("/")}
        >
          <Home className="h-5 w-5 transition-transform duration-200 group-active:scale-90" />
          <span className="text-xs mt-1 transition-colors group-hover:text-nike-red">Home</span>
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="flex flex-col items-center relative group touch-none"
          onClick={onSearchClick}
        >
          <Search className="h-5 w-5 transition-transform duration-200 group-active:scale-90" />
          <span className="text-xs mt-1 transition-colors group-hover:text-nike-red">Search</span>
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="flex flex-col items-center relative group touch-none"
          onClick={() => navigate("/wishlist")}
        >
          <Heart className="h-5 w-5 transition-transform duration-200 group-active:scale-90" />
          <span className="text-xs mt-1 transition-colors group-hover:text-nike-red">Wishlist</span>
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="flex flex-col items-center relative group touch-none"
          onClick={onCartClick}
        >
          <div className="relative">
            <ShoppingBag className="h-5 w-5 transition-transform duration-200 group-active:scale-90" />
            {itemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-nike-red text-white text-xs rounded-full h-4 w-4 flex items-center justify-center animate-fade-up">
                {itemsCount}
              </span>
            )}
          </div>
          <span className="text-xs mt-1 transition-colors group-hover:text-nike-red">Cart</span>
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="flex flex-col items-center relative group touch-none"
          onClick={onAuthClick}
        >
          <UserRound className="h-5 w-5 transition-transform duration-200 group-active:scale-90" />
          <span className="text-xs mt-1 transition-colors group-hover:text-nike-red">Account</span>
        </Button>
      </div>
    </div>
  );
};