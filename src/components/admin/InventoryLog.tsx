
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface InventoryLogProps {
  productId: string;
  currentStock: number;
  onSuccess?: () => void;
}

export function InventoryLog({ productId, currentStock, onSuccess }: InventoryLogProps) {
  const [type, setType] = useState<'restock' | 'adjustment'>('restock');
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const quantityChange = parseInt(quantity) * (type === 'adjustment' ? 1 : 1);

      const { error } = await supabase
        .from('inventory_logs')
        .insert({
          product_id: productId,
          quantity_change: quantityChange,
          type,
          notes,
        });

      if (error) throw error;

      toast({
        title: "Inventory updated",
        description: `Successfully ${type === 'restock' ? 'restocked' : 'adjusted'} inventory`,
      });

      setQuantity('');
      setNotes('');
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Error updating inventory",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Type</Label>
        <Select value={type} onValueChange={(value: 'restock' | 'adjustment') => setType(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="restock">Restock</SelectItem>
            <SelectItem value="adjustment">Adjustment</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Quantity</Label>
        <Input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
          min="1"
        />
        <p className="text-sm text-muted-foreground">
          Current stock: {currentStock}
        </p>
      </div>

      <div className="space-y-2">
        <Label>Notes</Label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any relevant notes about this inventory change"
        />
      </div>

      <Button type="submit" disabled={loading}>
        Update Inventory
      </Button>
    </form>
  );
}
