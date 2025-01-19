import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/product/ProductCard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Sparkles, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import ProductQuickView from "../ProductQuickView";

interface ProductRecommendationsProps {
  currentProductId: string;
  categoryId?: string;
}

export const ProductRecommendations = ({
  currentProductId,
  categoryId,
}: ProductRecommendationsProps) => {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const { data: recommendations, isLoading } = useQuery({
    queryKey: ["product-recommendations", currentProductId, categoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, category:categories(name)")
        .neq("id", currentProductId)
        .eq("category_id", categoryId)
        .order("recommendation_score", { ascending: false })
        .limit(8);

      if (error) throw error;
      return data;
    },
    enabled: !!categoryId,
  });

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollAmount = direction === 'left' ? -300 : 300;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  if (!recommendations?.length) return null;

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-100 rounded-full">
            <Sparkles className="w-5 h-5 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold">Similar Products</h2>
        </div>
        {!isMobile && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('left')}
              className="rounded-full hover:bg-purple-50"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('right')}
              className="rounded-full hover:bg-purple-50"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      
      <ScrollArea className="w-full">
        <div 
          ref={scrollContainerRef}
          className="flex gap-4 pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {recommendations.map((product) => (
            <div 
              key={product.id} 
              className="w-[250px] flex-none"
            >
              <ProductCard
                product={product}
                onQuickView={() => setSelectedProduct(product)}
              />
            </div>
          ))}
        </div>
        {!isMobile && <ScrollBar orientation="horizontal" />}
      </ScrollArea>

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
    </div>
  );
};