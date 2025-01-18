import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useMediaQuery } from "@/hooks/use-mobile";

const Navbar = ({ onCartClick }: { onCartClick: () => void }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleAuthenticatedAction = (action: () => void, redirectPath?: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to continue",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    if (redirectPath) {
      navigate(redirectPath);
    } else {
      action();
    }
  };

  if (isMobile) {
    return (
      <>
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-2 bg-white border-b">
          <Link to="/" className="text-xl font-bold">
            NIKE
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/search")}
            className="ml-auto"
          >
            <Search className="w-5 h-5" />
          </Button>
        </nav>
        <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around py-2 bg-white border-t">
          <Button
            variant="ghost"
            onClick={() => handleAuthenticatedAction(() => navigate("/wishlist"))}
            className="flex flex-col items-center"
          >
            <span className="material-icons">favorite_border</span>
            <span className="text-xs">Wishlist</span>
          </Button>
          <Button
            variant="ghost"
            onClick={() => handleAuthenticatedAction(onCartClick)}
            className="flex flex-col items-center"
          >
            <span className="material-icons">shopping_cart</span>
            <span className="text-xs">Cart</span>
          </Button>
          <Button
            variant="ghost"
            onClick={() => handleAuthenticatedAction(() => navigate("/orders"))}
            className="flex flex-col items-center"
          >
            <span className="material-icons">receipt_long</span>
            <span className="text-xs">Orders</span>
          </Button>
        </div>
      </>
    );
  }

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 bg-white border-b">
      <Link to="/" className="text-xl font-bold">
        NIKE
      </Link>
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/search")}
        >
          <Search className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          onClick={() => handleAuthenticatedAction(() => navigate("/wishlist"))}
        >
          <span className="material-icons">favorite_border</span>
        </Button>
        <Button
          variant="ghost"
          onClick={() => handleAuthenticatedAction(onCartClick)}
        >
          <span className="material-icons">shopping_cart</span>
        </Button>
        <Button
          variant="ghost"
          onClick={() => handleAuthenticatedAction(() => navigate("/orders"))}
        >
          <span className="material-icons">receipt_long</span>
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;