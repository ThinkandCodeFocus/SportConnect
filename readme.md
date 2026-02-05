# Cahier des Charges Backend - SportConnect

## 📋 Description du Projet

SportConnect est un réseau social professionnel dédié au monde du sport. Cette spécification technique détaille l'ensemble des fonctionnalités backend à implémenter avec **Spring Boot** pour supporter l'application frontend Next.js.

---

## 🛠️ Stack Technique Recommandée

### Framework & Langage
- **Java 17+** (LTS)
- **Spring Boot 3.x**
- **Spring Security 6.x** avec JWT
- **Spring Data JPA** avec Hibernate
- **Spring WebSocket** pour le temps réel

### Base de Données
- **PostgreSQL** (principal)
- **Redis** (cache, sessions, temps réel)
- **Elasticsearch** (recherche avancée)

### Stockage Fichiers
- **dossier racine** (médias, avatars, documents)

### Services Additionnels
- **Spring Mail** (notifications email)
- **Firebase Cloud Messaging** ou **WebSocket** (notifications push)
- **Spring Batch** (tâches planifiées)

### Documentation & Tests
- **OpenAPI/Swagger** (documentation API)
- **JUnit 5 + Mockito** (tests unitaires)
- **Testcontainers** (tests d'intégration)

---

## 🔐 1. Module Authentification & Sécurité

### 1.1 Entités

#### User (Utilisateur)
```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String password; // BCrypt hashed
    
    @Column(unique = true)
    private String username;
    
    private String firstName;
    private String lastName;
    private String phone;
    
    @Enumerated(EnumType.STRING)
    private UserRole role; // PLAYER, AGENT, COACH, CLUB_ADMIN, FEDERATION, SPONSOR, ADMIN
    
    @Enumerated(EnumType.STRING)
    private AccountStatus status; // ACTIVE, INACTIVE, SUSPENDED, PENDING_VERIFICATION
    
    private boolean emailVerified;
    private boolean phoneVerified;
    private boolean profileCompleted;
    
    private LocalDateTime lastLogin;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private UserProfile profile;
    
    @ManyToOne
    @JoinColumn(name = "club_id")
    private Club currentClub;
    
    // Relations
    @OneToMany(mappedBy = "user")
    private List<UserConnection> connections;
    
    @OneToMany(mappedBy = "author")
    private List<Post> posts;
}
```

#### UserRole (Enum)
```java
public enum UserRole {
    PLAYER,           // Joueur
    AGENT,            // Agent FIFA
    COACH,            // Entraîneur
    STAFF,            // Staff technique (préparateur, médecin, etc.)
    CLUB_ADMIN,       // Administrateur de club
    FEDERATION,       // Membre fédération
    SPONSOR,          // Sponsor/Entreprise
    SCOUT,            // Recruteur
    JOURNALIST,       // Journaliste sportif
    ADMIN             // Admin plateforme
}
```

### 1.2 Endpoints API

```
POST   /api/v1/auth/register                 # Inscription
POST   /api/v1/auth/login                    # Connexion (retourne JWT)
POST   /api/v1/auth/logout                   # Déconnexion
POST   /api/v1/auth/refresh-token            # Rafraîchir le token JWT
POST   /api/v1/auth/forgot-password          # Mot de passe oublié
POST   /api/v1/auth/reset-password           # Réinitialiser mot de passe
POST   /api/v1/auth/verify-email             # Vérifier email
POST   /api/v1/auth/resend-verification      # Renvoyer email de vérification
POST   /api/v1/auth/change-password          # Changer mot de passe
GET    /api/v1/auth/me                       # Profil utilisateur connecté
DELETE /api/v1/auth/delete-account           # Supprimer compte
```

### 1.3 DTOs

```java
// RegisterRequest
public record RegisterRequest(
    @NotBlank @Email String email,
    @NotBlank @Size(min = 8) String password,
    @NotBlank String firstName,
    @NotBlank String lastName,
    @NotNull UserRole role,
    String phone
) {}

// LoginRequest
public record LoginRequest(
    @NotBlank String email,
    @NotBlank String password
) {}

// AuthResponse
public record AuthResponse(
    String accessToken,
    String refreshToken,
    Long expiresIn,
    UserDTO user
) {}
```

### 1.4 Sécurité JWT

- **Access Token**: durée 15 minutes
- **Refresh Token**: durée 7 jours (stocké en BDD)
- **Claims JWT**: userId, email, role, permissions
- **Blacklist tokens** lors de la déconnexion

---

## 👤 2. Module Profil Utilisateur

### 2.1 Entités

#### UserProfile
```java
@Entity
@Table(name = "user_profiles")
public class UserProfile {
    @Id
    private UUID id; // Même ID que User
    
    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;
    
    private String bio;
    private String headline; // Ex: "Milieu offensif | Ligue 1"
    
    private String avatarUrl;
    private String bannerUrl;
    
    @Enumerated(EnumType.STRING)
    private Sport primarySport;
    
    private String position; // Ex: "Milieu offensif", "Gardien"
    
    @Enumerated(EnumType.STRING)
    private Level level; // AMATEUR, SEMI_PRO, PROFESSIONAL, ELITE
    
    private String currentLocation;
    private String nationality;
    private LocalDate dateOfBirth;
    private Integer height; // en cm
    private Integer weight; // en kg
    private String preferredFoot; // LEFT, RIGHT, BOTH
    
    private boolean isAvailableForTransfer;
    private boolean isVerified;
    
    private Integer profileViews;
    private Integer connectionsCount;
    private Integer postsCount;
    
    @ElementCollection
    private List<String> languages;
    
    @ElementCollection
    private List<String> skills; // Compétences spécifiques
    
    // Paramètres de confidentialité
    private boolean showEmail;
    private boolean showPhone;
    private boolean showDateOfBirth;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

#### CareerHistory (Historique de carrière)
```java
@Entity
@Table(name = "career_histories")
public class CareerHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "club_id")
    private Club club;
    
    private String clubName; // Si club non enregistré
    private String clubLogo;
    
    private String role; // Position ou rôle
    private LocalDate startDate;
    private LocalDate endDate;
    private boolean current;
    
    private Integer matches;
    private Integer goals;
    private Integer assists;
    
    private String description;
    
    private LocalDateTime createdAt;
}
```

#### Achievement (Palmarès)
```java
@Entity
@Table(name = "achievements")
public class Achievement {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    private String title; // Ex: "Meilleur passeur Ligue 1"
    private String description;
    private Integer year;
    
    @Enumerated(EnumType.STRING)
    private AchievementType type; // TROPHY, AWARD, RECORD, CERTIFICATION
    
    private String iconUrl;
    
    private LocalDateTime createdAt;
}
```

#### Certification
```java
@Entity
@Table(name = "certifications")
public class Certification {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    private String title; // Ex: "UEFA B License"
    private String issuer; // Ex: "UEFA"
    private Integer year;
    private String credentialUrl;
    private LocalDate expirationDate;
    
    private LocalDateTime createdAt;
}
```

#### SeasonStats (Statistiques par saison)
```java
@Entity
@Table(name = "season_stats")
public class SeasonStats {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "club_id")
    private Club club;
    
    private String season; // Ex: "2025-2026"
    private Integer matches;
    private Integer goals;
    private Integer assists;
    private Integer yellowCards;
    private Integer redCards;
    private Integer minutesPlayed;
    private Double averageRating;
    private Double passAccuracy;
    
    private LocalDateTime createdAt;
}
```

#### Video (Vidéos du profil)
```java
@Entity
@Table(name = "user_videos")
public class UserVideo {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    private String title;
    private String description;
    private String videoUrl;
    private String thumbnailUrl;
    private String duration; // Format "mm:ss"
    private Integer views;
    
    private boolean isPublic;
    
