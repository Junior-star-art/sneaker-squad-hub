
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ProductQuickView from "../ProductQuickView";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/use-toast";
import ProductSkeleton from "../ProductSkeleton";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  images: string[] | null;
  stock: number | null;
  category: {
    name: string;
  } | null;
}

const LatestAndGreatest = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { addItem } = useCart();
  const { toast } = useToast();

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['latest-products'],
    queryFn: async () => {
      console.log('Fetching latest products...'); // Debug log
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(name)
        `)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) {
        console.error('Supabase query error:', error); // Debug log
        throw error;
      }

      console.log('Products fetched:', data); // Debug log
      return data as Product[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 30000),
  });

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || '/placeholder.svg'
    });
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error loading products</p>
      </div>
    );
  }

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold sm:text-4xl mb-4">Latest & Greatest</h2>
          <p className="text-lg text-gray-600">
            Check out our newest arrivals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))
          ) : (
            products?.map((product) => (
              <Card
                key={product.id}
                className="group relative overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <Badge className="absolute top-4 left-4 bg-purple-600 text-white">
                  <Star className="w-3 h-3 mr-1" />
                  New Arrival
                </Badge>
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.images?.[0] || '/placeholder.svg'}
                    alt={product.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                    <p className="text-gray-600">${product.price}</p>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">
                      {product.category?.name}
                    </span>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm">Quick view</span>
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    onClick={(e) => handleAddToCart(product, e)}
                  >
                    Add to Cart
                  </Button>
                </div>
              </Card>
            ))
          )}
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
      </div>
    </section>
  );
};

export default LatestAndGreatest;
