import { Card } from "@/components/ui/card";

const ProductCardSkeleton = () => {
  return (
    <Card className="group relative overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-200 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 to-transparent animate-shimmer" />
      </div>
      <div className="p-6 space-y-4">
        <div className="h-4 bg-gray-200 rounded w-3/4">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 to-transparent animate-shimmer" />
        </div>
        <div className="h-4 bg-gray-200 rounded w-1/4">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 to-transparent animate-shimmer" />
        </div>
        <div className="h-10 bg-gray-200 rounded">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 to-transparent animate-shimmer" />
        </div>
      </div>
    </Card>
  );
};

export default ProductCardSkeleton;