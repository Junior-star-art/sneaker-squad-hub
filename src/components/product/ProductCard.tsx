import { Button } from "@/components/ui/button";
import { Eye, Star } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/contexts/CartContext";
import { useRecentlyViewed } from "@/contexts/RecentlyViewedContext";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;  // Explicitly typed as number
    description: string | null;
    images: string[] | null;
    stock: number | null;
    featured: boolean | null;
    category: {
      name: string;
    } | null;
  };
  onQuickView: (product: any) => void;
}

const formatPrice = (price: number) => {
  return `$${price.toFixed(2)}`;
};

export const ProductCard = ({ product, onQuickView }: ProductCardProps) => {
  const { addItem } = useCart();
  const { addToRecentlyViewed } = useRecentlyViewed();
  const [zoomedImageId, setZoomedImageId] = useState<string | null>(null);
  const { toast } = useToast();

  return (
    <div 
      className="group animate-fade-up transition-all duration-300 hover:shadow-xl rounded-xl"
      role="gridcell"
      tabIndex={0}
      aria-label={`${product.name} - ${formatPrice(product.price)}`}
    >
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="aspect-square overflow-hidden">
          <img
            src={product.images?.[0] || '/placeholder.svg'}
            alt={product.name}
            className={`w-full h-full object-cover transform transition-all duration-500 ${
              zoomedImageId === product.id ? 'scale-150' : 'group-hover:scale-110'
            }`}
            onMouseEnter={() => setZoomedImageId(product.id)}
            onMouseLeave={() => setZoomedImageId(null)}
            loading="lazy"
          />
          {product.featured && (
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium">Featured</span>
            </div>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <div className="flex gap-2">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                addItem({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.images?.[0] || '/placeholder.svg'
                });
                toast({
                  title: "Added to bag",
                  description: `${product.name} has been added to your shopping bag.`,
                });
              }}
              className="flex-1 bg-white text-black hover:bg-white/90"
              variant="secondary"
            >
              Add to Bag
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product);
                addToRecentlyViewed({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.images?.[0] || '/placeholder.svg'
                });
              }}
              className="bg-white text-black hover:bg-white/90 px-3"
              variant="secondary"
              size="icon"
            >
              <Eye className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-4 space-y-1 p-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-left line-clamp-1">{product.name}</h3>
            <p className="text-nike-gray mt-1 text-left font-medium">{formatPrice(product.price)}</p>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm text-green-600">{product.stock} in stock</p>
              {product.category?.name && (
                <>
                  <span className="text-nike-gray">•</span>
                  <p className="text-sm text-nike-gray">{product.category.name}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};