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
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import CartItem from "./cart/CartItem";
import CheckoutForm from "./cart/CheckoutForm";

type CartDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const CartDrawer = ({ open, onOpenChange }: CartDrawerProps) => {
  const { items, savedItems, removeItem, updateQuantity, saveForLater, moveToCart, removeSavedItem, total } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[96vh]">
        <DrawerHeader>
          <DrawerTitle>Your Cart</DrawerTitle>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto px-4">
          {!isCheckingOut ? (
            <>
              {items.length === 0 && savedItems.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Your cart is empty
                </p>
              ) : (
                <div className="space-y-6">
                  {items.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="font-medium">Cart Items</h3>
                      <AnimatePresence>
                        {items.map((item) => (
                          <CartItem
                            key={item.id}
                            item={item}
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
                      <h3 className="font-medium">Saved for Later</h3>
                      <AnimatePresence>
                        {savedItems.map((item) => (
                          <CartItem
                            key={item.id}
                            item={item}
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
        {!isCheckingOut && (
          <DrawerFooter>
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium">Total</span>
              <span className="font-medium">{total}</span>
            </div>
            <Button 
              className="w-full" 
              disabled={items.length === 0}
              onClick={() => setIsCheckingOut(true)}
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
  );
};

export default CartDrawer;