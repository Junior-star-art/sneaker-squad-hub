import { products } from "@/data/products";
import { Card } from "@/components/ui/card";
import { Star, History } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const iconicProducts = products.filter(product => 
  product.isIconic && (
    product.name.includes('Air Force 1') || 
    product.name.includes('Air Jordan')
  )
);

const ShopIcons = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-6 h-6 text-nike-red" />
          <h2 className="text-3xl font-bold">Shop Our Icons</h2>
        </div>
        <p className="text-nike-gray mb-12">Legendary styles that defined generations</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {iconicProducts.slice(0, 2).map((product) => (
            <Card 
              key={product.id} 
              className="group overflow-hidden animate-fade-up hover:shadow-xl transition-shadow"
            >
              <div className="relative aspect-[16/9]">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <Badge 
                  className="absolute top-4 right-4 bg-nike-red text-white"
                  variant="secondary"
                >
                  Legacy
                </Badge>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <History className="w-4 h-4 text-nike-red" />
                  <span className="text-sm font-medium">Heritage Collection</span>
                </div>
                <h3 className="text-2xl font-bold">{product.name}</h3>
                <p className="text-nike-gray mt-2 line-clamp-2">{product.description}</p>
                {product.heritage && (
                  <p className="mt-4 text-sm text-nike-gray italic">
                    "{product.heritage}"
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopIcons;