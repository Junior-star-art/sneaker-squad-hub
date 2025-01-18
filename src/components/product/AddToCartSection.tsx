import { Button } from "@/components/ui/button";

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
  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-medium mb-2">Select Color</h4>
        <div className="flex gap-2">
          {colors?.map((color) => (
            <button
              key={color.name}
              onClick={() => onColorSelect(color)}
              className="w-8 h-8 rounded-full border-2 transition-colors"
              style={{
                backgroundColor: color.code,
                borderColor: selectedColor?.name === color.name ? '#000' : 'transparent'
              }}
              title={color.name}
            />
          ))}
        </div>
      </div>
      <div>
        <h4 className="font-medium mb-2">Select Size</h4>
        <div className="grid grid-cols-3 gap-2">
          {sizes.map((size) => (
            <Button
              key={size}
              variant={selectedSize === size ? "default" : "outline"}
              className="hover:bg-black hover:text-white"
              onClick={() => onSizeSelect(size)}
            >
              {size}
            </Button>
          ))}
        </div>
      </div>
      <Button
        className="w-full"
        onClick={onAddToCart}
        disabled={isOutOfStock || !selectedSize}
      >
        {isOutOfStock ? "Out of Stock" : "Add to Bag"}
      </Button>
    </div>
  );
};