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

  const categories = ["Shoes", "Clothing", "Equipment"];
  const genders = ["Men", "Women", "Kids"];
  const sports = ["Running", "Basketball", "Training"];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !open) {
        e.preventDefault();
        onOpenChange(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const mockResults = [
      {
        id: 1,
        name: "Nike Air Max 270",
        price: "$150",
        description: "Men's Running Shoes",
        image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/7c5678f4-c28d-4862-a8d9-56750f839f12/air-max-270-shoes-V4DfZQ.png"
      },
      {
        id: 2,
        name: "Nike Air Force 1",
        price: "$100",
        description: "Men's Shoes",
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
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-10 pr-10"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2"
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
                <Button variant="outline" size="icon">
                  <SlidersHorizontal className="h-4 w-4" />
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

          <div className="text-xs text-muted-foreground">
            Press <kbd className="rounded-md border px-2 py-0.5">ESC</kbd> to close
            or <kbd className="rounded-md border px-2 py-0.5">/</kbd> to open search
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
