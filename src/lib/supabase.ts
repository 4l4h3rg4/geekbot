
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mudwvruxxplggtuzfczq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11ZHd2cnV4eHBsZ2d0dXpmY3pxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4NTI1MzIsImV4cCI6MjA2MTQyODUzMn0._O8v6NpLq6gpRmRxhgs5ndmYunk4yGVvJf14Iqz_2Pw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Export a helper function to check if we have a session
export const getCurrentSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  return { session: data.session, error };
};

// Helper for checking authentication status
export const isAuthenticated = async () => {
  const { session } = await getCurrentSession();
  return !!session;
};
