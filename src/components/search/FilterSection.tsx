import { Badge } from "@/components/ui/badge";

type FilterSectionProps = {
  title: string;
  items: string[];
  type: 'category' | 'gender' | 'sport';
};

const FilterSection = ({ title, items, type }: FilterSectionProps) => {
  return (
    <div className="space-y-2">
      <h3 className="font-medium">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Badge
            key={item}
            variant="outline"
            className="cursor-pointer hover:bg-accent"
          >
            {item}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default FilterSection;