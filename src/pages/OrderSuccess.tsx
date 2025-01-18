import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Navbar } from "@/components/Navbar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface OrderTracking {
  id: string;
  status: string;
  description: string | null;
  location: string | null;
  created_at: string;
}

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [order, setOrder] = useState<any>(null);
  const [tracking, setTracking] = useState<OrderTracking[]>([]);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!user) {
        navigate('/');
        return;
      }

      const orderId = searchParams.get('order_id');
      if (!orderId) {
        navigate('/');
        return;
      }

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
          order_tracking (
            *
          )
        `)
        .eq('id', orderId)
        .eq('user_id', user.id)
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Could not fetch order details",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      setOrder(data);
      if (data.order_tracking) {
        setTracking(data.order_tracking.sort((a: OrderTracking, b: OrderTracking) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ));
      }
    };

    fetchOrder();

    // Set up real-time subscription for tracking updates
    const channel = supabase
      .channel('order-tracking')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'order_tracking',
          filter: `order_id=eq.${searchParams.get('order_id')}`,
        },
        (payload) => {
          setTracking(current => [payload.new as OrderTracking, ...current]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, searchParams, navigate, toast]);

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <Check className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-3 text-center sm:mt-5">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Order Confirmed!
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Thank you for your order. We'll send you shipping confirmation when your order ships.
                </p>
              </div>
            </div>

            {tracking.length > 0 && (
              <div className="mt-6 border-t border-gray-200 pt-6">
                <h4 className="text-sm font-medium text-gray-900">Order Status Updates</h4>
                <ScrollArea className="h-[200px] mt-2">
                  <div className="space-y-4">
                    {tracking.map((update) => (
                      <div key={update.id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-sm">{update.status}</p>
                            {update.description && (
                              <p className="text-sm text-gray-500 mt-1">{update.description}</p>
                            )}
                            {update.location && (
                              <p className="text-sm text-gray-500">{update.location}</p>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">
                            {new Date(update.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            <div className="mt-6 border-t border-gray-200 pt-6">
              <div className="space-y-4">
                {order.order_items.map((item: any) => (
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
                      <p className="text-sm text-gray-500">
                        Size: {item.size || 'N/A'}
                      </p>
                    </div>
                    <p className="text-sm font-medium">
                      ${item.price_at_time}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t border-gray-200 pt-6">
                <div className="flex justify-between text-sm">
                  <span>Total</span>
                  <span className="font-medium">${order.total_amount}</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button
                onClick={() => navigate('/orders')}
                className="w-full"
              >
                View Order History
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
