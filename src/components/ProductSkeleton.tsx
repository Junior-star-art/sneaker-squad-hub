const ProductSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  );
};

export default ProductSkeleton;