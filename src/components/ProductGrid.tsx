import { useCart } from "@/contexts/CartContext";
import { useRecentlyViewed } from "@/contexts/RecentlyViewedContext";
import { useState, useRef } from "react";
import ProductQuickView from "./ProductQuickView";
import SizeGuide from "./SizeGuide";
import ProductSkeleton from "./ProductSkeleton";
import { useToast } from "@/components/ui/use-toast";
import ErrorBoundary from "./ErrorBoundary";
import PullToRefresh from 'react-pull-to-refresh';
import BackToTop from './BackToTop';
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "./product/ProductCard";

interface SupabaseProduct {
  id: string;
  name: string;
  description: string | null;
  price: number;
  images: string[] | null;
  stock: number | null;
  featured: boolean | null;
  category: {
    name: string;
  } | null;
}

const fetchProducts = async () => {
  console.log('Fetching products...');
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(name)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
  
  console.log('Products fetched:', data);
  return data as SupabaseProduct[];
};

const ProductGrid = () => {
  const [selectedProduct, setSelectedProduct] = useState<SupabaseProduct | null>(null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [page, setPage] = useState(1);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    meta: {
      onError: (error: Error) => {
        console.error('Query error:', error);
        toast({
          title: "Error loading products",
          description: "There was a problem loading the products. Please try again later.",
          variant: "destructive",
        });
      }
    }
  });

  const handleRefresh = async () => {
    window.location.reload();
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error loading products. Please try again later.</p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <PullToRefresh onRefresh={handleRefresh} distanceToRefresh={70}>
          <div>
            <h2 className="text-4xl font-bold mb-4 text-left animate-fade-up">
              Trending Now
            </h2>
            <p className="text-nike-gray mb-8 text-left animate-fade-up delay-100">
              Discover our latest collection of innovative Nike footwear
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" role="grid" aria-label="Product grid">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, index) => (
                  <ProductSkeleton key={index} />
                ))
              ) : (
                products?.slice(0, page * 8).map((product) => (
                  <ProductCard 
                    key={product.id}
                    product={product}
                    onQuickView={(product) => setSelectedProduct(product)}
                  />
                ))
              )}
            </div>

            <div ref={loadMoreRef} className="h-10 mt-8" />

            {selectedProduct && (
              <ProductQuickView
                product={{
                  id: selectedProduct.id,
                  name: selectedProduct.name,
                  price: selectedProduct.price,  // Pass the numeric price directly
                  description: selectedProduct.description || '',
                  features: [],
                  materials: '',
                  care: '',
                  shipping: '',
                  stock: selectedProduct.stock || 0,
                  angles: selectedProduct.images || [],
                  colors: [],
                  image: selectedProduct.images?.[0] || '/placeholder.svg'
                }}
                open={Boolean(selectedProduct)}
                onOpenChange={(open) => !open && setSelectedProduct(null)}
              />
            )}
            
            <SizeGuide 
              open={sizeGuideOpen}
              onOpenChange={setSizeGuideOpen}
            />
          </div>
        </PullToRefresh>
        <BackToTop />
      </div>
    </ErrorBoundary>
  );
};

export default ProductGrid;