import { products } from "@/data/products";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Eye, TrendingUp } from "lucide-react";

const calculateTrendingScore = (product: typeof products[0]) => {
  const stockScore = Math.max(0, 100 - product.stock) * 0.4;
  const viewScore = (product.views || 0) * 0.3;
  const salesScore = (product.salesVolume || 0) * 0.3;
  return stockScore + viewScore + salesScore;
};

const TrendingThisWeek = () => {
  const trendingProducts = [...products]
    .sort((a, b) => calculateTrendingScore(b) - calculateTrendingScore(a))
    .slice(0, 3);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 justify-center mb-4">
          <Flame className="w-6 h-6 text-nike-red" />
          <h2 className="text-3xl font-bold text-center">Trending This Week</h2>
        </div>
        <p className="text-nike-gray text-center mb-12">What's hot right now</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trendingProducts.map((product, index) => (
            <Card 
              key={product.id} 
              className={`group relative overflow-hidden animate-fade-up hover:shadow-xl transition-all duration-300 ${
                index === 0 ? 'md:col-span-2' : ''
              }`}
            >
              <Badge 
                className="absolute top-4 right-4 bg-nike-red text-white z-10"
                variant="secondary"
              >
                <TrendingUp className="w-4 h-4 mr-1" />
                Trending
              </Badge>
              <div className="aspect-square overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg">{product.name}</h3>
                <p className="text-nike-gray mt-2">{product.price}</p>
                <div className="flex items-center gap-2 mt-4">
                  <Eye className="w-4 h-4 text-nike-gray" />
                  <span className="text-sm text-nike-gray">
                    {product.views?.toLocaleString()} people viewed this item
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm text-green-600">{product.stock} in stock</span>
                  <span className="text-nike-gray">•</span>
                  <span className="text-sm text-nike-gray">{product.salesVolume} sold</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingThisWeek;