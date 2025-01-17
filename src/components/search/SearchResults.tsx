import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Eye, ShoppingBag } from "lucide-react";
import { useRecentlyViewed } from "@/contexts/RecentlyViewedContext";
import { useToast } from "@/components/ui/use-toast";
import ProductQuickView from "@/components/ProductQuickView";
import { motion } from "framer-motion";

type SearchResultsProps = {
  results: Product[];
  searchQuery: string;
};

const SearchResults = ({ results, searchQuery }: SearchResultsProps) => {
  const { addItem } = useCart();
  const { addToRecentlyViewed } = useRecentlyViewed();
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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

  const handleAddToBag = (product: Product) => {
    addItem(product);
    toast({
      title: "Added to bag",
      description: `${product.name} has been added to your shopping bag.`,
    });
  };

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    addToRecentlyViewed(product);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
        {results.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="group relative"
          >
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
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
            <div className="mt-4">
              <h3 className="text-sm font-medium">{product.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{product.price}</p>
              {product.stock < 5 && product.stock > 0 && (
                <p className="text-xs text-red-500 mt-1">
                  Only {product.stock} left in stock!
                </p>
              )}
              {product.stock === 0 && (
                <p className="text-xs text-red-500 mt-1">Out of stock</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {selectedProduct && (
        <ProductQuickView
          product={selectedProduct}
          open={Boolean(selectedProduct)}
          onOpenChange={(open) => !open && setSelectedProduct(null)}
        />
      )}
    </>
  );
};

export default SearchResults;