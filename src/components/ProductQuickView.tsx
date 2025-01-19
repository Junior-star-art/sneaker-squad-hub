import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { ImageGallery } from "./product/ImageGallery";
import { ProductInfo } from "./product/ProductInfo";
import { AddToCartSection } from "./product/AddToCartSection";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";

interface Color {
  name: string;
  code: string;
  image: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  materials: string;
  care: string;
  shipping: string;
  stock: number;
  colors: Color[];
  angles: string[];
  image: string;
}

interface ProductQuickViewProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SIZES = ["US 7", "US 8", "US 9", "US 10", "US 11", "US 12"];

const ProductQuickView = ({ product, open, onOpenChange }: ProductQuickViewProps) => {
  const { addItem } = useCart();
  const [selectedColor, setSelectedColor] = useState<Color | null>(product.colors?.[0] || null);
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: selectedImage || product.image
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`sm:max-w-[800px] ${isMobile ? 'p-0' : 'p-6'} max-h-[90vh] overflow-hidden`}>
        <DialogHeader className={`${isMobile ? 'px-4 py-2' : ''} relative`}>
          <DialogTitle className="pr-8">{product.name}</DialogTitle>
          <DialogClose className="absolute right-4 top-4">
            <X className="h-4 w-4" />
          </DialogClose>
        </DialogHeader>
        <ScrollArea className={`${isMobile ? 'px-4' : ''}`}>
          <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'sm:grid-cols-2'}`}>
            <div className="space-y-4">
              <ImageGallery
                images={product.angles}
                mainImage={selectedImage}
                productName={product.name}
                onImageSelect={setSelectedImage}
              />
            </div>
            <div className="space-y-6">
              <ProductInfo {...product} />
              <AddToCartSection
                colors={product.colors}
                selectedColor={selectedColor}
                onColorSelect={(color) => {
                  setSelectedColor(color);
                  setSelectedImage(color.image);
                }}
                sizes={SIZES}
                selectedSize={selectedSize}
                onSizeSelect={setSelectedSize}
                onAddToCart={handleAddToCart}
                isOutOfStock={product.stock === 0}
              />
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ProductQuickView;