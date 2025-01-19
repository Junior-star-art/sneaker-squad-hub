import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from "@/integrations/supabase/client";

interface OrderMapProps {
  orderId: string;
  initialLocation?: {
    latitude: number;
    longitude: number;
  };
}

const OrderMap = ({ orderId, initialLocation }: OrderMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN || '';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [initialLocation?.longitude || -74.006, initialLocation?.latitude || 40.7128],
      zoom: 12
    });

    marker.current = new mapboxgl.Marker()
      .setLngLat([initialLocation?.longitude || -74.006, initialLocation?.latitude || 40.7128])
      .addTo(map.current);

    // Subscribe to real-time updates
    const channel = supabase
      .channel('order-tracking')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'order_tracking',
          filter: `order_id=eq.${orderId}`,
        },
        (payload) => {
          if (payload.new && map.current && marker.current) {
            const { latitude, longitude } = payload.new;
            if (latitude && longitude) {
              const newLocation = [longitude, latitude];
              marker.current.setLngLat(newLocation);
              map.current.flyTo({
                center: newLocation,
                zoom: 12,
                duration: 2000
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      if (map.current) {
        map.current.remove();
      }
      supabase.removeChannel(channel);
    };
  }, [orderId, initialLocation]);

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default OrderMap;