import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = 'https://sllihrbacnavuodegwxd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsbGlocmJhY25hdnVvZGVnd3hkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcwOTY0NjQsImV4cCI6MjA1MjY3MjQ2NH0.c2Q0nWs__tOx6ggxrm--fiBMwfkML_TtQLvcq2VUy3E';

// Initialize the Supabase client with explicit config
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'lovable'
    }
  },
  db: {
    schema: 'public'
  }
});

// Helper function to get public URL for storage items
export const getPublicImageUrl = (imagePath: string) => {
  if (!imagePath) return '/placeholder.svg';
  
  // If it's already a full URL, return it
  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  // If it's a relative path starting with /, assume it's from public directory
  if (imagePath.startsWith('/')) {
    return imagePath;
  }

  // Otherwise, construct the Supabase storage URL
  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(imagePath);

  return data.publicUrl;
};

// Add error logging for debugging
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Supabase auth state changed:', event, session?.user?.id);
});
