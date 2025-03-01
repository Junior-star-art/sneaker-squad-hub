
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import CartItem from "./cart/CartItem";
import { CheckoutForm } from "./cart/CheckoutForm";
import { ShoppingBag, PackageOpen, ShoppingBasket } from "lucide-react";
import { CartAuthDialog } from "./cart/CartAuthDialog";
import { CartItem as CartItemType } from "@/types/cart";

type CartDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const CartDrawer = ({ open, onOpenChange }: CartDrawerProps) => {
  const { items, savedItems, removeItem, updateQuantity, saveForLater, moveToCart, removeSavedItem, total } = useCart();
  const { user } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const handleCheckoutClick = () => {
    if (!user) {
      setShowAuthDialog(true);
    } else {
      setIsCheckingOut(true);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthDialog(false);
    setIsCheckingOut(true);
  };

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="h-[96vh]">
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-2">
              <ShoppingBasket className="h-5 w-5" />
              Your Cart
            </DrawerTitle>
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto px-4">
            {!isCheckingOut ? (
              <>
                {items.length === 0 && savedItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center mb-4 animate-fade-up">
                      <ShoppingBag className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2 animate-fade-up">
                      Your cart is empty
                    </h3>
                    <p className="text-gray-500 max-w-[240px] mb-6 animate-fade-up">
                      Looks like you haven't added any items to your cart yet.
                      Start shopping to fill it up!
                    </p>
                    <DrawerClose asChild>
                      <Button 
                        variant="outline"
                        className="animate-fade-up"
                      >
                        Browse Products
                      </Button>
                    </DrawerClose>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {items.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="font-medium flex items-center gap-2">
                          <ShoppingBasket className="h-4 w-4" />
                          Cart Items ({items.length})
                        </h3>
                        <AnimatePresence>
                          {items.map((item) => (
                            <CartItem
                              key={item.id}
                              item={item as CartItemType}
                              onUpdateQuantity={updateQuantity}
                              onRemove={removeItem}
                              onSave={saveForLater}
                            />
                          ))}
                        </AnimatePresence>
                      </div>
                    )}
                    
                    {savedItems.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="font-medium flex items-center gap-2">
                          <PackageOpen className="h-4 w-4" />
                          Saved for Later ({savedItems.length})
                        </h3>
                        <AnimatePresence>
                          {savedItems.map((item) => (
                            <CartItem
                              key={item.id}
                              item={item as CartItemType}
                              isSaved
                              onRemove={removeSavedItem}
                              onUpdateQuantity={updateQuantity}
                              onMoveToCart={moveToCart}
                            />
                          ))}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <CheckoutForm onBack={() => setIsCheckingOut(false)} />
            )}
          </div>
          {!isCheckingOut && items.length > 0 && (
            <DrawerFooter>
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium">Total</span>
                <span className="font-medium">{total}</span>
              </div>
              <Button 
                className="w-full" 
                onClick={handleCheckoutClick}
              >
                Proceed to Checkout
              </Button>
              <DrawerClose asChild>
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </DrawerClose>
            </DrawerFooter>
          )}
        </DrawerContent>
      </Drawer>
      <CartAuthDialog 
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  );
};

export default CartDrawer;
