
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PaymentRequest {
  amount: number;
  item_name: string;
  item_description?: string;
  custom_str1?: string;
  email_address?: string;
  name_first?: string;
  name_last?: string;
}

interface PaymentResponse {
  paymentData: Record<string, string>;
  paymentUrl: string;
}

export const useSecurePayment = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createPayment = async (paymentRequest: PaymentRequest): Promise<PaymentResponse | null> => {
    setLoading(true);
    
    try {
      // Input validation
      if (!paymentRequest.amount || paymentRequest.amount <= 0) {
        throw new Error('Invalid payment amount');
      }

      if (!paymentRequest.item_name || paymentRequest.item_name.trim().length === 0) {
        throw new Error('Item name is required');
      }

      // Sanitize inputs
      const sanitizedRequest = {
        ...paymentRequest,
        item_name: paymentRequest.item_name.trim().substring(0, 100),
        item_description: paymentRequest.item_description?.trim().substring(0, 255) || '',
        name_first: paymentRequest.name_first?.trim().substring(0, 50) || '',
        name_last: paymentRequest.name_last?.trim().substring(0, 50) || '',
      };

      const session = await supabase.auth.getSession();
      if (!session.data.session) {
        throw new Error('Authentication required');
      }

      const response = await fetch('/functions/v1/create-payfast-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.data.session.access_token}`,
        },
        body: JSON.stringify(sanitizedRequest),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Payment creation failed');
      }

      const paymentData = await response.json();
      
      toast({
        title: "Payment created",
        description: "Redirecting to secure payment page...",
      });

      return paymentData;

    } catch (error: any) {
      console.error('Payment creation error:', error);
      toast({
        title: "Payment Error",
        description: error.message || 'Failed to create payment',
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createPayment,
    loading
  };
};
