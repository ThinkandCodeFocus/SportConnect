# 🔗 Guide d'Intégration Frontend-Backend - GalsenFoot

## 📋 Infrastructure Créée

### 1. **Configuration Environnement**
- ✅ `.env.local` - Variables d'environnement
- ✅ `.env.example` - Template des variables

### 2. **Types TypeScript** (`lib/types/api.ts`)
- ✅ Types pour tous les modèles backend (User, Post, Club, Job, etc.)
- ✅ Types pour les requêtes et réponses d'API
- ✅ Types pour l'authentification (Register, Login, AuthResponse)

### 3. **Utilitaires d'Authentification** (`lib/utils/auth.ts`)
- ✅ Gestion des tokens dans les cookies
- ✅ `saveTokens()` - Sauvegarder access et refresh tokens
- ✅ `getAccessToken()` - Récupérer le token d'accès
- ✅ `clearTokens()` - Supprimer tous les tokens
- ✅ `isAuthenticated()` - Vérifier si l'utilisateur est connecté

### 4. **Client API** (`lib/api/client.ts`)
- ✅ Instance axios configurée avec baseURL et timeout
- ✅ **Request Interceptor** : Ajoute automatiquement le JWT à chaque requête
- ✅ **Response Interceptor** : Gestion des erreurs 401 et redirection vers login
- ✅ Gestion centralisée des erreurs

### 5. **Endpoints API** (`lib/api/endpoints.ts`)
- ✅ **authAPI** : register, login, logout
- ✅ **userAPI** : getById, update, getProfile, updateProfile
- ✅ **postAPI** : CRUD posts, like, comment, share
- ✅ **clubAPI** : CRUD clubs, membres
- ✅ **jobAPI** : CRUD offres, candidatures
- ✅ **messageAPI** : Conversations, messages
- ✅ **notificationAPI** : Notifications utilisateur
- ✅ **connectionAPI** : Réseau, invitations

### 6. **Context d'Authentification** (`contexts/AuthContext.tsx`)
- ✅ Gestion globale de l'état utilisateur
- ✅ `login()` - Connexion utilisateur
- ✅ `register()` - Inscription utilisateur
- ✅ `logout()` - Déconnexion
- ✅ `refreshUser()` - Recharger les données utilisateur
- ✅ `updateProfile()` - Mettre à jour le profil
- ✅ Hook `useAuth()` pour accéder au contexte

### 7. **Providers** (`app/providers.tsx`)
- ✅ Wrapper pour envelopper l'app avec les contexts
- ✅ Intégré dans `app/layout.tsx`

---

## 🚀 Utilisation

### **1. Configuration Backend**

Assurez-vous que le backend Spring Boot tourne sur `http://localhost:8080`

```bash
cd galsenfoot-backend
./mvnw spring-boot:run
```

### **2. Configuration Frontend**

Créer le fichier `.env.local` à la racine de SportConnect :

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_TOKEN_KEY=galsenfoot_access_token
NEXT_PUBLIC_REFRESH_TOKEN_KEY=galsenfoot_refresh_token
```

### **3. Démarrer le Frontend**

```bash
cd SportConnect
npm run dev
```

---

## 📝 Exemples d'Utilisation

### **Utiliser le Hook useAuth**

```tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";

export function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Non connecté</div>;
  }

  return (
    <div>
      <h1>Bonjour {user?.firstName}!</h1>
      <button onClick={logout}>Déconnexion</button>
    </div>
  );
}
```

### **Appeler l'API Directement**

```tsx
import api from "@/lib/api/endpoints";

// Récupérer tous les clubs
const clubs = await api.club.getAll();

// Créer un post
const newPost = await api.post.create({
  content: "Mon premier post!",
  type: "TEXT",
});

// Liker un post
await api.post.like(postId, userId);
```

### **Connexion**

```tsx
import { useAuth } from "@/contexts/AuthContext";

