import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import FilterSection from "./FilterSection";
import SearchResults from "./SearchResults";
import VisualSearch from "./VisualSearch";
import { useIsMobile } from "@/hooks/use-mobile";
import VoiceSearch from "./VoiceSearch";
import RecentSearches from "./RecentSearches";
import ImageSearchUpload from "./ImageSearchUpload";
import CameraSearch from "./CameraSearch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

export function SearchOverlay({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
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
  const isMobile = useIsMobile();

  const handleVisualSearch = ({ type, data }: { type: string; data: string }) => {
    console.log(`Performing ${type} search with data:`, data);
  };

  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    if (query.length > 2 && !recentSearches.includes(query)) {
      const newSearches = [query, ...recentSearches].slice(0, 5);
      setRecentSearches(newSearches);
      localStorage.setItem('recentSearches', JSON.stringify(newSearches));
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

  const handleVoiceSearch = (text: string) => {
    setSearchQuery(text);
    handleSearch(text);
  };

  const handleRecentSearchSelect = (search: string) => {
    setSearchQuery(search);
    handleSearch(search);
  };

  const handleRecentSearchClear = (search: string) => {
    const newSearches = recentSearches.filter(s => s !== search);
    setRecentSearches(newSearches);
    localStorage.setItem('recentSearches', JSON.stringify(newSearches));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "sm:max-w-2xl transition-all duration-300",
        isMobile && "w-full h-[100dvh] p-4"
      )}>
        <DialogTitle className="sr-only">Search Products</DialogTitle>
        <DialogDescription className="sr-only">
          Search for products, brands, and categories
        </DialogDescription>
        
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
                  searchQuery && "border-primary",
                  isMobile && "text-lg h-12"
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
                    navigator.vibrate(50);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <VoiceSearch onResult={handleVoiceSearch} />
          </div>

          {!searchQuery && recentSearches.length > 0 && (
            <RecentSearches
              searches={recentSearches}
              onSelect={handleRecentSearchSelect}
              onClear={handleRecentSearchClear}
            />
          )}

          <Tabs defaultValue="image" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="image">Image Search</TabsTrigger>
              <TabsTrigger value="camera">Camera Search</TabsTrigger>
            </TabsList>
            <TabsContent value="image">
              <ImageSearchUpload onImageSelect={(image) => handleVisualSearch({ type: 'image', data: image })} />
            </TabsContent>
            <TabsContent value="camera">
              <CameraSearch onCapture={(image) => handleVisualSearch({ type: 'camera', data: image })} />
            </TabsContent>
          </Tabs>

          {isSearching ? (
            <div className="animate-pulse space-y-4">
              <div className="h-48 bg-gray-200 rounded-lg" />
              <div className="h-48 bg-gray-200 rounded-lg" />
            </div>
          ) : (
            <SearchResults 
              results={searchResults} 
              searchQuery={searchQuery}
              onClose={() => onOpenChange(false)}
            />
          )}

          {!isMobile && (
            <div className="text-xs text-muted-foreground flex items-center gap-2">
              <span>Press</span>
              <kbd className="rounded-md border px-2 py-0.5 bg-muted">ESC</kbd>
              <span>to close or</span>
              <kbd className="rounded-md border px-2 py-0.5 bg-muted">⌘K</kbd>
              <span>to open search</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
