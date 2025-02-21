
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OptimizedImage } from "@/components/ui/optimized-image";

interface ProductPreviewProps {
  name: string;
  price: string;
  description: string;
  images?: string[];
  stock: number;
}

export function ProductPreview({ name, price, description, images, stock }: ProductPreviewProps) {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(parseFloat(price || '0'));

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-square">
        <OptimizedImage
          src={images?.[0] || '/placeholder.svg'}
          alt={name}
          className="object-cover w-full h-full"
          sizes="(max-width: 768px) 100vw, 300px"
        />
        {stock <= 0 && (
          <Badge variant="destructive" className="absolute top-2 right-2">
            Out of Stock
          </Badge>
        )}
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-lg line-clamp-1">{name || 'Product Name'}</h3>
        <p className="text-xl font-bold text-primary">{formattedPrice}</p>
        <p className="text-muted-foreground text-sm line-clamp-2">
          {description || 'Product description will appear here'}
        </p>
        <div className="flex items-center gap-2">
          <Badge variant={stock > 0 ? "secondary" : "outline"}>
            {stock > 0 ? `${stock} in stock` : 'Out of stock'}
          </Badge>
        </div>
      </div>
    </Card>
  );
}
