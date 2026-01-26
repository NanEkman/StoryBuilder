import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export interface UserHistory {
  id?: string;
  user_id: string;
  action: string;
  details?: any;
  created_at?: string;
}

export async function addUserHistory(entry: UserHistory) {
  const { data, error } = await supabase
    .from('user_history')
    .insert([entry])
    .select();
  if (error) throw error;
  return data;
}

export async function getUserHistory(user_id: string) {
  const { data, error } = await supabase
    .from('user_history')
    .select('*')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}
