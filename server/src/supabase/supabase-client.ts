import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE__API_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);
