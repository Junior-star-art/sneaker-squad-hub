import { useCart } from "@/contexts/CartContext";
import { useRecentlyViewed } from "@/contexts/RecentlyViewedContext";
import { useState, useEffect, useRef } from "react";
import { Eye, Heart, Share2, Ruler, Facebook, Twitter, Instagram, Star } from "lucide-react";
import ProductQuickView from "./ProductQuickView";
import SizeGuide from "./SizeGuide";
import { Button } from "@/components/ui/button";
import ProductSkeleton from "./ProductSkeleton";
import { useToast } from "@/components/ui/use-toast";
import ErrorBoundary from "./ErrorBoundary";
import PullToRefresh from 'react-pull-to-refresh';
import BackToTop from './BackToTop';
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface SupabaseProduct {
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
}

const fetchProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(name)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
  return data as SupabaseProduct[];
};

const ProductGrid = () => {
  const { addItem } = useCart();
  const { recentlyViewed, addToRecentlyViewed } = useRecentlyViewed();
  const [selectedProduct, setSelectedProduct] = useState<SupabaseProduct | null>(null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [zoomedImageId, setZoomedImageId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const handleRefresh = async () => {
    window.location.reload();
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleShare = async (product: SupabaseProduct) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description || '',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  const handleMouseMove = (e, productId) => {
    if (zoomedImageId === productId) {
      const image = e.currentTarget;
      const { left, top, width, height } = image.getBoundingClientRect();
      const x = (e.clientX - left) / width * 100;
      const y = (e.clientY - top) / height * 100;
      image.style.transformOrigin = `${x}% ${y}%`;
    }
  };

  const handleSocialShare = async (product, platform) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out ${product.name}!`);
    
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
        break;
      case 'instagram':
        toast({
          title: "Instagram Sharing",
          description: "Copy the link and share it on Instagram!",
        });
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error loading products. Please try again later.</p>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  return (
    <ErrorBoundary>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <PullToRefresh onRefresh={handleRefresh} distanceToRefresh={70}>
          <div>
            <h2 className="text-4xl font-bold mb-4 text-left animate-fade-up">
              Trending Now
            </h2>
            <p className="text-nike-gray mb-8 text-left animate-fade-up delay-100">
              Discover our latest collection of innovative Nike footwear
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" role="grid" aria-label="Product grid">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, index) => (
                  <ProductSkeleton key={index} />
                ))
              ) : (
                products?.slice(0, page * 8).map((product) => (
                  <div 
                    key={product.id} 
                    className="group animate-fade-up transition-all duration-300 hover:shadow-xl rounded-xl"
                    role="gridcell"
                    tabIndex={0}
                    aria-label={`${product.name} - ${formatPrice(product.price)}`}
                  >
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100">
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={product.images?.[0] || '/placeholder.svg'}
                          alt={product.name}
                          className={`w-full h-full object-cover transform transition-all duration-500 ${
                            zoomedImageId === product.id ? 'scale-150' : 'group-hover:scale-110'
                          }`}
                          onMouseEnter={() => setZoomedImageId(product.id)}
                          onMouseLeave={() => setZoomedImageId(null)}
                          loading="lazy"
                        />
                        {product.featured && (
                          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-sm font-medium">Featured</span>
                          </div>
                        )}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <div className="flex gap-2">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              addItem({
                                id: Number(product.id),
                                name: product.name,
                                price: formatPrice(product.price),
                                image: product.images?.[0] || '/placeholder.svg'
                              });
                              toast({
                                title: "Added to bag",
                                description: `${product.name} has been added to your shopping bag.`,
                              });
                            }}
                            className="flex-1 bg-white text-black hover:bg-white/90"
                            variant="secondary"
                          >
                            Add to Bag
                          </Button>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProduct(product);
                              addToRecentlyViewed({
                                id: product.id,
                                name: product.name,
                                price: formatPrice(product.price),
                                image: product.images?.[0] || '/placeholder.svg'
                              });
                            }}
                            className="bg-white text-black hover:bg-white/90 px-3"
                            variant="secondary"
                            size="icon"
                          >
                            <Eye className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 space-y-1 p-2">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-left line-clamp-1">{product.name}</h3>
                          <p className="text-nike-gray mt-1 text-left font-medium">{formatPrice(product.price)}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm text-green-600">{product.stock} in stock</p>
                            {product.category?.name && (
                              <>
                                <span className="text-nike-gray">•</span>
                                <p className="text-sm text-nike-gray">{product.category.name}</p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div ref={loadMoreRef} className="h-10 mt-8" />

            {selectedProduct && (
              <ProductQuickView
                product={{
                  id: parseInt(selectedProduct.id), // Convert string ID to number
                  name: selectedProduct.name,
                  price: formatPrice(selectedProduct.price),
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
            
            <SizeGuide 
              open={sizeGuideOpen}
              onOpenChange={setSizeGuideOpen}
            />
          </div>
        </PullToRefresh>
        <BackToTop />
      </div>
    </ErrorBoundary>
  );
};

export default ProductGrid;
