import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { supabase } from "./supabase";
import { signInWithGoogle } from "./auth";

type Screen = "splash" | "auth" | "google";

const RED = "#E5090B";
const DARK = "#10151D";
const MUTED = "#738094";

export default function App() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [language, setLanguage] = useState<"FR" | "EN">("FR");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setScreen("auth"), 1000);
    return () => clearTimeout(timer);
  }, []);

  async function login() {
    setMessage("");
    if (!email.trim() || !password) {
      setMessage(language === "FR"
        ? "Veuillez saisir votre adresse e-mail et votre mot de passe."
        : "Please enter your email and password.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    });
    setLoading(false);

    if (error) setMessage(error.message);
    else setMessage(language === "FR" ? "Connexion réussie." : "Login successful.");
  }

  async function google() {
    setMessage("");
    setScreen("google");
    try {
      await signInWithGoogle();
      setScreen("auth");
      setMessage(language === "FR" ? "Connexion Google réussie." : "Google sign-in successful.");
    } catch (error) {
      setScreen("auth");
      setMessage(error instanceof Error ? error.message : "Connexion Google impossible.");
    }
  }

  if (screen === "splash") {
    return (
      <SafeAreaView style={styles.splash}>
        <View style={styles.splashCenter}>
          <Image source={require("./splash.screen.png")} style={styles.splashImage} resizeMode="contain" />
        </View>
      </SafeAreaView>
    );
  }

  if (screen === "google") {
    return (
      <SafeAreaView style={styles.googleScreen}>
        <View style={styles.googleCard}>
          <View style={styles.logoBox}>
            <Text style={styles.logoW}>W</Text>
          </View>
          <Text style={styles.brand}><Text>Worker</Text><Text style={styles.brandRed}>TSA</Text></Text>
          <Text style={styles.googleText}>
            {language === "FR" ? "Connexion avec Google..." : "Signing in with Google..."}
          </Text>
          <ActivityIndicator size="large" color={RED} />
          <Pressable style={styles.cancelButton} onPress={() => setScreen("auth")}>
            <Text style={styles.cancelText}>Annuler</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.authContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.languageRow}>
          <Pressable onPress={() => setLanguage("FR")} style={styles.langButton}>
            <Text style={[styles.langText, language === "FR" && styles.langActive]}>🇫🇷  FR</Text>
          </Pressable>
          <View style={styles.langDivider} />
          <Pressable onPress={() => setLanguage("EN")} style={styles.langButton}>
            <Text style={[styles.langText, language === "EN" && styles.langActive]}>EN</Text>
          </Pressable>
        </View>

        <Image source={require("./auth.screen.png")} style={styles.referenceImage} resizeMode="contain" />

        <View style={styles.realForm}>
          <Text style={styles.welcome}>
            {language === "FR" ? "Bienvenue !" : "Welcome!"}
          </Text>
          <Text style={styles.subtitle}>
            {language === "FR"
              ? "Connectez-vous à votre compte ou créez-en un pour commencer."
              : "Sign in to your account or create one to get started."}
          </Text>

          <View style={styles.input}>
            <Text style={styles.inputIcon}>✉</Text>
            <View style={styles.inputDivider} />
            <TextInput
              style={styles.inputText}
              value={email}
              onChangeText={setEmail}
              placeholder={language === "FR" ? "Adresse e-mail" : "Email address"}
              placeholderTextColor="#8793A4"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.input}>
            <Text style={styles.inputIcon}>▣</Text>
            <View style={styles.inputDivider} />
            <TextInput
              style={styles.inputText}
              value={password}
              onChangeText={setPassword}
              placeholder={language === "FR" ? "Mot de passe" : "Password"}
              placeholderTextColor="#8793A4"
              secureTextEntry={!showPassword}
            />
            <Pressable onPress={() => setShowPassword(v => !v)}>
              <Text style={styles.eye}>{showPassword ? "◉" : "◌"}</Text>
            </Pressable>
          </View>

          <View style={styles.options}>
            <Pressable style={styles.rememberRow} onPress={() => setRemember(v => !v)}>
              <View style={[styles.checkbox, remember && styles.checkboxChecked]}>
                {remember && <Text style={styles.check}>✓</Text>}
              </View>
              <Text style={styles.rememberText}>
                {language === "FR" ? "Se souvenir de moi" : "Remember me"}
              </Text>
            </Pressable>
            <Pressable onPress={() => setMessage(language === "FR"
              ? "La récupération du mot de passe sera ajoutée avec la suite des maquettes."
              : "Password recovery will be added with the next mockups.")}>
              <Text style={styles.forgot}>
                {language === "FR" ? "Mot de passe oublié ?" : "Forgot password?"}
              </Text>
            </Pressable>
          </View>

          <Pressable style={styles.primary} onPress={login} disabled={loading}>
            <Text style={styles.primaryText}>
              {loading ? "..." : language === "FR" ? "Se connecter" : "Sign in"}
            </Text>
            <Text style={styles.arrow}>→</Text>
          </Pressable>

          <View style={styles.orRow}>
            <View style={styles.line} />
            <Text style={styles.or}>ou</Text>
            <View style={styles.line} />
          </View>

          <Pressable style={styles.outlineButton} onPress={google}>
            <Text style={styles.googleG}>G</Text>
            <View style={styles.buttonDivider} />
            <Text style={styles.outlineText}>
              {language === "FR" ? "Se connecter avec Google" : "Sign in with Google"}
            </Text>
          </Pressable>

          <Text style={styles.noAccount}>
            {language === "FR" ? "Vous n’avez pas de compte ?" : "Don't have an account?"}
          </Text>

          <Pressable
            style={styles.outlineButton}
            onPress={() => setMessage(language === "FR"
              ? "L'écran de création de compte sera ajouté avec sa maquette."
              : "The account creation screen will be added with its mockup.")}
          >
            <Text style={styles.personPlus}>♙+</Text>
            <View style={styles.buttonDivider} />
            <Text style={[styles.outlineText, styles.redText]}>
              {language === "FR" ? "Créer un compte" : "Create an account"}
            </Text>
          </Pressable>

          {message ? <Text style={styles.message}>{message}</Text> : null}

          <Text style={styles.footer}>
            by <Text style={styles.footerStrong}>Trillion Software</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  splash: { flex: 1, backgroundColor: "#fff" },
  splashCenter: { flex: 1, alignItems: "center", justifyContent: "center" },
  splashImage: { width: "100%", height: "100%" },

  authContainer: {
    flexGrow: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 30
  },
  languageRow: {
    alignSelf: "flex-end",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4
  },
  langButton: { paddingHorizontal: 5, paddingVertical: 4 },
  langText: { fontSize: 15, color: "#758196" },
  langActive: { color: RED, fontWeight: "700" },
  langDivider: { width: 1, height: 23, backgroundColor: "#D4D9DF", marginHorizontal: 6 },

  referenceImage: {
    width: "100%",
    height: 330,
    marginTop: 0,
    marginBottom: 8
  },

  // The real form is coded natively; the supplied mockup remains unchanged
  // as the visual reference file in the project root.
  realForm: { width: "100%" },
  welcome: { fontSize: 43, fontWeight: "800", color: DARK, marginBottom: 8 },
  subtitle: { fontSize: 20, lineHeight: 28, color: "#6C788A", marginBottom: 23 },

  input: {
    height: 78,
    borderWidth: 1.5,
    borderColor: "#CBD2DB",
    borderRadius: 17,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 16
  },
  inputIcon: { width: 31, color: RED, fontSize: 25, textAlign: "center" },
  inputDivider: { width: 1, height: 34, backgroundColor: "#D5D9DE", marginHorizontal: 13 },
  inputText: { flex: 1, fontSize: 17, color: DARK },
  eye: { fontSize: 25, color: "#8491A2", paddingHorizontal: 4 },

  options: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 26
  },
  rememberRow: { flexDirection: "row", alignItems: "center", gap: 9 },
  checkbox: {
    width: 34,
    height: 34,
    borderWidth: 3,
    borderColor: RED,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center"
  },
  checkboxChecked: { backgroundColor: "#fff" },
  check: { color: RED, fontSize: 22, fontWeight: "800" },
  rememberText: { fontSize: 15, fontWeight: "650", color: DARK },
  forgot: { fontSize: 15, color: RED, fontWeight: "700" },

  primary: {
    height: 72,
    borderRadius: 40,
    backgroundColor: RED,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 18
  },
  primaryText: { color: "#fff", fontSize: 20, fontWeight: "800" },
  arrow: { color: "#fff", fontSize: 34 },

  orRow: { flexDirection: "row", alignItems: "center", gap: 18, marginVertical: 28 },
  line: { flex: 1, height: 1.5, backgroundColor: "#D4D9DF" },
  or: { fontSize: 20, fontWeight: "700", color: DARK },

  outlineButton: {
    height: 68,
    borderWidth: 2,
    borderColor: RED,
    borderRadius: 40,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  googleG: { fontSize: 28, fontWeight: "800", color: "#4285F4" },
  personPlus: { fontSize: 29, color: RED },
  buttonDivider: { width: 1, height: 31, backgroundColor: "#D5D9DE", marginHorizontal: 13 },
  outlineText: { fontSize: 16, fontWeight: "700", color: DARK },
  redText: { color: RED },

  noAccount: { textAlign: "center", color: "#8793A4", fontSize: 16, marginVertical: 17 },
  message: {
    marginTop: 15,
    padding: 13,
    borderRadius: 12,
    backgroundColor: "#FFF2F2",
    color: "#C4070A",
    fontSize: 14,
    lineHeight: 20
  },
  footer: { textAlign: "center", color: MUTED, fontSize: 15, marginTop: 34 },
  footerStrong: { color: DARK, fontWeight: "800" },

  googleScreen: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 30
  },
  googleCard: { width: "100%", maxWidth: 430, alignItems: "center" },
  logoBox: {
    width: 110,
    height: 110,
    borderRadius: 26,
    backgroundColor: RED,
    alignItems: "center",
    justifyContent: "center"
  },
  logoW: { color: "#fff", fontSize: 60, fontWeight: "900" },
  brand: { fontSize: 50, fontWeight: "800", color: DARK, marginTop: 20 },
  brandRed: { color: RED },
  googleText: { color: "#758196", fontSize: 18, marginVertical: 25 },
  cancelButton: {
    marginTop: 28,
    borderWidth: 1,
    borderColor: "#D6DBE1",
    borderRadius: 25,
    paddingHorizontal: 22,
    paddingVertical: 11
  },
  cancelText: { color: "#515D6E" }
});