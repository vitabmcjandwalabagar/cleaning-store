import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://beikebeotzgurxqkgpdw.supabase.co";
const supabaseKey = "sb_publishable_rw37qogGhg7VV90K_jOIbw_o8gT55Zq";

export const supabase = createClient(supabaseUrl, supabaseKey);