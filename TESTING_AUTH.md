# 🔐 Guide de Test - Phase 2 : Authentification

## ✅ Ce qui a été implémenté

### **1. Pages d'Authentification**
- ✅ [app/login/page.tsx](app/login/page.tsx) - Page de connexion complète
- ✅ [app/register/page.tsx](app/register/page.tsx) - Page d'inscription avec validation
- ✅ Validation de formulaires côté client
- ✅ Gestion des erreurs d'API
- ✅ Indicateurs de chargement

### **2. Header Dynamique**
- ✅ [components/layout/header.tsx](components/layout/header.tsx) mis à jour
- ✅ Affichage de l'utilisateur connecté (photo, nom, rôle)
- ✅ Boutons Login/Register si non connecté
- ✅ Menu déroulant avec déconnexion
- ✅ Support mobile et desktop

### **3. Protection des Routes**
- ✅ [middleware.ts](middleware.ts) - Middleware Next.js
- ✅ [lib/hoc/withAuth.tsx](lib/hoc/withAuth.tsx) - HOC pour composants
- ✅ Redirection automatique vers `/login` si non authentifié
- ✅ Redirection vers `/` si déjà connecté sur pages auth

---

## 🚀 Comment Tester

### **Étape 1 : Démarrer le Backend**

```bash
cd galsenfoot-backend
./mvnw spring-boot:run
```

✅ Le backend doit tourner sur `http://localhost:8080`

### **Étape 2 : Démarrer le Frontend**

```bash
cd SportConnect
npm run dev
```

✅ Le frontend doit tourner sur `http://localhost:3000`

### **Étape 3 : Tester l'Inscription**

1. Aller sur `http://localhost:3000`
2. Cliquer sur **"S'inscrire"** dans le header
3. Remplir le formulaire :
   - **Rôle** : Choisir "Joueur" (ou autre)
   - **Prénom** : Jean
   - **Nom** : Dupont
   - **Nom d'utilisateur** : jeandupont
   - **Email** : jean.dupont@test.com
   - **Téléphone** : +221771234567 (optionnel)
   - **Mot de passe** : Password123!
   - **Confirmer** : Password123!
4. Cliquer sur **"Créer mon compte"**

**✅ Résultat attendu :**
- Redirection automatique vers la page d'accueil
- Header affiche votre nom et avatar
- Token JWT stocké dans les cookies

### **Étape 4 : Vérifier l'Authentification**

1. **Dans le Header** : Vous devriez voir "Jean Dupont" avec avatar
2. **Menu utilisateur** : Cliquer sur l'avatar → Menu déroulant s'affiche
3. **Cookies** : Ouvrir DevTools (F12) → Application → Cookies
   - `galsenfoot_access_token` doit exister
   - `galsenfoot_refresh_token` doit exister

### **Étape 5 : Tester la Déconnexion**

1. Cliquer sur l'avatar dans le header
2. Cliquer sur **"Déconnexion"**

**✅ Résultat attendu :**
- Redirection vers `/login`
- Cookies supprimés
- Header affiche "Se connecter" / "S'inscrire"

### **Étape 6 : Tester la Connexion**

1. Aller sur `/login`
2. Remplir avec les identifiants créés :
   - **Email** : jean.dupont@test.com
   - **Mot de passe** : Password123!
3. Cliquer sur **"Se connecter"**

**✅ Résultat attendu :**
- Connexion réussie
- Redirection vers la page d'accueil
- Utilisateur reconnu dans le header

### **Étape 7 : Tester la Protection des Routes**

1. **Connecté** : Essayer d'accéder à `/profile` → ✅ Page accessible
2. **Déconnecté** : Se déconnecter puis essayer `/profile` → 🔄 Redirection vers `/login`
3. **Déjà connecté** : Essayer d'accéder à `/login` → 🔄 Redirection vers `/`

---

## 🧪 Tests en Mode Développement

Sur la page `/login`, un bouton **"Remplir avec compte test"** apparaît en mode dev.

### Créer un Compte Test Rapide

```bash
# Option 1 : Via l'interface (recommandé)
1. Cliquer sur "S'inscrire"
2. Cliquer sur "Remplir avec compte test" en bas
3. Modifier l'email pour le rendre unique
4. Soumettre

# Option 2 : Via cURL (backend direct)
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!",
    "username": "testuser",
    "firstName": "Test",
    "lastName": "User",
    "role": "PLAYER"
  }'
```

---

## 🔍 Debugging

### **1. Vérifier les Tokens**

Ouvrir la console du navigateur (F12) :

```javascript
// Vérifier les cookies
document.cookie

// Voir tous les cookies
document.cookie.split('; ').forEach(c => console.log(c))
```

### **2. Inspecter l'État Auth**

Dans n'importe quel composant :

```typescript
const { user, isAuthenticated, isLoading } = useAuth();
console.log("User:", user);
console.log("Authenticated:", isAuthenticated);
console.log("Loading:", isLoading);
```

### **3. Tester l'API Directement**

```javascript
// Dans la console du navigateur
fetch('http://localhost:8080/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'jean.dupont@test.com',
    password: 'Password123!'
  })
})
.then(r => r.json())
.then(data => console.log(data))
```

### **4. Vérifier les Requêtes API**

DevTools → Network → Filtrer par "XHR" :
- ✅ `POST /api/auth/register` → 201 Created
- ✅ `POST /api/auth/login` → 200 OK
- ✅ `POST /api/auth/logout` → 200 OK
- ✅ Requêtes protégées ont header `Authorization: Bearer ...`

---

## ⚠️ Problèmes Courants

### **Erreur : "Network Error" ou CORS**

**Cause** : Le backend n'est pas démarré ou CORS mal configuré

**Solution** :
1. Vérifier que le backend tourne sur `http://localhost:8080`
2. Le backend est déjà configuré pour accepter `localhost:3000`

### **Erreur : "Invalid credentials"**

**Cause** : Email ou mot de passe incorrect

**Solution** :
1. Vérifier que le compte existe (créer via `/register`)
2. Vérifier le mot de passe (sensible à la casse)

### **Erreur : "Email already exists"**

**Cause** : Un compte avec cet email existe déjà

**Solution** :
1. Utiliser un autre email
2. Ou se connecter avec les identifiants existants

### **Cookie non défini**

**Cause** : Configuration des cookies ou HTTPS

**Solution** :
1. En développement, les cookies fonctionnent sur HTTP
2. Vérifier `.env.local` existe et contient les bonnes clés

### **Redirection infinie**

**Cause** : Problème avec le middleware ou les tokens

**Solution** :
1. Supprimer tous les cookies (DevTools → Application → Clear all)
2. Rafraîchir la page
3. Se reconnecter

---

## 📊 Checklist de Test Complète

- [ ] ✅ Inscription d'un nouvel utilisateur
- [ ] ✅ Réception des tokens JWT
- [ ] ✅ Affichage du nom dans le header
- [ ] ✅ Menu utilisateur fonctionnel
- [ ] ✅ Déconnexion
- [ ] ✅ Connexion avec compte existant
- [ ] ✅ Tentative d'accès à route protégée (connecté) → Accès autorisé
- [ ] ✅ Tentative d'accès à route protégée (déconnecté) → Redirection login
- [ ] ✅ Tentative d'accès à /login (déjà connecté) → Redirection /
- [ ] ✅ Validation des champs de formulaire
- [ ] ✅ Affichage des erreurs API
- [ ] ✅ Indicateurs de chargement

---

## 🎯 Prochaine Étape : Phase 3

Une fois l'authentification validée, nous passerons à :

### **Phase 3 : Profil Utilisateur**
- Afficher le profil complet de l'utilisateur
- Modifier les informations de profil
- Upload de photo de profil (à implémenter)
- Afficher profil d'autres utilisateurs

**Commande pour passer à la Phase 3 :**
```
Authentification OK, passons à la Phase 3 !
```

---

## 📝 Notes

### **Structure de l'Auth**
```
AuthContext (contexts/AuthContext.tsx)
    ↓
Providers (app/providers.tsx)
    ↓
RootLayout (app/layout.tsx)
    ↓
Tous les composants peuvent utiliser useAuth()
```

### **Flow d'Authentification**
```
1. User → Submit form
2. Frontend → POST /api/auth/register (ou login)
3. Backend → Valide + Crée JWT tokens
4. Frontend → Stocke tokens dans cookies
5. Frontend → Récupère données user
6. AuthContext → user state mis à jour
7. Header → Affiche user connecté
```

### **Sécurité Implémentée**
- ✅ Tokens JWT avec expiration
- ✅ Refresh token pour sessions longues
- ✅ Cookies sécurisés (secure + sameSite)
- ✅ Validation côté client et serveur
- ✅ Headers Authorization automatiques
- ✅ Redirection sur 401 Unauthorized

---

**✅ Phase 2 : Authentification - PRÊTE À TESTER !**
