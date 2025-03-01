
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
import { PaymentMethodIcons } from "@/components/cart/PaymentMethodIcons";
import { SecurityInfo } from "@/components/cart/SecurityInfo";
import { DiscountCodeInput } from "@/components/cart/DiscountCodeInput";
import { LaybyPlanForm } from "@/components/cart/LaybyPlanForm";
import { useNavigate } from "react-router-dom";

interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimated_days: number;
}

interface CheckoutFormProps {
  onBack: () => void;
}

export const CheckoutForm = ({ onBack }: CheckoutFormProps) => {
  const { items, total: subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<string | null>(null);
  const [appliedDiscount, setAppliedDiscount] = useState<{
    type: string;
    value: number;
    code: string;
    maxAmount?: number;
  } | null>(null);
  const [isLayby, setIsLayby] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

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

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to complete your purchase.",
          variant: "destructive",
        });
        return;
      }
      
      // Get user details for shipping information
      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileError) {
        console.error('Error fetching user profile:', profileError);
      }
      
      // Get user's default shipping address
      const { data: userAddresses, error: addressError } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_default', true)
        .single();
      
      if (addressError && addressError.code !== 'PGRST116') {
        console.error('Error fetching user address:', addressError);
      }
      
      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          status: 'pending',
          total_amount: calculateTotal(),
          shipping_method_id: selectedShippingMethod,
          shipping_address: userAddresses ? {
            address_line1: userAddresses.address_line1,
            address_line2: userAddresses.address_line2,
            city: userAddresses.city,
            state: userAddresses.state,
            postal_code: userAddresses.postal_code,
            country: userAddresses.country,
          } : null,
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
        price_at_time: parseFloat(item.price.toString().replace('$', '')),
        size: item.size
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        throw new Error('Failed to create order items');
      }
      
      // Create initial tracking entry
      const { error: trackingError } = await supabase
        .from('order_tracking')
        .insert({
          order_id: order.id,
          status: 'order_created',
          description: 'Order has been created and is awaiting payment',
        });
      
      if (trackingError) {
        console.error('Error creating tracking entry:', trackingError);
      }
      
      // Apply discount code if used
      if (appliedDiscount) {
        const { error: discountError } = await supabase
          .from('discount_codes')
          .insert({
            promotion_id: appliedDiscount.code,
            user_id: user.id,
            used_at: new Date().toISOString(),
          });
        
        if (discountError) {
          console.error('Error recording discount usage:', discountError);
        }
      }

      // Initiate payment
      const paymentResult = initiatePayFastPayment({
        orderId: order.id,
        amount: calculateTotal(),
        customerName: user?.user_metadata?.full_name || userProfile?.full_name || '',
        customerEmail: user?.email || '',
        itemName: `Order #${order.id.slice(0, 8)}`,
      });
      
      // Clear the cart after successful order creation
      clearCart();
      
      // Redirect to payment page
      window.location.href = paymentResult.url;
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "There was a problem processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate total including shipping and discount
  const calculateTotal = () => {
    const subtotalValue = parseFloat(subtotal.replace('$', ''));
    const shippingCost = selectedShippingMethod 
      ? shippingMethods?.find(m => m.id === selectedShippingMethod)?.price || 0
      : 0;
    const discountAmount = calculateDiscountAmount();

    return subtotalValue + shippingCost - discountAmount;
  };

  const handleLaybySuccess = async (planId: string) => {
    try {
      setIsLoading(true);
      
      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id,
          status: 'layby_active',
          total_amount: calculateTotal(),
          shipping_method_id: selectedShippingMethod,
        })
        .select()
        .single();

      if (orderError || !order) {
        throw new Error('Failed to create order');
      }

      // Update layby plan with order ID
      const { error: updateError } = await supabase
        .from('layby_plans')
        .update({ order_id: order.id })
        .eq('id', planId);

      if (updateError) {
        throw updateError;
      }

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price_at_time: parseFloat(item.price.toString().replace('$', '')),
        size: item.size
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        throw new Error('Failed to create order items');
      }
      
      // Create tracking entry for layby order
      const { error: trackingError } = await supabase
        .from('order_tracking')
        .insert({
          order_id: order.id,
          status: 'layby_created',
          description: 'Layby plan has been created',
        });
      
      if (trackingError) {
        console.error('Error creating tracking entry:', trackingError);
      }

      toast({
        title: "Success",
        description: "Your layby plan has been created and your order has been placed.",
      });
      
      // Clear the cart after successful order creation
      clearCart();

      // Redirect to order confirmation
      navigate(`/orders/${order.id}`);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "There was a problem processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <div className="space-y-6">
      <PaymentMethodIcons />
      
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Payment Method</h3>
        <RadioGroup
          onValueChange={(value) => setIsLayby(value === 'layby')}
          defaultValue="immediate"
          className="space-y-4"
        >
          <div className="flex items-center space-x-3 border p-4 rounded-lg">
            <RadioGroupItem value="immediate" id="immediate" />
            <Label htmlFor="immediate" className="flex-1">
              <div className="flex justify-between">
                <div>
                  <div className="font-medium">Pay Now</div>
                  <div className="text-sm text-gray-500">Pay the full amount immediately</div>
                </div>
              </div>
            </Label>
          </div>
          <div className="flex items-center space-x-3 border p-4 rounded-lg">
            <RadioGroupItem value="layby" id="layby" />
            <Label htmlFor="layby" className="flex-1">
              <div className="flex justify-between">
                <div>
                  <div className="font-medium">Layby</div>
                  <div className="text-sm text-gray-500">Pay over time with regular installments</div>
                </div>
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>

      {isLayby ? (
        <LaybyPlanForm
          total={calculateTotal()}
          onSuccess={handleLaybySuccess}
          onCancel={() => setIsLayby(false)}
        />
      ) : (
        <>
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
                <span>${calculateTotal().toFixed(2)}</span>
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
        </>
      )}
    </div>
  );
};
