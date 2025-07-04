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

    // Initialize with Mapbox token
    mapboxgl.accessToken = process.env.MAPBOX_PUBLIC_TOKEN || '';
    
    const initialLngLat: [number, number] = [
      initialLocation?.longitude || -74.006,
      initialLocation?.latitude || 40.7128
    ];

    // Create map instance
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: initialLngLat,
      zoom: 12
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add marker
    marker.current = new mapboxgl.Marker({
      color: '#FF0000',
      draggable: false
    })
      .setLngLat(initialLngLat)
      .addTo(map.current);

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
        (payload: any) => {
          console.log('Received tracking update:', payload);
          if (payload.new && map.current && marker.current) {
            const { latitude, longitude } = payload.new;
            if (latitude && longitude) {
              const newLocation: [number, number] = [longitude, latitude];
              marker.current.setLngLat(newLocation);
              map.current.flyTo({
                center: newLocation,
                zoom: 12,
                duration: 2000,
                essential: true
              });
            }
          }
        }
      )
      .subscribe();

    // Cleanup
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