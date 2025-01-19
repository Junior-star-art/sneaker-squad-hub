import { Button } from "@/components/ui/button";
import { Minus, Plus, X, Heart, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { OptimizedImage } from "@/components/ui/optimized-image";

type CartItemProps = {
  item: {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    size?: string;
  };
  isSaved?: boolean;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  onSave?: (id: string) => void;
  onMoveToCart?: (id: string) => void;
};

const CartItem = ({
  item,
  isSaved = false,
  onUpdateQuantity,
  onRemove,
  onSave,
  onMoveToCart,
}: CartItemProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-4 border-b pb-4"
    >
      <OptimizedImage 
        src={item.image} 
        alt={item.name} 
        className="h-24 w-24"
        sizes="96px"
      />
      <div className="flex-1">
        <h3 className="font-medium">{item.name}</h3>
        <p className="text-muted-foreground">{formatPrice(item.price)}</p>
        {item.size && <p className="text-sm text-muted-foreground">Size: {item.size}</p>}
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
};

export default CartItem;