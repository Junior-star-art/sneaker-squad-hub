import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "./ProductCard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Sparkles } from "lucide-react";

interface ProductRecommendationsProps {
  currentProductId: string;
  categoryId?: string;
}

export const ProductRecommendations = ({
  currentProductId,
  categoryId,
}: ProductRecommendationsProps) => {
  const { data: recommendations } = useQuery({
    queryKey: ["product-recommendations", currentProductId, categoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, category:categories(name)")
        .neq("id", currentProductId)
        .eq("category_id", categoryId)
        .order("recommendation_score", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
    enabled: !!categoryId,
  });

  if (!recommendations?.length) return null;

  return (
    <div className="py-8">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-purple-100 rounded-full">
          <Sparkles className="w-5 h-5 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold">You May Also Like</h2>
      </div>
      <ScrollArea className="w-full whitespace-nowrap pb-4">
        <div className="flex space-x-4">
          {recommendations.map((product) => (
            <div key={product.id} className="w-[250px] flex-none">
              <ProductCard
                product={product}
                onQuickView={() => {}}
              />
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};