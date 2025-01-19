import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { PaymentMethodIcons } from "./PaymentMethodIcons";
import { SecurityInfo } from "./SecurityInfo";
import { DiscountCodeInput } from "./DiscountCodeInput";
import { LaybyPlanForm } from "./LaybyPlanForm";
import { CartAuthDialog } from "./CartAuthDialog";
import { processPayFastPayment } from "@/utils/payfast";
import type { PayFastPaymentParams } from "@/types/global";

export const CheckoutForm = () => {
  const { items, total } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!user) {
      setShowAuthDialog(true);
      return;
    }

    try {
      setLoading(true);

      // Prepare order items
      const orderItems = items.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      }));

      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: total,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(
          orderItems.map(item => ({
            order_id: order.id,
            ...item
          }))
        );

      if (itemsError) throw itemsError;

      // Process payment
      const paymentParams: PayFastPaymentParams = {
        merchant_id: process.env.PAYFAST_MERCHANT_ID || '',
        merchant_key: process.env.PAYFAST_MERCHANT_KEY || '',
        amount: total.toString(),
        item_name: `Order #${order.id}`,
        return_url: `${window.location.origin}/order-success`,
        cancel_url: `${window.location.origin}/cart`,
        notify_url: `${window.location.origin}/api/payfast-notification`,
        name_first: user.user_metadata?.full_name?.split(' ')[0] || '',
        name_last: user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
      };

      await processPayFastPayment(paymentParams);

      toast({
        title: "Order placed successfully",
        description: "You will be redirected to complete the payment",
      });
    } catch (error: any) {
      toast({
        title: "Error placing order",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={user?.user_metadata?.full_name || ''}
            disabled
            className="bg-muted"
          />
        </div>
      </div>

      <PaymentMethodIcons />
      <SecurityInfo />
      <DiscountCodeInput />
      <LaybyPlanForm />

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Processing..." : "Place Order"}
      </Button>

      <CartAuthDialog 
        open={showAuthDialog} 
        onOpenChange={setShowAuthDialog}
      />
    </form>
  );
};