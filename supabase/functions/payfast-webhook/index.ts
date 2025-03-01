
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseKey);

const PAYFAST_MERCHANT_ID = Deno.env.get('PAYFAST_MERCHANT_ID') ?? '';
const PAYFAST_MERCHANT_KEY = Deno.env.get('PAYFAST_MERCHANT_KEY') ?? '';

// Calculate PayFast signature
function calculateSignature(data: Record<string, string>, passPhrase = ''): string {
  // Remove signature if it exists
  const { signature, ...dataWithoutSignature } = data;
  
  // Create parameter string
  const paramString = Object.keys(dataWithoutSignature)
    .sort()
    .map(key => `${key}=${encodeURIComponent(dataWithoutSignature[key])}`)
    .join('&');
  
  // Add passphrase if it exists
  const stringToHash = passPhrase 
    ? `${paramString}&passphrase=${encodeURIComponent(passPhrase)}`
    : paramString;
  
  // Generate MD5 hash
  return new TextEncoder().encode(stringToHash)
    .reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Only accept POST requests
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Parse the POST data
    const formData = await req.formData();
    const data: Record<string, string> = {};
    for (const [key, value] of formData.entries()) {
      data[key] = value.toString();
    }
    
    console.log('Received PayFast notification:', data);
    
    // Verify the request comes from PayFast
    // 1. Check if the merchant ID is correct
    if (data.merchant_id !== PAYFAST_MERCHANT_ID) {
      console.error('Invalid merchant ID');
      return new Response(JSON.stringify({ error: 'Invalid merchant ID' }), { 
        status: 403, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // 2. Calculate and verify signature if provided
    if (data.signature) {
      const calculatedSignature = calculateSignature(data);
      if (calculatedSignature !== data.signature) {
        console.error('Invalid signature');
        return new Response(JSON.stringify({ error: 'Invalid signature' }), { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }
    
    // Get the order ID from the m_payment_id
    const orderId = data.m_payment_id;
    if (!orderId) {
      console.error('No order ID provided');
      return new Response(JSON.stringify({ error: 'No order ID provided' }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Determine payment status
    let orderStatus = 'pending';
    
    switch (data.payment_status) {
      case 'COMPLETE':
        orderStatus = 'paid';
        break;
      case 'FAILED':
        orderStatus = 'payment_failed';
        break;
      case 'PENDING':
        orderStatus = 'payment_pending';
        break;
      case 'CANCELLED':
        orderStatus = 'cancelled';
        break;
      default:
        orderStatus = 'pending';
    }
    
    // Update order status in database
    const { data: updateData, error: updateError } = await supabase
      .from('orders')
      .update({ 
        status: orderStatus,
        payment_intent_id: data.pf_payment_id || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);
    
    if (updateError) {
      console.error('Error updating order:', updateError);
      return new Response(JSON.stringify({ error: 'Error updating order' }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // If payment is complete, create tracking entry for the order
    if (orderStatus === 'paid') {
      const { data: trackingData, error: trackingError } = await supabase
        .from('order_tracking')
        .insert({
          order_id: orderId,
          status: 'payment_confirmed',
          description: 'Payment confirmed via PayFast',
          location: 'Payment Processor',
        });
      
      if (trackingError) {
        console.error('Error creating tracking entry:', trackingError);
      }
    }
    
    // Respond with success
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error processing PayFast webhook:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
