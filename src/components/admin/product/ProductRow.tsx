
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ProductForm } from "../ProductForm";
import { OptimizedImage } from "@/components/ui/optimized-image";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  images: string[];
  description?: string;
  category_id?: string;
}

interface ProductRowProps {
  product: Product;
}

export function ProductRow({ product }: ProductRowProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({
        title: "Product deleted",
        description: "The product has been successfully deleted",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <TableRow>
      <TableCell>
        <OptimizedImage
          src={product.images?.[0] || "/placeholder.svg"}
          alt={product.name}
          className="h-12 w-12 object-cover rounded"
        />
      </TableCell>
      <TableCell>{product.name}</TableCell>
      <TableCell>${product.price}</TableCell>
      <TableCell>{product.stock}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedProduct(product)}
              >
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <ProductForm
                product={selectedProduct}
                onSuccess={() => {
                  setSelectedProduct(null);
                  queryClient.invalidateQueries({ queryKey: ["products"] });
                }}
              />
            </DialogContent>
          </Dialog>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              if (confirm("Are you sure you want to delete this product?")) {
                deleteMutation.mutate(product.id);
              }
            }}
          >
            Delete
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
