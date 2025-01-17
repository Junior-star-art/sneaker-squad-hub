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

const products = [
  {
    id: 1,
    name: "Nike Air Max 270",
    price: "$150",
    description: "The Nike Air Max 270 delivers unrivaled comfort with the largest Air unit yet. The modern design draws inspiration from Air Max icons, showcasing Nike's greatest innovation with its window to the world-famous cushioning.",
    features: [
      "Largest heel Air unit yet for enhanced cushioning",
      "Mesh upper for breathability",
      "Foam midsole for responsive cushioning",
      "Rubber outsole for durability"
    ],
    materials: "Upper: Mesh and synthetic materials, Midsole: Foam with Air cushioning, Outsole: Rubber",
    care: "Spot clean with mild detergent and water. Air dry away from direct heat.",
    shipping: "Free standard shipping on orders over $100",
    stock: 15,
    colors: [
      {
        name: "Black/White",
        code: "#000000",
        image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/7c5678f4-c28d-4862-a8d9-56750f839f12/air-max-270-shoes-V4DfZQ.png"
      },
      {
        name: "White/Red",
        code: "#FFFFFF",
        image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/9c9c5e61-d7cf-4245-a30d-c4a6c0fc0452/air-max-270-shoes-rVTfXk.png"
      }
    ],
    angles: [
      "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/7c5678f4-c28d-4862-a8d9-56750f839f12/air-max-270-shoes-V4DfZQ.png",
      "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/9c9c5e61-d7cf-4245-a30d-c4a6c0fc0452/air-max-270-shoes-rVTfXk.png",
      "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/9c9c5e61-d7cf-4245-a30d-c4a6c0fc0452/air-max-270-shoes-rVTfXk.png"
    ],
    image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/7c5678f4-c28d-4862-a8d9-56750f839f12/air-max-270-shoes-V4DfZQ.png"
  },
  {
    id: 2,
    name: "Nike Air Force 1",
    price: "$100",
    description: "The radiance lives on in the Nike Air Force 1, the basketball original that puts a fresh spin on what you know best: durably stitched overlays, clean finishes and the perfect amount of flash to make you shine.",
    features: [
      "Full-length Nike Air cushioning",
      "Padded collar for comfort",
      "Perforations on toe for breathability",
      "Durable rubber outsole"
    ],
    materials: "Upper: Leather and synthetic materials, Midsole: Nike Air cushioning, Outsole: Rubber",
    care: "Clean with a soft brush or cloth. Use mild soap if needed.",
    shipping: "Free standard shipping on orders over $100",
    stock: 20,
    colors: [
      {
        name: "White",
        code: "#FFFFFF",
        image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/e6da41fa-1be4-4ce5-b89c-22be4f1f02d4/air-force-1-07-shoes-WrLlWX.png"
      }
    ],
    angles: [
      "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/e6da41fa-1be4-4ce5-b89c-22be4f1f02d4/air-force-1-07-shoes-WrLlWX.png"
    ],
    image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/e6da41fa-1be4-4ce5-b89c-22be4f1f02d4/air-force-1-07-shoes-WrLlWX.png"
  },
  {
    id: 3,
    name: "Nike ZoomX Vaporfly",
    price: "$250",
    description: "Continue the next evolution of speed with a racing shoe made to help you chase new goals and records. The Nike ZoomX Vaporfly 3 builds on the model racers everywhere love.",
    features: [
      "ZoomX foam for responsive cushioning",
      "Full-length carbon fiber plate",
      "Engineered mesh upper",
      "Lightweight design"
    ],
    materials: "Upper: Engineered mesh, Midsole: ZoomX foam with carbon fiber plate, Outsole: Rubber",
    care: "Hand wash with cold water and mild detergent. Air dry only.",
    shipping: "Free standard shipping on orders over $100",
    stock: 8,
    colors: [
      {
        name: "Hyper Pink",
        code: "#FF69B4",
        image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/fd17b420-b388-4c8a-aaaa-e0a98ddf175f/zoomx-vaporfly-3-road-racing-shoes-xsDgvM.png"
      }
    ],
    angles: [
      "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/fd17b420-b388-4c8a-aaaa-e0a98ddf175f/zoomx-vaporfly-3-road-racing-shoes-xsDgvM.png"
    ],
    image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/fd17b420-b388-4c8a-aaaa-e0a98ddf175f/zoomx-vaporfly-3-road-racing-shoes-xsDgvM.png"
  },
  {
    id: 4,
    name: "Nike Dunk Low",
    price: "$110",
    description: "Created for the hardwood but taken to the streets, this '80s b-ball icon returns with classic details and throwback hoops flair. Channeling vintage style back onto the streets, its padded, low-cut collar lets you take your game anywhere—in comfort.",
    features: [
      "Padded, low-cut collar",
      "Classic flat laces",
      "Rubber sole for traction",
      "Perforated toe box"
    ],
    materials: "Upper: Leather and synthetic materials, Midsole: Foam, Outsole: Rubber",
    care: "Wipe clean with a dry cloth. Use shoe cleaner for tough stains.",
    shipping: "Free standard shipping on orders over $100",
    stock: 12,
    colors: [
      {
        name: "Black/White",
        code: "#000000",
        image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/5939882e-c875-4ed9-a229-fe3c1c16634e/dunk-low-shoes-t4Vk4P.png"
      }
    ],
    angles: [
      "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/5939882e-c875-4ed9-a229-fe3c1c16634e/dunk-low-shoes-t4Vk4P.png"
    ],
    image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/5939882e-c875-4ed9-a229-fe3c1c16634e/dunk-low-shoes-t4Vk4P.png"
  },
  {
    id: 5,
    name: "Nike Air Zoom Pegasus",
    price: "$120",
    description: "The Nike Air Zoom Pegasus is your trusted training companion, offering exceptional comfort and responsiveness for your daily runs. With its breathable mesh upper and Zoom Air cushioning, it delivers a smooth ride mile after mile.",
    features: [
      "Nike Zoom Air cushioning",
      "Engineered mesh upper",
      "Durable rubber outsole",
      "Dynamic Fit technology"
    ],
    materials: "Upper: Engineered mesh, Midsole: Nike Zoom Air cushioning, Outsole: Rubber",
    care: "Clean with a soft brush and mild soap. Air dry naturally.",
    shipping: "Free standard shipping on orders over $100",
    stock: 25,
    colors: [
      {
        name: "Blue/White",
        code: "#0000FF",
        image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/389b709e-5102-4e55-aa5d-07099b500831/pegasus-40-road-running-shoes-50CtF7.png"
      }
    ],
    angles: [
      "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/389b709e-5102-4e55-aa5d-07099b500831/pegasus-40-road-running-shoes-50CtF7.png"
    ],
    image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/389b709e-5102-4e55-aa5d-07099b500831/pegasus-40-road-running-shoes-50CtF7.png"
  },
  {
    id: 6,
    name: "Nike Metcon 8",
    price: "$130",
    description: "The Nike Metcon 8 is built to help you tackle any workout in the gym. From lifting to sprinting to rope climbs, this training shoe delivers stability and durability.",
    features: [
      "Wide, flat heel for stability",
      "Rubber wrap-up for durability",
      "Breathable upper mesh",
      "Flexible forefoot"
    ],
    materials: "Upper: Mesh and synthetic materials, Midsole: Foam, Outsole: Rubber",
    care: "Spot clean with mild detergent. Air dry away from direct heat.",
    shipping: "Free standard shipping on orders over $100",
    stock: 18,
    colors: [
      {
        name: "Black/Red",
        code: "#000000",
        image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/fd88656c-0f5f-46f7-a31f-b4044187353b/metcon-8-workout-shoes-p9rQzn.png"
      }
    ],
    angles: [
      "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/fd88656c-0f5f-46f7-a31f-b4044187353b/metcon-8-workout-shoes-p9rQzn.png"
    ],
    image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/fd88656c-0f5f-46f7-a31f-b4044187353b/metcon-8-workout-shoes-p9rQzn.png"
  },
  {
    id: 7,
    name: "Nike Free Run 5.0",
    price: "$100",
    description: "The Nike Free Run 5.0 returns to its roots with a flexible design that moves with your foot. The lightweight upper combines with a minimal midsole for a barefoot-like feel that delivers a natural ride.",
    features: [
      "Flexible design",
      "Minimal cushioning",
      "Lightweight construction",
      "Strategic traction pattern"
    ],
    materials: "Upper: Lightweight mesh, Midsole: Foam, Outsole: Rubber pods",
    care: "Hand wash with cold water and mild soap. Air dry.",
    shipping: "Free standard shipping on orders over $100",
    stock: 30,
    colors: [
      {
        name: "Grey/White",
        code: "#808080",
        image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/b05afb11-db22-461d-b94e-49bdc316b445/free-run-5-road-running-shoes-m8L9mr.png"
      }
    ],
    angles: [
      "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/b05afb11-db22-461d-b94e-49bdc316b445/free-run-5-road-running-shoes-m8L9mr.png"
    ],
    image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/b05afb11-db22-461d-b94e-49bdc316b445/free-run-5-road-running-shoes-m8L9mr.png"
  },
  {
    id: 8,
    name: "Nike React Infinity",
    price: "$160",
    description: "The Nike React Infinity is designed to help reduce injury and keep you running. More foam and improved upper details provide a secure and cushioned feel.",
    features: [
      "Nike React foam",
      "Wider forefoot base",
      "Rocker geometry",
      "Reinforced upper"
    ],
    materials: "Upper: Flyknit and synthetic materials, Midsole: Nike React foam, Outsole: Rubber",
    care: "Clean with soft brush and mild soap. Air dry naturally.",
    shipping: "Free standard shipping on orders over $100",
    stock: 22,
    colors: [
      {
        name: "White/Blue",
        code: "#FFFFFF",
        image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/e8e530a3-2317-4783-819b-40860281daaf/invincible-3-road-running-shoes-Wwmmlp.png"
      }
    ],
    angles: [
      "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/e8e530a3-2317-4783-819b-40860281daaf/invincible-3-road-running-shoes-Wwmmlp.png"
    ],
    image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/e8e530a3-2317-4783-819b-40860281daaf/invincible-3-road-running-shoes-Wwmmlp.png"
  }
];

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
          <h2 className="text-2xl font-bold mb-8">Trending Now</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <ProductSkeleton key={index} />
              ))
            ) : (
              products.slice(0, page * 6).map((product) => (
                <div 
                  key={product.id} 
                  className="group animate-fade-up"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => handleKeyPress(e, () => setSelectedProduct(product))}
                >
                  <div className="relative overflow-hidden rounded-lg bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className={`w-full h-auto aspect-square object-cover transform transition-all duration-300 ${
                        zoomedImageId === product.id ? 'scale-150' : 'group-hover:scale-105'
                      }`}
                      onMouseEnter={() => setZoomedImageId(product.id)}
                      onMouseLeave={() => setZoomedImageId(null)}
                      onMouseMove={(e) => handleMouseMove(e, product.id)}
                      loading="lazy"
                    />
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="bg-white p-2 rounded-full shadow-md hover:scale-110 transition-transform"
                        aria-label={`Add ${product.name} to wishlist`}
                      >
                        <Heart 
                          className={`w-5 h-5 ${wishlist.includes(product.id) ? "fill-red-500 text-red-500" : ""}`}
                        />
                      </button>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleSocialShare(product, 'facebook')}
                          className="bg-white p-2 rounded-full shadow-md hover:scale-110 transition-transform"
                          aria-label="Share on Facebook"
                        >
                          <Facebook className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleSocialShare(product, 'twitter')}
                          className="bg-white p-2 rounded-full shadow-md hover:scale-110 transition-transform"
                          aria-label="Share on Twitter"
                        >
                          <Twitter className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleSocialShare(product, 'instagram')}
                          className="bg-white p-2 rounded-full shadow-md hover:scale-110 transition-transform"
                          aria-label="Share on Instagram"
                        >
                          <Instagram className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex gap-2">
                        <Button
                          onClick={() => addItem(product)}
                          className="flex-1 bg-white text-black hover:bg-white/90"
                          variant="secondary"
                        >
                          Add to Bag
                        </Button>
                        <Button
                          onClick={() => {
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
                  <div className="mt-4 space-y-1">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-left">{product.name}</h3>
                        <p className="text-nike-gray mt-1 text-left">{product.price}</p>
                        <p className="text-sm text-gray-500">{product.stock} items in stock</p>
                        <p className="text-sm text-green-600">{Math.floor(Math.random() * 100)} sold this month</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSizeGuideOpen(true)}
                        className="mt-1"
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
              <h2 className="text-2xl font-bold mb-8">Recently Viewed</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {recentlyViewed.map((product) => (
                  <div 
                    key={product.id} 
                    className="group"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => handleKeyPress(e, () => setSelectedProduct(product))}
                  >
                    <div className="relative overflow-hidden rounded-lg bg-gray-100">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-auto aspect-square object-cover transform group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button
                          onClick={() => addItem(product)}
                          className="w-full bg-white text-black hover:bg-white/90"
                          variant="secondary"
                        >
                          Add to Bag
                        </Button>
                      </div>
                    </div>
                    <div className="mt-4">
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