export function LoginForm() {
  const { login } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({
        email: "user@example.com",
        password: "Password123!",
      });
      // Redirection automatique vers "/"
    } catch (error) {
      console.error("Erreur de connexion:", error);
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### **Inscription**

```tsx
import { useAuth } from "@/contexts/AuthContext";

export function RegisterForm() {
  const { register } = useAuth();
  
  const handleSubmit = async (data) => {
    try {
      await register({
        email: data.email,
        password: data.password,
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        role: "PLAYER",
      });
      // Redirection automatique vers "/"
    } catch (error) {
      console.error("Erreur d'inscription:", error);
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

---

## 🔐 Sécurité

### **Tokens JWT**
- ✅ Access token stocké dans un cookie sécurisé (1 jour)
- ✅ Refresh token stocké dans un cookie sécurisé (7 jours)
- ✅ Cookies en `httpOnly` en production
- ✅ Cookies avec `sameSite: strict`

### **Intercepteurs**
- ✅ Le token JWT est automatiquement ajouté à chaque requête
- ✅ En cas de 401, l'utilisateur est redirigé vers `/login`
- ✅ Les tokens sont automatiquement supprimés en cas d'erreur d'auth

---

## 📁 Structure des Fichiers

```
SportConnect/
├── .env.local                    # Variables d'environnement
├── app/
│   ├── layout.tsx               # Layout principal avec Providers
│   └── providers.tsx            # Wrapper des contexts
├── contexts/
│   └── AuthContext.tsx          # Context d'authentification global
├── lib/
│   ├── api/
│   │   ├── client.ts           # Client axios avec intercepteurs
│   │   └── endpoints.ts        # Tous les endpoints API
│   ├── types/
│   │   └── api.ts              # Types TypeScript
│   ├── utils/
│   │   └── auth.ts             # Utilitaires tokens/cookies
│   └── index.ts                # Exports centralisés
```

---

## 🔄 Prochaines Étapes

### **Phase 2 : Authentification** 🔐
1. Créer page de connexion (`app/login/page.tsx`)
2. Créer page d'inscription (`app/register/page.tsx`)
3. Tester connexion/déconnexion
4. Créer un middleware pour les routes protégées

### **Phase 3 : Profil Utilisateur** 👤
1. Intégrer le profil dans le header
2. Créer page de profil avec données réelles
3. Modifier le profil

### **Phase 4 : Publications (Feed)** 📝
1. Récupérer les posts depuis l'API
2. Créer un nouveau post
3. Système de like/unlike
4. Commentaires

---

## ⚠️ Notes Importantes

### **CORS Backend**
Le backend est déjà configuré pour accepter `localhost:3000` dans [SecurityConfig.java](galsenfoot-backend/src/main/java/com/example/galsenfoot_backend/config/SecurityConfig.java#L56-L60)

### **Backend Endpoints Publics**
- `/api/auth/**` - Accessible sans authentification
- Tous les autres endpoints nécessitent un JWT

### **Amélioration Suggérée Backend**
Créer un endpoint `/api/auth/me` pour récupérer l'utilisateur connecté sans décoder manuellement le JWT :

```java
@GetMapping("/me")
public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
    // Return current user info
}
```

---

## 🐛 Debugging

### **Vérifier les tokens**
```typescript
import { getAccessToken, getRefreshToken } from "@/lib/utils/auth";

console.log("Access Token:", getAccessToken());
console.log("Refresh Token:", getRefreshToken());
```

### **Tester l'API directement**
```typescript
import apiClient from "@/lib/api/client";

// Test simple
apiClient.get("/api/clubs")
  .then(res => console.log(res.data))
  .catch(err => console.error(err));
```

### **Vérifier le contexte d'auth**
```tsx
const { user, isAuthenticated, isLoading } = useAuth();

console.log("User:", user);
console.log("Authenticated:", isAuthenticated);
console.log("Loading:", isLoading);
```

---

## 📞 Support

Pour toute question sur l'intégration :
1. Vérifier que le backend tourne sur le port 8080
2. Vérifier le fichier `.env.local`
3. Vérifier les logs du navigateur (F12)
4. Vérifier les logs du backend

---

**✅ L'infrastructure de base est prête ! Passons à la Phase 2 : Authentification**
