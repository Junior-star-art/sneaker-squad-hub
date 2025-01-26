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
import { EnhancedReviews } from "./product/EnhancedReviews";
import { X, Info } from "lucide-react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import SizeGuide from "./SizeGuide";

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
  const { toast } = useToast();
  const [selectedColor, setSelectedColor] = useState<Color | null>(product.colors?.[0] || null);
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const isMobile = useIsMobile();

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: "Please select a size",
        description: "You must select a size before adding to cart",
        variant: "destructive",
      });
      return;
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: selectedImage || product.image,
      size: selectedSize,
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} - Size ${selectedSize} has been added to your cart`,
    });
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[800px] p-0 max-h-[90vh] overflow-hidden bg-white">
          <DialogHeader className="sticky top-0 z-10 bg-white border-b p-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold">{product.name}</DialogTitle>
              <div className="flex items-center gap-2">
                {product.stock > 0 ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    In Stock
                  </Badge>
                ) : (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
                <DialogClose className="hover:bg-gray-100 rounded-full p-2 transition-colors">
                  <X className="h-5 w-5" />
                </DialogClose>
              </div>
            </div>
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
                  {product.colors?.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-3">Available Colors</h4>
                      <div className="flex gap-3 flex-wrap">
                        {product.colors?.map((color) => (
                          <TooltipProvider key={color.name}>
                            <Tooltip>
                              <TooltipTrigger>
                                <button
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
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{color.name}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Select Size</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-sm"
                        onClick={() => setShowSizeGuide(true)}
                      >
                        <Info className="w-4 h-4 mr-2" />
                        Size Guide
                      </Button>
                    </div>
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

                  <Separator className="my-6" />

                  <div className="space-y-4">
                    <h4 className="font-medium">Materials & Care</h4>
                    <p className="text-gray-600 leading-relaxed">
                      Upper: Premium leather and synthetic materials for durability
                      <br />
                      Midsole: Nike Air cushioning for comfort
                      <br />
                      Outsole: Durable rubber for traction
                    </p>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <p className="font-medium">Care Instructions:</p>
                      <ul className="list-disc pl-5 text-gray-600 space-y-1">
                        <li>Clean with a soft brush or cloth</li>
                        <li>Use mild soap if needed</li>
                        <li>Air dry naturally away from direct heat</li>
                        <li>Store in a cool, dry place</li>
                      </ul>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-4">
                    <h4 className="font-medium">Shipping Information</h4>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Info className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Free Standard Shipping</p>
                          <p className="text-sm text-gray-600">Orders over $100 qualify for free shipping</p>
                        </div>
                      </div>
                      <ul className="text-sm text-gray-600 space-y-2">
                        <li>• Standard Delivery: 3-5 business days</li>
                        <li>• Express Delivery: 1-2 business days (additional fee)</li>
                        <li>• Free returns within 30 days</li>
                      </ul>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <EnhancedReviews productId={product.id} />
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

      <SizeGuide 
        open={showSizeGuide}
        onOpenChange={setShowSizeGuide}
      />
    </>
  );
};

export default ProductQuickView;
