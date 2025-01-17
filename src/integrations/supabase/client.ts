import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = 'https://sllihrbacnavuodegwxd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsbGlocmJhY25hdnVvZGVnd3hkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDU0ODQ4NzAsImV4cCI6MjAyMTA2MDg3MH0.Hs-fxh_O_rF3QfGKcpILSc4ZbRG-kFbYGj-QmXO_7jc';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);