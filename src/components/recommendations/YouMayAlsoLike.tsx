import { ProductCard } from "@/components/product/ProductCard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/use-mobile";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useToast } from "@/components/ui/use-toast";

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

const fetchRecommendations = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(name)')
    .order('recommendation_score', { ascending: false })
    .limit(10);

  if (error) throw error;
  return data as Product[];
};

export const YouMayAlsoLike = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const { data: recommendations, isLoading, error } = useQuery({
    queryKey: ['recommendations'],
    queryFn: fetchRecommendations,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    onError: (error) => {
      toast({
        title: "Error loading recommendations",
        description: "Please try again later.",
        variant: "destructive",
      });
      console.error('Error fetching recommendations:', error);
    },
  });

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-800 rounded-lg">
        <p>Unable to load recommendations. Please try again later.</p>
      </div>
    );
  }

  if (!recommendations?.length && !isLoading) return null;

  const renderSkeletons = () => (
    <div className="flex space-x-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="w-[250px] flex-none">
          <Skeleton className="h-[300px] w-full rounded-lg" />
        </div>
      ))}
    </div>
  );

  return (
    <ErrorBoundary>
      <section 
        className="py-8"
        aria-label="Product recommendations"
      >
        <h2 className="text-2xl font-bold mb-4">You May Also Like</h2>
        <ScrollArea className="w-full whitespace-nowrap rounded-lg">
          <div className="flex w-full space-x-4 pb-4">
            {isLoading ? (
              renderSkeletons()
            ) : (
              recommendations?.map((product) => (
                <div 
                  key={product.id} 
                  className={`${isMobile ? 'w-[80vw]' : 'w-[250px]'} flex-none`}
                >
                  <ProductCard
                    product={product}
                    onQuickView={() => {}}
                  />
                </div>
              ))
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>
    </ErrorBoundary>
  );
};