    private LocalDateTime createdAt;
}
```

### 2.2 Endpoints API

```
GET    /api/v1/profiles/{userId}                    # Voir un profil
PUT    /api/v1/profiles/{userId}                    # Mettre à jour son profil
PATCH  /api/v1/profiles/{userId}/avatar             # Uploader avatar
PATCH  /api/v1/profiles/{userId}/banner             # Uploader bannière
GET    /api/v1/profiles/{userId}/stats              # Statistiques du profil

# Carrière
GET    /api/v1/profiles/{userId}/career             # Historique de carrière
POST   /api/v1/profiles/{userId}/career             # Ajouter une expérience
PUT    /api/v1/profiles/{userId}/career/{id}        # Modifier une expérience
DELETE /api/v1/profiles/{userId}/career/{id}        # Supprimer une expérience

# Palmarès
GET    /api/v1/profiles/{userId}/achievements       # Liste des récompenses
POST   /api/v1/profiles/{userId}/achievements       # Ajouter une récompense
PUT    /api/v1/profiles/{userId}/achievements/{id}  # Modifier
DELETE /api/v1/profiles/{userId}/achievements/{id}  # Supprimer

# Certifications
GET    /api/v1/profiles/{userId}/certifications     # Liste des certifications
POST   /api/v1/profiles/{userId}/certifications     # Ajouter
PUT    /api/v1/profiles/{userId}/certifications/{id}
DELETE /api/v1/profiles/{userId}/certifications/{id}

# Statistiques par saison
GET    /api/v1/profiles/{userId}/season-stats       # Stats par saison
POST   /api/v1/profiles/{userId}/season-stats       # Ajouter stats saison
PUT    /api/v1/profiles/{userId}/season-stats/{id}
DELETE /api/v1/profiles/{userId}/season-stats/{id}

# Vidéos
GET    /api/v1/profiles/{userId}/videos             # Vidéos du profil
POST   /api/v1/profiles/{userId}/videos             # Uploader vidéo
DELETE /api/v1/profiles/{userId}/videos/{id}        # Supprimer vidéo

# Privacy
PUT    /api/v1/profiles/{userId}/privacy            # Paramètres confidentialité
```

---

## 📝 3. Module Publications (Feed)

### 3.1 Entités

#### Post
```java
@Entity
@Table(name = "posts")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne
    @JoinColumn(name = "author_id", nullable = false)
    private User author;
    
    @ManyToOne
    @JoinColumn(name = "club_id")
    private Club club; // Si posté par un club
    
    @Column(columnDefinition = "TEXT")
    private String content;
    
    @Enumerated(EnumType.STRING)
    private PostType type; // TEXT, IMAGE, VIDEO, PERFORMANCE, JOB, ARTICLE
    
    @Enumerated(EnumType.STRING)
    private PostVisibility visibility; // PUBLIC, CONNECTIONS_ONLY, PRIVATE
    
    private Integer likesCount;
    private Integer commentsCount;
    private Integer sharesCount;
    
    private boolean isPinned;
    private boolean isEdited;
    
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "media_id")
    private PostMedia media;
    
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "performance_id")
    private PostPerformance performance;
    
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "job_post_id")
    private JobPost jobPost;
    
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL)
    private List<PostLike> likes;
    
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL)
    private List<Comment> comments;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

#### PostMedia
```java
@Entity
@Table(name = "post_media")
public class PostMedia {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Enumerated(EnumType.STRING)
    private MediaType type; // IMAGE, VIDEO
    
    private String url;
    private String thumbnailUrl;
    private String altText;
    
    private Integer width;
    private Integer height;
    private Long fileSize;
    private String mimeType;
}
```

#### PostPerformance
```java
@Entity
@Table(name = "post_performances")
public class PostPerformance {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    private String matchName; // Ex: "Bayern vs Dortmund"
    private String result; // Ex: "3-1"
    private LocalDate matchDate;
    
    private Integer goals;
    private Integer assists;
    private Double rating;
    private Integer minutesPlayed;
    
    // Stats additionnelles flexibles
    @ElementCollection
    @CollectionTable(name = "performance_stats")
    private Map<String, String> additionalStats;
}
```

#### PostLike
```java
@Entity
@Table(name = "post_likes")
public class PostLike {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    private LocalDateTime createdAt;
}
```

#### Comment
```java
@Entity
@Table(name = "comments")
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;
    
    @ManyToOne
    @JoinColumn(name = "author_id", nullable = false)
    private User author;
    
    @ManyToOne
    @JoinColumn(name = "parent_comment_id")
    private Comment parentComment; // Pour les réponses
    
    @Column(columnDefinition = "TEXT")
    private String content;
    
    private Integer likesCount;
    
    @OneToMany(mappedBy = "parentComment", cascade = CascadeType.ALL)
    private List<Comment> replies;
    
    @OneToMany(mappedBy = "comment", cascade = CascadeType.ALL)
    private List<CommentLike> likes;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

#### CommentLike
```java
@Entity
@Table(name = "comment_likes")
public class CommentLike {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne
    @JoinColumn(name = "comment_id", nullable = false)
    private Comment comment;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    private LocalDateTime createdAt;
}
```

#### PostShare
```java
@Entity
@Table(name = "post_shares")
public class PostShare {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne
    @JoinColumn(name = "post_id", nullable = false)
    private Post originalPost;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User sharedBy;
    
    private String additionalComment;
    
    private LocalDateTime createdAt;
}
```

#### SavedPost
```java
@Entity
@Table(name = "saved_posts")
public class SavedPost {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    private LocalDateTime createdAt;
}
```

### 3.2 Endpoints API

```
# Feed
GET    /api/v1/feed                                 # Fil d'actualité personnalisé
GET    /api/v1/feed?filter={type}                   # Filtrer par type (posts, jobs, performances)

# Posts
POST   /api/v1/posts                                # Créer une publication
GET    /api/v1/posts/{postId}                       # Détail d'une publication
PUT    /api/v1/posts/{postId}                       # Modifier sa publication
DELETE /api/v1/posts/{postId}                       # Supprimer sa publication
POST   /api/v1/posts/{postId}/media                 # Upload média pour un post

# Likes
POST   /api/v1/posts/{postId}/like                  # Liker un post
DELETE /api/v1/posts/{postId}/like                  # Retirer le like
GET    /api/v1/posts/{postId}/likes                 # Liste des personnes ayant liké

# Comments
GET    /api/v1/posts/{postId}/comments              # Commentaires d'un post
POST   /api/v1/posts/{postId}/comments              # Ajouter un commentaire
PUT    /api/v1/posts/{postId}/comments/{commentId}  # Modifier commentaire
DELETE /api/v1/posts/{postId}/comments/{commentId}  # Supprimer commentaire
POST   /api/v1/comments/{commentId}/like            # Liker un commentaire
DELETE /api/v1/comments/{commentId}/like            # Retirer like commentaire
POST   /api/v1/comments/{commentId}/reply           # Répondre à un commentaire

# Partages
POST   /api/v1/posts/{postId}/share                 # Partager un post
GET    /api/v1/posts/{postId}/shares                # Liste des partages

# Sauvegarde
POST   /api/v1/posts/{postId}/save                  # Sauvegarder un post
DELETE /api/v1/posts/{postId}/save                  # Retirer de la sauvegarde
GET    /api/v1/saved-posts                          # Mes posts sauvegardés

# Signalement
POST   /api/v1/posts/{postId}/report                # Signaler un post
POST   /api/v1/comments/{commentId}/report          # Signaler un commentaire
```

### 3.3 Algorithme Feed

```java
// Service pour générer le feed personnalisé
@Service
public class FeedService {
    
