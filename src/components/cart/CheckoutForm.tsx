import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";

type CheckoutFormProps = {
  onBack: () => void;
};

interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimated_days: number;
}

const CheckoutForm = ({ onBack }: CheckoutFormProps) => {
  const { items, total: subtotal } = useCart();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch shipping methods
  const { data: shippingMethods } = useQuery({
    queryKey: ['shippingMethods'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shipping_methods')
        .select('*')
        .order('price');
      
      if (error) throw error;
      return data as ShippingMethod[];
    },
  });

  // Calculate total including shipping
  const total = () => {
    const subtotalValue = parseFloat(subtotal.replace('$', ''));
    const shippingCost = selectedShippingMethod 
      ? shippingMethods?.find(m => m.id === selectedShippingMethod)?.price || 0
      : 0;
    return (subtotalValue + shippingCost).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
  };

  const handleCheckout = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please sign in to continue with checkout",
        variant: "destructive",
      });
      return;
    }

    if (!selectedShippingMethod) {
      toast({
        title: "Error",
        description: "Please select a shipping method",
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
          shippingMethodId: selectedShippingMethod,
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
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Shipping Method</h3>
        <RadioGroup
          onValueChange={setSelectedShippingMethod}
          className="space-y-4"
        >
          {shippingMethods?.map((method) => (
            <div key={method.id} className="flex items-center space-x-3 border p-4 rounded-lg">
              <RadioGroupItem value={method.id} id={method.id} />
              <Label htmlFor={method.id} className="flex-1">
                <div className="flex justify-between">
                  <div>
                    <div className="font-medium">{method.name}</div>
                    <div className="text-sm text-gray-500">{method.description}</div>
                    <div className="text-sm text-gray-500">Estimated delivery: {method.estimated_days} days</div>
                  </div>
                  <div className="font-medium">
                    ${method.price.toFixed(2)}
                  </div>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="border-t pt-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{subtotal}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>
              {selectedShippingMethod
                ? `$${shippingMethods?.find(m => m.id === selectedShippingMethod)?.price.toFixed(2)}`
                : '-'}
            </span>
          </div>
          <div className="flex justify-between font-medium text-lg pt-2">
            <span>Total</span>
            <span>{total()}</span>
          </div>
        </div>

        <div className="space-y-2 mt-6">
          <Button 
            onClick={handleCheckout} 
            className="w-full"
            disabled={isLoading || !selectedShippingMethod}
          >
            {isLoading ? "Processing..." : "Proceed to Payment"}
          </Button>
          <Button variant="outline" className="w-full" onClick={onBack}>
            Back to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;