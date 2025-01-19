import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  try {
    // Get all products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, views, stock, category_id');

    if (productsError) throw productsError;

    // Update recommendation scores for each product
    for (const product of products) {
      const viewsScore = Math.min(product.views || 0, 1000) / 10;
      const stockScore = Math.min(product.stock || 0, 100);
      
      // Get category popularity
      const { count } = await supabase
        .from('recently_viewed_products')
        .select('*', { count: 'exact', head: true })
        .eq('product_id', product.id);
      
      const popularityScore = Math.min((count || 0) * 2, 100);
      
      // Calculate final score
      const finalScore = Math.floor(
        (viewsScore + stockScore + popularityScore) / 3
      );

      // Update product score
      await supabase
        .from('products')
        .update({ recommendation_score: finalScore })
        .eq('id', product.id);
    }

    return new Response(
      JSON.stringify({ message: "Recommendation scores updated successfully" }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error('Error updating recommendation scores:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});