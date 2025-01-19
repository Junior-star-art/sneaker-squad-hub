import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface Color {
  name: string;
  code: string;
  image: string;
}

interface AddToCartSectionProps {
  colors: Color[];
  selectedColor: Color | null;
  onColorSelect: (color: Color) => void;
  sizes: string[];
  selectedSize: string | null;
  onSizeSelect: (size: string) => void;
  onAddToCart: () => void;
  isOutOfStock: boolean;
}

export const AddToCartSection = ({
  colors,
  selectedColor,
  onColorSelect,
  sizes,
  selectedSize,
  onSizeSelect,
  onAddToCart,
  isOutOfStock
}: AddToCartSectionProps) => {
  const isMobile = useIsMobile();

  return (
    <div className={cn(
      "space-y-6",
      isMobile && "fixed bottom-0 left-0 right-0 bg-white p-4 border-t shadow-lg"
    )}>
      {colors?.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">Select Color</h4>
          <div className="flex gap-2">
            {colors?.map((color) => (
              <button
                key={color.name}
                onClick={() => onColorSelect(color)}
                className={cn(
                  "w-8 h-8 rounded-full border-2 transition-colors",
                  selectedColor?.name === color.name ? "border-primary" : "border-transparent"
                )}
                style={{
                  backgroundColor: color.code,
                }}
                title={color.name}
              />
            ))}
          </div>
        </div>
      )}
      <div>
        <h4 className="font-medium mb-2">Select Size</h4>
        <div className="grid grid-cols-3 gap-2">
          {sizes.map((size) => (
            <Button
              key={size}
              variant={selectedSize === size ? "default" : "outline"}
              className={cn(
                "hover:bg-primary hover:text-white",
                selectedSize === size && "bg-primary text-white"
              )}
              onClick={() => onSizeSelect(size)}
            >
              {size}
            </Button>
          ))}
        </div>
      </div>
      <Button
        className="w-full"
        size={isMobile ? "lg" : "default"}
        onClick={onAddToCart}
        disabled={isOutOfStock || !selectedSize}
      >
        {isOutOfStock ? "Out of Stock" : "Add to Bag"}
      </Button>
    </div>
  );
};