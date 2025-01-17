import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ProductFilters = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-4">Price Range</h3>
        <Slider
          defaultValue={[0, 1000]}
          max={1000}
          step={10}
          className="w-full"
        />
        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
          <span>$0</span>
          <span>$1000</span>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-4">Colors</h3>
        <div className="space-y-2">
          {["Black", "White", "Red", "Blue"].map((color) => (
            <div key={color} className="flex items-center space-x-2">
              <Checkbox id={color} />
              <label htmlFor={color} className="text-sm">
                {color}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-4">Size</h3>
        <div className="space-y-2">
          {["US 7", "US 8", "US 9", "US 10", "US 11"].map((size) => (
            <div key={size} className="flex items-center space-x-2">
              <Checkbox id={size} />
              <label htmlFor={size} className="text-sm">
                {size}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-4">Sort By</h3>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ProductFilters;