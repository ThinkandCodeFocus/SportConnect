// ===========================
// USER & AUTH TYPES
// ===========================

export type UserRole = 
  | "PLAYER" 
  | "AGENT" 
  | "COACH" 
  | "CLUB_ADMIN" 
  | "SCOUT" 
  | "FAN";

export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  active: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  profile?: {
    photoUrl?: string;
  };
}

export interface UserProfile {
  id: string;
  bio?: string;
  location?: string;
  country?: string;
  birthDate?: string;
  gender?: string;
  profilePicture?: string;
  coverPhoto?: string;
  position?: string;
  currentClub?: string;
  experience?: string;
  languages?: string[];
  skills?: string[];
  achievements?: string[];
  createdAt: string;
  updatedAt: string;
}

// ===========================
// AUTH TYPES
// ===========================

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  userId: string;
  email: string;
  username: string;
  role: UserRole;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LogoutRequest {
  refreshToken: string;
}

// ===========================
// POST TYPES
// ===========================

export interface Post {
  id: string;
  content: string;
  authorId: string;
  clubId?: string;
  type: "TEXT" | "IMAGE" | "VIDEO" | "JOB" | "PERFORMANCE";
  mediaUrl?: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  createdAt: string;
  updatedAt: string;
  author?: User;
}

export interface CreatePostRequest {
  content: string;
  type: "TEXT" | "IMAGE" | "VIDEO" | "JOB" | "PERFORMANCE";
  mediaUrl?: string;
  clubId?: string;
}

export interface Comment {
  id: string;
  content: string;
  postId: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  author?: User;
}

// ===========================
// CLUB TYPES
// ===========================

export interface Club {
  id: string;
  name: string;
  logo?: string;
  shortName?: string;
  type: string;
  sport: string;
  league?: string;
  level?: string;
  location?: string;
  country?: string;
  city?: string;
  foundedYear?: number;
  stadium?: string;
  stadiumCapacity?: number;
  description?: string;
  website?: string;
  email?: string;
  phone?: string;
  twitterUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  bannerUrl?: string;
  followersCount: number;
  employeesCount?: number;
  openPositionsCount?: number;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ClubMember {
  id: string;
  clubId: string;
  userId: string;
  role: "OWNER" | "ADMIN" | "MEMBER" | "PLAYER" | "COACH" | "STAFF";
  joinedAt: string;
}

// ===========================
// JOB TYPES
// ===========================

export interface JobPost {
  id: string;
  clubId?: string;
  postedById: string;
  title: string;
  type: string;
  sport?: string;
  description?: string;
  location?: string;
  salaryRange?: string;
  contractType?: string;
  deadline?: string;
  isRemote?: boolean;
  category?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  club?: Club;
  postedBy?: User;
}

// Alias pour compatibilité avec les composants
export type Job = JobPost;

export interface JobApplication {
  id: string;
  jobPostId: string;
  userId: string;
  coverLetter?: string;
  status: "PENDING" | "REVIEWED" | "ACCEPTED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
}

// ===========================
// MESSAGE TYPES
// ===========================

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content?: string;
  type: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  replyToId?: string;
  isEdited: boolean;
  isDeleted: boolean;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  sender?: User;
  receiver?: User;
}

// ===========================
// NOTIFICATION TYPES
// ===========================

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title?: string;
  content?: string;
  actorId?: string;
  entityType?: string;
  entityId?: string;
  imageUrl?: string;
  actionUrl?: string;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
  sender?: User;
}

// ===========================
// CONNECTION TYPES
// ===========================

export interface Connection {
  id: string;
  requesterId: string;
  addresseeId: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "BLOCKED";
  createdAt: string;
  updatedAt: string;
  requester?: User;
  addressee?: User;
}

// ===========================
// API RESPONSE TYPES
// ===========================

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string>;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
  last: boolean;
  first: boolean;
}
