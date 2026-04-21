import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://beikebeotzgurxqkgpdw.supabase.co";
const supabaseAnonKey = "sb_publishable_rw37qogGhg7VV90K_jOIbw_o8gT55Zq";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);