import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Bell } from "lucide-react";

interface StockNotificationProps {
  productId: string;
  productName: string;
}

export const StockNotification = ({ productId, productName }: StockNotificationProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("stock_notifications").insert({
        product_id: productId,
        user_id: user?.id,
        email: user?.email || email,
      });

      if (error) throw error;

      toast({
        title: "Notification Set",
        description: `We'll notify you when ${productName} is back in stock.`,
      });
    } catch (error) {
      console.error("Error setting notification:", error);
      toast({
        title: "Error",
        description: "Failed to set notification. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!user && (
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full"
        />
      )}
      <Button
        type="submit"
        variant="outline"
        disabled={isSubmitting}
        className="w-full flex items-center gap-2"
      >
        <Bell className="w-4 h-4" />
        Notify When Available
      </Button>
    </form>
  );
};