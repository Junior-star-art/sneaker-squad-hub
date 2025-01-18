import { useEffect, useState } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  description: string;
}

const fetchRecommendations = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('recommendation_score', { ascending: false })
    .limit(10);

  if (error) throw error;
  return data;
};

export const YouMayAlsoLike = () => {
  const { data: recommendations, isLoading } = useQuery({
    queryKey: ['recommendations'],
    queryFn: fetchRecommendations,
  });

  if (isLoading || !recommendations?.length) return null;

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-4">You May Also Like</h2>
      <ScrollArea className="w-full whitespace-nowrap rounded-lg">
        <div className="flex w-full space-x-4 pb-4">
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