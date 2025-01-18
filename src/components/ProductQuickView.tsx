import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

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

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
};

const ProductQuickView = ({ product, open, onOpenChange }: ProductQuickViewProps) => {
  const { addItem } = useCart();
  const [selectedColor, setSelectedColor] = useState<Color | null>(product.colors?.[0] || null);
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const getStockStatus = () => {
    if (product.stock === 0) return { label: "Out of Stock", color: "destructive" };
    if (product.stock < 5) return { label: "Low Stock", color: "warning" };
    return { label: "In Stock", color: "success" };
  };

  const status = getStockStatus();
  const formattedPrice = formatPrice(product.price);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-4">
            <div className="relative aspect-square group">
              <img
                src={selectedImage}
                alt={product.name}
                className="object-cover w-full h-full rounded-lg transition-transform group-hover:scale-105"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {product.angles?.map((angle, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(angle)}
                  className="w-20 h-20 rounded-md overflow-hidden border-2 transition-colors"
                  style={{ borderColor: selectedImage === angle ? '#000' : 'transparent' }}
                >
                  <img src={angle} alt={`${product.name} view ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-2xl font-bold">{formattedPrice}</p>
                <Badge variant={status.color as "default" | "destructive" | "secondary"}>{status.label}</Badge>
              </div>
              {product.stock > 0 && product.stock < 5 && (
                <p className="text-sm text-red-500">Only {product.stock} left in stock!</p>
              )}
            </div>
            <div>
              <h4 className="font-medium mb-2">Select Color</h4>
              <div className="flex gap-2">
                {product.colors?.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => {
                      setSelectedColor(color);
                      setSelectedImage(color.image);
                    }}
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
                {SIZES.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    className="hover:bg-black hover:text-white"
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-sm text-gray-600">{product.description}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Features</h4>
                <ul className="text-sm text-gray-600 list-disc pl-4">
                  {product.features?.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Materials & Care</h4>
                <p className="text-sm text-gray-600">{product.materials}</p>
                <p className="text-sm text-gray-600 mt-1">{product.care}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Shipping</h4>
                <p className="text-sm text-gray-600">{product.shipping}</p>
              </div>
            </div>
            <Button
              className="w-full"
              onClick={() => {
                addItem({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: selectedImage || product.image
                });
                onOpenChange(false);
              }}
              disabled={product.stock === 0 || !selectedSize}
            >
              {product.stock === 0 ? "Out of Stock" : "Add to Bag"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductQuickView;