import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { OrderTracking } from "@/components/orders/OrderTracking";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import { useState } from "react";

const OrderDetails = () => {
  const { orderId } = useParams();
  const { toast } = useToast();
  const [showCart, setShowCart] = useState(false);

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            product:products (
              name,
              images
            )
          ),
          shipping_method:shipping_methods (*)
        `)
        .eq('id', orderId)
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load order details",
          variant: "destructive",
        });
        throw error;
      }

      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar onCartClick={() => setShowCart(true)} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onCartClick={() => setShowCart(true)} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-sm rounded-lg divide-y divide-gray-200">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-semibold">Order #{orderId?.slice(0, 8)}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Placed on {format(new Date(order?.created_at), 'MMMM d, yyyy')}
                </p>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                ${order?.status === 'completed' ? 'bg-green-100 text-green-800' :
                  order?.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                }`}>
                {order?.status}
              </span>
            </div>
          </div>

          <div className="px-4 py-5 sm:p-6">
            <OrderTracking orderId={orderId!} />
          </div>

          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium mb-4">Order Items</h3>
            <div className="space-y-4">
              {order?.order_items.map((item: any) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <img
                    src={item.product.images?.[0] || '/placeholder.svg'}
                    alt={item.product.name}
                    className="h-16 w-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{item.product.name}</h4>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                    {item.size && (
                      <p className="text-sm text-gray-500">
                        Size: {item.size}
                      </p>
                    )}
                  </div>
                  <p className="text-sm font-medium">
                    ${item.price_at_time}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-gray-200 pt-6">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${order?.total_amount}</span>
              </div>
              {order?.shipping_method && (
                <div className="flex justify-between text-sm mt-2">
                  <span>Shipping ({order.shipping_method.name})</span>
                  <span>${order.shipping_method.price}</span>
                </div>
              )}
              <div className="flex justify-between font-medium text-lg mt-4">
                <span>Total</span>
                <span>${order?.total_amount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;