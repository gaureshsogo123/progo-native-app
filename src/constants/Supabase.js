import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://mjofpkthxnlkmjelskdy.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qb2Zwa3RoeG5sa21qZWxza2R5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzg3MDI3MDAsImV4cCI6MTk5NDI3ODcwMH0.sFUH4uPSdr76g3t1gmB1g-7J7OcwOYPltS686FVc9sk";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default supabase;
