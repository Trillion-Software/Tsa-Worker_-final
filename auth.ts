import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { supabase, supabaseConfigured } from "./supabase";

WebBrowser.maybeCompleteAuthSession();

export async function signInWithGoogle() {
  if (!supabaseConfigured) {
    throw new Error(
      "Supabase n'est pas configuré. Ajoutez EXPO_PUBLIC_SUPABASE_URL et EXPO_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  const redirectTo = Linking.createURL("auth/callback");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      skipBrowserRedirect: true
    }
  });

  if (error) throw error;
  if (!data?.url) throw new Error("URL de connexion Google introuvable.");

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

  if (result.type === "success" && result.url) {
    const parsed = Linking.parse(result.url);
    const fragment = result.url.split("#")[1] ?? "";
    const params = new URLSearchParams(fragment);

    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");

    if (accessToken && refreshToken) {
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      });

      if (sessionError) throw sessionError;
      return;
    }

    if (parsed.queryParams?.error_description) {
      throw new Error(String(parsed.queryParams.error_description));
    }
  }

  if (result.type === "cancel" || result.type === "dismiss") {
    throw new Error("Connexion Google annulée.");
  }
}