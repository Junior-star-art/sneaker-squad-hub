import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useRecentlyViewed } from "@/contexts/RecentlyViewedContext";
import { useCart } from "@/contexts/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ImageGallery } from "@/components/product/ImageGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { AddToCartSection } from "@/components/product/AddToCartSection";
import { EnhancedReviews } from "@/components/product/EnhancedReviews";
import SizeGuide from "@/components/SizeGuide";
import { Button } from "@/components/ui/button";
import { Ruler } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const { addToRecentlyViewed } = useRecentlyViewed();
  const { addItem } = useCart();
  const [selectedColor, setSelectedColor] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

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
      setSelectedImage(product.images?.[0] || "");
    }
  }, [product, addToRecentlyViewed]);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar onCartClick={() => setIsCartDrawerOpen(true)} />
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
        <Navbar onCartClick={() => setIsCartDrawerOpen(true)} />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold">Product not found</h1>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: "Please select a size",
        description: "You must select a size before adding to cart",
        variant: "destructive",
      });
      return;
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: selectedImage || product.images?.[0],
      size: selectedSize,
    });

    toast({
      title: "Added to cart",
      description: "Item has been added to your cart",
    });
  };

  const formattedProduct = {
    ...product,
    angles: product.images || [],
    features: [],
    materials: "",
    care: "",
    shipping: "Free standard shipping on orders over $100",
  };

  return (
    <div className="min-h-screen">
      <Navbar onCartClick={() => setIsCartDrawerOpen(true)} />
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: product.category?.name || "Products", href: "#" },
            { label: product.name, href: "#" },
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="space-y-4">
            <ImageGallery
              images={product.images || []}
              mainImage={selectedImage}
              productName={product.name}
              onImageSelect={setSelectedImage}
            />
          </div>

          <div className="space-y-6">
            <ProductInfo {...formattedProduct} />
            
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Select Size</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSizeGuide(true)}
                    className="text-sm"
                  >
                    <Ruler className="w-4 h-4 mr-2" />
                    Size Guide
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {product.sizes?.map((size: string) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      className={`h-12 text-base hover:bg-primary hover:text-white transition-colors ${
                        selectedSize === size ? 'ring-2 ring-primary ring-offset-2' : ''
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              <Button
                className="w-full h-12 text-base font-medium"
                onClick={handleAddToCart}
                disabled={product.stock === 0 || !selectedSize}
              >
                {product.stock === 0 ? "Out of Stock" : `Add to Cart - $${product.price}`}
              </Button>
            </div>

            <EnhancedReviews productId={product.id} />
          </div>
        </div>
      </div>

      <SizeGuide
        open={showSizeGuide}
        onOpenChange={setShowSizeGuide}
      />

      <Footer />
    </div>
  );
};

export default ProductDetail;