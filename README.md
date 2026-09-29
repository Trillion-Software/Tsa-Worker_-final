# Worker TSA — Expo React Native + TypeScript + Supabase

## Architecture définitive

- React Native
- Expo
- TypeScript
- Supabase
- Expo EAS pour les builds Android/iOS

Vite, Astro et React Web ne sont pas utilisés.

## Fichiers à plat

Tous les fichiers de l'application sont à la racine du projet.

Les deux maquettes fournies sont conservées telles quelles à la racine :

- `splash.screen.png`
- `auth.screen.png`

Le fichier `auth.screen.png` sert de référence visuelle ; l'interface fonctionnelle est codée en composants React Native.

## Installation

```bash
npm install
```

Copier `.env.example` en `.env` ou configurer les variables Expo :

```text
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
```

Puis :

```bash
npx expo start
```

## Android

Pour un Android App Bundle :

```bash
npx eas build --platform android --profile production
```

Le build de production est destiné à produire le fichier utilisable pour Google Play.

## iOS

```bash
npx eas build --platform ios --profile production
```

Un compte Apple Developer est nécessaire pour distribuer une application iOS.

## Supabase

Activer Email/Password et Google dans Authentication > Providers.

Pour Google OAuth sur mobile, configurer l'URL de redirection correspondant au schéma :

```text
worker-tsa://auth/callback
```

La configuration exacte des URLs autorisées doit être faite dans le projet Supabase et dans la configuration OAuth Google.

## Prochaine étape

Les écrans suivants seront ajoutés à partir des prochaines maquettes fournies. Ne pas inventer leurs interfaces avant de recevoir les maquettes.
