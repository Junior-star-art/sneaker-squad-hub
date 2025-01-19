import { useState } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import ProductQuickView from "@/components/ProductQuickView";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  images: string[] | null;
  stock: number | null;
  featured: boolean | null;
  category: {
    name: string;
  } | null;
  category_id: string | null;
  created_at?: string;
}

const fetchLatestProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(name)
    `)
    .order('created_at', { ascending: false })
    .limit(4);

  if (error) throw error;
  return data as Product[];
};

const LatestAndGreatest = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['latest-products'],
    queryFn: fetchLatestProducts,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading products</div>;
  }

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Latest & Greatest</h2>
          <p className="text-gray-600">Check out our newest arrivals</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products?.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={() => setSelectedProduct(product)}
            />
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