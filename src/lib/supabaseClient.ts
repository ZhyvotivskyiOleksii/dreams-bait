import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables.");
}

try {
  new URL(supabaseUrl);
} catch {
  throw new Error(
    `Invalid NEXT_PUBLIC_SUPABASE_URL: "${supabaseUrl}". Use https://<project>.supabase.co`
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
