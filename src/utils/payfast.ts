
interface PayFastData {
  merchant_id: string;
  merchant_key: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
  name_first: string;
  email_address: string;
  amount: string;
  item_name: string;
  m_payment_id: string;
}

export const createPayFastForm = (data: PayFastData) => {
  const form = document.createElement('form');
  form.method = 'POST';
  
  // Determine if we're in production or development
  const isProd = import.meta.env.PROD;
  form.action = isProd 
    ? 'https://www.payfast.co.za/eng/process' 
    : 'https://sandbox.payfast.co.za/eng/process';

  // Add a hidden input for each data field
  Object.entries(data).forEach(([key, value]) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = value;
    form.appendChild(input);
  });

  return form;
};

interface PayFastPaymentParams {
  amount: number;
  customerName: string;
  customerEmail: string;
  itemName: string;
  orderId: string;
}

interface PayFastResponse {
  url: string;
}

export const initiatePayFastPayment = (orderData: PayFastPaymentParams): PayFastResponse => {
  // Get environment variables
  const merchantId = import.meta.env.VITE_PAYFAST_MERCHANT_ID || '';
  const merchantKey = import.meta.env.VITE_PAYFAST_MERCHANT_KEY || '';
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
  
  if (!merchantId || !merchantKey) {
    console.error('PayFast merchant credentials not found in environment variables');
  }
  
  const paymentData: PayFastData = {
    merchant_id: merchantId,
    merchant_key: merchantKey,
    return_url: `${window.location.origin}/order-success?order_id=${orderData.orderId}`,
    cancel_url: `${window.location.origin}/payment-cancelled?order_id=${orderData.orderId}`,
    notify_url: `${supabaseUrl}/functions/v1/payfast-webhook`,
    name_first: orderData.customerName,
    email_address: orderData.customerEmail,
    amount: orderData.amount.toFixed(2),
    item_name: orderData.itemName,
    m_payment_id: orderData.orderId,
  };

  const form = createPayFastForm(paymentData);
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
  
  // Return a mock URL since PayFast handles the redirect
  return {
    url: `${window.location.origin}/processing-payment?order=${orderData.orderId}`
  };
};

// Function to check the payment status of an order
export const checkOrderPaymentStatus = async (orderId: string): Promise<string> => {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    
    const { data, error } = await supabase
      .from('orders')
      .select('status')
      .eq('id', orderId)
      .single();
    
    if (error) throw error;
    return data?.status || 'unknown';
  } catch (error) {
    console.error('Error checking payment status:', error);
    return 'error';
  }
};
