import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import FilterSection from "./FilterSection";
import SearchResults from "./SearchResults";

type Filter = {
  category?: string;
  gender?: string;
  sport?: string;
  priceRange?: [number, number];
  colors?: string[];
  sizes?: string[];
  isNewArrival?: boolean;
  sortBy?: 'price-asc' | 'price-desc' | 'newest' | 'popular';
};

const COLORS = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Red", hex: "#FF0000" },
  { name: "Blue", hex: "#0000FF" },
  { name: "Green", hex: "#00FF00" },
];

const SIZES = ["6", "7", "8", "9", "10", "11", "12"];

export function SearchOverlay({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Filter>({
    priceRange: [0, 500],
    colors: [],
    sizes: [],
    isNewArrival: false,
    sortBy: 'newest'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchButtonHovered, setSearchButtonHovered] = useState(false);

  const categories = ["Shoes", "Clothing", "Equipment"];
  const genders = ["Men", "Women", "Kids"];
  const sports = ["Running", "Basketball", "Training"];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(true);
        toast({
          title: "Search Activated",
          description: "Use '/' or 'Ctrl + K' to search",
          duration: 2000,
        });
      } else if (e.key === "/" && !open) {
        e.preventDefault();
        onOpenChange(true);
      } else if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange, toast]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    // Mock search results - replace with actual API call
    const mockResults = [
      {
        id: 1,
        name: "Nike Air Max 270",
        price: "$150",
        description: "Men's Running Shoes",
        features: ["Responsive cushioning", "Breathable mesh upper"],
        materials: "Mesh and synthetic materials",
        care: "Wipe clean with a damp cloth",
        shipping: "Free shipping on orders over $50",
        stock: 10,
        colors: [
          { name: "Black", code: "#000000", image: "black-270.jpg" },
          { name: "White", code: "#FFFFFF", image: "white-270.jpg" }
        ],
        angles: ["front", "back", "side"],
        image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/7c5678f4-c28d-4862-a8d9-56750f839f12/air-max-270-shoes-V4DfZQ.png"
      },
      {
        id: 2,
        name: "Nike Air Force 1",
        price: "$100",
        description: "Men's Shoes",
        features: ["Classic design", "Durable construction"],
        materials: "Leather and synthetic materials",
        care: "Clean with shoe cleaner",
        shipping: "Free shipping on orders over $50",
        stock: 15,
        colors: [
          { name: "White", code: "#FFFFFF", image: "white-af1.jpg" },
          { name: "Black", code: "#000000", image: "black-af1.jpg" }
        ],
        angles: ["front", "back", "side"],
        image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/e6da41fa-1be4-4ce5-b89c-22be4f1f02d4/air-force-1-07-shoes-WrLlWX.png"
      }
    ].filter(item => 
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
    );

    await new Promise(resolve => setTimeout(resolve, 300));
    setSearchResults(mockResults);
    setIsSearching(false);
  };

  const handleFilterClick = (type: keyof Filter, value: string | boolean) => {
    setActiveFilters(prev => ({
      ...prev,
      [type]: Array.isArray(prev[type])
        ? (prev[type] as string[]).includes(value as string)
          ? (prev[type] as string[]).filter(v => v !== value)
          : [...(prev[type] as string[]), value]
        : value
    }));
  };

  const handlePriceRangeChange = (value: number[]) => {
    setActiveFilters(prev => ({
      ...prev,
      priceRange: value as [number, number]
    }));
  };

  const handleSortChange = (value: Filter['sortBy']) => {
    setActiveFilters(prev => ({
      ...prev,
      sortBy: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 group">
              <Search className={cn(
                "absolute left-3 top-2.5 h-5 w-5 transition-colors duration-200",
                searchQuery ? "text-primary" : "text-muted-foreground"
              )} />
              <Input
                placeholder="Search products..."
                className={cn(
                  "pl-10 pr-10 transition-all duration-200",
                  "focus:ring-2 focus:ring-primary focus:border-transparent",
                  searchQuery && "border-primary"
                )}
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => {
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Sheet open={showFilters} onOpenChange={setShowFilters}>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon"
                  className={cn(
                    "transition-all duration-200",
                    showFilters && "bg-primary text-primary-foreground"
                  )}
                  onMouseEnter={() => setSearchButtonHovered(true)}
                  onMouseLeave={() => setSearchButtonHovered(false)}
                >
                  <SlidersHorizontal className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    searchButtonHovered && "scale-110"
                  )} />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Price Range</h3>
                    <Slider
                      defaultValue={activeFilters.priceRange}
                      max={500}
                      step={10}
                      onValueChange={handlePriceRangeChange}
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>${activeFilters.priceRange?.[0]}</span>
                      <span>${activeFilters.priceRange?.[1]}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Colors</h3>
                    <div className="flex flex-wrap gap-2">
                      {COLORS.map((color) => (
                        <div
                          key={color.name}
                          className={cn(
                            "w-8 h-8 rounded-full cursor-pointer border-2",
                            activeFilters.colors?.includes(color.name)
                              ? "border-primary"
                              : "border-transparent"
                          )}
                          style={{ backgroundColor: color.hex }}
                          onClick={() => handleFilterClick('colors', color.name)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Sizes</h3>
                    <div className="flex flex-wrap gap-2">
                      {SIZES.map((size) => (
                        <Badge
                          key={size}
                          variant={activeFilters.sizes?.includes(size) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => handleFilterClick('sizes', size)}
                        >
                          {size}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Sort By</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant={activeFilters.sortBy === 'price-asc' ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleSortChange('price-asc')}
                      >
                        Price: Low to High
                      </Badge>
                      <Badge
                        variant={activeFilters.sortBy === 'price-desc' ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleSortChange('price-desc')}
                      >
                        Price: High to Low
                      </Badge>
                      <Badge
                        variant={activeFilters.sortBy === 'newest' ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleSortChange('newest')}
                      >
                        Newest
                      </Badge>
                      <Badge
                        variant={activeFilters.sortBy === 'popular' ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleSortChange('popular')}
                      >
                        Popular
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant={activeFilters.isNewArrival ? "default" : "outline"}
                      onClick={() => handleFilterClick('isNewArrival', !activeFilters.isNewArrival)}
                    >
                      New Arrivals Only
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="space-y-4">
            <FilterSection title="Categories" items={categories} type="category" />
            <FilterSection title="Gender" items={genders} type="gender" />
            <FilterSection title="Sport" items={sports} type="sport" />
          </div>

          {isSearching ? (
            <div className="animate-pulse space-y-4">
              <div className="h-48 bg-gray-200 rounded-lg" />
              <div className="h-48 bg-gray-200 rounded-lg" />
            </div>
          ) : (
            <SearchResults 
              results={searchResults} 
              searchQuery={searchQuery}
            />
          )}

          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <span>Press</span>
            <kbd className="rounded-md border px-2 py-0.5 bg-muted">ESC</kbd>
            <span>to close or</span>
            <kbd className="rounded-md border px-2 py-0.5 bg-muted">⌘K</kbd>
            <span>to open search</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}