    public Page<PostDTO> getFeed(UUID userId, Pageable pageable, PostType filter) {
        // 1. Récupérer les connexions de l'utilisateur
        // 2. Récupérer les clubs suivis
        // 3. Calculer le score de pertinence pour chaque post:
        //    - Récence (décroissance exponentielle)
        //    - Engagement (likes, commentaires, partages)
        //    - Relation avec l'auteur (connexion directe > 2ème degré)
        //    - Intérêts de l'utilisateur (sport, position, localisation)
        // 4. Trier par score et paginer
        // 5. Grouper par type si nécessaire
    }
}
```

---

## 👥 4. Module Réseau (Connexions)

### 4.1 Entités

#### UserConnection
```java
@Entity
@Table(name = "user_connections")
public class UserConnection {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne
    @JoinColumn(name = "requester_id", nullable = false)
    private User requester;
    
    @ManyToOne
    @JoinColumn(name = "addressee_id", nullable = false)
    private User addressee;
    
    @Enumerated(EnumType.STRING)
    private ConnectionStatus status; // PENDING, ACCEPTED, DECLINED, BLOCKED
    
    private String message; // Message d'invitation optionnel
    
    private LocalDateTime requestedAt;
    private LocalDateTime respondedAt;
    private LocalDateTime connectedAt;
}
```

#### FollowClub
```java
@Entity
@Table(name = "club_followers")
public class ClubFollower {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "club_id", nullable = false)
    private Club club;
    
    private boolean notificationsEnabled;
    
    private LocalDateTime followedAt;
}
```

### 4.2 Endpoints API

```
# Connexions
GET    /api/v1/network/connections                  # Mes connexions
GET    /api/v1/network/connections/pending          # Invitations reçues
GET    /api/v1/network/connections/sent             # Invitations envoyées
POST   /api/v1/network/connections/request          # Envoyer une invitation
POST   /api/v1/network/connections/{id}/accept      # Accepter
POST   /api/v1/network/connections/{id}/decline     # Refuser
DELETE /api/v1/network/connections/{id}             # Supprimer connexion
POST   /api/v1/network/connections/{id}/block       # Bloquer utilisateur

# Suggestions
GET    /api/v1/network/suggestions                  # Suggestions de connexions
GET    /api/v1/network/mutual/{userId}              # Connexions en commun

# Suivi de clubs
GET    /api/v1/network/following                    # Clubs suivis
POST   /api/v1/network/follow/{clubId}              # Suivre un club
DELETE /api/v1/network/follow/{clubId}              # Ne plus suivre
```

### 4.3 Algorithme de Suggestions

```java
@Service
public class ConnectionSuggestionService {
    
    public List<UserSuggestionDTO> getSuggestions(UUID userId, int limit) {
        // Critères de suggestion:
        // 1. Connexions de 2ème degré (amis d'amis)
        // 2. Même club actuel ou ancien
        // 3. Même sport et position similaire
        // 4. Même localisation géographique
        // 5. Même formation/école
        // 6. Personnes ayant consulté le profil
        // 7. Profils vérifiés et actifs
        
        // Score pondéré pour chaque critère
    }
}
```

---

## 🏢 5. Module Clubs & Organisations

### 5.1 Entités

#### Club
```java
@Entity
@Table(name = "clubs")
public class Club {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(nullable = false)
    private String name;
    
    private String logo; // URL du logo
    private String shortName; // Ex: "PSG", "OM"
    
    @Enumerated(EnumType.STRING)
    private ClubType type; // CLUB, ACADEMY, FEDERATION, SPONSOR, AGENCY
    
    @Enumerated(EnumType.STRING)
    private Sport sport;
    
    private String league; // Ex: "Ligue 1"
    private String level; // Ex: "Professionnel"
    
    private String location;
    private String country;
    private String city;
    
    private Integer foundedYear;
    
    private String stadium;
    private Integer stadiumCapacity;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private String website;
    private String email;
    private String phone;
    
    // Réseaux sociaux
    private String twitterUrl;
    private String facebookUrl;
    private String instagramUrl;
    private String linkedInUrl;
    
    private String bannerUrl;
    
    private Integer followersCount;
    private Integer employeesCount;
    private Integer openPositionsCount;
    
    private boolean isVerified;
    
    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner; // Administrateur principal
    
    @OneToMany(mappedBy = "club")
    private List<ClubMember> members;
    
    @OneToMany(mappedBy = "club")
    private List<ClubPlayer> players;
    
    @OneToMany(mappedBy = "club")
    private List<ClubStaff> staff;
    
    @OneToMany(mappedBy = "club")
    private List<JobPost> jobPosts;
    
    @OneToMany(mappedBy = "club")
    private List<ClubTrophy> trophies;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

#### ClubMember (Admins et gestionnaires du club)
```java
@Entity
@Table(name = "club_members")
public class ClubMember {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne
    @JoinColumn(name = "club_id", nullable = false)
    private Club club;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Enumerated(EnumType.STRING)
    private ClubMemberRole role; // OWNER, ADMIN, MANAGER, MEMBER
    
    @ElementCollection
    @Enumerated(EnumType.STRING)
    private List<ClubPermission> permissions;
    
    private LocalDateTime joinedAt;
}
```

#### ClubPlayer (Joueurs du club)
```java
@Entity
@Table(name = "club_players")
public class ClubPlayer {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne
    @JoinColumn(name = "club_id", nullable = false)
    private Club club;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User linkedUser; // Si le joueur a un compte
    
    // Infos joueur (si pas de compte lié)
    private String name;
    private String avatarUrl;
    private String position;
    private Integer shirtNumber;
    private Integer age;
    private String nationality;
    
    private LocalDate joinDate;
    private LocalDate contractEndDate;
    
    @Enumerated(EnumType.STRING)
    private PlayerStatus status; // ACTIVE, INJURED, SUSPENDED, LOANED, TRANSFERRED
    
    private String injuryDescription;
    private LocalDate injuryExpectedReturn;
    
    // Contact
    private String email;
    private String phone;
    
    // Statistiques saison actuelle
    private Integer matches;
    private Integer goals;
    private Integer assists;
    private Integer yellowCards;
    private Integer redCards;
    private Integer minutesPlayed;
    private Double averageRating;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

#### ClubStaff (Staff technique)
```java
@Entity
@Table(name = "club_staff")
public class ClubStaff {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne
    @JoinColumn(name = "club_id", nullable = false)
    private Club club;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User linkedUser;
    
    private String name;
    private String avatarUrl;
    
    @Enumerated(EnumType.STRING)
    private StaffRole role; // HEAD_COACH, ASSISTANT_COACH, GOALKEEPER_COACH, 
                            // FITNESS_COACH, VIDEO_ANALYST, DOCTOR, PHYSIOTHERAPIST,
                            // SPORTING_DIRECTOR, SCOUT
    
    private String customRole; // Si rôle non standard
    
    private LocalDate joinDate;
    
    private String email;
    private String phone;
    
    private LocalDateTime createdAt;
}
```

#### ClubMatch (Matchs du club)
```java
@Entity
@Table(name = "club_matches")
public class ClubMatch {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne
    @JoinColumn(name = "club_id", nullable = false)
    private Club club;
    
    private String opponent;
    private String opponentLogo;
    
    @Enumerated(EnumType.STRING)
    private MatchType type; // LEAGUE, CUP, FRIENDLY, INTERNATIONAL
    
    private String competition;
    
    private LocalDate matchDate;
    private LocalTime matchTime;
    
    @Enumerated(EnumType.STRING)
    private MatchVenue venue; // HOME, AWAY, NEUTRAL
    
    private String stadiumName;
    
    // Résultat (null si pas encore joué)
    private Integer scoreHome;
    private Integer scoreAway;
    
    @Enumerated(EnumType.STRING)
    private MatchResult result; // WIN, DRAW, LOSS, PENDING
    
    private LocalDateTime createdAt;
}
```

#### ClubTrophy
```java
@Entity
@Table(name = "club_trophies")
public class ClubTrophy {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne
    @JoinColumn(name = "club_id", nullable = false)
    private Club club;
    
