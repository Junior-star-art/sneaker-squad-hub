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
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  console.log('Starting to fetch products...');
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
  
  console.log('Products fetched successfully:', data);
  console.log('Number of products:', data?.length || 0);
  return data as SupabaseProduct[];
};

const ProductGrid = () => {
  const [selectedProduct, setSelectedProduct] = useState<SupabaseProduct | null>(null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [page, setPage] = useState(1);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products, isLoading, error, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
    meta: {
      errorMessage: "Failed to load products"
    }
  });

  console.log('Current products state:', {
    isLoading,
    error,
    productsLength: products?.length || 0,
    products
  });

  const handleRefresh = async () => {
    try {
      await queryClient.invalidateQueries({ queryKey: ['products'] });
      await refetch();
      toast({
        title: "Success",
        description: "Products refreshed successfully",
      });
    } catch (error) {
      console.error('Refresh error:', error);
      toast({
        title: "Error",
        description: "Failed to refresh products",
        variant: "destructive",
      });
    }
  };

  if (error) {
    console.error('Product grid error:', error);
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="text-red-500 mb-4">
          <svg
            className="h-12 w-12 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <p className="text-lg font-medium text-gray-900 mb-2">Unable to load products</p>
        <p className="text-gray-500 text-center mb-6">
          There was a problem loading the products. Please try again.
        </p>
        <button 
          onClick={() => refetch()} 
          className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
        >
          Try Again
        </button>
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
              ) : !products?.length ? (
                <div className="col-span-full text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
                    <svg
                      className="w-full h-full"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-500">Check back later for new arrivals.</p>
                </div>
              ) : (
                products.slice(0, page * 8).map((product) => (
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
                  price: selectedProduct.price,
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