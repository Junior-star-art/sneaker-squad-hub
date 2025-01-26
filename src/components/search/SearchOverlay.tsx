import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import FilterSection from "./FilterSection";
import { SearchResults } from "./SearchResults";
import VisualSearch from "./VisualSearch";
import { useIsMobile } from "@/hooks/use-mobile";
import VoiceSearch from "./VoiceSearch";
import { SearchFilters } from "@/types/search";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [filters, setFilters] = useState<SearchFilters>({
    priceRange: [0, 500],
    colors: [],
    sizes: [],
    sortBy: 'newest'
  });
  const [showFilters, setShowFilters] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 2 && !recentSearches.includes(query)) {
      const newSearches = [query, ...recentSearches].slice(0, 5);
      setRecentSearches(newSearches);
      localStorage.setItem('recentSearches', JSON.stringify(newSearches));
    }
  };

  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "sm:max-w-2xl transition-all duration-300",
        isMobile && "w-full h-[100dvh] p-4"
      )}>
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
                    navigator.vibrate(50);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <VoiceSearch onResult={handleSearch} />
          </div>

          <Tabs defaultValue="filters" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="filters">Filters</TabsTrigger>
              <TabsTrigger value="visual">Visual Search</TabsTrigger>
            </TabsList>
            <TabsContent value="filters">
              <div className="space-y-4">
                <FilterSection
                  title="Categories"
                  items={["Running", "Basketball", "Training", "Lifestyle"]}
                  type="category"
                  selectedItems={filters.categories || []}
                  onSelect={(category) => handleFilterChange({ category })}
                />
                <FilterSection
                  title="Colors"
                  items={["Black", "White", "Red", "Blue"]}
                  type="color"
                  selectedItems={filters.colors || []}
                  onSelect={(color) => {
                    const newColors = filters.colors?.includes(color)
                      ? filters.colors.filter(c => c !== color)
                      : [...(filters.colors || []), color];
                    handleFilterChange({ colors: newColors });
                  }}
                />
                <FilterSection
                  title="Sizes"
                  items={["US 7", "US 8", "US 9", "US 10", "US 11"]}
                  type="size"
                  selectedItems={filters.sizes || []}
                  onSelect={(size) => {
                    const newSizes = filters.sizes?.includes(size)
                      ? filters.sizes.filter(s => s !== size)
                      : [...(filters.sizes || []), size];
                    handleFilterChange({ sizes: newSizes });
                  }}
                />
              </div>
            </TabsContent>
            <TabsContent value="visual">
              <VisualSearch onSearch={(data) => {
                console.log('Visual search data:', data);
                toast({
                  title: "Visual Search",
                  description: "This feature is coming soon!",
                });
              }} />
            </TabsContent>
          </Tabs>

          <SearchResults 
            query={searchQuery}
            filters={filters}
            onClose={() => onOpenChange(false)}
          />

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