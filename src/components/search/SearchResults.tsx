import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import ProductQuickView from "../ProductQuickView";
import { Button } from "../ui/button";

interface SearchResult {
  id: string;
  name: string;
  price: number;
  description: string | null;
  images: string[] | null;
  stock: number | null;
}

interface SearchResultsProps {
  query: string;
  onClose: () => void;
}

export function SearchResults({ query, onClose }: SearchResultsProps) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .ilike('name', `%${query}%`)
        .limit(5);

      if (error) {
        console.error('Error fetching search results:', error);
      } else {
        setResults(data || []);
      }
      setIsLoading(false);
    };

    fetchResults();
  }, [query]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (results.length === 0 && query.trim()) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No results found for "{query}"</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((result) => (
        <div
          key={result.id}
          className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <img
            src={result.images?.[0] || '/placeholder.svg'}
            alt={result.name}
            className="w-16 h-16 object-cover rounded"
          />
          <div className="flex-1">
            <h3 className="font-medium">{result.name}</h3>
            <p className="text-sm text-gray-500">{formatPrice(result.price)}</p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setSelectedProduct(result);
              onClose();
            }}
          >
            View Details
          </Button>
        </div>
      ))}

      {selectedProduct && (
        <ProductQuickView
          product={{
            id: selectedProduct.id,
            name: selectedProduct.name,
            price: selectedProduct.price,
            description: selectedProduct.description || '',
            features: [],
            materials: '',
            care: '',
            shipping: '',
            stock: selectedProduct.stock || 0,
            colors: [],
            angles: selectedProduct.images || [],
            image: selectedProduct.images?.[0] || '/placeholder.svg'
          }}
          open={Boolean(selectedProduct)}
          onOpenChange={(open) => !open && setSelectedProduct(null)}
        />
      )}
    </div>
  );
}