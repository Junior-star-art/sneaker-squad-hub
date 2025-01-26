import { Badge } from "@/components/ui/badge";

type FilterSectionProps = {
  title: string;
  items: string[];
  type: 'category' | 'gender' | 'sport';
  onSelect: (item: string) => void;
  selectedItems: string[];
};

const FilterSection = ({ title, items, selectedItems, onSelect }: FilterSectionProps) => {
  return (
    <div className="space-y-2">
      <h3 className="font-medium">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Badge
            key={item}
            variant={selectedItems.includes(item) ? "default" : "outline"}
            className="cursor-pointer hover:bg-accent"
            onClick={() => onSelect(item)}
          >
            {item}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default FilterSection;