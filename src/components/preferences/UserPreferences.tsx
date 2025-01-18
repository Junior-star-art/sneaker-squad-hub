import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface UserPreferences {
  preferred_sizes: Record<string, string[]>;
  email_preferences: {
    order_updates: boolean;
    recommendations: boolean;
    stock_notifications: boolean;
  };
}

export const UserPreferences = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: preferences, isLoading } = useQuery({
    queryKey: ['user-preferences'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      return data as UserPreferences;
    },
    enabled: !!user,
  });

  const updatePreferences = useMutation({
    mutationFn: async (newPreferences: Partial<UserPreferences>) => {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user?.id,
          ...newPreferences,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-preferences'] });
      toast({
        title: "Preferences updated",
        description: "Your preferences have been saved successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update preferences. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleEmailPreferenceChange = (key: keyof UserPreferences['email_preferences']) => {
    if (!preferences) return;

    updatePreferences.mutate({
      email_preferences: {
        ...preferences.email_preferences,
        [key]: !preferences.email_preferences[key],
      },
    });
  };

  if (isLoading) return <div>Loading preferences...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="order-updates"
              checked={preferences?.email_preferences.order_updates}
              onCheckedChange={() => handleEmailPreferenceChange('order_updates')}
            />
            <label htmlFor="order-updates">Order Updates</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="recommendations"
              checked={preferences?.email_preferences.recommendations}
              onCheckedChange={() => handleEmailPreferenceChange('recommendations')}
            />
            <label htmlFor="recommendations">Product Recommendations</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="stock-notifications"
              checked={preferences?.email_preferences.stock_notifications}
              onCheckedChange={() => handleEmailPreferenceChange('stock_notifications')}
            />
            <label htmlFor="stock-notifications">Stock Notifications</label>
          </div>
        </div>
      </div>
    </div>
  );
};