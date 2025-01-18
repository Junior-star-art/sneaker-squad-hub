import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { ImageGallery } from "./product/ImageGallery";
import { ProductInfo } from "./product/ProductInfo";
import { AddToCartSection } from "./product/AddToCartSection";

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
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 sm:grid-cols-2">
          <ImageGallery
            images={product.angles}
            mainImage={selectedImage}
            productName={product.name}
            onImageSelect={setSelectedImage}
          />
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
      </DialogContent>
    </Dialog>
  );
};

export default ProductQuickView;