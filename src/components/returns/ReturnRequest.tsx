import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";

interface ReturnRequestProps {
  orderId: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
  }>;
}

export const ReturnRequest = ({ orderId, items }: ReturnRequestProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reason, setReason] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const createReturn = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('return_requests')
        .insert({
          order_id: orderId,
          user_id: user?.id,
          reason,
          items: selectedItems.map(id => ({
            item_id: id,
            quantity: items.find(item => item.id === id)?.quantity || 1,
          })),
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Return request submitted",
        description: "We'll review your request and get back to you soon.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit return request. Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Return Request</h3>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={item.id}
              checked={selectedItems.includes(item.id)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedItems([...selectedItems, item.id]);
                } else {
                  setSelectedItems(selectedItems.filter(id => id !== item.id));
                }
              }}
            />
            <label htmlFor={item.id}>{item.name} (Qty: {item.quantity})</label>
          </div>
        ))}
      </div>
      <div>
        <label className="block mb-2">Reason for Return</label>
        <Textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Please explain why you want to return these items..."
          className="w-full"
        />
      </div>
      <Button
        onClick={() => createReturn.mutate()}
        disabled={selectedItems.length === 0 || !reason || createReturn.isPending}
      >
        Submit Return Request
      </Button>
    </div>
  );
};