import { useState, useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { trackEvent } from '@/utils/analytics';

interface Promotion {
  id: string;
  message: string;
  code: string;
  type: 'discount' | 'free_shipping' | 'special_offer';
  discount_amount?: number;
  end_date?: string;
}

export const PromotionalBanner = () => {
  const [currentPromotion, setCurrentPromotion] = useState<Promotion | null>(null);
  const [isVisible, setIsVisible] = useState(true);

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
          setCurrentPromotion(data);
          trackEvent('promotion_view', 'marketing', data.code);
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