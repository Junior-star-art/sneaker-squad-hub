
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PaymentRequest {
  amount: number;
  item_name: string;
  item_description?: string;
  custom_str1?: string;
  email_address?: string;
  name_first?: string;
  name_last?: string;
}

function generateSignature(data: Record<string, any>, passphrase: string): string {
  // Create parameter string
  let pfOutput = '';
  for (const key in data) {
    if (data[key] !== '') {
      pfOutput += `${key}=${encodeURIComponent(data[key]).replace(/%20/g, '+')}&`;
    }
  }
  
  // Remove last ampersand
  pfOutput = pfOutput.slice(0, -1);
  
  if (passphrase) {
    pfOutput += `&passphrase=${encodeURIComponent(passphrase)}`;
  }
  
  console.log('Signature string:', pfOutput);
  
  // Generate MD5 hash
  const encoder = new TextEncoder();
  const data_encoded = encoder.encode(pfOutput);
  
  return crypto.subtle.digest('MD5', data_encoded).then(hashBuffer => {
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  });
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Get user from JWT
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: user, error: authError } = await supabaseClient.auth.getUser(token)

    if (authError || !user.user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Rate limiting check - allow max 5 payment requests per minute per user
    const rateLimit = await supabaseClient
      .from('payment_rate_limits')
      .select('*')
      .eq('user_id', user.user.id)
      .gte('created_at', new Date(Date.now() - 60000).toISOString())

    if (rateLimit.data && rateLimit.data.length >= 5) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const paymentRequest: PaymentRequest = await req.json()

    // Input validation
    if (!paymentRequest.amount || paymentRequest.amount <= 0 || paymentRequest.amount > 50000) {
      return new Response(
        JSON.stringify({ error: 'Invalid amount. Must be between R0.01 and R50,000' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!paymentRequest.item_name || paymentRequest.item_name.length > 100) {
      return new Response(
        JSON.stringify({ error: 'Invalid item name' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get PayFast credentials from Supabase secrets
    const merchantId = Deno.env.get('PAYFAST_MERCHANT_ID')
    const merchantKey = Deno.env.get('PAYFAST_MERCHANT_KEY')

    if (!merchantId || !merchantKey) {
      console.error('PayFast credentials not configured')
      return new Response(
        JSON.stringify({ error: 'Payment system not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create payment data
    const paymentData = {
      merchant_id: merchantId,
      merchant_key: merchantKey,
      return_url: `${req.headers.get('origin')}/order-success`,
      cancel_url: `${req.headers.get('origin')}/payment-cancelled`,
      notify_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/payfast-webhook`,
      name_first: paymentRequest.name_first || '',
      name_last: paymentRequest.name_last || '',
      email_address: paymentRequest.email_address || user.user.email || '',
      m_payment_id: crypto.randomUUID(),
      amount: paymentRequest.amount.toFixed(2),
      item_name: paymentRequest.item_name,
      item_description: paymentRequest.item_description || '',
      custom_str1: paymentRequest.custom_str1 || user.user.id,
    }

    // Generate signature
    const signature = await generateSignature(paymentData, '')

    // Log rate limit entry
    await supabaseClient
      .from('payment_rate_limits')
      .insert({ user_id: user.user.id })

    // Log payment request for audit
    await supabaseClient
      .from('payment_audit_logs')
      .insert({
        user_id: user.user.id,
        amount: paymentRequest.amount,
        payment_id: paymentData.m_payment_id,
        action: 'payment_initiated'
      })

    return new Response(
      JSON.stringify({
        paymentData: { ...paymentData, signature },
        paymentUrl: 'https://sandbox.payfast.co.za/eng/process' // Use sandbox for testing
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error creating PayFast payment:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