    private String title; // Ex: "Ligue 1"
    private String competition;
    private Integer count;
    private Integer lastWonYear;
    
    private LocalDateTime createdAt;
}
```

#### ClubStats (Statistiques globales du club)
```java
@Entity
@Table(name = "club_stats")
public class ClubStats {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @OneToOne
    @JoinColumn(name = "club_id", nullable = false)
    private Club club;
    
    private String season;
    
    private Integer playersCount;
    private Integer staffCount;
    
    private Integer wins;
    private Integer draws;
    private Integer losses;
    private Integer goalsFor;
    private Integer goalsAgainst;
    private Integer points;
    private Integer position;
    private Integer totalTeams;
    
    private LocalDateTime updatedAt;
}
```

### 5.2 Endpoints API

```
# Clubs (Public)
GET    /api/v1/clubs                                # Liste des clubs (avec filtres)
GET    /api/v1/clubs/{clubId}                       # Détail d'un club
GET    /api/v1/clubs/{clubId}/posts                 # Publications du club
GET    /api/v1/clubs/{clubId}/jobs                  # Offres du club
GET    /api/v1/clubs/{clubId}/squad                 # Effectif joueurs
GET    /api/v1/clubs/{clubId}/staff                 # Staff technique
GET    /api/v1/clubs/{clubId}/trophies              # Palmarès
GET    /api/v1/clubs/{clubId}/matches               # Matchs (passés et à venir)
GET    /api/v1/clubs/{clubId}/stats                 # Statistiques

# Mon Club (Gestion - authentifié, avec permissions)
POST   /api/v1/my-club                              # Créer un club
GET    /api/v1/my-club                              # Mon club (dashboard)
PUT    /api/v1/my-club                              # Modifier infos club
PATCH  /api/v1/my-club/logo                         # Uploader logo
PATCH  /api/v1/my-club/banner                       # Uploader bannière
DELETE /api/v1/my-club                              # Supprimer club

# Gestion des joueurs
GET    /api/v1/my-club/players                      # Liste joueurs
POST   /api/v1/my-club/players                      # Ajouter un joueur
GET    /api/v1/my-club/players/{playerId}           # Détail joueur
PUT    /api/v1/my-club/players/{playerId}           # Modifier joueur
DELETE /api/v1/my-club/players/{playerId}           # Supprimer joueur
PATCH  /api/v1/my-club/players/{playerId}/status    # Changer statut (actif, blessé, etc.)
PATCH  /api/v1/my-club/players/{playerId}/stats     # Mettre à jour stats
POST   /api/v1/my-club/players/import               # Import en masse (CSV)
GET    /api/v1/my-club/players/export               # Export CSV

# Gestion du staff
GET    /api/v1/my-club/staff                        # Liste staff
POST   /api/v1/my-club/staff                        # Ajouter membre staff
PUT    /api/v1/my-club/staff/{staffId}              # Modifier
DELETE /api/v1/my-club/staff/{staffId}              # Supprimer

# Gestion des matchs
GET    /api/v1/my-club/matches                      # Liste matchs
POST   /api/v1/my-club/matches                      # Ajouter un match
PUT    /api/v1/my-club/matches/{matchId}            # Modifier match
DELETE /api/v1/my-club/matches/{matchId}            # Supprimer match
PATCH  /api/v1/my-club/matches/{matchId}/result     # Enregistrer résultat

# Statistiques club
GET    /api/v1/my-club/stats                        # Stats globales
PUT    /api/v1/my-club/stats                        # Mettre à jour stats saison

# Palmarès
GET    /api/v1/my-club/trophies                     # Liste trophées
POST   /api/v1/my-club/trophies                     # Ajouter trophée
PUT    /api/v1/my-club/trophies/{trophyId}          # Modifier
DELETE /api/v1/my-club/trophies/{trophyId}          # Supprimer

# Membres et permissions
GET    /api/v1/my-club/members                      # Liste admins/gestionnaires
POST   /api/v1/my-club/members                      # Inviter un membre
PUT    /api/v1/my-club/members/{memberId}           # Modifier rôle/permissions
DELETE /api/v1/my-club/members/{memberId}           # Retirer membre

# Comparaison
GET    /api/v1/my-club/compare/{otherClubId}        # Comparer avec autre club
```

### 5.3 DTOs Club

```java
// CreateClubRequest
public record CreateClubRequest(
    @NotBlank String name,
    @NotNull ClubType type,
    @NotNull Sport sport,
    String league,
    String location,
    String description
) {}

// AddPlayerRequest
public record AddPlayerRequest(
    @NotBlank String name,
    @NotBlank String position,
    @NotNull Integer shirtNumber,
    Integer age,
    String nationality,
    LocalDate contractEndDate,
    String email,
    String phone
) {}

// AddStaffRequest
public record AddStaffRequest(
    @NotBlank String name,
    @NotNull StaffRole role,
    String customRole,
    String email,
    String phone
) {}

// UpdatePlayerStatsRequest
public record UpdatePlayerStatsRequest(
    Integer matches,
    Integer goals,
    Integer assists,
    Integer yellowCards,
    Integer redCards,
    Double averageRating
) {}

// CreateMatchRequest
public record CreateMatchRequest(
    @NotBlank String opponent,
    @NotNull LocalDate matchDate,
    LocalTime matchTime,
    @NotNull MatchVenue venue,
    MatchType type,
    String competition,
    String stadiumName
) {}

// RecordMatchResultRequest
public record RecordMatchResultRequest(
    @NotNull Integer scoreHome,
    @NotNull Integer scoreAway
) {}
```

---

## 💼 6. Module Offres d'Emploi

### 6.1 Entités

#### JobPost
```java
@Entity
@Table(name = "job_posts")
public class JobPost {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne
    @JoinColumn(name = "club_id")
    private Club club;
    
    @ManyToOne
    @JoinColumn(name = "posted_by_id", nullable = false)
    private User postedBy;
    
    @Column(nullable = false)
    private String title;
    
    @Enumerated(EnumType.STRING)
    private JobType type; // RECRUITMENT (joueur/staff), TENDER (appel d'offres)
    
    @Enumerated(EnumType.STRING)
    private Sport sport;
    
    private String level; // Ex: "Ligue 1", "National"
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @ElementCollection
    private List<String> requirements;
    
    private String location;
    private String salaryRange; // Ex: "150k-250k€/an"
    
    @Enumerated(EnumType.STRING)
    private ContractType contractType; // CDI, CDD, TRANSFER, LOAN
    
    private LocalDate deadline;
    
    private Boolean isUrgent;
    private Boolean isRemote;
    
    private String category; // Pour les appels d'offres: "Équipement", "Sponsoring", etc.
    
    private Integer applicantsCount;
    private Integer viewsCount;
    
    @Enumerated(EnumType.STRING)
    private JobStatus status; // OPEN, CLOSED, FILLED, EXPIRED
    
    @OneToMany(mappedBy = "jobPost", cascade = CascadeType.ALL)
    private List<JobApplication> applications;
    
