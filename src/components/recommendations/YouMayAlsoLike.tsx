import React from 'react';
import { ProductCard } from "@/components/product/ProductCard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/use-mobile";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
    staleTime: 5 * 60 * 1000,
    retry: 3,
    meta: {
      errorMessage: "Error loading recommendations"
    }
  });

  if (error) {
    toast({
      title: "Error loading recommendations",
      description: "Please try again later.",
      variant: "destructive",
    });
    console.error('Error fetching recommendations:', error);
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
        <div key={index} className="w-[250px] flex-none animate-pulse">
          <Skeleton className="h-[300px] w-full rounded-lg" />
          <div className="mt-4 space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const scrollAmount = direction === 'left' ? -container.offsetWidth : container.offsetWidth;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <ErrorBoundary>
      <section 
        className="py-8 px-4 sm:px-6 lg:px-8 bg-white"
        aria-label="Product recommendations"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-100 rounded-full">
                <Sparkles className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold">You May Also Like</h2>
            </div>
            {!isMobile && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => scroll('left')}
                  className="rounded-full"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => scroll('right')}
                  className="rounded-full"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <ScrollArea className="w-full">
            <div 
              ref={scrollContainerRef}
              className={cn(
                "flex gap-4 pb-4",
                isMobile ? "overflow-x-auto snap-x snap-mandatory" : ""
              )}
            >
              {isLoading ? (
                renderSkeletons()
              ) : (
                recommendations?.map((product) => (
                  <div 
                    key={product.id} 
                    className={cn(
                      "flex-none transition-transform",
                      isMobile ? "w-[80vw] snap-center" : "w-[250px]",
                      "animate-fade-up hover:scale-[1.02] duration-300"
                    )}
                  >
                    <ProductCard
                      product={product}
                      onQuickView={() => {}}
                    />
                  </div>
                ))
              )}
            </div>
            {!isMobile && <ScrollBar orientation="horizontal" />}
          </ScrollArea>
        </div>
      </section>
    </ErrorBoundary>
  );
};