
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { checkOrderPaymentStatus } from "@/utils/payfast";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Check, Package } from "lucide-react";

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const [isLoading, setIsLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setIsLoading(false);
        return;
      }

      try {
        // Check payment status
        const paymentStatus = await checkOrderPaymentStatus(orderId);
        
        // Fetch order details
        const { data, error } = await supabase
          .from('orders')
          .select(`
            id,
            total_amount,
            status,
            created_at,
            order_items (
              id,
              quantity,
              price_at_time,
              size,
              products:product_id (
                name,
                images
              )
            )
          `)
          .eq('id', orderId)
          .single();

        if (error) throw error;

        setOrderDetails(data);
        
        // If payment is still pending, show a toast
        if (paymentStatus === 'pending') {
          toast({
            title: "Payment Processing",
            description: "Your payment is still being processed. We'll update you once it's confirmed.",
          });
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
        toast({
          title: "Error",
          description: "Could not fetch order details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, toast]);

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <h1 className="text-2xl font-semibold">Loading order details...</h1>
        </div>
      </div>
    );
  }

  if (!orderId || !orderDetails) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center max-w-md p-6">
          <h1 className="text-2xl font-semibold mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-6">
            We couldn't find the order details. Please check your order history.
          </p>
          <Button onClick={() => navigate('/orders')}>View My Orders</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-12">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <Check className="h-10 w-10 text-green-600" />
        </motion.div>
        <h1 className="text-3xl font-bold mb-2">Thank You For Your Order!</h1>
        <p className="text-lg text-gray-600">
          {orderDetails.status === 'paid' 
            ? "Your payment has been received and your order is confirmed." 
            : "Your order has been received and is being processed."}
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h2 className="text-xl font-semibold">Order Details</h2>
          <span className="text-gray-600">Order #{orderId.substring(0, 8)}</span>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Order Date</span>
            <span>{new Date(orderDetails.created_at).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Order Status</span>
            <span className="capitalize">
              {orderDetails.status === 'paid' ? 'Confirmed' : orderDetails.status.replace('_', ' ')}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Amount</span>
            <span>${orderDetails.total_amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Payment Status</span>
            <span className={`capitalize ${orderDetails.status === 'paid' ? 'text-green-600' : 'text-orange-500'}`}>
              {orderDetails.status === 'paid' ? 'Paid' : 'Pending'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold border-b pb-4 mb-4">Order Items</h2>
        <div className="space-y-4">
          {orderDetails.order_items.map((item: any) => (
            <div key={item.id} className="flex items-center py-3 border-b last:border-0">
              <div className="h-16 w-16 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center mr-4">
                {item.products.images && item.products.images[0] ? (
                  <img 
                    src={item.products.images[0]} 
                    alt={item.products.name} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Package className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{item.products.name}</h3>
                <div className="text-sm text-gray-600">
                  <span>Size: {item.size}</span>
                  <span className="mx-2">•</span>
                  <span>Qty: {item.quantity}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-medium">${(item.price_at_time * item.quantity).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={() => navigate('/orders')}>
          View My Orders
        </Button>
        <Button variant="outline" onClick={() => navigate('/')}>
          Continue Shopping
        </Button>
      </div>
    </div>
  );
};