    @OneToMany(mappedBy = "jobPost", cascade = CascadeType.ALL)
    private List<SavedJob> savedBy;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

#### JobApplication
```java
@Entity
@Table(name = "job_applications")
public class JobApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne
    @JoinColumn(name = "job_post_id", nullable = false)
    private JobPost jobPost;
    
    @ManyToOne
    @JoinColumn(name = "applicant_id", nullable = false)
    private User applicant;
    
    @Column(columnDefinition = "TEXT")
    private String motivation; // Lettre de motivation
    
    @Column(columnDefinition = "TEXT")
    private String experience;
    
    private String availability; // Ex: "Immédiate", "Janvier 2026"
    
    private String salaryExpectation;
    
    private String resumeUrl; // CV uploadé
    private String videoUrl; // Vidéo de présentation
    
    @ElementCollection
    private List<String> documents; // Documents additionnels
    
    @Enumerated(EnumType.STRING)
    private ApplicationStatus status; // PENDING, REVIEWED, SHORTLISTED, INTERVIEW, ACCEPTED, REJECTED, WITHDRAWN
    
    @Column(columnDefinition = "TEXT")
    private String recruiterNotes; // Notes du recruteur (privées)
    
    private LocalDateTime appliedAt;
    private LocalDateTime reviewedAt;
    private LocalDateTime updatedAt;
}
```

#### SavedJob
```java
@Entity
@Table(name = "saved_jobs")
public class SavedJob {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne
    @JoinColumn(name = "job_post_id", nullable = false)
    private JobPost jobPost;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    private LocalDateTime savedAt;
}
```

### 6.2 Endpoints API

```
# Offres (Public)
GET    /api/v1/jobs                                 # Liste des offres (avec filtres)
GET    /api/v1/jobs/{jobId}                         # Détail d'une offre
GET    /api/v1/jobs/recommended                     # Offres recommandées

# Candidatures
POST   /api/v1/jobs/{jobId}/apply                   # Postuler
GET    /api/v1/my-applications                      # Mes candidatures
GET    /api/v1/my-applications/{applicationId}      # Détail candidature
DELETE /api/v1/my-applications/{applicationId}      # Retirer candidature

# Sauvegarde
POST   /api/v1/jobs/{jobId}/save                    # Sauvegarder offre
DELETE /api/v1/jobs/{jobId}/save                    # Retirer sauvegarde
GET    /api/v1/saved-jobs                           # Mes offres sauvegardées

# Gestion des offres (Club Admin)
POST   /api/v1/my-club/jobs                         # Créer une offre
GET    /api/v1/my-club/jobs                         # Mes offres
PUT    /api/v1/my-club/jobs/{jobId}                 # Modifier offre
DELETE /api/v1/my-club/jobs/{jobId}                 # Supprimer offre
PATCH  /api/v1/my-club/jobs/{jobId}/status          # Changer statut (close, reopen)

# Gestion des candidatures (Club Admin)
GET    /api/v1/my-club/jobs/{jobId}/applications                # Liste candidatures
GET    /api/v1/my-club/jobs/{jobId}/applications/{applicationId} # Détail candidature
PATCH  /api/v1/my-club/jobs/{jobId}/applications/{applicationId}/status # Changer statut
POST   /api/v1/my-club/jobs/{jobId}/applications/{applicationId}/notes  # Ajouter note
```

### 6.3 DTOs Jobs

```java
// CreateJobPostRequest
public record CreateJobPostRequest(
    @NotBlank String title,
    @NotNull JobType type,
    @NotNull Sport sport,
    @NotBlank String description,
    List<String> requirements,
    String level,
    String location,
    String salaryRange,
    ContractType contractType,
    LocalDate deadline,
    Boolean isUrgent,
    String category
) {}

// ApplyJobRequest
public record ApplyJobRequest(
    String motivation,
    String experience,
    String availability,
    String salaryExpectation
) {}

// UpdateApplicationStatusRequest
public record UpdateApplicationStatusRequest(
    @NotNull ApplicationStatus status,
    String notes
) {}
```

---

## 💬 7. Module Messagerie

### 7.1 Entités

#### Conversation
```java
@Entity
@Table(name = "conversations")
public class Conversation {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    private String name; // Pour les groupes
    private String imageUrl; // Pour les groupes
    
    private boolean isGroup;
    
    @ManyToMany
    @JoinTable(
        name = "conversation_participants",
        joinColumns = @JoinColumn(name = "conversation_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> participants;
    
    @OneToMany(mappedBy = "conversation", cascade = CascadeType.ALL)
    private List<Message> messages;
    
    @ManyToOne
    @JoinColumn(name = "created_by_id")
    private User createdBy;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

#### ConversationParticipant
```java
@Entity
@Table(name = "conversation_participants")
public class ConversationParticipant {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne
    @JoinColumn(name = "conversation_id", nullable = false)
    private Conversation conversation;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    private boolean isAdmin; // Pour les groupes
    private boolean isMuted;
    
    private LocalDateTime lastReadAt;
    private Integer unreadCount;
    
    private boolean isArchived;
    private boolean isPinned;
    
    private LocalDateTime joinedAt;
    private LocalDateTime leftAt;
}
```

#### Message
```java
@Entity
@Table(name = "messages")
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne
    @JoinColumn(name = "conversation_id", nullable = false)
    private Conversation conversation;
    
    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;
    
    @Column(columnDefinition = "TEXT")
    private String content;
    
    @Enumerated(EnumType.STRING)
    private MessageType type; // TEXT, IMAGE, FILE, SYSTEM
    
    private String fileUrl;
    private String fileName;
    private Long fileSize;
    
    @ManyToOne
    @JoinColumn(name = "reply_to_id")
    private Message replyTo;
    
    @OneToMany(mappedBy = "message")
    private List<MessageRead> readBy;
    
