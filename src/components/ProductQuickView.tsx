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
import { Separator } from "./ui/separator";

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
      <DialogContent className="sm:max-w-[800px] p-0 max-h-[90vh] overflow-hidden bg-white">
        <DialogHeader className="sticky top-0 z-10 bg-white border-b p-4">
          <DialogTitle className="text-xl font-semibold pr-8">{product.name}</DialogTitle>
          <DialogClose className="absolute right-4 top-4 hover:bg-gray-100 rounded-full p-2 transition-colors">
            <X className="h-5 w-5" />
          </DialogClose>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-4rem)]">
          <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'sm:grid-cols-2'} p-4`}>
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
              
              <Separator className="my-6" />
              
              <div className={`space-y-6 ${isMobile ? 'pb-24' : ''}`}>
                {colors?.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3">Available Colors</h4>
                    <div className="flex gap-3 flex-wrap">
                      {product.colors?.map((color) => (
                        <button
                          key={color.name}
                          onClick={() => {
                            setSelectedColor(color);
                            setSelectedImage(color.image);
                          }}
                          className={`w-12 h-12 rounded-full border-2 transition-all hover:scale-110 ${
                            selectedColor?.name === color.name 
                              ? 'border-primary ring-2 ring-primary ring-offset-2' 
                              : 'border-gray-200'
                          }`}
                          style={{ backgroundColor: color.code }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-medium mb-3">Select Size</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {SIZES.map((size) => (
                      <Button
                        key={size}
                        variant={selectedSize === size ? "default" : "outline"}
                        className={`h-12 text-base hover:bg-primary hover:text-white transition-colors ${
                          selectedSize === size ? 'ring-2 ring-primary ring-offset-2' : ''
                        }`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        {isMobile && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg">
            <Button
              className="w-full h-12 text-base font-medium"
              onClick={handleAddToCart}
              disabled={product.stock === 0 || !selectedSize}
            >
              {product.stock === 0 ? "Out of Stock" : `Add to Cart - $${product.price}`}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProductQuickView;