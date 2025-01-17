import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Eye, ShoppingBag, Star, Heart } from "lucide-react";
import { useRecentlyViewed } from "@/contexts/RecentlyViewedContext";
import { useToast } from "@/hooks/use-toast";
import ProductQuickView from "@/components/ProductQuickView";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface SearchProduct {
  id: string;
  name: string;
  price: number;  // Changed from string to number
  description: string;
  image: string;
  stock?: number;
  rating?: number;
}

type SearchResultsProps = {
  results: SearchProduct[];
  searchQuery: string;
};

const SearchResults = ({ results, searchQuery }: SearchResultsProps) => {
  const { addItem } = useCart();
  const { addToRecentlyViewed } = useRecentlyViewed();
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<SearchProduct | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  if (!searchQuery) {
    return null;
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          No results found for "{searchQuery}"
        </p>
      </div>
    );
  }

  const handleAddToBag = (product: SearchProduct) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    });
    toast({
      title: "Added to bag",
      description: `${product.name} has been added to your shopping bag.`,
    });
  };

  const handleQuickView = (product: SearchProduct) => {
    setSelectedProduct(product);
    addToRecentlyViewed({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    });
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
    
    toast({
      title: wishlist.includes(productId) ? "Removed from wishlist" : "Added to wishlist",
      description: `Item has been ${wishlist.includes(productId) ? "removed from" : "added to"} your wishlist.`,
    });
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
        <AnimatePresence>
          {results.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="group relative"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <div className="aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-gray-50 to-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className={`h-full w-full object-cover object-center transform transition-transform duration-500 ${
                    hoveredProduct === product.id ? 'scale-110' : ''
                  }`}
                  loading="lazy"
                />
                {product.rating && (
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-medium">{product.rating}</span>
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="bg-white/90 backdrop-blur-sm hover:bg-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                  >
                    <Heart className={`h-4 w-4 ${wishlist.includes(product.id) ? "fill-red-500 text-red-500" : ""}`} />
                  </Button>
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleAddToBag(product)}
                    className="bg-white text-black hover:bg-white/90"
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Add to Bag
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => handleQuickView(product)}
                    className="bg-white text-black hover:bg-white/90"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <h3 className="text-sm font-medium line-clamp-1">{product.name}</h3>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">{formatPrice(product.price)}</p>
                  {typeof product.stock === 'number' && product.stock < 5 && (
                    <Badge variant={product.stock === 0 ? "destructive" : "secondary"}>
                      {product.stock === 0 ? "Out of Stock" : `${product.stock} left`}
                    </Badge>
                  )}
                </div>
                {product.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {selectedProduct && (
        <ProductQuickView
          product={{
            id: selectedProduct.id,
            name: selectedProduct.name,
            price: selectedProduct.price,
            description: selectedProduct.description,
            features: [],
            materials: '',
            care: '',
            shipping: '',
            stock: selectedProduct.stock || 0,
            angles: [selectedProduct.image],
            colors: [],
            image: selectedProduct.image
          }}
          open={Boolean(selectedProduct)}
          onOpenChange={(open) => !open && setSelectedProduct(null)}
        />
      )}
    </>
  );
};

export default SearchResults;
