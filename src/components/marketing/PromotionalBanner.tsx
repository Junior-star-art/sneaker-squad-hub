import { useState, useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { trackEvent } from '@/utils/analytics';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Promotion {
  id: string;
  message: string;
  code: string;
  type: 'discount' | 'free_shipping' | 'special_offer';
  discount_amount?: number;
  end_date?: string;
  discount_type: string;
  discount_value: number;
  name: string;
  description?: string;
  min_purchase_amount?: number;
  max_discount_amount?: number;
  start_date: string;
  active?: boolean;
}

export const PromotionalBanner = () => {
  const [currentPromotion, setCurrentPromotion] = useState<Promotion | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCurrentPromotion = async () => {
      try {
        const { data, error } = await supabase
          .from('promotions')
          .select('*')
          .eq('active', true)
          .lte('start_date', new Date().toISOString())
          .gte('end_date', new Date().toISOString())
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error) throw error;
        
        if (data) {
          // Transform the data to match our Promotion interface
          const promotion: Promotion = {
            id: data.id,
            message: data.description || 'Special offer!',
            code: data.code,
            type: data.discount_type === 'percentage' ? 'discount' : 
                  data.discount_type === 'shipping' ? 'free_shipping' : 'special_offer',
            discount_amount: data.discount_value,
            end_date: data.end_date,
            discount_type: data.discount_type,
            discount_value: data.discount_value,
            name: data.name,
            description: data.description,
            min_purchase_amount: data.min_purchase_amount,
            max_discount_amount: data.max_discount_amount,
            start_date: data.start_date,
            active: data.active
          };
          
          setCurrentPromotion(promotion);
          trackEvent('promotion_view', 'marketing', promotion.code);
        }
      } catch (error) {
        console.error('Error fetching promotion:', error);
      }
    };

    fetchCurrentPromotion();
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    if (currentPromotion) {
      trackEvent('promotion_dismissed', 'marketing', currentPromotion.code);
    }
  };

  const handleCopyCode = () => {
    if (currentPromotion) {
      navigator.clipboard.writeText(currentPromotion.code);
      toast({
        title: "Code copied!",
        description: "The promotion code has been copied to your clipboard.",
      });
      trackEvent('promotion_code_copied', 'marketing', currentPromotion.code);
    }
  };

  if (!isVisible || !currentPromotion) return null;

  return (
    <div className="bg-nike-red text-white py-3 px-4 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm font-medium">
            {currentPromotion.message}{' '}
            <button
              onClick={handleCopyCode}
              className="underline font-bold hover:text-gray-100"
            >
              Use code: {currentPromotion.code}
            </button>
          </p>
        </div>
        <button
          onClick={handleClose}
          className="p-1 hover:bg-red-600 rounded-full transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};