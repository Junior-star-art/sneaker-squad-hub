import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { TrackingUpdate } from "@/types/database";
import { OrderMap } from "./OrderMap";
import { TrackingTimeline } from "./TrackingTimeline";

interface OrderTrackingProps {
  orderId: string;
}

type SupabaseTrackingUpdate = Omit<TrackingUpdate, 'status'> & {
  status: string;
};

const isValidStatus = (status: string): status is TrackingUpdate['status'] => {
  return ['pending', 'processing', 'shipped', 'delivered'].includes(status);
};

const transformTrackingUpdate = (update: SupabaseTrackingUpdate): TrackingUpdate => {
  const status = isValidStatus(update.status) ? update.status : 'pending';
  return { ...update, status };
};

export const OrderTracking = ({ orderId }: OrderTrackingProps) => {
  const { toast } = useToast();

  const { data: trackingUpdates = [], refetch } = useQuery({
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
          description: "Failed to load tracking updates",
          variant: "destructive",
        });
        throw error;
      }

      const transformedData = (data || []).map(transformTrackingUpdate);
      return transformedData;
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel('order-tracking-updates')
      .on(
        'postgres_changes' as any,
        {
          event: '*',
          schema: 'public',
          table: 'order_tracking',
          filter: `order_id=eq.${orderId}`,
        },
        (payload: { new: SupabaseTrackingUpdate }) => {
          if (payload.new) {
            const transformedUpdate = transformTrackingUpdate(payload.new);
            refetch();
            
            toast({
              title: "Tracking Updated",
              description: `Order status: ${transformedUpdate.status}`,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, toast, refetch]);

  const latestUpdate = trackingUpdates[0];

  return (
    <div className="space-y-6">
      {latestUpdate?.latitude && latestUpdate?.longitude && (
        <div className="h-[400px] rounded-lg overflow-hidden">
          <OrderMap
            latitude={latestUpdate.latitude}
            longitude={latestUpdate.longitude}
            location={latestUpdate.location}
          />
        </div>
      )}
      <TrackingTimeline updates={trackingUpdates} />
    </div>
  );
};