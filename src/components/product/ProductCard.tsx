import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { Eye, AlertTriangle, CheckCircle, XCircle, Star, ShoppingCart } from "lucide-react";
import { WishlistButton } from "./WishlistButton";
import { differenceInDays } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

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
  const { addItem } = useCart();
  const { toast } = useToast();

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

  const handleAddToCart = () => {
    if (!product.stock) {
      toast({
        title: "Out of Stock",
        description: "This product is currently unavailable",
        variant: "destructive",
      });
      return;
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || '/placeholder.svg'
    });

    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  const stockStatus = getStockStatus(product.stock);
  const StockIcon = stockStatus.icon;

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="aspect-square overflow-hidden relative">
        <img
          src={product.images?.[0] || '/placeholder.svg'}
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {isNewArrival(product.created_at) && (
            <Badge className="bg-purple-600 text-white">
              <Star className="w-3 h-3 mr-1" />
              New Arrival
            </Badge>
          )}
          {product.stock !== null && product.stock < 5 && (
            <Badge variant="secondary" className="bg-yellow-500 text-white">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Only {product.stock} left
            </Badge>
          )}
        </div>
        <div className="absolute top-4 right-4 flex gap-2">
          <WishlistButton productId={product.id} />
          <Button
            variant="secondary"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity md:flex hidden"
            onClick={() => onQuickView(product)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium truncate text-base md:text-lg">{product.name}</h3>
          <Badge 
            variant={stockStatus.variant}
            className={`hidden md:flex items-center gap-1 ${
              !product.stock ? 'bg-red-100 text-red-700' :
              product.stock < 5 ? 'bg-yellow-100 text-yellow-700' :
              'bg-green-100 text-green-700'
            }`}
          >
            <StockIcon className="w-3 h-3" />
            <span className="text-xs">{stockStatus.label}</span>
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{product.category?.name}</p>
        <div className="flex flex-col md:flex-row md:items-center justify-between mt-4 gap-2">
          <span className="font-medium text-lg">{formatPrice(product.price)}</span>
          <Button
            size="sm"
            className="w-full md:w-auto flex items-center justify-center gap-2"
            onClick={handleAddToCart}
            disabled={!product.stock}
          >
            <ShoppingCart className="h-4 w-4" />
            <span>{!product.stock ? "Out of Stock" : "Add to Cart"}</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}