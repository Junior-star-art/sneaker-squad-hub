import { products } from "@/data/products";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { differenceInDays } from "date-fns";

const LatestAndGreatest = () => {
  // Sort products by release date
  const latestProducts = [...products]
    .sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())
    .slice(0, 4);

  const isNewArrival = (releaseDate: string) => {
    return differenceInDays(new Date(), new Date(releaseDate)) <= 30;
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-nike-red" />
            <div>
              <h2 className="text-3xl font-bold">Latest & Greatest</h2>
              <p className="text-nike-gray mt-2">Fresh drops and bestsellers</p>
            </div>
          </div>
          <Button variant="ghost" className="group">
            View All
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestProducts.map((product, index) => (
            <Card 
              key={product.id} 
              className={`group overflow-hidden animate-fade-up hover:shadow-xl transition-all duration-300 ${
                index === 0 ? 'sm:col-span-2 sm:row-span-2' : ''
              }`}
            >
              <div className="aspect-square overflow-hidden relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                {isNewArrival(product.releaseDate) && (
                  <Badge className="absolute top-4 right-4 bg-nike-red text-white">
                    New Arrival
                  </Badge>
                )}
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-nike-gray mt-1">{product.price}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Clock className="w-4 h-4 text-nike-gray" />
                  <p className="text-sm text-nike-gray">
                    Released {new Date(product.releaseDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestAndGreatest;