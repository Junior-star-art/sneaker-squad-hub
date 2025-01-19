import { products } from "@/data/products";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";
import ProductQuickView from "../ProductQuickView";
import { ProductCard } from "../product/ProductCard";

const LatestAndGreatest = () => {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  const latestProducts = [...products]
    .sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())
    .slice(0, 4);

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-12">
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left mb-6 sm:mb-0">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-nike-red" />
              <span className="text-sm font-medium text-nike-red">New Arrivals</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold">Latest & Greatest</h2>
            <p className="text-gray-600 mt-2">Fresh drops and bestsellers</p>
          </div>
          <Button variant="ghost" className="group hidden sm:flex">
            View All
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {latestProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                description: product.description,
                images: [product.image],
                stock: product.stock,
                featured: false,
                category: { name: product.category },
                created_at: product.releaseDate
              }}
              onQuickView={setSelectedProduct}
            />
          ))}
        </div>
        <Button variant="ghost" className="w-full mt-6 sm:hidden">
          View All
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>

      {selectedProduct && (
        <ProductQuickView
          product={{
            id: selectedProduct.id,
            name: selectedProduct.name,
            price: selectedProduct.price,
            description: selectedProduct.description || '',
            features: [],
            materials: '',
            care: '',
            shipping: '',
            stock: selectedProduct.stock || 0,
            angles: selectedProduct.images || [],
            colors: [],
            image: selectedProduct.images?.[0] || '/placeholder.svg'
          }}
          open={Boolean(selectedProduct)}
          onOpenChange={(open) => !open && setSelectedProduct(null)}
        />
      )}
    </section>
  );
};

export default LatestAndGreatest;