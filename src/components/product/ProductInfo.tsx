import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface ProductInfoProps {
  name: string;
  price: number;
  description: string;
  features: string[];
  materials: string;
  care: string;
  shipping: string;
  stock: number;
}

export const ProductInfo = ({ 
  price, 
  description, 
  features, 
  materials, 
  care, 
  shipping,
  stock 
}: ProductInfoProps) => {
  const isMobile = useIsMobile();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getStockStatus = () => {
    if (stock === 0) return { label: "Out of Stock", variant: "destructive" as const, icon: "🚫" };
    if (stock < 5) return { label: "Low Stock", variant: "secondary" as const, icon: "⚠️" };
    return { label: "In Stock", variant: "outline" as const, icon: "✅" };
  };

  const status = getStockStatus();
  const formattedPrice = formatPrice(price);

  return (
    <div className={cn("space-y-6", isMobile && "pb-4")}>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold">{formattedPrice}</p>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="w-4 h-4 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">(24 reviews)</span>
          </div>
        </div>
        <Badge variant={status.variant} className="text-sm">
          {status.icon} {status.label}
        </Badge>
        {stock > 0 && stock < 5 && (
          <p className="text-sm text-red-500 mt-1">Only {stock} left in stock - order soon!</p>
        )}
      </div>

      <Separator />

      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2 text-lg">Description</h4>
          <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>

        {features?.length > 0 && (
          <div>
            <h4 className="font-medium mb-2 text-lg">Key Features</h4>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              {features?.map((feature, index) => (
                <li key={index} className="leading-relaxed">{feature}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <Separator />

      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2 text-lg">Materials & Care</h4>
          <p className="text-gray-600 leading-relaxed">{materials}</p>
          <p className="text-gray-600 mt-2 leading-relaxed">{care}</p>
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="font-medium mb-2 text-lg">Shipping Information</h4>
        <p className="text-gray-600 leading-relaxed">{shipping}</p>
      </div>
    </div>
  );
};