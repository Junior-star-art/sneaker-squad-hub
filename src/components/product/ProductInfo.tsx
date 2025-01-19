import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

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
    if (stock === 0) return { label: "Out of Stock", color: "destructive" };
    if (stock < 5) return { label: "Low Stock", color: "warning" };
    return { label: "In Stock", color: "success" };
  };

  const status = getStockStatus();
  const formattedPrice = formatPrice(price);

  return (
    <div className={cn("space-y-6", isMobile && "pb-4")}>
      <div>
        <div className="flex justify-between items-center mb-2">
          <p className="text-2xl font-bold">{formattedPrice}</p>
          <Badge variant={status.color as "default" | "destructive" | "secondary"}>{status.label}</Badge>
        </div>
        {stock > 0 && stock < 5 && (
          <p className="text-sm text-red-500">Only {stock} left in stock!</p>
        )}
      </div>
      <Separator />
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Description</h4>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        {features?.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Features</h4>
            <ul className="text-sm text-gray-600 list-disc pl-4 space-y-1">
              {features?.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        )}
        <Separator />
        <div>
          <h4 className="font-medium mb-2">Materials & Care</h4>
          <p className="text-sm text-gray-600">{materials}</p>
          <p className="text-sm text-gray-600 mt-1">{care}</p>
        </div>
        <Separator />
        <div>
          <h4 className="font-medium mb-2">Shipping</h4>
          <p className="text-sm text-gray-600">{shipping}</p>
        </div>
      </div>
    </div>
  );
};