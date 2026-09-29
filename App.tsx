import { useEffect, useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRoundPlus,
  ChevronDown
} from "lucide-react";
import { supabase } from "./supabase";
import { signInWithGoogle } from "./auth";

type Screen = "splash" | "auth" | "google";

function App() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [language, setLanguage] = useState<"FR" | "EN">("FR");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => setScreen("auth"), 1000);
    return () => window.clearTimeout(timer);
  }, []);

  async function handleGoogle() {
    setMessage("");
    setScreen("google");
    try {
      await signInWithGoogle();
    } catch (error) {
      setScreen("auth");
      setMessage(error instanceof Error ? error.message : "Connexion Google impossible.");
    }
  }

  async function handleLogin() {
    setMessage("");

    if (!email.trim() || !password) {
      setMessage(
        language === "FR"
          ? "Veuillez saisir votre adresse e-mail et votre mot de passe."
          : "Please enter your email address and password."
      );
      return;
    }

    if (!supabase) {
      setMessage(
        "Supabase n'est pas encore configuré. Ajoutez vos clés dans .env.local."
      );
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage(
      language === "FR"
        ? "Connexion réussie."
        : "Login successful."
    );
  }

  function handleForgotPassword() {
    setMessage(
      language === "FR"
        ? "La récupération du mot de passe sera connectée à Supabase."
        : "Password recovery will be connected to Supabase."
    );
  }

  function handleCreateAccount() {
    setMessage(
      language === "FR"
        ? "L'écran de création de compte sera ajouté avec sa maquette."
        : "The account creation screen will be added with its mockup."
    );
  }

  if (screen === "splash") return <SplashScreen />;

  if (screen === "google") {
    return (
      <main className="screen google-screen">
        <div className="google-loading-card">
          <div className="brand-mark small">
            <span>W</span>
          </div>
          <h1>Worker<span>TSA</span></h1>
          <p>{language === "FR" ? "Connexion avec Google..." : "Signing in with Google..."}</p>
          <div className="loader" aria-label="Chargement" />
          <button className="back-button" onClick={() => setScreen("auth")}>
            Annuler
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="screen auth-screen">
      <div className="language-switch">
        <button
          className={language === "FR" ? "language active" : "language"}
          onClick={() => setLanguage("FR")}
          aria-label="Français"
        >
          <span className="flag">🇫🇷</span> FR
        </button>
        <span className="language-divider" />
        <button
          className={language === "EN" ? "language active" : "language"}
          onClick={() => setLanguage("EN")}
          aria-label="English"
        >
          EN
        </button>
        <ChevronDown size={18} strokeWidth={2} />
      </div>

      <section className="auth-content">
        <Brand />

        <div className="welcome">
          <h2>{language === "FR" ? "Bienvenue !" : "Welcome!"}</h2>
          <p>
            {language === "FR"
              ? "Connectez-vous à votre compte ou créez-en un pour commencer."
              : "Sign in to your account or create one to get started."}
          </p>
        </div>

        <div className="form">
          <div className="input-wrap">
            <Mail className="input-icon" size={29} strokeWidth={2} />
            <span className="input-divider" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={language === "FR" ? "Adresse e-mail" : "Email address"}
              autoComplete="email"
            />
          </div>

          <div className="input-wrap">
            <LockKeyhole className="input-icon" size={29} strokeWidth={2} />
            <span className="input-divider" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={language === "FR" ? "Mot de passe" : "Password"}
              autoComplete="current-password"
            />
            <button
              className="icon-button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              type="button"
            >
              {showPassword ? <EyeOff size={27} /> : <Eye size={27} />}
            </button>
          </div>

          <div className="options-row">
            <label className="remember">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="custom-checkbox" />
              <span>{language === "FR" ? "Se souvenir de moi" : "Remember me"}</span>
            </label>

            <button className="forgot" onClick={handleForgotPassword} type="button">
              {language === "FR" ? "Mot de passe oublié ?" : "Forgot password?"}
            </button>
          </div>

          <button className="primary-button" onClick={handleLogin} disabled={loading}>
            <span>{loading ? "..." : language === "FR" ? "Se connecter" : "Sign in"}</span>
            <ArrowRight size={34} strokeWidth={2.2} />
          </button>

          <div className="or-row">
            <span />
            <strong>{language === "FR" ? "ou" : "or"}</strong>
            <span />
          </div>

          <button className="google-button" onClick={handleGoogle} type="button">
            <span className="google-g">G</span>
            <span className="button-divider" />
            <strong>
              {language === "FR" ? "Se connecter avec Google" : "Sign in with Google"}
            </strong>
          </button>

          <p className="no-account">
            {language === "FR" ? "Vous n’avez pas de compte ?" : "Don't have an account?"}
          </p>

          <button className="create-button" onClick={handleCreateAccount} type="button">
            <UserRoundPlus size={30} strokeWidth={2.2} />
            <span className="button-divider" />
            <strong>
              {language === "FR" ? "Créer un compte" : "Create an account"}
            </strong>
          </button>

          {message && <div className="message">{message}</div>}
        </div>

        <Footer />
      </section>
    </main>
  );
}

function SplashScreen() {
  return (
    <main className="screen splash-screen">
      <div className="splash-center">
        <Brand showSlogan={false} />
      </div>
      <Footer />
    </main>
  );
}

function Brand({ showSlogan = true }: { showSlogan?: boolean }) {
  return (
    <div className="brand">
      <div className="brand-mark">
        <div className="people-symbol">
          <span className="head left" />
          <span className="head center" />
          <span className="head right" />
          <span className="body left-body" />
          <span className="body center-body" />
          <span className="body right-body" />
          <span className="arc" />
        </div>
      </div>

      <div className="brand-name">
        <span>Worker</span><b>TSA</b>
      </div>

      {showSlogan && (
        <div className="slogan">
          <span />
          <strong>Votre travail, notre priorité !!</strong>
          <span />
        </div>
      )}
    </div>
  );
}

function Footer() {
  return (
    <div className="footer">
      by <strong>Trillion Software</strong>
    </div>
  );
}

export default App;