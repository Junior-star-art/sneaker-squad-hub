import { products } from "@/components/ProductGrid";
import { Card } from "@/components/ui/card";

const iconicProducts = products.filter(product => 
  product.name.includes('Air Force 1') || 
  product.name.includes('Air Jordan')
);

const ShopIcons = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-4">Shop Our Icons</h2>
        <p className="text-nike-gray text-center mb-12">Legendary styles that defined generations</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {iconicProducts.slice(0, 2).map((product) => (
            <Card 
              key={product.id} 
              className="group overflow-hidden animate-fade-up hover:shadow-xl transition-shadow"
            >
              <div className="relative aspect-[16/9]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center justify-center h-full">
                    <span className="text-white text-xl font-bold">Shop Now</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold">{product.name}</h3>
                <p className="text-nike-gray mt-2">{product.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopIcons;