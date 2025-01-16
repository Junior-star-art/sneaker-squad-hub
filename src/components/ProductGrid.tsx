import { useCart } from "@/contexts/CartContext";
import { useRecentlyViewed } from "@/contexts/RecentlyViewedContext";
import { useState } from "react";
import { Eye, Heart, Share2, Ruler } from "lucide-react";
import ProductQuickView from "./ProductQuickView";
import SizeGuide from "./SizeGuide";
import ProductFilters, { FilterOptions } from "./filters/ProductFilters";
import { Button } from "@/components/ui/button";

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
  }
];

const ProductGrid = () => {
  const { addItem } = useCart();
  const { recentlyViewed, addToRecentlyViewed } = useRecentlyViewed();
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 300],
    colors: [],
    sizes: [],
  });

  const filteredProducts = products.filter((product) => {
    const price = parseFloat(product.price.replace("$", ""));
    const matchesPrice = price >= filters.priceRange[0] && price <= filters.priceRange[1];
    
    const matchesColor = filters.colors.length === 0 || 
      product.colors.some(color => 
        filters.colors.includes(color.name.toLowerCase().replace("/", "-"))
      );
    
    const matchesSize = filters.sizes.length === 0;

    return matchesPrice && matchesColor && matchesSize;
  });

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Trending Now</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <ProductFilters
            initialFilters={filters}
            onFilterChange={setFilters}
          />
        </div>
        
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group animate-fade-up">
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-auto transform group-hover:scale-105 transition duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="bg-white p-2 rounded-full shadow-md hover:scale-110 transition-transform"
                    >
                      <Heart 
                        className={wishlist.includes(product.id) ? "fill-red-500 text-red-500" : ""}
                      />
                    </button>
                    <button
                      onClick={() => handleShare(product)}
                      className="bg-white p-2 rounded-full shadow-md hover:scale-110 transition-transform"
                    >
                      <Share2 />
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300">
                    <div className="flex gap-2">
                      <button
                        onClick={() => addItem(product)}
                        className="flex-1 bg-white text-black py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        Add to Bag
                      </button>
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          addToRecentlyViewed(product);
                        }}
                        className="bg-white text-black p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        aria-label="Quick view"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium">{product.name}</h3>
                      <p className="text-nike-gray mt-1">{product.price}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSizeGuideOpen(true)}
                    >
                      <Ruler className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {recentlyViewed.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Recently Viewed</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentlyViewed.map((product) => (
              <div key={product.id} className="group animate-fade-up">
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-auto"
                    loading="lazy"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300">
                    <button
                      onClick={() => addItem(product)}
                      className="w-full bg-white text-black py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      Add to Bag
                    </button>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium">{product.name}</h3>
                  <p className="text-nike-gray mt-1">{product.price}</p>
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
  );
};

export default ProductGrid;
