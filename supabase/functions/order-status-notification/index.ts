import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderStatusUpdate {
  orderId: string;
  status: string;
  description?: string;
  location?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { orderId, status, description, location }: OrderStatusUpdate = await req.json();

    // Insert order tracking update
    const { data: trackingData, error: trackingError } = await supabaseClient
      .from('order_tracking')
      .insert({
        order_id: orderId,
        status,
        description,
        location,
      })
      .select('*, orders(user_id)');

    if (trackingError) throw trackingError;

    // Get user email
    const { data: userData, error: userError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', trackingData[0].orders.user_id)
      .single();

    if (userError) throw userError;

    // Send email using Resend
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
      },
      body: JSON.stringify({
        from: "orders@yourdomain.com",
        to: [userData.email],
        subject: `Order Status Update - ${status}`,
        html: `
          <h1>Order Status Update</h1>
          <p>Your order #${orderId.slice(0, 8)} has been updated:</p>
          <p><strong>Status:</strong> ${status}</p>
          ${description ? `<p><strong>Details:</strong> ${description}</p>` : ''}
          ${location ? `<p><strong>Location:</strong> ${location}</p>` : ''}
          <p>Track your order anytime by visiting your order history.</p>
        `,
      }),
    });

    if (!emailResponse.ok) {
      throw new Error('Failed to send email');
    }

    return new Response(JSON.stringify({ message: "Order status updated and notification sent" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
};

serve(handler);