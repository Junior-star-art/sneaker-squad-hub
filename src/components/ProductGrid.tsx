import { useCart } from "@/contexts/CartContext";
import { useRecentlyViewed } from "@/contexts/RecentlyViewedContext";
import { useState, useEffect, useRef } from "react";
import { Eye, Heart, Share2, Ruler, Facebook, Twitter, Instagram } from "lucide-react";
import ProductQuickView from "./ProductQuickView";
import SizeGuide from "./SizeGuide";
import { Button } from "@/components/ui/button";
import ProductSkeleton from "./ProductSkeleton";
import { useToast } from "@/components/ui/use-toast";
import ErrorBoundary from "./ErrorBoundary";
import { products } from "@/data/products";

const ProductGrid = () => {
  const { addItem } = useCart();
  const { recentlyViewed, addToRecentlyViewed } = useRecentlyViewed();
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [isLoading] = useState(false);
  const [zoomedImageId, setZoomedImageId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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

  const toggleWishlist = (productId: number) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleShare = async (product: typeof products[0]) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>, productId: number) => {
    if (zoomedImageId === productId) {
      const image = e.currentTarget;
      const { left, top, width, height } = image.getBoundingClientRect();
      const x = (e.clientX - left) / width * 100;
      const y = (e.clientY - top) / height * 100;
      image.style.transformOrigin = `${x}% ${y}%`;
    }
  };

  const handleSocialShare = async (product: typeof products[0], platform: 'facebook' | 'twitter' | 'instagram') => {
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

  return (
    <ErrorBoundary>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div>
          <h2 className="text-4xl font-bold mb-4 text-left animate-fade-up">Trending Now</h2>
          <p className="text-nike-gray mb-8 text-left animate-fade-up delay-100">
            Discover our latest collection of innovative Nike footwear
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <ProductSkeleton key={index} />
              ))
            ) : (
              products.slice(0, page * 8).map((product, index) => (
                <div 
                  key={product.id} 
                  className={`group animate-fade-up transition-all duration-300 hover:shadow-xl rounded-xl
                    ${index === 0 ? 'sm:col-span-2 sm:row-span-2' : ''}`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => handleKeyPress(e, () => setSelectedProduct(product))}
                >
                  <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100">
                    <div className={`aspect-square overflow-hidden ${index === 0 ? 'sm:aspect-[4/3]' : ''}`}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className={`w-full h-full object-cover transform transition-all duration-500 ${
                          zoomedImageId === product.id ? 'scale-150' : 'group-hover:scale-110'
                        }`}
                        onMouseEnter={() => setZoomedImageId(product.id)}
                        onMouseLeave={() => setZoomedImageId(null)}
                        onMouseMove={(e) => handleMouseMove(e, product.id)}
                        loading="lazy"
                      />
                    </div>
                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product.id);
                        }}
                        className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
                        aria-label={`Add ${product.name} to wishlist`}
                      >
                        <Heart 
                          className={`w-5 h-5 transition-colors ${wishlist.includes(product.id) ? "fill-red-500 text-red-500" : ""}`}
                        />
                      </button>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSocialShare(product, 'facebook');
                          }}
                          className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
                          aria-label="Share on Facebook"
                        >
                          <Facebook className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSocialShare(product, 'twitter');
                          }}
                          className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
                          aria-label="Share on Twitter"
                        >
                          <Twitter className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSocialShare(product, 'instagram');
                          }}
                          className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
                          aria-label="Share on Instagram"
                        >
                          <Instagram className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div 
                      className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
                    >
                      <div className="flex gap-2">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            addItem(product);
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
                            addToRecentlyViewed(product);
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
                        <p className="text-nike-gray mt-1 text-left font-medium">{product.price}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-sm text-green-600">{product.stock} in stock</p>
                          <span className="text-nike-gray">•</span>
                          <p className="text-sm text-nike-gray">{Math.floor(Math.random() * 100)} sold</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSizeGuideOpen(true);
                        }}
                        className="mt-1 hover:bg-gray-100"
                      >
                        <Ruler className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div ref={loadMoreRef} className="h-10 mt-8" />

          {recentlyViewed.length > 0 && (
            <div className="mt-16 animate-fade-up">
              <h2 className="text-3xl font-bold mb-6 text-left">Recently Viewed</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {recentlyViewed.map((product) => (
                  <div 
                    key={product.id} 
                    className="group hover:shadow-lg rounded-xl transition-all duration-300"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => handleKeyPress(e, () => setSelectedProduct(product))}
                  >
                    <div className="relative overflow-hidden rounded-xl bg-gray-100">
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            addItem(product);
                            toast({
                              title: "Added to bag",
                              description: `${product.name} has been added to your shopping bag.`,
                            });
                          }}
                          className="w-full bg-white text-black hover:bg-white/90"
                          variant="secondary"
                        >
                          Add to Bag
                        </Button>
                      </div>
                    </div>
                    <div className="mt-4 p-2">
                      <h3 className="text-lg font-medium text-left">{product.name}</h3>
                      <p className="text-nike-gray mt-1 text-left">{product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedProduct && (
            <ProductQuickView
              product={selectedProduct}
              open={Boolean(selectedProduct)}
              onOpenChange={(open) => !open && setSelectedProduct(null)}
            />
          )}
          
          <SizeGuide 
            open={sizeGuideOpen}
            onOpenChange={setSizeGuideOpen}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default ProductGrid;