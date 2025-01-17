import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { orderId } = await req.json();

    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          product:products (
            name
          )
        )
      `)
      .eq('id', orderId)
      .single();

    if (orderError) throw orderError;

    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', order.user_id)
      .single();

    if (profileError) throw profileError;

    // Send email using Resend
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
      },
      body: JSON.stringify({
        from: "orders@yourdomain.com",
        to: profile.email,
        subject: `Order Confirmation #${order.id.slice(0, 8)}`,
        html: `
          <h1>Thank you for your order!</h1>
          <p>Hi ${profile.full_name},</p>
          <p>We've received your order and are getting it ready.</p>
          <h2>Order Details</h2>
          <ul>
            ${order.order_items.map((item: any) => `
              <li>${item.product.name} - Quantity: ${item.quantity}</li>
            `).join('')}
          </ul>
          <p>Total: $${order.total_amount}</p>
          <p>We'll send you another email when your order ships.</p>
        `,
      }),
    });

    if (!emailResponse.ok) {
      throw new Error('Failed to send email');
    }

    return new Response(
      JSON.stringify({ message: "Order notification sent successfully" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});