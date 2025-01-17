import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Clock, X } from "lucide-react";

interface RecentSearchesProps {
  searches: string[];
  onSelect: (search: string) => void;
  onClear: (search: string) => void;
}

const RecentSearches = ({ searches, onSelect, onClear }: RecentSearchesProps) => {
  if (searches.length === 0) return null;

  return (
    <ScrollArea className="h-[200px] w-full rounded-md border p-4">
      <h3 className="font-medium mb-2 flex items-center gap-2">
        <Clock className="h-4 w-4" />
        Recent Searches
      </h3>
      <div className="space-y-2">
        {searches.map((search, index) => (
          <div key={index} className="flex items-center justify-between group">
            <Button
              variant="ghost"
              className="w-full justify-start text-left"
              onClick={() => {
                onSelect(search);
                navigator.vibrate(50); // Haptic feedback
              }}
            >
              {search}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => {
                onClear(search);
                navigator.vibrate(50); // Haptic feedback
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default RecentSearches;