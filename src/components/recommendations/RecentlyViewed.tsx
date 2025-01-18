import { useRecentlyViewed } from "@/contexts/RecentlyViewedContext";
import { ProductCard } from "@/components/product/ProductCard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import ErrorBoundary from "@/components/ErrorBoundary";

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
  category_id: string | null;
  created_at?: string;
}

export const RecentlyViewed = () => {
  const { recentlyViewed } = useRecentlyViewed();
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "You're back online",
        description: "Your recently viewed products are now up to date.",
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "You're offline",
        description: "Some features may be limited.",
        variant: "destructive",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (recentlyViewed.length === 0) return null;

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
        aria-label="Recently viewed products"
      >
        <h2 className="text-2xl font-bold mb-4">Recently Viewed</h2>
        <ScrollArea className="w-full whitespace-nowrap rounded-lg">
          <div className="flex w-full space-x-4 pb-4">
            {isLoading ? (
              renderSkeletons()
            ) : (
              recentlyViewed.map((product) => (
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

        {!isOnline && (
          <div className="mt-4 p-4 bg-yellow-50 text-yellow-800 rounded-lg">
            <p className="text-sm">
              You're currently offline. Some product information may not be up to date.
            </p>
          </div>
        )}
      </section>
    </ErrorBoundary>
  );
};