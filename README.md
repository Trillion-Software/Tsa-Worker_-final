# Worker TSA — TypeScript + Supabase

Premières pages intégrées à partir des maquettes fournies :

- `splash.screen.png` → écran de démarrage, 1 seconde.
- `auth.screen.png` → authentification.
- Flux Google OAuth → écran de transition avant redirection vers Google.

## Installation

```bash
npm install
```

Copier `.env.example` vers `.env.local`, puis renseigner :

```text
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

Lancer :

```bash
npm run dev
```

Construire :

```bash
npm run build
```

## Supabase

Dans Supabase :

1. Activer Email/Password dans Authentication > Sign In / Providers.
2. Activer Google dans Authentication > Sign In / Providers.
3. Ajouter l'URL de l'application dans les URLs de redirection autorisées.
4. Pour le développement Vite, l'URL locale habituelle est `http://localhost:5173`.

Le code utilise `signInWithOAuth({ provider: "google" })`.
La page Google elle-même est fournie par Google/Supabase ; elle n'est pas une maquette que l'application peut contrôler.

## Structure

Tous les fichiers du projet sont volontairement à plat à la racine du repository.
