
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function PaymentCancelled() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const updateOrderStatus = async () => {
      if (!orderId) return;
      
      try {
        setIsProcessing(true);
        
        // Update order status to cancelled
        const { error } = await supabase
          .from('orders')
          .update({ status: 'cancelled' })
          .eq('id', orderId);
        
        if (error) throw error;
        
        // Add tracking update
        await supabase
          .from('order_tracking')
          .insert({
            order_id: orderId,
            status: 'payment_cancelled',
            description: 'Payment was cancelled by the customer',
          });
        
      } catch (error) {
        console.error('Error updating order status:', error);
      } finally {
        setIsProcessing(false);
      }
    };
    
    updateOrderStatus();
  }, [orderId]);

  const handleTryAgain = async () => {
    if (!orderId) {
      navigate('/cart');
      return;
    }
    
    try {
      setIsProcessing(true);
      
      // Get order details
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();
      
      if (orderError) throw orderError;
      
      // Get order items
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('*, products:product_id(*)')
        .eq('order_id', orderId);
      
      if (itemsError) throw itemsError;
      
      // Add items back to cart
      const cartItems = itemsData.map((item: any) => ({
        id: item.product_id,
        name: item.products.name,
        price: item.price_at_time,
        image: item.products.images?.[0] || '',
        quantity: item.quantity,
        size: item.size,
      }));
      
      // Store in session storage for cart to pick up
      sessionStorage.setItem('recovered_cart_items', JSON.stringify(cartItems));
      
      toast({
        title: "Cart Recovered",
        description: "We've restored your cart items. You can try the payment again.",
      });
      
      // Navigate to cart
      navigate('/cart');
    } catch (error) {
      console.error('Error recovering cart:', error);
      toast({
        title: "Error",
        description: "Could not recover your cart. Please try again.",
        variant: "destructive",
      });
      navigate('/cart');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 text-center">
      <div className="mb-8">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="h-10 w-10 text-red-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Payment Cancelled</h1>
        <p className="text-lg text-gray-600 mb-4">
          Your payment was not completed and no charges were made.
        </p>
        {orderId && (
          <p className="text-sm text-gray-500">
            Order reference: #{orderId.substring(0, 8)}
          </p>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">What would you like to do?</h2>
        <div className="space-y-4">
          <Button 
            onClick={handleTryAgain}
            className="w-full flex items-center justify-center"
            disabled={isProcessing}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            {isProcessing ? "Processing..." : "Try Payment Again"}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="w-full"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Return to Homepage
          </Button>
        </div>
      </div>
      
      <p className="text-sm text-gray-500">
        If you have any questions about your order, please contact our customer support.
      </p>
    </div>
  );
}
