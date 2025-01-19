import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Fetch dynamic content
    const { data: products } = await supabaseClient
      .from('products')
      .select('slug')
    
    const { data: categories } = await supabaseClient
      .from('categories')
      .select('slug')

    // Base URL from environment or default
    const baseUrl = 'https://your-domain.com' // Replace with your actual domain

    // Static routes
    const staticRoutes = [
      '',
      'privacy-policy',
      'terms',
      'blog',
      'style-guide',
      'sustainability'
    ]

    // Generate XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticRoutes.map(route => `
  <url>
    <loc>${baseUrl}/${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>${route === '' ? '1.0' : '0.8'}</priority>
  </url>`).join('')}
  ${products?.map(product => `
  <url>
    <loc>${baseUrl}/products/${product.slug}</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`).join('')}
  ${categories?.map(category => `
  <url>
    <loc>${baseUrl}/category/${category.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
</urlset>`

    return new Response(xml, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600'
      }
    })
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return new Response(JSON.stringify({ error: 'Error generating sitemap' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    })
  }
})