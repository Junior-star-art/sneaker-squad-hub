import { supabase } from "@/integrations/supabase/client";

interface RecommendationFactors {
  categoryWeight: number;
  priceRangeWeight: number;
  viewsWeight: number;
}

export const getRecommendedProducts = async (
  userId: string | undefined,
  currentProductId?: string,
  limit: number = 4
) => {
  try {
    // Get user's recently viewed products
    const { data: recentlyViewed } = await supabase
      .from('recently_viewed_products')
      .select('product_id')
      .eq('user_id', userId)
      .order('viewed_at', { ascending: false })
      .limit(5);

    // Get user's preferences
    const { data: preferences } = await supabase
      .from('user_preferences')
      .select('preferred_categories')
      .eq('user_id', userId)
      .single();

    // Build recommendation query
    let query = supabase
      .from('products')
      .select(`
        *,
        category:categories(name)
      `)
      .neq('id', currentProductId)
      .gt('stock', 0);

    // If we have user preferences, boost products from preferred categories
    if (preferences?.preferred_categories?.length > 0) {
      query = query.in('category_id', preferences.preferred_categories);
    }

    // If we have recently viewed products, use their categories for recommendations
    if (recentlyViewed?.length > 0) {
      const recentProductIds = recentlyViewed.map(item => item.product_id);
      const { data: recentCategories } = await supabase
        .from('products')
        .select('category_id')
        .in('id', recentProductIds);
        
      if (recentCategories?.length) {
        const categoryIds = recentCategories
          .map(p => p.category_id)
          .filter((id): id is string => id !== null);
          
        if (categoryIds.length) {
          query = query.in('category_id', categoryIds);
        }
      }
    }

    // Get recommendations ordered by recommendation_score
    const { data: recommendations, error } = await query
      .order('recommendation_score', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return recommendations;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return [];
  }
};

export const updateRecommendationScore = async (productId: string) => {
  try {
    // Get product details including recommendation_score and stock
    const { data: product } = await supabase
      .from('products')
      .select('recommendation_score, stock')
      .eq('id', productId)
      .single();

    if (!product) return;

    // Calculate new recommendation score based on stock level
    const stockScore = Math.min(product.stock || 0, 100); // Max 100 points from stock
    const currentScore = product.recommendation_score || 0;
    const newScore = Math.floor(stockScore + currentScore);

    // Update the product's recommendation score
    await supabase
      .from('products')
      .update({ recommendation_score: newScore })
      .eq('id', productId);

  } catch (error) {
    console.error('Error updating recommendation score:', error);
  }
};