    private boolean isEdited;
    private boolean isDeleted;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

#### MessageRead
```java
@Entity
@Table(name = "message_reads")
public class MessageRead {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne
    @JoinColumn(name = "message_id", nullable = false)
    private Message message;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    private LocalDateTime readAt;
}
```

### 7.2 Endpoints API REST

```
# Conversations
GET    /api/v1/conversations                        # Liste des conversations
POST   /api/v1/conversations                        # Créer une conversation
GET    /api/v1/conversations/{conversationId}       # Détail conversation
DELETE /api/v1/conversations/{conversationId}       # Supprimer/quitter conversation

# Messages
GET    /api/v1/conversations/{conversationId}/messages # Messages d'une conversation
POST   /api/v1/conversations/{conversationId}/messages # Envoyer un message
PUT    /api/v1/messages/{messageId}                 # Modifier un message
DELETE /api/v1/messages/{messageId}                 # Supprimer un message

# Actions conversation
POST   /api/v1/conversations/{conversationId}/archive      # Archiver
POST   /api/v1/conversations/{conversationId}/unarchive    # Désarchiver
POST   /api/v1/conversations/{conversationId}/pin          # Épingler
POST   /api/v1/conversations/{conversationId}/unpin        # Désépingler
POST   /api/v1/conversations/{conversationId}/mute         # Mettre en sourdine
POST   /api/v1/conversations/{conversationId}/unmute       # Réactiver

# Groupes
POST   /api/v1/conversations/{conversationId}/participants      # Ajouter participant
DELETE /api/v1/conversations/{conversationId}/participants/{userId} # Retirer participant
PUT    /api/v1/conversations/{conversationId}/settings         # Modifier groupe (nom, image)

# Status
POST   /api/v1/conversations/{conversationId}/read             # Marquer comme lu
GET    /api/v1/conversations/unread-count                      # Nombre non lus
```

### 7.3 WebSocket Events

```
// Configuration WebSocket
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/queue");
        config.setApplicationDestinationPrefixes("/app");
        config.setUserDestinationPrefix("/user");
    }
    
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws").withSockJS();
    }
}

// Événements WebSocket:
// Client → Server:
// /app/chat.send                    # Envoyer message
// /app/chat.typing                  # Indicateur de frappe
// /app/chat.read                    # Marquer lu

// Server → Client:
// /user/{userId}/queue/messages     # Nouveaux messages
// /user/{userId}/queue/typing       # Quelqu'un tape
// /topic/conversation/{id}          # Messages groupe
// /user/{userId}/queue/notifications # Notifications
// /user/{userId}/queue/presence     # Statut en ligne
```

---

## 🔔 8. Module Notifications

### 8.1 Entités

#### Notification
```java
@Entity
@Table(name = "notifications")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Enumerated(EnumType.STRING)
    private NotificationType type;
    // LIKE, COMMENT, REPLY, CONNECTION_REQUEST, CONNECTION_ACCEPTED,
    // JOB_MATCH, JOB_APPLICATION_STATUS, MENTION, CLUB_POST,
    // ACHIEVEMENT, PROFILE_VIEW, MESSAGE, SYSTEM
    
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String content;
    
    // Références optionnelles
    @ManyToOne
    @JoinColumn(name = "actor_id")
    private User actor; // Utilisateur à l'origine
    
    private String entityType; // POST, COMMENT, JOB, USER, CLUB
    private UUID entityId;
    
    private String imageUrl;
    private String actionUrl;
    
    private boolean isRead;
    
    private LocalDateTime createdAt;
    private LocalDateTime readAt;
}
```

#### NotificationPreferences
```java
@Entity
@Table(name = "notification_preferences")
public class NotificationPreferences {
    @Id
    private UUID userId;
    
    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;
    
    // Email
    private boolean emailLikes;
    private boolean emailComments;
    private boolean emailConnections;
    private boolean emailMessages;
    private boolean emailJobs;
    private boolean emailNewsletter;
    
    // Push
    private boolean pushLikes;
    private boolean pushComments;
    private boolean pushConnections;
    private boolean pushMessages;
    private boolean pushJobs;
    
    // In-App
    private boolean inAppLikes;
    private boolean inAppComments;
    private boolean inAppConnections;
    private boolean inAppMessages;
    private boolean inAppJobs;
    
    private LocalDateTime updatedAt;
}
```

### 8.2 Endpoints API

```
# Notifications
GET    /api/v1/notifications                        # Liste des notifications
GET    /api/v1/notifications/unread-count           # Nombre non lues
POST   /api/v1/notifications/{id}/read              # Marquer comme lue
POST   /api/v1/notifications/read-all               # Tout marquer comme lu
DELETE /api/v1/notifications/{id}                   # Supprimer notification

# Préférences
GET    /api/v1/notifications/preferences            # Mes préférences
PUT    /api/v1/notifications/preferences            # Modifier préférences
```

### 8.3 Service de Notifications

```java
@Service
public class NotificationService {
    
    // Créer et envoyer notification
    public void notify(User recipient, NotificationType type, User actor, 
                       String entityType, UUID entityId, String content) {
        // 1. Vérifier les préférences
        // 2. Créer en BDD
        // 3. WebSocket push si en ligne
        // 4. Email si configuré
        // 5. Push mobile si configuré
    }
    
    // Événements à notifier:
    // - Post liké
    // - Commentaire sur post
    // - Réponse à commentaire
    // - Demande de connexion
    // - Connexion acceptée
    // - Nouvelle offre correspondant au profil
    // - Changement statut candidature
    // - Mention dans un post/commentaire
    // - Publication d'un club suivi
    // - Nouveau message
    // - Badge/Récompense obtenue
    // - Visite de profil
}
```

---

## 🔍 9. Module Recherche

### 9.1 Configuration Elasticsearch

```java
// Indices à créer:

// users_index
{
    "settings": {
        "analysis": {
            "analyzer": {
                "name_analyzer": {
                    "type": "custom",
                    "tokenizer": "standard",
                    "filter": ["lowercase", "asciifolding"]
                }
            }
        }
    },
    "mappings": {
        "properties": {
            "id": { "type": "keyword" },
            "name": { "type": "text", "analyzer": "name_analyzer" },
            "headline": { "type": "text" },
            "sport": { "type": "keyword" },
            "position": { "type": "keyword" },
            "location": { "type": "text" },
            "currentClub": { "type": "text" },
            "isVerified": { "type": "boolean" },
            "connectionsCount": { "type": "integer" }
        }
    }
}

// clubs_index
{
    "mappings": {
        "properties": {
            "id": { "type": "keyword" },
            "name": { "type": "text", "analyzer": "name_analyzer" },
            "type": { "type": "keyword" },
            "sport": { "type": "keyword" },
            "location": { "type": "text" },
            "country": { "type": "keyword" },
            "isVerified": { "type": "boolean" },
            "followersCount": { "type": "integer" }
        }
    }
}

// jobs_index
{
    "mappings": {
        "properties": {
            "id": { "type": "keyword" },
            "title": { "type": "text" },
            "description": { "type": "text" },
            "sport": { "type": "keyword" },
            "level": { "type": "keyword" },
            "location": { "type": "text" },
            "type": { "type": "keyword" },
            "status": { "type": "keyword" },
            "postedAt": { "type": "date" }
        }
    }
}
```

### 9.2 Endpoints API

```
# Recherche globale
GET    /api/v1/search?q={query}                     # Recherche tous types
GET    /api/v1/search?q={query}&type=users          # Recherche utilisateurs
GET    /api/v1/search?q={query}&type=clubs          # Recherche clubs
GET    /api/v1/search?q={query}&type=jobs           # Recherche offres

# Filtres de recherche
GET    /api/v1/search/users?q={query}&sport=football&position=attaquant&location=paris
GET    /api/v1/search/clubs?q={query}&type=club&sport=football&country=france
GET    /api/v1/search/jobs?q={query}&type=recruitment&sport=football&level=ligue1

# Suggestions
GET    /api/v1/search/suggestions?q={query}         # Auto-complétion
GET    /api/v1/search/trending                      # Recherches tendances
```

---

## 👥 10. Module Groupes

### 10.1 Entités

#### Group
```java
@Entity
@Table(name = "groups")
public class Group {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private String imageUrl;
    private String bannerUrl;
    
    @Enumerated(EnumType.STRING)
    private GroupVisibility visibility; // PUBLIC, PRIVATE, SECRET
    
    @ManyToOne
    @JoinColumn(name = "created_by_id")
    private User createdBy;
    
    private Integer membersCount;
    private Integer postsCount;
    
    @ElementCollection
    private List<String> tags;
    
    @Enumerated(EnumType.STRING)
    private Sport sport;
    
    @OneToMany(mappedBy = "group")
    private List<GroupMember> members;
    
    @OneToMany(mappedBy = "group")
    private List<GroupPost> posts;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

#### GroupMember
```java
@Entity
@Table(name = "group_members")
public class GroupMember {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne
    @JoinColumn(name = "group_id", nullable = false)
    private Group group;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Enumerated(EnumType.STRING)
    private GroupMemberRole role; // OWNER, ADMIN, MODERATOR, MEMBER
    
    private LocalDateTime joinedAt;
}
```

### 10.2 Endpoints API

```
# Groupes
GET    /api/v1/groups                               # Découvrir des groupes
GET    /api/v1/groups/{groupId}                     # Détail groupe
POST   /api/v1/groups                               # Créer groupe
PUT    /api/v1/groups/{groupId}                     # Modifier groupe
DELETE /api/v1/groups/{groupId}                     # Supprimer groupe

# Membres
GET    /api/v1/groups/{groupId}/members             # Liste membres
POST   /api/v1/groups/{groupId}/join                # Rejoindre
POST   /api/v1/groups/{groupId}/leave               # Quitter
POST   /api/v1/groups/{groupId}/invite              # Inviter
PUT    /api/v1/groups/{groupId}/members/{userId}/role # Changer rôle
DELETE /api/v1/groups/{groupId}/members/{userId}    # Expulser

# Posts groupe
GET    /api/v1/groups/{groupId}/posts               # Posts du groupe
POST   /api/v1/groups/{groupId}/posts               # Poster dans groupe

# Mes groupes
GET    /api/v1/my-groups                            # Mes groupes
GET    /api/v1/my-groups/invitations                # Invitations reçues
```

---

## ⚙️ 11. Module Administration

### 11.1 Endpoints Admin

```
# Utilisateurs
GET    /api/v1/admin/users                          # Liste utilisateurs
GET    /api/v1/admin/users/{userId}                 # Détail utilisateur
PUT    /api/v1/admin/users/{userId}                 # Modifier utilisateur
PATCH  /api/v1/admin/users/{userId}/status          # Activer/Suspendre
DELETE /api/v1/admin/users/{userId}                 # Supprimer utilisateur
POST   /api/v1/admin/users/{userId}/verify          # Vérifier profil

# Clubs
GET    /api/v1/admin/clubs                          # Liste clubs
PUT    /api/v1/admin/clubs/{clubId}                 # Modifier club
POST   /api/v1/admin/clubs/{clubId}/verify          # Vérifier club
DELETE /api/v1/admin/clubs/{clubId}                 # Supprimer club

# Posts
GET    /api/v1/admin/posts                          # Liste posts
DELETE /api/v1/admin/posts/{postId}                 # Supprimer post

# Signalements
GET    /api/v1/admin/reports                        # Liste signalements
PUT    /api/v1/admin/reports/{reportId}             # Traiter signalement

# Statistiques
GET    /api/v1/admin/stats                          # Stats plateforme
GET    /api/v1/admin/stats/users                    # Stats utilisateurs
GET    /api/v1/admin/stats/engagement               # Stats engagement
```

---

## 📊 12. Module Analytics & Statistiques

### 12.1 Entités

#### ProfileView
```java
@Entity
@Table(name = "profile_views")
public class ProfileView {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne
    @JoinColumn(name = "profile_id", nullable = false)
    private User profile;
    
