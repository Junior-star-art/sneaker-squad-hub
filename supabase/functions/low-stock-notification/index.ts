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

    // Get all products with low stock
    const { data: lowStockProducts, error: productsError } = await supabaseClient
      .from('products')
      .select('name, stock, low_stock_threshold')
      .eq('inventory_status', 'low_stock');

    if (productsError) throw productsError;

    if (!lowStockProducts?.length) {
      return new Response(
        JSON.stringify({ message: "No low stock products found" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Send email notification using Resend
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
      },
      body: JSON.stringify({
        from: "inventory@yourdomain.com",
        to: "manager@yourdomain.com",
        subject: "Low Stock Alert",
        html: `
          <h1>Low Stock Alert</h1>
          <p>The following products are running low on stock:</p>
          <ul>
            ${lowStockProducts.map(product => `
              <li>${product.name} - Current stock: ${product.stock} (Threshold: ${product.low_stock_threshold})</li>
            `).join('')}
          </ul>
          <p>Please review and restock as needed.</p>
        `,
      }),
    });

    if (!emailResponse.ok) {
      throw new Error('Failed to send email notification');
    }

    return new Response(
      JSON.stringify({ message: "Low stock notification sent successfully" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in low-stock-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});