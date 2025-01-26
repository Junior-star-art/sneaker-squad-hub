import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

interface StockIndicatorProps {
  stock: number;
  lowStockThreshold?: number;
}

export const StockIndicator = ({ 
  stock, 
  lowStockThreshold = 5 
}: StockIndicatorProps) => {
  if (stock === 0) {
    return (
      <Badge variant="destructive" className="flex items-center gap-1">
        <XCircle className="w-4 h-4" />
        Out of Stock
      </Badge>
    );
  }

  if (stock <= lowStockThreshold) {
    return (
      <Badge variant="secondary" className="flex items-center gap-1">
        <AlertTriangle className="w-4 h-4" />
        Low Stock - Only {stock} left
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="flex items-center gap-1">
      <CheckCircle className="w-4 h-4" />
      In Stock
    </Badge>
  );
};