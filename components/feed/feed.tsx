"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api/endpoints";
import { Post } from "@/lib/types/api";
import { CreatePost } from "./create-post";
import { PostCard } from "./post-card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function Feed() {
  const { user, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "my-posts">("all");

  useEffect(() => {
    loadPosts();
  }, [filter, user]);

  const loadPosts = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      let response;
      
      if (filter === "my-posts" && user) {
        // Charger uniquement les posts de l'utilisateur
        response = await api.post.getByUser(user.id);
      } else {
        // Charger le feed global (tous les posts)
        response = await api.post.getFeed(50, 0);
      }
      
      setPosts(response.data);
    } catch (err: any) {
      console.error("Failed to load posts:", err);
      setError(err.message || "Échec du chargement des posts");
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostCreated = (newPost: Post) => {
    setPosts([newPost, ...posts]);
  };

  const handleLike = async (postId: string) => {
    if (!user) return;

    try {
      // Optimistic update
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likesCount: post.likesCount + 1,
          };
        }
        return post;
      }));

      await api.post.like(postId, user.id);
    } catch (err) {
      console.error("Failed to like post:", err);
      // Revert optimistic update
      loadPosts();
    }
  };

  const handleUnlike = async (postId: string) => {
    if (!user) return;

    try {
      // Optimistic update
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likesCount: Math.max(0, post.likesCount - 1),
          };
        }
        return post;
      }));

      await api.post.unlike(postId, user.id);
    } catch (err) {
      console.error("Failed to unlike post:", err);
      // Revert optimistic update
      loadPosts();
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce post ?")) {
      return;
    }

    try {
      await api.post.delete(postId);
      setPosts(posts.filter(post => post.id !== postId));
    } catch (err: any) {
      console.error("Failed to delete post:", err);
      alert(err.message || "Échec de la suppression");
    }
  };

  return (
    <div className="flex-1 space-y-4">
      {/* Create Post */}
      {isAuthenticated && user && (
        <CreatePost onPostCreated={handlePostCreated} currentUser={user} />
      )}

      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={(v) => setFilter(v as "all" | "my-posts")}>
        <TabsList className="w-full">
          <TabsTrigger value="all" className="flex-1">
            Tout
          </TabsTrigger>
          <TabsTrigger value="my-posts" className="flex-1">
            Mes posts
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Posts List */}
      {!isLoading && posts.length === 0 && (
        <div className="bg-card rounded-lg border border-border p-12 text-center">
          <p className="text-muted-foreground">
            {filter === "my-posts" 
              ? "Vous n'avez pas encore publié de posts" 
              : "Aucun post disponible"}
          </p>
        </div>
      )}

      {!isLoading && posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          currentUser={user}
          onLike={handleLike}
          onUnlike={handleUnlike}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
