import { useCart } from "@/contexts/CartContext";
import { useRecentlyViewed } from "@/contexts/RecentlyViewedContext";
import { useState, useRef, useEffect } from "react";
import ProductQuickView from "./ProductQuickView";
import SizeGuide from "./SizeGuide";
import ProductSkeleton from "./ProductSkeleton";
import { useToast } from "@/components/ui/use-toast";
import ErrorBoundary from "./ErrorBoundary";
import BackToTop from './BackToTop';
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { ProductCard } from "./product/ProductCard";
import { Button } from "./ui/button";
import { useInView } from "react-intersection-observer";
import { getRecommendedProducts } from "@/utils/recommendationsEngine";

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

const fetchProducts = async ({ pageParam = 0 }) => {
  console.log('Attempting to fetch products page:', pageParam);
  const from = pageParam * PRODUCTS_PER_PAGE;
  const to = from + PRODUCTS_PER_PAGE - 1;
  
  try {
    console.log('Supabase client status:', supabase);
    
    const { data, error, count } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(name)
      `, { count: 'exact' })
      .range(from, to)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error fetching products:', error);
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }
    
    if (!data) {
      console.warn('No data returned from Supabase');
      return { 
        products: [], 
        nextPage: undefined 
      };
    }
    
    console.log('Products fetched successfully:', {
      count: data.length,
      firstProduct: data[0],
      lastProduct: data[data.length - 1]
    });
    
    return { 
      products: data as SupabaseProduct[], 
      nextPage: data.length === PRODUCTS_PER_PAGE ? pageParam + 1 : undefined 
    };
  } catch (error) {
    console.error('Critical error in fetchProducts:', error);
    throw error;
  }
};

const fetchSimilarProducts = async (categoryId: string | null) => {
  if (!categoryId) {
    console.log('No category ID provided for similar products');
    return [];
  }
  
  try {
    console.log('Fetching similar products for category:', categoryId);
    
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(name)
      `)
      .eq('category_id', categoryId)
      .limit(4);

    if (error) {
      console.error('Error fetching similar products:', error);
      throw error;
    }

    console.log('Similar products fetched:', data?.length || 0);
    return data as SupabaseProduct[];
  } catch (error) {
    console.error('Failed to fetch similar products:', error);
    throw error;
  }
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
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
  });

  const { data: similarProducts } = useQuery({
    queryKey: ['similar-products', selectedProduct?.category_id],
    queryFn: () => fetchSimilarProducts(selectedProduct?.category_id || null),
    enabled: !!selectedProduct?.category_id,
  });

  // Add this new query for recommended products
  const { data: recommendedProducts } = useQuery({
    queryKey: ['recommended-products'],
    queryFn: async () => {
      const { data: userAuth } = await supabase.auth.getUser();
      return getRecommendedProducts(userAuth.user?.id, undefined, 4);
    },
  });

  useEffect(() => {
    console.log('ProductGrid mounted');
    return () => {
      console.log('ProductGrid unmounted');
    };
  }, []);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      console.log('Loading more products due to scroll', {
        inView,
        hasNextPage,
        isFetchingNextPage
      });
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

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
        description: "Failed to refresh products",
        variant: "destructive",
      });
    }
  };

  // Ensure we have unique keys for each product
  const allProducts = data?.pages.flatMap((page, pageIndex) => 
    page.products.map((product) => ({
      ...product,
      uniqueKey: `${product.id}-${pageIndex}` // Create a unique key combining product ID and page index
    }))
  ) || [];

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
        <Button 
          onClick={() => refetch()} 
          variant="outline"
        >
          Try Again
        </Button>
      </div>
    );
  }

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
                <ProductSkeleton key={`skeleton-${index}`} />
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
                  key={product.uniqueKey} // Use the unique key we created
                  product={product}
                  onQuickView={() => handleQuickView(product)}
                />
              ))
            )}
          </div>

          {/* Infinite Scroll Trigger */}
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

          {/* Recommended Products Section */}
          {recommendedProducts && recommendedProducts.length > 0 && (
            <div className="mt-16">
              <h3 className="text-2xl font-bold mb-6">Recommended For You</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {recommendedProducts.map((product) => (
                  <ProductCard
                    key={`recommended-${product.id}`}
                    product={product}
                    onQuickView={() => handleQuickView(product)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Similar Products Section */}
          {selectedProduct && similarProducts && similarProducts.length > 0 && (
            <div className="mt-16">
              <h3 className="text-2xl font-bold mb-6">Similar Products</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {similarProducts.map((product) => (
                  <ProductCard
                    key={`similar-${product.id}`}
                    product={product}
                    onQuickView={() => handleQuickView(product)}
                  />
                ))}
              </div>
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
