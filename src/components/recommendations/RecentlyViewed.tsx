import { useRecentlyViewed } from "@/contexts/RecentlyViewedContext";
import { ProductCard } from "@/components/product/ProductCard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

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
}

export const RecentlyViewed = () => {
  const { recentlyViewed } = useRecentlyViewed();

  if (recentlyViewed.length === 0) return null;

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-4">Recently Viewed</h2>
      <ScrollArea className="w-full whitespace-nowrap rounded-lg">
        <div className="flex w-full space-x-4 pb-4">
          {recentlyViewed.map((product) => (
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