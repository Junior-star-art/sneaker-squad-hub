
import { Button } from "@/components/ui/button";
import { CartItem as CartItemType } from "@/types/cart";
import { MinusIcon, PlusIcon, TrashIcon, HeartIcon, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

interface CartItemProps {
  item: CartItemType;
  isSaved?: boolean;
  onUpdateQuantity?: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  onSave?: (id: string) => Promise<void>;
  onMoveToCart?: (id: string) => Promise<void>;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  isSaved = false,
  onUpdateQuantity,
  onRemove,
  onSave,
  onMoveToCart,
}) => {
  const handleQuantityUpdate = (increment: number) => {
    if (onUpdateQuantity) {
      onUpdateQuantity(item.id, item.quantity + increment);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.2 }}
      className="flex items-start gap-4 border-b pb-4"
    >
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between">
          <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
          <p className="text-sm font-medium text-gray-900">
            {typeof item.price === 'number' 
              ? item.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) 
              : item.price}
          </p>
        </div>
        {item.size && (
          <p className="mt-1 text-xs text-gray-500">Size: {item.size}</p>
        )}
        <div className="mt-2 flex items-center justify-between">
          {!isSaved && onUpdateQuantity && (
            <div className="flex items-center border rounded">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleQuantityUpdate(-1)}
                disabled={item.quantity <= 1}
              >
                <MinusIcon className="h-3 w-3" />
              </Button>
              <span className="px-2">{item.quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleQuantityUpdate(1)}
              >
                <PlusIcon className="h-3 w-3" />
              </Button>
            </div>
          )}
          {isSaved && (
            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
          )}
          <div className="flex space-x-2">
            {!isSaved && onSave && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-400 hover:text-gray-500"
                onClick={() => onSave(item.id)}
              >
                <HeartIcon className="h-4 w-4" />
              </Button>
            )}
            {isSaved && onMoveToCart && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-400 hover:text-gray-500"
                onClick={() => onMoveToCart(item.id)}
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:text-red-500"
              onClick={() => onRemove(item.id)}
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItem;
