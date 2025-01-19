import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DiscountCodeInputProps {
  subtotal: number;
  onApplyDiscount: (discount: {
    type: string;
    value: number;
    code: string;
    maxAmount?: number;
  }) => void;
}

export const DiscountCodeInput = ({ subtotal, onApplyDiscount }: DiscountCodeInputProps) => {
  const [code, setCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  const validateDiscountCode = async () => {
    if (!code.trim()) {
      toast({
        title: "Error",
        description: "Please enter a discount code",
        variant: "destructive",
      });
      return;
    }

    setIsValidating(true);
    try {
      // Check if promotion exists and is active
      const { data: promotion, error: promotionError } = await supabase
        .from("promotions")
        .select("*")
        .eq("code", code.toUpperCase())
        .eq("active", true)
        .single();

      if (promotionError || !promotion) {
        throw new Error("Invalid discount code");
      }

      // Validate dates
      const now = new Date();
      if (now < new Date(promotion.start_date) || now > new Date(promotion.end_date)) {
        throw new Error("This discount code has expired");
      }

      // Validate usage limit
      if (promotion.usage_limit && promotion.times_used >= promotion.usage_limit) {
        throw new Error("This discount code has reached its usage limit");
      }

      // Validate minimum purchase amount
      if (promotion.min_purchase_amount && subtotal < promotion.min_purchase_amount) {
        throw new Error(`Minimum purchase amount of $${promotion.min_purchase_amount} required`);
      }

      // Calculate discount amount
      let discountAmount = promotion.discount_type === "percentage" 
        ? (subtotal * promotion.discount_value) / 100
        : promotion.discount_value;

      // Apply maximum discount if specified
      if (promotion.max_discount_amount && discountAmount > promotion.max_discount_amount) {
        discountAmount = promotion.max_discount_amount;
      }

      // Update promotion usage count
      const { error: updateError } = await supabase
        .from("promotions")
        .update({ times_used: promotion.times_used + 1 })
        .eq("id", promotion.id);

      if (updateError) throw updateError;

      onApplyDiscount({
        type: promotion.discount_type,
        value: promotion.discount_value,
        code: promotion.code,
        maxAmount: promotion.max_discount_amount,
      });

      toast({
        title: "Success",
        description: "Discount code applied successfully",
      });

    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to apply discount code",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Input
        placeholder="Enter discount code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="uppercase"
      />
      <Button 
        onClick={validateDiscountCode}
        disabled={isValidating}
        variant="outline"
      >
        {isValidating ? "Validating..." : "Apply"}
      </Button>
    </div>
  );
};