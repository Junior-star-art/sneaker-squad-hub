
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
  signature?: string;
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
    if (value !== undefined) { // Only add fields that have values
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    }
  });

  return form;
};

/**
 * Generate a signature for PayFast data
 * Note: This function is for reference. In production,
 * sensitive signature generation should happen server-side.
 */
export const generateSignature = (data: Omit<PayFastData, 'signature'>, passPhrase = '') => {
  const sortedKeys = Object.keys(data).sort();
  
  // Create a query string of key-value pairs
  const queryString = sortedKeys
    .map(key => `${key}=${encodeURIComponent(data[key as keyof typeof data])}`)
    .join('&');
  
  // Add passphrase if provided
  const stringToHash = passPhrase 
    ? `${queryString}&passphrase=${encodeURIComponent(passPhrase)}`
    : queryString;
  
  // In browser environments we'd use the Web Crypto API
  // For simplicity in this example, we're returning a placeholder
  // The actual signature would be created server-side
  console.log('Data to be signed:', stringToHash);
  return 'placeholder-signature';
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
  success: boolean;
  message?: string;
}

export const initiatePayFastPayment = (orderData: PayFastPaymentParams): PayFastResponse => {
  try {
    // Get environment variables
    const merchantId = import.meta.env.VITE_PAYFAST_MERCHANT_ID || '';
    const merchantKey = import.meta.env.VITE_PAYFAST_MERCHANT_KEY || '';
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
    
    if (!merchantId || !merchantKey) {
      console.error('PayFast merchant credentials not found in environment variables');
      return {
        url: `${window.location.origin}/payment-cancelled?order_id=${orderData.orderId}`,
        success: false,
        message: 'Missing payment gateway credentials'
      };
    }
    
    // Prepare payment data
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

    // Create and submit payment form
    const form = createPayFastForm(paymentData);
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
    
    // Return processing URL
    return {
      url: `${window.location.origin}/processing-payment?order=${orderData.orderId}`,
      success: true
    };
  } catch (error) {
    console.error('Error initiating PayFast payment:', error);
    return {
      url: `${window.location.origin}/payment-cancelled?order_id=${orderData.orderId}`,
      success: false,
      message: 'Failed to initiate payment'
    };
  }
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

// Function to verify if a payment has been confirmed
export const isPaymentConfirmed = async (orderId: string): Promise<boolean> => {
  const status = await checkOrderPaymentStatus(orderId);
  return status === 'paid';
};

// Function to get payment tracking information
export const getPaymentTracking = async (orderId: string) => {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    
    const { data, error } = await supabase
      .from('order_tracking')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    console.error('Error fetching payment tracking:', error);
    return null;
  }
};
