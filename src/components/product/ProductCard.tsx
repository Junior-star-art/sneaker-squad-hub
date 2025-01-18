import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { Eye } from "lucide-react";
import { WishlistButton } from "./WishlistButton";

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
}

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addItem } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <Card className="group overflow-hidden">
      <div className="aspect-square overflow-hidden relative">
        <img
          src={product.images?.[0] || '/placeholder.svg'}
          alt={product.name}
          className="object-cover w-full h-full transition-transform group-hover:scale-105"
        />
        <div className="absolute top-4 right-4 flex gap-2">
          <WishlistButton productId={product.id} />
          <Button
            variant="secondary"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onQuickView(product)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-medium truncate">{product.name}</h3>
        <p className="text-sm text-muted-foreground mt-1">{product.category?.name}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="font-medium">{formatPrice(product.price)}</span>
          <Button
            size="sm"
            onClick={() => addItem({
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.images?.[0] || '/placeholder.svg'
            })}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </Card>
  );
}