import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Package, Truck, CheckCircle, AlertCircle, Calendar } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface OrderTrackingProps {
  orderId: string;
}

const statusIcons = {
  pending: AlertCircle,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
};

export const OrderTracking = ({ orderId }: OrderTrackingProps) => {
  const { toast } = useToast();

  const { data: tracking, isLoading } = useQuery({
    queryKey: ['order-tracking', orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('order_tracking')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load tracking information",
          variant: "destructive",
        });
        throw error;
      }

      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Order Tracking</h3>
      <ScrollArea className="h-[300px] rounded-md border p-4">
        <div className="space-y-8">
          {tracking?.map((update) => {
            const StatusIcon = statusIcons[update.status as keyof typeof statusIcons] || Package;
            return (
              <div key={update.id} className="relative">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50">
                      <StatusIcon className="h-5 w-5 text-blue-500" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium capitalize">{update.status}</p>
                      <time className="text-sm text-gray-500">
                        {format(new Date(update.created_at), 'MMM d, yyyy h:mm a')}
                      </time>
                    </div>
                    {update.location && (
                      <p className="mt-1 text-sm text-gray-500">{update.location}</p>
                    )}
                    {update.description && (
                      <p className="mt-1 text-sm">{update.description}</p>
                    )}
                    {update.tracking_number && (
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4 text-gray-500" />
                          <p className="text-sm text-gray-500">
                            Tracking Number: {update.tracking_number}
                          </p>
                        </div>
                        {update.carrier && (
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-gray-500" />
                            <p className="text-sm text-gray-500">
                              Carrier: {update.carrier}
                            </p>
                          </div>
                        )}
                        {update.estimated_delivery && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <p className="text-sm text-gray-500">
                              Estimated Delivery: {format(new Date(update.estimated_delivery), 'MMM d, yyyy')}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};