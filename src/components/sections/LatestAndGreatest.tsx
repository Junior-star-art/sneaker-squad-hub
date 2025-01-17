import { products } from "@/components/ProductGrid";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const LatestAndGreatest = () => {
  // Get the latest 4 products
  const latestProducts = products.slice(0, 4);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold">Latest & Greatest</h2>
            <p className="text-nike-gray mt-2">Fresh drops and bestsellers</p>
          </div>
          <Button variant="ghost" className="group">
            View All
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestProducts.map((product) => (
            <Card key={product.id} className="group overflow-hidden animate-fade-up">
              <div className="aspect-square overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-nike-gray mt-1">{product.price}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestAndGreatest;