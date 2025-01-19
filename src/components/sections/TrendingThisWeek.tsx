import { products } from "@/data/products";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Eye, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ProductQuickView from "../ProductQuickView";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/use-toast";

const calculateTrendingScore = (product: typeof products[0]) => {
  const stockScore = Math.max(0, 100 - product.stock) * 0.4;
  const viewScore = (product.views || 0) * 0.3;
  const salesScore = (product.salesVolume || 0) * 0.3;
  return stockScore + viewScore + salesScore;
};

const TrendingThisWeek = () => {
  const [selectedProduct, setSelectedProduct] = useState<(typeof products[0]) | null>(null);
  const { addItem } = useCart();
  const { toast } = useToast();
  
  const trendingProducts = [...products]
    .sort((a, b) => calculateTrendingScore(b) - calculateTrendingScore(a))
    .slice(0, 3);

  const handleAddToCart = (product: typeof products[0], e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price.replace('$', '')),
      image: product.image
    });
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 bg-red-100 text-nike-red px-4 py-2 rounded-full mb-4">
            <Flame className="w-5 h-5" />
            <span className="font-medium">Trending Now</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold">What's Hot Right Now</h2>
          <p className="text-gray-600 mt-2 max-w-xl">
            Discover the most popular items our community is loving this week
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trendingProducts.map((product, index) => (
            <Card 
              key={product.id} 
              className={`group relative overflow-hidden animate-fade-up hover:shadow-xl transition-all duration-300 cursor-pointer ${
                index === 0 ? 'md:col-span-2' : ''
              }`}
              onClick={() => setSelectedProduct(product)}
            >
              <Badge 
                className="absolute top-4 right-4 bg-nike-red text-white z-10"
                variant="secondary"
              >
                <TrendingUp className="w-4 h-4 mr-1" />
                Trending
              </Badge>
              <div className={`aspect-square ${index === 0 ? 'md:aspect-[16/9]' : ''} overflow-hidden`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg line-clamp-1">{product.name}</h3>
                <p className="text-nike-gray mt-2">{product.price}</p>
                <div className="flex items-center gap-2 mt-4">
                  <Eye className="w-4 h-4 text-nike-gray" />
                  <span className="text-sm text-nike-gray">
                    {product.views?.toLocaleString()} views
                  </span>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm text-green-600">{product.stock} in stock</span>
                  <span className="text-sm text-nike-gray">{product.salesVolume} sold</span>
                </div>
                <Button 
                  className="w-full mt-4"
                  onClick={(e) => handleAddToCart(product, e)}
                >
                  Add to Cart
                </Button>
              </div>
            </Card>
          ))}
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
              angles: [selectedProduct.image],
              colors: [],
              image: selectedProduct.image
            }}
            open={Boolean(selectedProduct)}
            onOpenChange={(open) => !open && setSelectedProduct(null)}
          />
        )}
      </div>
    </section>
  );
};

export default TrendingThisWeek;