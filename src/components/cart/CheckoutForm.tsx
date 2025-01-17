import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

type CheckoutFormProps = {
  onBack: () => void;
};

const CheckoutForm = ({ onBack }: CheckoutFormProps) => {
  const { items, total } = useCart();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCheckout = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please sign in to continue with checkout",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      const { data: { url }, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          items,
          userId: user.id,
        },
      });

      if (error) throw error;

      // Send order notification
      const orderId = new URL(url).searchParams.get('order_id');
      if (orderId) {
        await supabase.functions.invoke('order-notification', {
          body: { orderId },
        });
      }

      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "There was a problem processing your checkout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="font-medium">Total to Pay:</span>
          <span className="font-medium">{total}</span>
        </div>
        <Button 
          onClick={handleCheckout} 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Proceed to Payment"}
        </Button>
        <Button variant="outline" className="w-full mt-2" onClick={onBack}>
          Back to Cart
        </Button>
      </div>
    </div>
  );
};

export default CheckoutForm;