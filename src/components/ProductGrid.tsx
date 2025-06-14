
import { useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { useRecentlyViewed } from "@/contexts/RecentlyViewedContext";
import { useState } from "react";
import ProductQuickView from "./ProductQuickView";
import SizeGuide from "./SizeGuide";
import ProductCardSkeleton from "./product/ProductCardSkeleton";
import { useToast } from "@/hooks/use-toast";
import ErrorBoundary from "./ErrorBoundary";
import BackToTop from './BackToTop';
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { ProductCard } from "./product/ProductCard";
import { Button } from "./ui/button";
import { useInView } from "react-intersection-observer";
import { PostgrestError } from "@supabase/supabase-js";

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
  category_id: string | null;
  created_at?: string;
}

const PRODUCTS_PER_PAGE = 8;
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000;

const fetchProducts = async ({ pageParam = 0 }) => {
  const from = pageParam * PRODUCTS_PER_PAGE;
  const to = from + PRODUCTS_PER_PAGE - 1;
  const requestId = Math.random().toString(36).substring(7);

  console.log('Initiating product fetch:', { 
    requestId,
    from, 
    to, 
    timestamp: new Date().toISOString()
  });

  let retryCount = 0;
  let lastError: Error | PostgrestError | null = null;

  while (retryCount < MAX_RETRIES) {
    try {
      if (!supabase) {
        throw new Error('Supabase client is not initialized');
      }

      const { data, error, count } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(name)
        `, { count: 'exact' })
        .range(from, to)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error details:', {
          requestId,
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          timestamp: new Date().toISOString(),
          retryCount,
          requestDetails: {
            from,
            to,
            pageParam
          }
        });
        throw error;
      }

      if (!data) {
        console.warn('No data returned from Supabase', {
          requestId,
          timestamp: new Date().toISOString(),
          retryCount,
          requestDetails: {
            from,
            to,
            pageParam
          }
        });
        return {
          products: [],
          nextPage: undefined,
          total: 0
        };
      }

      console.log('Products fetched successfully:', {
        requestId,
        count: data.length,
        total: count,
        timestamp: new Date().toISOString(),
        retryAttempt: retryCount
      });

      return {
        products: data as SupabaseProduct[],
        nextPage: data.length === PRODUCTS_PER_PAGE ? pageParam + 1 : undefined,
        total: count
      };
    } catch (error) {
      console.error('Fetch error:', {
        requestId,
        error,
        retryCount,
        timestamp: new Date().toISOString(),
        errorType: error instanceof Error ? 'Error' : 'PostgrestError',
        errorDetails: {
          message: error instanceof Error ? error.message : (error as PostgrestError).message,
          name: error instanceof Error ? error.name : 'PostgrestError'
        }
      });

      lastError = error as Error | PostgrestError;
      retryCount++;

      if (retryCount < MAX_RETRIES) {
        const delay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount - 1);
        console.log(`Retry attempt ${retryCount} after ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  if (lastError) {
    throw lastError;
  }

  throw new Error('Failed to fetch products after all retries');
};

const ProductGrid = () => {
  const [selectedProduct, setSelectedProduct] = useState<SupabaseProduct | null>(null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { ref: loadMoreRef, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch
  } = useInfiniteQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 30000),
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      console.log('Loading more products due to scroll', {
        inView,
        hasNextPage,
        isFetchingNextPage
      });
      void fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (error) {
      console.error('Product fetch error:', {
        error,
        timestamp: new Date().toISOString(),
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        type: error instanceof Error ? error.constructor.name : typeof error
      });

      toast({
        title: "Error loading products",
        description: error instanceof Error ? error.message : "Failed to load products",
        variant: "destructive"
      });
    }
  }, [error, toast]);

  const handleRefresh = async () => {
    console.log('Manually refreshing products');
    try {
      await queryClient.invalidateQueries({ queryKey: ['products'] });
      await refetch();
      toast({
        title: "Success",
        description: "Products refreshed successfully",
      });
    } catch (error) {
      console.error('Error during manual refresh:', error);
      toast({
        title: "Error",
        description: "Failed to refresh products. Please try again.",
        variant: "destructive",
      });
    }
  };

  const allProducts = data?.pages.flatMap((page) => 
    page.products.map((product) => ({
      ...product,
      uniqueKey: `${product.id}-${Math.random()}`
    }))
  ) || [];

  const handleQuickView = (product: SupabaseProduct) => {
    console.log('Opening quick view for product:', product.id);
    setSelectedProduct(product);
  };

  return (
    <ErrorBoundary>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
                <ProductCardSkeleton key={`skeleton-${index}`} />
              ))
            ) : !allProducts?.length ? (
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
              allProducts.map((product) => (
                <ProductCard 
                  key={product.uniqueKey}
                  product={product}
                  onQuickView={() => handleQuickView(product)}
                />
              ))
            )}
          </div>

          {!isLoading && hasNextPage && (
            <div ref={loadMoreRef} className="flex justify-center mt-8">
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? 'Loading more...' : 'Load more products'}
              </Button>
            </div>
          )}

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
        <BackToTop />
      </div>
    </ErrorBoundary>
  );
};

export default ProductGrid;
