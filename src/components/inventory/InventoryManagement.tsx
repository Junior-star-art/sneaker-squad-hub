import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Minus, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: string;
  name: string;
  stock: number;
  low_stock_threshold: number;
  inventory_status: string;
}

export function InventoryManagement() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const { toast } = useToast();

  const { data: products, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, stock, low_stock_threshold, inventory_status")
        .order("name");

      if (error) throw error;
      return data as Product[];
    },
  });

  const handleStockChange = async (type: "increase" | "decrease") => {
    if (!selectedProduct || !quantity || isNaN(Number(quantity))) {
      toast({
        title: "Error",
        description: "Please enter a valid quantity",
        variant: "destructive",
      });
      return;
    }

    const quantityChange = type === "increase" ? Number(quantity) : -Number(quantity);

    try {
      const { error } = await supabase.from("inventory_logs").insert({
        product_id: selectedProduct.id,
        quantity_change: quantityChange,
        type: type === "increase" ? "restock" : "adjustment",
        notes: notes,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Stock ${type === "increase" ? "increased" : "decreased"} successfully`,
      });

      setSelectedProduct(null);
      setQuantity("");
      setNotes("");
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update stock",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "out_of_stock":
        return <Badge variant="destructive">Out of Stock</Badge>;
      case "low_stock":
        return <Badge variant="secondary">Low Stock</Badge>;
      default:
        return <Badge variant="default">In Stock</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">Inventory Management</h2>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Current Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products?.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>{getStatusBadge(product.inventory_status)}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedProduct(product)}
                    >
                      Update Stock
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Update Stock for {product.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <label className="text-sm font-medium">Quantity</label>
                        <Input
                          type="number"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          min="1"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Notes</label>
                        <Input
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Optional notes about this change"
                          className="mt-1"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleStockChange("increase")}
                          className="flex-1"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Stock
                        </Button>
                        <Button
                          onClick={() => handleStockChange("decrease")}
                          variant="destructive"
                          className="flex-1"
                        >
                          <Minus className="w-4 h-4 mr-2" />
                          Remove Stock
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {products?.some(p => p.inventory_status === "low_stock") && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md flex items-center gap-2">
          <AlertTriangle className="text-yellow-500" />
          <p className="text-sm text-yellow-700">
            Some products are running low on stock. Please review and restock as needed.
          </p>
        </div>
      )}
    </div>
  );
}