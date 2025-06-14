import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Star, ShoppingCart, Plus, XCircle, AlertTriangle, CheckCircle } from "lucide-react";
import { WishlistButton } from "./WishlistButton";
import { differenceInDays } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCart } from "@/contexts/CartContext";
import { motion } from "framer-motion";
import { useState } from "react";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { StockIndicator } from "./StockIndicator";
import { StockNotification } from "./StockNotification";
import { getPublicImageUrl } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string | null;
  images: string[] | null;
  stock: number | null;
  featured: boolean | null;
  category: {
    name: string;
  } | null;
  created_at?: string;
}

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { addItem } = useCart();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getStockStatus = (stock: number | null) => {
    if (!stock) return { label: "Out of Stock", icon: XCircle, variant: "destructive" as const };
    if (stock < 5) return { label: "Low Stock", icon: AlertTriangle, variant: "secondary" as const };
    return { label: "In Stock", icon: CheckCircle, variant: "outline" as const };
  };

  const isNewArrival = (createdAt?: string) => {
    if (!createdAt) return false;
    return differenceInDays(new Date(), new Date(createdAt)) <= 30;
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.stock) {
      toast({
        title: "Out of Stock",
        description: "This product is currently unavailable",
        variant: "destructive",
      });
      return;
    }

    setIsAddingToCart(true);
    try {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] ? getPublicImageUrl(product.images[0]) : '/placeholder.svg'
      });

      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const stockStatus = getStockStatus(product.stock);
  const StockIcon = stockStatus.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        className="group overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer active:scale-[0.99] relative" 
        onClick={() => onQuickView(product)}
      >
        <div className="aspect-square overflow-hidden relative">
          <OptimizedImage
            src={product.images?.[0] ? getPublicImageUrl(product.images[0]) : '/placeholder.svg'}
            alt={product.name}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
            priority={product.featured}
            placeholder="blur"
          />
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {isNewArrival(product.created_at) && (
              <Badge className="bg-purple-600 text-white">
                <Star className="w-3 h-3 mr-1" />
                New Arrival
              </Badge>
            )}
            <StockIndicator stock={product.stock || 0} />
          </div>
          <div className="absolute top-4 right-4 flex gap-2">
            <WishlistButton productId={product.id} />
            {!isMobile && (
              <Button
                variant="secondary"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white"
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickView(product);
                }}
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            {product.stock && product.stock > 0 ? (
              <Button
                className="w-full bg-black hover:bg-gray-800 text-white gap-2"
                onClick={handleAddToCart}
                disabled={isAddingToCart}
              >
                {isAddingToCart ? (
                  "Adding..."
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Add to Cart
                  </>
                )}
              </Button>
            ) : (
              <StockNotification productId={product.id} productName={product.name} />
            )}
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium truncate text-base md:text-lg">{product.name}</h3>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{product.category?.name}</p>
          <div className="flex flex-col md:flex-row md:items-center justify-between mt-4 gap-2">
            <span className="font-medium text-lg">{formatPrice(product.price)}</span>
            {isMobile && product.stock && product.stock > 0 && (
              <Button
                size="sm"
                className="w-full md:w-auto flex items-center justify-center gap-2"
                onClick={handleAddToCart}
                disabled={isAddingToCart}
              >
                <ShoppingCart className="h-4 w-4" />
                <span>
                  {isAddingToCart ? "Adding..." : "Add to Cart"}
                </span>
              </Button>
            )}
            {isMobile && (!product.stock || product.stock === 0) && (
              <StockNotification productId={product.id} productName={product.name} />
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
