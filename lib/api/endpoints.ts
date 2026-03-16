import apiClient from "./client";
import {
  User,
  UserProfile,
  RegisterRequest,
  LoginRequest,
  LogoutRequest,
  AuthResponse,
  Post,
  CreatePostRequest,
  Comment,
  Club,
  ClubMember,
  JobPost,
  JobApplication,
  Message,
  Conversation,
  Notification,
  Connection,
} from "@/lib/types/api";

// ===========================
// AUTH ENDPOINTS
// ===========================

export const authAPI = {
  register: (data: RegisterRequest) =>
    apiClient.post<AuthResponse>("/api/auth/register", data),

  login: (data: LoginRequest) =>
    apiClient.post<AuthResponse>("/api/auth/login", data),

  logout: (data: LogoutRequest) =>
    apiClient.post("/api/auth/logout", data),

  me: () =>
    apiClient.get<User>("/api/auth/me"),
};

// ===========================
// USER ENDPOINTS
// ===========================

export const userAPI = {
  getById: (id: string) =>
    apiClient.get<User>(`/api/users/${id}`),

  getByEmail: (email: string) =>
    apiClient.get<User>(`/api/users/email/${email}`),

  getByUsername: (username: string) =>
    apiClient.get<User>(`/api/users/username/${username}`),

  update: (id: string, data: Partial<User>) =>
    apiClient.put<User>(`/api/users/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/api/users/${id}`),

  getProfile: (id: string) =>
    apiClient.get<UserProfile>(`/api/users/${id}/profile`),

  createProfile: (id: string, data: Partial<UserProfile>) =>
    apiClient.post<UserProfile>(`/api/users/${id}/profile`, data),

  updateProfile: (id: string, data: Partial<UserProfile>) =>
    apiClient.put<UserProfile>(`/api/users/${id}/profile`, data),
};

// ===========================
// POST ENDPOINTS
// ===========================

export const postAPI = {
  getById: (id: string) =>
    apiClient.get<Post>(`/api/posts/${id}`),

  getByUser: (userId: string) =>
    apiClient.get<Post[]>(`/api/posts/user/${userId}`),

  getByClub: (clubId: string) =>
    apiClient.get<Post[]>(`/api/posts/club/${clubId}`),

  getFeed: (limit?: number, offset?: number) =>
    apiClient.get<Post[]>("/api/posts/feed", { 
      params: { limit, offset } 
    }),

  isLiked: (postId: string, userId: string) =>
    apiClient.get<{ isLiked: boolean }>(`/api/posts/${postId}/liked/${userId}`),

  create: (data: CreatePostRequest) =>
    apiClient.post<Post>("/api/posts", data),

  update: (id: string, data: Partial<Post>) =>
    apiClient.put<Post>(`/api/posts/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/api/posts/${id}`),

  like: (id: string, userId: string) =>
    apiClient.post(`/api/posts/${id}/like`, { userId }),

  unlike: (id: string, userId: string) =>
    apiClient.delete(`/api/posts/${id}/like`, { data: { userId } }),

  save: (id: string, userId: string) =>
    apiClient.post(`/api/posts/${id}/save`, { userId }),

  unsave: (id: string, userId: string) =>
    apiClient.delete(`/api/posts/${id}/save`, { data: { userId } }),

  share: (id: string, userId: string) =>
    apiClient.post(`/api/posts/${id}/share`, { userId }),
};

// ===========================
// COMMENT ENDPOINTS
// ===========================

export const commentAPI = {
  getByPost: (postId: string) =>
    apiClient.get<Comment[]>(`/api/comments/post/${postId}`),

  create: (data: { postId: string; content: string; authorId: string }) =>
    apiClient.post<Comment>("/api/comments", data),

  update: (id: string, content: string) =>
    apiClient.put<Comment>(`/api/comments/${id}`, { content }),

  delete: (id: string) =>
    apiClient.delete(`/api/comments/${id}`),
};

// ===========================
// CLUB ENDPOINTS
// ===========================

