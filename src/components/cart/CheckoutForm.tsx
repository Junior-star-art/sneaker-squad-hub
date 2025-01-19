import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { initiatePayFastPayment } from "@/utils/payfast";
import { PaymentMethodIcons } from "./PaymentMethodIcons";
import { SecurityInfo } from "./SecurityInfo";
import { DiscountCodeInput } from "./DiscountCodeInput";

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

interface Discount {
  type: string;
  value: number;
  code: string;
  maxAmount?: number;
}

const CheckoutForm = ({ onBack }: CheckoutFormProps) => {
  const { items, total: subtotal } = useCart();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<string | null>(null);
  const [appliedDiscount, setAppliedDiscount] = useState<Discount | null>(null);
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

  // Calculate discount amount
  const calculateDiscountAmount = () => {
    if (!appliedDiscount) return 0;
    
    const subtotalValue = parseFloat(subtotal.replace('$', ''));
    let discountAmount = appliedDiscount.type === 'percentage'
      ? (subtotalValue * appliedDiscount.value) / 100
      : appliedDiscount.value;

    if (appliedDiscount.maxAmount && discountAmount > appliedDiscount.maxAmount) {
      discountAmount = appliedDiscount.maxAmount;
    }

    return discountAmount;
  };

  // Calculate total including shipping and discount
  const total = () => {
    const subtotalValue = parseFloat(subtotal.replace('$', ''));
    const shippingCost = selectedShippingMethod 
      ? shippingMethods?.find(m => m.id === selectedShippingMethod)?.price || 0
      : 0;
    const discountAmount = calculateDiscountAmount();

    return (subtotalValue + shippingCost - discountAmount).toLocaleString('en-US', {
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
      
      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          status: 'pending',
          total_amount: parseFloat(total().replace('$', '')),
          shipping_method_id: selectedShippingMethod,
        })
        .select()
        .single();

      if (orderError || !order) {
        throw new Error('Failed to create order');
      }

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price_at_time: parseFloat(item.price.toString()),
        size: item.size
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        throw new Error('Failed to create order items');
      }

      // If discount was applied, create discount code record
      if (appliedDiscount) {
        const { error: discountError } = await supabase
          .from('discount_codes')
          .insert({
            user_id: user.id,
            code: appliedDiscount.code,
            used_at: new Date().toISOString(),
          });

        if (discountError) {
          console.error('Error recording discount usage:', discountError);
        }
      }

      // Send order notification
      await supabase.functions.invoke('order-notification', {
        body: { orderId: order.id },
      });

      // Initiate PayFast payment
      initiatePayFastPayment({
        amount: parseFloat(total().replace('$', '')),
        customerName: user.user_metadata?.full_name || 'Customer',
        customerEmail: user.email || '',
        itemName: `Order #${order.id.slice(0, 8)}`,
      });

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
      <PaymentMethodIcons />
      
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

      <div className="space-y-4">
        <h3 className="font-medium text-lg">Discount Code</h3>
        <DiscountCodeInput 
          subtotal={parseFloat(subtotal.replace('$', ''))}
          onApplyDiscount={setAppliedDiscount}
        />
      </div>

      <div className="border-t pt-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{subtotal}</span>
          </div>
          {appliedDiscount && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount ({appliedDiscount.code})</span>
              <span>-${calculateDiscountAmount().toFixed(2)}</span>
            </div>
          )}
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

        <SecurityInfo />

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