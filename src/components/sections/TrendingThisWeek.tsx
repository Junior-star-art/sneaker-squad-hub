import { products } from "@/data/products";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame } from "lucide-react";

const TrendingThisWeek = () => {
  // Simulate trending products based on stock (lower stock might indicate higher sales)
  const trendingProducts = [...products]
    .sort((a, b) => a.stock - b.stock)
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
          {trendingProducts.map((product) => (
            <Card 
              key={product.id} 
              className="group relative overflow-hidden animate-fade-up"
            >
              <Badge 
                className="absolute top-4 right-4 bg-nike-red text-white"
                variant="secondary"
              >
                Trending
              </Badge>
              <div className="aspect-square overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg">{product.name}</h3>
                <p className="text-nike-gray mt-2">{product.price}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingThisWeek;