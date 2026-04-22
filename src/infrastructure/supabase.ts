import { createClient } from "@supabase/supabase-js";
import { Logger } from "../shared/logger";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  Logger.error("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables.");
  process.exit(1);
}

export const supabase = createClient(supabaseUrl, supabaseKey);

Logger.info("✅ Supabase client initialized");
