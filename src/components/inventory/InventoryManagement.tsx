import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Package, AlertTriangle, CheckCircle } from "lucide-react";

interface Product {
  id: string;
  name: string;
  stock: number;
  low_stock_threshold: number;
  inventory_status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

export const InventoryManagement = () => {
  const [restockAmount, setRestockAmount] = useState<{ [key: string]: number }>({});
  const { toast } = useToast();

  const { data: products, isLoading, refetch } = useQuery({
    queryKey: ["inventory-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, stock, low_stock_threshold, inventory_status")
        .order("name");

      if (error) throw error;
      return data as Product[];
    },
  });

  const handleRestock = async (productId: string) => {
    const amount = restockAmount[productId];
    if (!amount || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid restock amount",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("inventory_logs")
        .insert({
          product_id: productId,
          quantity_change: amount,
          type: "restock",
          notes: `Manual restock of ${amount} units`,
        });

      if (error) throw error;

      toast({
        title: "Restock successful",
        description: `Added ${amount} units to inventory`,
      });

      // Clear the restock amount input
      setRestockAmount(prev => ({ ...prev, [productId]: 0 }));
      refetch();
    } catch (error) {
      console.error("Error restocking product:", error);
      toast({
        title: "Error",
        description: "Failed to restock product",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: Product['inventory_status']) => {
    switch (status) {
      case 'in_stock':
        return <Badge className="bg-green-500"><CheckCircle className="w-4 h-4 mr-1" /> In Stock</Badge>;
      case 'low_stock':
        return <Badge variant="warning"><AlertTriangle className="w-4 h-4 mr-1" /> Low Stock</Badge>;
      case 'out_of_stock':
        return <Badge variant="destructive"><Package className="w-4 h-4 mr-1" /> Out of Stock</Badge>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return <div>Loading inventory...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Inventory Management</h2>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Current Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Restock Amount</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products?.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>{getStatusBadge(product.inventory_status)}</TableCell>
              <TableCell>
                <Input
                  type="number"
                  min="1"
                  value={restockAmount[product.id] || ''}
                  onChange={(e) => setRestockAmount(prev => ({
                    ...prev,
                    [product.id]: parseInt(e.target.value) || 0
                  }))}
                  className="w-24"
                />
              </TableCell>
              <TableCell>
                <Button
                  onClick={() => handleRestock(product.id)}
                  disabled={!restockAmount[product.id] || restockAmount[product.id] <= 0}
                >
                  Restock
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};