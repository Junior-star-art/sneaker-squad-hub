import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Filter = {
  category?: string;
  gender?: string;
  sport?: string;
};

export function SearchOverlay({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Filter>({});

  // Categories
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

  const handleFilterClick = (type: keyof Filter, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [type]: prev[type] === value ? undefined : value
    }));
  };

  const FilterSection = ({ title, items, type }: { title: string; items: string[]; type: keyof Filter }) => (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Badge
            key={item}
            variant="outline"
            className={cn(
              "cursor-pointer hover:bg-accent",
              activeFilters[type] === item && "bg-accent"
            )}
            onClick={() => handleFilterClick(type, item)}
          >
            {item}
          </Badge>
        ))}
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-10 pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="space-y-4">
            <FilterSection title="Categories" items={categories} type="category" />
            <FilterSection title="Gender" items={genders} type="gender" />
            <FilterSection title="Sport" items={sports} type="sport" />
          </div>

          {searchQuery && (
            <div className="animate-fade-up space-y-4">
              <h3 className="font-medium">Results</h3>
              <div className="text-sm text-muted-foreground">
                No results found for "{searchQuery}"
              </div>
            </div>
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