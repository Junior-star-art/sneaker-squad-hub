
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { StockIndicator } from "./StockIndicator";
import { AlertCircle, Plus, Minus } from "lucide-react";

interface InventoryManagerProps {
  productId: string;
  currentStock: number;
  lowStockThreshold?: number;
  onUpdate?: (newStock: number) => void;
}

export function InventoryManager({
  productId,
  currentStock,
  lowStockThreshold = 5,
  onUpdate
}: InventoryManagerProps) {
  const [quantity, setQuantity] = useState('1');
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const updateStock = async (type: 'restock' | 'adjustment', quantityChange: number) => {
    try {
      setIsUpdating(true);

      const { error } = await supabase
        .from('inventory_logs')
        .insert({
          product_id: productId,
          quantity_change: quantityChange,
          type: type,
          notes: `Manual ${type} of ${Math.abs(quantityChange)} units`
        });

      if (error) throw error;

      onUpdate?.(currentStock + quantityChange);

      toast({
        title: "Stock updated",
        description: `Successfully ${type === 'restock' ? 'added' : 'removed'} ${Math.abs(quantityChange)} units`,
      });

      setQuantity('1');
    } catch (error: any) {
      console.error('Stock update error:', error);
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Inventory Management</h3>
        <StockIndicator stock={currentStock} lowStockThreshold={lowStockThreshold} />
      </div>

      {currentStock <= lowStockThreshold && (
        <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 p-3 rounded-md">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">Low stock alert! Consider restocking.</span>
        </div>
      )}

      <div className="flex items-center gap-2">
        <Input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-24"
        />
        
        <Button
          variant="outline"
          onClick={() => updateStock('restock', Math.abs(parseInt(quantity)))}
          disabled={isUpdating || parseInt(quantity) < 1}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Stock
        </Button>

        <Button
          variant="outline"
          onClick={() => updateStock('adjustment', -Math.abs(parseInt(quantity)))}
          disabled={isUpdating || parseInt(quantity) < 1 || currentStock < parseInt(quantity)}
          className="flex items-center gap-2"
        >
          <Minus className="h-4 w-4" />
          Remove Stock
        </Button>
      </div>

      <div className="text-sm text-muted-foreground">
        Current stock: {currentStock} units
        <br />
        Low stock threshold: {lowStockThreshold} units
      </div>
    </div>
  );
}
