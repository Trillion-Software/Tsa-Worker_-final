import { supabase } from "./supabase";

export async function signInWithGoogle() {
  if (!supabase) {
    throw new Error(
      "Supabase n'est pas configuré. Ajoutez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY."
    );
  }

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.origin
    }
  });

  if (error) throw error;
}