import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qsuxdkqtghofawdlsiiv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzdXhka3F0Z2hvZmF3ZGxzaWl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MTk2ODksImV4cCI6MjA3MjQ5NTY4OX0.Fy436fKa-VAbjTJzIvQZZYplBbM0uV44CMTsSlNp-3k';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, 
    autoRefreshToken: false
  }
});
