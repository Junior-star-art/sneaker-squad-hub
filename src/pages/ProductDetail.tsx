import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useRecentlyViewed } from "@/contexts/RecentlyViewedContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductQuickView from "@/components/ProductQuickView";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { Breadcrumb } from "@/components/ui/breadcrumb";

const ProductDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const { addToRecentlyViewed } = useRecentlyViewed();
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          category:categories(name)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (product) {
      addToRecentlyViewed(product);
    }
  }, [product, addToRecentlyViewed]);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="aspect-square w-full" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-1/2" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to load product details. Please try again later.",
    });
    return null;
  }

  if (!product) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold">Product not found</h1>
        </div>
        <Footer />
      </div>
    );
  }

  const formattedProduct = {
    ...product,
    angles: product.images || [],
    colors: product.colors || [],
    features: [],
    materials: "",
    care: "",
    shipping: "Free standard shipping on orders over $100",
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: product.category?.name || "Products", href: "#" },
            { label: product.name, href: "#" },
          ]}
        />
        <ProductQuickView
          product={formattedProduct}
          open={isQuickViewOpen}
          onOpenChange={setIsQuickViewOpen}
        />
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;