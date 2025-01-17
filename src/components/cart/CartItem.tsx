import { Button } from "@/components/ui/button";
import { Minus, Plus, X, Heart, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

type CartItemProps = {
  item: {
    id: string; // Changed from number to string
    name: string;
    price: string;
    image: string;
    quantity: number;
  };
  isSaved?: boolean;
  onUpdateQuantity: (id: string, quantity: number) => void; // Changed from number to string
  onRemove: (id: string) => void; // Changed from number to string
  onSave?: (id: string) => void; // Changed from number to string
  onMoveToCart?: (id: string) => void; // Changed from number to string
};

const CartItem = ({
  item,
  isSaved = false,
  onUpdateQuantity,
  onRemove,
  onSave,
  onMoveToCart,
}: CartItemProps) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: "auto" }}
    exit={{ opacity: 0, height: 0 }}
    transition={{ duration: 0.2 }}
    className="flex items-center gap-4 border-b pb-4"
  >
    <img src={item.image} alt={item.name} className="h-24 w-24 object-cover" />
    <div className="flex-1">
      <h3 className="font-medium">{item.name}</h3>
      <p className="text-muted-foreground">{item.price}</p>
      {!isSaved && (
        <div className="flex items-center gap-2 mt-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span>{item.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
    <div className="flex flex-col gap-2">
      <Button variant="ghost" size="icon" onClick={() => onRemove(item.id)}>
        <X className="h-4 w-4" />
      </Button>
      {!isSaved && onSave && (
        <Button variant="ghost" size="icon" onClick={() => onSave(item.id)}>
          <Heart className="h-4 w-4" />
        </Button>
      )}
      {isSaved && onMoveToCart && (
        <Button variant="ghost" size="icon" onClick={() => onMoveToCart(item.id)}>
          <ShoppingCart className="h-4 w-4" />
        </Button>
      )}
    </div>
  </motion.div>
);

export default CartItem;