    @ManyToOne
    @JoinColumn(name = "viewer_id")
    private User viewer; // null si anonyme
    
    private String viewerCompany;
    private String viewerPosition;
    
    private LocalDateTime viewedAt;
}
```

### 12.2 Endpoints API

```
# Mes statistiques
GET    /api/v1/analytics/profile-views              # Vues de mon profil
GET    /api/v1/analytics/profile-views/stats        # Stats vues (graphique)
GET    /api/v1/analytics/post-engagement            # Engagement posts
GET    /api/v1/analytics/audience                   # Démographie audience

# Club Analytics (si admin club)
GET    /api/v1/my-club/analytics/overview           # Vue d'ensemble
GET    /api/v1/my-club/analytics/followers          # Stats followers
GET    /api/v1/my-club/analytics/posts              # Stats posts
GET    /api/v1/my-club/analytics/jobs               # Stats offres
```

---

## 🔧 13. Configurations & Utils

### 13.1 Enums Communs

```java
public enum Sport {
    FOOTBALL, BASKETBALL, HANDBALL, RUGBY, VOLLEYBALL, 
    TENNIS, ATHLETICS, SWIMMING, CYCLING, BOXING,
    MARTIAL_ARTS, GOLF, HOCKEY, BASEBALL, OTHER
}

public enum Level {
    AMATEUR, REGIONAL, NATIONAL, SEMI_PRO, PROFESSIONAL, ELITE
}

public enum ClubType {
    CLUB, ACADEMY, FEDERATION, SPONSOR, AGENCY
}

public enum PlayerStatus {
    ACTIVE, INJURED, SUSPENDED, LOANED, TRANSFERRED
}

public enum StaffRole {
    HEAD_COACH, ASSISTANT_COACH, GOALKEEPER_COACH,
    FITNESS_COACH, VIDEO_ANALYST, DOCTOR, PHYSIOTHERAPIST,
    SPORTING_DIRECTOR, SCOUT
}

public enum ContractType {
    CDI, CDD, TRANSFER, LOAN
}

public enum JobType {
    RECRUITMENT, TENDER
}

public enum JobStatus {
    OPEN, CLOSED, FILLED, EXPIRED
}

public enum ApplicationStatus {
    PENDING, REVIEWED, SHORTLISTED, INTERVIEW, ACCEPTED, REJECTED, WITHDRAWN
}

public enum MatchVenue {
    HOME, AWAY, NEUTRAL
}

public enum MatchResult {
    WIN, DRAW, LOSS, PENDING
}
```

### 13.2 Exception Handling

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(404).body(new ErrorResponse(404, ex.getMessage()));
    }
    
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(AccessDeniedException ex) {
        return ResponseEntity.status(403).body(new ErrorResponse(403, "Accès refusé"));
    }
    
    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ErrorResponse> handleValidation(ValidationException ex) {
        return ResponseEntity.status(400).body(new ErrorResponse(400, ex.getMessage()));
    }
}

public record ErrorResponse(int status, String message, LocalDateTime timestamp) {
    public ErrorResponse(int status, String message) {
        this(status, message, LocalDateTime.now());
    }
}
```

### 13.3 Pagination Standard

```java
// Réponse paginée standard
public record PageResponse<T>(
    List<T> content,
    int page,
    int size,
    long totalElements,
    int totalPages,
    boolean hasNext,
    boolean hasPrevious
) {
    public static <T> PageResponse<T> from(Page<T> page) {
        return new PageResponse<>(
            page.getContent(),
            page.getNumber(),
            page.getSize(),
            page.getTotalElements(),
            page.getTotalPages(),
            page.hasNext(),
            page.hasPrevious()
        );
    }
}
```

### 13.4 Configuration CORS

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:3000", "https://sportconnect.app")
            .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true)
            .maxAge(3600);
    }
}
```

### 13.5 File Upload Service

```java
@Service
public class FileUploadService {
    
    // Types autorisés
    private final Set<String> ALLOWED_IMAGE_TYPES = Set.of("image/jpeg", "image/png", "image/gif", "image/webp");
    private final Set<String> ALLOWED_VIDEO_TYPES = Set.of("video/mp4", "video/webm", "video/quicktime");
    private final Set<String> ALLOWED_DOCUMENT_TYPES = Set.of("application/pdf", "application/msword");
    
    // Tailles maximales
    private final long MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
    private final long MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
    private final long MAX_DOCUMENT_SIZE = 10 * 1024 * 1024; // 10MB
    
    public String uploadAvatar(MultipartFile file, UUID userId);
    public String uploadBanner(MultipartFile file, UUID userId);
    public String uploadPostMedia(MultipartFile file, UUID postId);
    public String uploadVideo(MultipartFile file, UUID userId);
    public String uploadDocument(MultipartFile file, String category);
    
