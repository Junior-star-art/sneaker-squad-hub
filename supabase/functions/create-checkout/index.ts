import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { items, userId, shippingMethodId } = await req.json();
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    // Get user profile and shipping method
    const [profileResponse, shippingMethodResponse] = await Promise.all([
      supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single(),
      supabaseClient
        .from('shipping_methods')
        .select('*')
        .eq('id', shippingMethodId)
        .single()
    ]);

    if (profileResponse.error) throw profileResponse.error;
    if (shippingMethodResponse.error) throw shippingMethodResponse.error;

    const profile = profileResponse.data;
    const shippingMethod = shippingMethodResponse.data;

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    // Calculate total amount including shipping
    const subtotal = items.reduce((sum: number, item: any) => 
      sum + (parseFloat(item.price.replace('$', '')) * item.quantity), 0
    );
    const total = subtotal + shippingMethod.price;

    // Create order in database
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .insert({
        user_id: userId,
        status: 'pending',
        total_amount: total,
        shipping_method_id: shippingMethodId
      })
      .select()
      .single();

    if (orderError || !order) {
      throw new Error('Failed to create order');
    }

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price_at_time: parseFloat(item.price.replace('$', '')),
      size: item.size
    }));

    const { error: itemsError } = await supabaseClient
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      throw new Error('Failed to create order items');
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/order/success?order_id=${order.id}`,
      cancel_url: `${req.headers.get('origin')}/cart`,
      customer_email: profile.email,
      metadata: {
        order_id: order.id,
      },
      shipping_options: [{
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {
            amount: Math.round(shippingMethod.price * 100),
            currency: 'usd',
          },
          display_name: shippingMethod.name,
          delivery_estimate: {
            minimum: {
              unit: 'business_day',
              value: Math.max(1, shippingMethod.estimated_days - 2),
            },
            maximum: {
              unit: 'business_day',
              value: shippingMethod.estimated_days,
            },
          },
        },
      }],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images: [item.image],
          },
          unit_amount: Math.round(parseFloat(item.price.replace('$', '')) * 100),
        },
        quantity: item.quantity,
      })),
    });

    return new Response(
      JSON.stringify({ sessionId: session.id, url: session.url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});