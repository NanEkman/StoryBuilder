import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) throw new Error("Missing SUPABASE_URL env var");
if (!supabaseKey) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY env var");

const supabase = createClient(supabaseUrl, supabaseKey);

export async function addUserHistory(entry) {
  const { data, error } = await supabase.from("user_history").insert([entry]).select();
  if (error) throw error;
  return data;
}

export async function getUserHistory(user_id) {
  const { data, error } = await supabase
    .from("user_history")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}
