import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Eye, ShoppingBag } from "lucide-react";
import { useRecentlyViewed } from "@/contexts/RecentlyViewedContext";

type Color = {
  name: string;
  code: string;
  image: string;
};

type Product = {
  id: number;
  name: string;
  price: string;
  description: string;
  features: string[];
  materials: string;
  care: string;
  shipping: string;
  stock: number;
  colors: Color[];
  angles: string[];
  image: string;
};

type SearchResultsProps = {
  results: Product[];
  searchQuery: string;
};

const SearchResults = ({ results, searchQuery }: SearchResultsProps) => {
  const { addItem } = useCart();
  const { addToRecentlyViewed } = useRecentlyViewed();
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
      {results.map((product) => (
        <div key={product.id} className="group relative">
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover object-center transform group-hover:scale-105 transition duration-300"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => addItem(product)}
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Add to Bag
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={() => {
                  setSelectedProduct(product);
                  addToRecentlyViewed(product);
                }}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-sm font-medium">{product.name}</h3>
            <p className="text-sm text-muted-foreground">{product.price}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;