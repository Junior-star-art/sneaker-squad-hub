import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export type FilterOptions = {
  priceRange: [number, number];
  colors: string[];
  sizes: string[];
};

type ProductFiltersProps = {
  onFilterChange: (filters: FilterOptions) => void;
  initialFilters: FilterOptions;
};

const AVAILABLE_COLORS = [
  { label: "Black/White", value: "black-white" },
  { label: "White/Red", value: "white-red" },
  { label: "Hyper Pink", value: "hyper-pink" },
];

const AVAILABLE_SIZES = [
  "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11"
];

const ProductFilters = ({ onFilterChange, initialFilters }: ProductFiltersProps) => {
  const handlePriceChange = (value: number[]) => {
    onFilterChange({
      ...initialFilters,
      priceRange: [value[0], value[1]] as [number, number],
    });
  };

  const handleColorChange = (color: string, checked: boolean) => {
    const newColors = checked
      ? [...initialFilters.colors, color]
      : initialFilters.colors.filter((c) => c !== color);
    onFilterChange({
      ...initialFilters,
      colors: newColors,
    });
  };

  const handleSizeChange = (size: string, checked: boolean) => {
    const newSizes = checked
      ? [...initialFilters.sizes, size]
      : initialFilters.sizes.filter((s) => s !== size);
    onFilterChange({
      ...initialFilters,
      sizes: newSizes,
    });
  };

  const handleReset = () => {
    onFilterChange({
      priceRange: [0, 300],
      colors: [],
      sizes: [],
    });
  };

  return (
    <div className="space-y-6 p-4 border rounded-lg bg-white">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Filters</h3>
        <Button variant="ghost" size="sm" onClick={handleReset}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Price Range</Label>
          <div className="pt-4">
            <Slider
              defaultValue={initialFilters.priceRange}
              max={300}
              step={10}
              onValueChange={handlePriceChange}
            />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>${initialFilters.priceRange[0]}</span>
              <span>${initialFilters.priceRange[1]}</span>
            </div>
          </div>
        </div>

        <div>
          <Label className="mb-2 block">Colors</Label>
          <div className="space-y-2">
            {AVAILABLE_COLORS.map((color) => (
              <div key={color.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`color-${color.value}`}
                  checked={initialFilters.colors.includes(color.value)}
                  onCheckedChange={(checked) =>
                    handleColorChange(color.value, checked as boolean)
                  }
                />
                <label
                  htmlFor={`color-${color.value}`}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {color.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="mb-2 block">Sizes</Label>
          <div className="grid grid-cols-3 gap-2">
            {AVAILABLE_SIZES.map((size) => (
              <div key={size} className="flex items-center space-x-2">
                <Checkbox
                  id={`size-${size}`}
                  checked={initialFilters.sizes.includes(size)}
                  onCheckedChange={(checked) =>
                    handleSizeChange(size, checked as boolean)
                  }
                />
                <label
                  htmlFor={`size-${size}`}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {size}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;