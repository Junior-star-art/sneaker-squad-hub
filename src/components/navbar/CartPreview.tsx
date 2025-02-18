
import { Button } from "@/components/ui/button";
import { HoverCardContent } from "@/components/ui/hover-card";
import { CartItem } from "@/types/cart";

interface CartPreviewProps {
  items: CartItem[];
  total: string;
  onCartClick: () => void;
  onAuthClick: () => void;
}

export const CartPreview = ({ items, total, onCartClick, onAuthClick }: CartPreviewProps) => {
  return (
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
            <button className="text-black underline" onClick={onAuthClick}>
              Join us
            </button>{" "}
            or{" "}
            <button className="text-black underline" onClick={onAuthClick}>
              Sign in
            </button>
          </p>
        </div>
      </div>
    </HoverCardContent>
  );
};
