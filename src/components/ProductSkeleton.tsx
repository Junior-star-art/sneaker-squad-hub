const ProductSkeleton = () => {
  return (
    <div className="animate-pulse space-y-4">
      <div className="bg-gray-200 aspect-square rounded-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 to-transparent animate-[shimmer_1.5s_infinite] translate-x-[-100%]"></div>
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 to-transparent animate-[shimmer_1.5s_infinite] translate-x-[-100%]"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 to-transparent animate-[shimmer_1.5s_infinite] translate-x-[-100%]"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-4 bg-gray-200 rounded w-1/4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 to-transparent animate-[shimmer_1.5s_infinite] translate-x-[-100%]"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-1/4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 to-transparent animate-[shimmer_1.5s_infinite] translate-x-[-100%]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;