    public void deleteFile(String fileUrl);
}
```

---

## 📁 14. Structure du Projet Spring Boot

```
src/
├── main/
│   ├── java/com/sportconnect/
│   │   ├── SportConnectApplication.java
│   │   │
│   │   ├── config/
│   │   │   ├── SecurityConfig.java
│   │   │   ├── JwtConfig.java
│   │   │   ├── WebSocketConfig.java
│   │   │   ├── CorsConfig.java
│   │   │   ├── RedisConfig.java
│   │   │   ├── ElasticsearchConfig.java
│   │   │   └── S3Config.java
│   │   │
│   │   ├── security/
│   │   │   ├── JwtTokenProvider.java
│   │   │   ├── JwtAuthenticationFilter.java
│   │   │   ├── UserDetailsServiceImpl.java
│   │   │   └── CustomAuthenticationEntryPoint.java
│   │   │
│   │   ├── entity/
│   │   │   ├── user/
│   │   │   │   ├── User.java
│   │   │   │   ├── UserProfile.java
│   │   │   │   ├── CareerHistory.java
│   │   │   │   ├── Achievement.java
│   │   │   │   └── ...
│   │   │   ├── club/
│   │   │   │   ├── Club.java
│   │   │   │   ├── ClubPlayer.java
│   │   │   │   ├── ClubStaff.java
│   │   │   │   └── ...
│   │   │   ├── post/
│   │   │   │   ├── Post.java
│   │   │   │   ├── Comment.java
│   │   │   │   └── ...
│   │   │   ├── job/
│   │   │   │   ├── JobPost.java
│   │   │   │   ├── JobApplication.java
│   │   │   │   └── ...
│   │   │   ├── messaging/
│   │   │   │   ├── Conversation.java
│   │   │   │   ├── Message.java
│   │   │   │   └── ...
│   │   │   └── ...
│   │   │
│   │   ├── repository/
│   │   │   ├── UserRepository.java
│   │   │   ├── ClubRepository.java
│   │   │   ├── PostRepository.java
│   │   │   └── ...
│   │   │
│   │   ├── service/
│   │   │   ├── auth/
│   │   │   │   ├── AuthService.java
│   │   │   │   └── AuthServiceImpl.java
│   │   │   ├── user/
│   │   │   │   ├── UserService.java
│   │   │   │   └── ProfileService.java
│   │   │   ├── club/
│   │   │   │   ├── ClubService.java
│   │   │   │   └── ClubManagementService.java
│   │   │   ├── feed/
│   │   │   │   ├── FeedService.java
│   │   │   │   └── PostService.java
│   │   │   ├── job/
│   │   │   │   └── JobService.java
│   │   │   ├── messaging/
│   │   │   │   └── MessagingService.java
│   │   │   ├── notification/
│   │   │   │   └── NotificationService.java
│   │   │   ├── search/
│   │   │   │   └── SearchService.java
│   │   │   └── file/
│   │   │       └── FileUploadService.java
│   │   │
│   │   ├── controller/
│   │   │   ├── AuthController.java
│   │   │   ├── UserController.java
│   │   │   ├── ProfileController.java
│   │   │   ├── ClubController.java
│   │   │   ├── MyClubController.java
│   │   │   ├── FeedController.java
│   │   │   ├── PostController.java
│   │   │   ├── JobController.java
│   │   │   ├── NetworkController.java
│   │   │   ├── MessagingController.java
│   │   │   ├── NotificationController.java
│   │   │   ├── SearchController.java
│   │   │   ├── GroupController.java
│   │   │   └── AdminController.java
│   │   │
│   │   ├── dto/
│   │   │   ├── request/
│   │   │   │   ├── RegisterRequest.java
│   │   │   │   ├── CreatePostRequest.java
│   │   │   │   └── ...
│   │   │   └── response/
│   │   │       ├── UserDTO.java
│   │   │       ├── ClubDTO.java
│   │   │       └── ...
│   │   │
│   │   ├── mapper/
│   │   │   ├── UserMapper.java
│   │   │   ├── ClubMapper.java
│   │   │   └── ...
│   │   │
│   │   ├── exception/
│   │   │   ├── GlobalExceptionHandler.java
│   │   │   ├── ResourceNotFoundException.java
│   │   │   ├── UnauthorizedException.java
│   │   │   └── ValidationException.java
│   │   │
│   │   ├── websocket/
│   │   │   ├── ChatWebSocketHandler.java
│   │   │   └── PresenceWebSocketHandler.java
│   │   │
│   │   ├── event/
│   │   │   ├── UserCreatedEvent.java
│   │   │   ├── PostLikedEvent.java
│   │   │   └── ...
│   │   │
│   │   └── util/
│   │       ├── SlugUtil.java
│   │       ├── DateUtil.java
│   │       └── ...
│   │
│   └── resources/
│       ├── application.yml
│       ├── application-dev.yml
│       ├── application-prod.yml
│       └── db/migration/     # Flyway migrations
│           ├── V1__create_users_table.sql
│           ├── V2__create_clubs_table.sql
│           └── ...
│
└── test/
    └── java/com/sportconnect/
        ├── controller/
        ├── service/
        └── repository/
```

---

## 🚀 15. Déploiement & DevOps

### 15.1 Docker Compose (Environnement de développement)

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      SPRING_PROFILES_ACTIVE: dev
      DATABASE_URL: jdbc:postgresql://db:5432/sportconnect
      REDIS_HOST: redis
      ELASTICSEARCH_HOST: elasticsearch
    depends_on:
      - db
      - redis
      - elasticsearch
  
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: sportconnect
      POSTGRES_USER: sportconnect
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
  
  elasticsearch:
    image: elasticsearch:8.9.0
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
    ports:
      - "9200:9200"
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data
  
  minio:
    image: minio/minio
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    ports:
      - "9000:9000"
      - "9001:9001"
    volumes:
      - minio_data:/data

volumes:
  postgres_data:
  elasticsearch_data:
  minio_data:
```

### 15.2 Variables d'environnement requises

```properties
# Database
DATABASE_URL=jdbc:postgresql://localhost:5432/sportconnect
DATABASE_USERNAME=sportconnect
DATABASE_PASSWORD=

# JWT
JWT_SECRET=your-256-bit-secret
JWT_EXPIRATION=900000
JWT_REFRESH_EXPIRATION=604800000

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Elasticsearch
ELASTICSEARCH_HOST=localhost
ELASTICSEARCH_PORT=9200

# S3/MinIO
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY=
S3_SECRET_KEY=
S3_BUCKET=sportconnect

# Mail
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=
MAIL_PASSWORD=

# Firebase (Push notifications)
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
```

---

## ✅ 16. Checklist de Développement

### Phase 1 - Foundation (Semaines 1-2)
- [ ] Setup projet Spring Boot avec structure
- [ ] Configuration PostgreSQL + Flyway
- [ ] Module Auth (Register, Login, JWT)
- [ ] Entités User et UserProfile
- [ ] CRUD basique User

### Phase 2 - Profil & Feed (Semaines 3-4)
- [ ] Profil complet (carrière, stats, vidéos)
- [ ] Module Posts (CRUD)
- [ ] Likes et Commentaires
- [ ] Upload de médias (S3)
- [ ] Feed avec pagination

### Phase 3 - Réseau & Clubs (Semaines 5-6)
- [ ] Module Connexions
- [ ] Suggestions de connexions
- [ ] CRUD Clubs
- [ ] Gestion membres clubs
- [ ] Gestion joueurs clubs
- [ ] Gestion staff clubs

### Phase 4 - Jobs & Search (Semaines 7-8)
- [ ] Module JobPost
- [ ] Candidatures
- [ ] Elasticsearch setup
- [ ] Recherche multi-critères
- [ ] Auto-complétion

### Phase 5 - Messaging & Notifications (Semaines 9-10)
- [ ] Module Conversations
- [ ] Messages REST
- [ ] WebSocket temps réel
- [ ] Module Notifications
- [ ] Push notifications

### Phase 6 - Advanced Features (Semaines 11-12)
- [ ] Module Groupes
- [ ] Analytics & Stats
- [ ] Admin Dashboard API
- [ ] Optimisation performances
- [ ] Tests complets

---

## 📚 17. Ressources & Documentation

### Documentation API
- Swagger UI disponible sur `/swagger-ui.html`
- OpenAPI spec sur `/v3/api-docs`

### Format des réponses API

```json
// Succès
{
    "success": true,
    "data": { ... },
    "message": "Operation successful"
}

// Erreur
{
    "success": false,
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "Invalid input",
        "details": [
            {"field": "email", "message": "Email invalide"}
        ]
    },
    "timestamp": "2026-02-05T10:30:00Z"
}

// Liste paginée
{
    "success": true,
    "data": {
        "content": [...],
        "page": 0,
        "size": 20,
        "totalElements": 156,
        "totalPages": 8,
        "hasNext": true,
        "hasPrevious": false
    }
}
```

---

## 📝 Notes Finales

Ce cahier des charges couvre l'ensemble des fonctionnalités visibles dans le frontend:

1. **Authentification** complète avec JWT
2. **Profils utilisateurs** riches avec carrière, stats, vidéos
3. **Feed social** avec posts, likes, commentaires, partages
4. **Gestion de clubs** complète avec joueurs, staff, matchs, statistiques
5. **Offres d'emploi** avec candidatures
6. **Messagerie** temps réel
7. **Système de notifications**
8. **Recherche avancée**
9. **Groupes thématiques**

L'implémentation doit respecter les bonnes pratiques REST, la sécurité (JWT, validation, sanitization), et les performances (pagination, caching, indexation).

---

*Document le 5 février 2026*
*Version 1.0*
