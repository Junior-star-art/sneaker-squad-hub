import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { TrackingUpdate } from "@/types/database";
import OrderMap from "./OrderMap";
import { TrackingTimeline } from "./TrackingTimeline";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

interface OrderTrackingProps {
  orderId: string;
}

export const OrderTracking = ({ orderId }: OrderTrackingProps) => {
  const [updates, setUpdates] = useState<TrackingUpdate[]>([]);
  const { toast } = useToast();
  const latestUpdate = updates[0];

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const { data, error } = await supabase
          .from('order_tracking')
          .select('*')
          .eq('order_id', orderId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setUpdates(data || []);
      } catch (error) {
        console.error('Error fetching tracking updates:', error);
        toast({
          title: "Error",
          description: "Failed to load tracking updates",
          variant: "destructive",
        });
      }
    };

    fetchUpdates();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('order-tracking')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'order_tracking',
          filter: `order_id=eq.${orderId}`,
        },
        async (payload: RealtimePostgresChangesPayload<TrackingUpdate>) => {
          console.log('Received tracking update:', payload);
          
          if (!payload.new) return;

          // Type assertion since we know the shape of our data
          const newUpdate = payload.new as TrackingUpdate;

          // Ensure all required fields are present
          if (!newUpdate.id || !newUpdate.order_id || !newUpdate.status || !newUpdate.created_at) {
            console.error('Invalid tracking update received:', newUpdate);
            return;
          }

          // Update the local state
          setUpdates(prev => [newUpdate, ...prev]);

          try {
            // Fetch the order to get the user ID
            const { data: orderData } = await supabase
              .from('orders')
              .select('user_id')
              .eq('id', orderId)
              .single();

            if (orderData?.user_id) {
              const { data: userData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', orderData.user_id)
                .single();

              if (userData) {
                // Send email notification
                await supabase.functions.invoke('order-status-notification', {
                  body: {
                    orderId,
                    status: newUpdate.status,
                    userId: userData.id,
                  },
                });
              }
            }
          } catch (error) {
            console.error('Error processing tracking update:', error);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, toast]);

  if (!updates.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No tracking updates available</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {latestUpdate?.latitude && latestUpdate?.longitude && (
        <div className="h-[400px] rounded-lg overflow-hidden">
          <OrderMap
            orderId={orderId}
            initialLocation={{
              latitude: Number(latestUpdate.latitude),
              longitude: Number(latestUpdate.longitude)
            }}
          />
        </div>
      )}
      <TrackingTimeline updates={updates} />
    </div>
  );
};