export const clubAPI = {
  getAll: () =>
    apiClient.get<Club[]>("/api/clubs"),

  getById: (id: string) =>
    apiClient.get<Club>(`/api/clubs/${id}`),

  getByType: (type: string) =>
    apiClient.get<Club[]>(`/api/clubs/type/${type}`),

  getBySport: (sport: string) =>
    apiClient.get<Club[]>(`/api/clubs/sport/${sport}`),

  getByCountry: (country: string) =>
    apiClient.get<Club[]>(`/api/clubs/country/${country}`),

  create: (data: Partial<Club>) =>
    apiClient.post<Club>("/api/clubs", data),

  update: (id: string, data: Partial<Club>) =>
    apiClient.put<Club>(`/api/clubs/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/api/clubs/${id}`),

  getMembers: (id: string) =>
    apiClient.get<ClubMember[]>(`/api/clubs/${id}/members`),

  addMember: (id: string, data: { userId: string; role: string }) =>
    apiClient.post<ClubMember>(`/api/clubs/${id}/members`, data),

  removeMember: (clubId: string, memberId: string) =>
    apiClient.delete(`/api/clubs/${clubId}/members/${memberId}`),
};

// ===========================
// JOB ENDPOINTS
// ===========================

export const jobAPI = {
  getAll: () =>
    apiClient.get<JobPost[]>("/api/jobs"),

  getById: (id: string) =>
    apiClient.get<JobPost>(`/api/jobs/${id}`),

  getByClub: (clubId: string) =>
    apiClient.get<JobPost[]>(`/api/jobs/club/${clubId}`),

  getByType: (type: string) =>
    apiClient.get<JobPost[]>(`/api/jobs/type/${type}`),

  create: (data: Partial<JobPost>) =>
    apiClient.post<JobPost>("/api/jobs", data),

  update: (id: string, data: Partial<JobPost>) =>
    apiClient.put<JobPost>(`/api/jobs/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/api/jobs/${id}`),

  apply: (jobId: string, data: { userId: string; coverLetter?: string }) =>
    apiClient.post<JobApplication>(`/api/jobs/${jobId}/apply`, data),

  getApplications: (jobId: string) =>
    apiClient.get<JobApplication[]>(`/api/jobs/${jobId}/applications`),
};

// ===========================
// MESSAGE ENDPOINTS
// ===========================

export const messageAPI = {
  getConversations: (userId: string) =>
    apiClient.get<Conversation[]>(`/api/messages/conversations/${userId}`),

  getConversation: (id: string) =>
    apiClient.get<Conversation>(`/api/messages/conversations/detail/${id}`),

  getMessages: (conversationId: string) =>
    apiClient.get<Message[]>(`/api/messages/conversation/${conversationId}`),

  send: (data: { conversationId: string; senderId: string; content: string; type?: string }) =>
    apiClient.post<Message>("/api/messages", data),

  markAsRead: (messageId: string, userId: string) =>
    apiClient.post(`/api/messages/${messageId}/read`, { userId }),

  createConversation: (data: { participants: string[] }) =>
    apiClient.post<Conversation>("/api/messages/conversations", data),
};

// ===========================
// NOTIFICATION ENDPOINTS
// ===========================

export const notificationAPI = {
  getByUser: (userId: string) =>
    apiClient.get<Notification[]>(`/api/notifications/user/${userId}`),

  markAsRead: (id: string) =>
    apiClient.put(`/api/notifications/${id}/read`),

  markAllAsRead: (userId: string) =>
    apiClient.put(`/api/notifications/user/${userId}/read-all`),

  delete: (id: string) =>
    apiClient.delete(`/api/notifications/${id}`),
};

// ===========================
// CONNECTION ENDPOINTS
// ===========================

export const connectionAPI = {
  getByUser: (userId: string) =>
    apiClient.get<Connection[]>(`/api/connections/user/${userId}`),

  getPending: (userId: string) =>
    apiClient.get<Connection[]>(`/api/connections/user/${userId}/pending`),

  send: (data: { requesterId: string; addresseeId: string }) =>
    apiClient.post<Connection>("/api/connections", data),

  accept: (id: string) =>
    apiClient.put(`/api/connections/${id}/accept`),

  reject: (id: string) =>
    apiClient.put(`/api/connections/${id}/reject`),

  cancel: (id: string) =>
    apiClient.delete(`/api/connections/${id}`),

  block: (id: string) =>
    apiClient.put(`/api/connections/${id}/block`),
};

// Export all APIs
export default {
  auth: authAPI,
  user: userAPI,
  post: postAPI,
  comment: commentAPI,
  club: clubAPI,
  job: jobAPI,
  message: messageAPI,
  notification: notificationAPI,
  connection: connectionAPI,
};
