"use client";

import { useState, useEffect } from "react";
import { Comment, User } from "@/lib/types/api";
import api from "@/lib/api/endpoints";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send } from "lucide-react";

interface CommentsProps {
  postId: string;
  currentUser: User | null;
  commentsCount: number;
  onCommentAdded?: () => void;
}

export function Comments({ postId, currentUser, commentsCount, onCommentAdded }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (showComments && comments.length === 0) {
      loadComments();
    }
  }, [showComments]);

  const loadComments = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const response = await api.comment.getByPost(postId);
      setComments(response.data);
    } catch (err: any) {
      console.error("Failed to load comments:", err);
      setError(err.message || "Échec du chargement des commentaires");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim() || !currentUser) return;
    
    setIsSubmitting(true);
    setError("");
    
    try {
      const response = await api.comment.create({
        postId,
        content: newComment.trim(),
        authorId: currentUser.id,
      });
      
      setComments([...comments, response.data]);
      setNewComment("");
      
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (err: any) {
      console.error("Failed to add comment:", err);
      setError(err.message || "Échec de l'ajout du commentaire");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm("Supprimer ce commentaire ?")) return;
    
    try {
      await api.comment.delete(commentId);
      setComments(comments.filter(c => c.id !== commentId));
    } catch (err: any) {
      console.error("Failed to delete comment:", err);
      alert(err.message || "Échec de la suppression");
    }
  };

  return (
    <div className="border-t border-border pt-3">
      {/* Toggle Comments Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowComments(!showComments)}
        className="text-muted-foreground hover:text-foreground"
      >
        {showComments ? "Masquer" : "Voir"} les commentaires ({commentsCount})
      </Button>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-3 space-y-3">
          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          {/* Comments List */}
          {!isLoading && comments.length === 0 && (
            <p className="text-sm text-muted-foreground">Aucun commentaire pour le moment</p>
          )}

          {!isLoading && comments.map((comment) => (
            <div key={comment.id} className="flex gap-2 text-sm">
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.author?.profile?.photoUrl || undefined} />
                <AvatarFallback>
                  {comment.author?.firstName?.[0]}{comment.author?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="bg-accent rounded-lg p-2">
                  <p className="font-medium text-foreground">
                    {comment.author?.firstName} {comment.author?.lastName}
                  </p>
                  <p className="text-foreground whitespace-pre-wrap break-words">
                    {comment.content}
                  </p>
                </div>
                
                <div className="flex items-center gap-3 mt-1 px-2">
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.createdAt), {
                      addSuffix: true,
                      locale: fr,
                    })}
                  </span>
                  
                  {currentUser && comment.authorId === currentUser.id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(comment.id)}
                      className="h-auto p-0 text-xs text-muted-foreground hover:text-destructive"
                    >
                      Supprimer
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Add Comment Form */}
          {currentUser && (
            <form onSubmit={handleSubmit} className="flex gap-2 items-start">
              <Avatar className="h-8 w-8">
                <AvatarImage src={currentUser.profile?.photoUrl || undefined} />
                <AvatarFallback>
                  {currentUser.firstName[0]}{currentUser.lastName[0]}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Écrire un commentaire..."
                  className="min-h-[60px] resize-none"
                  disabled={isSubmitting}
                />
              </div>
              
              <Button
                type="submit"
                size="icon"
                disabled={!newComment.trim() || isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          )}

          {!currentUser && (
            <p className="text-sm text-muted-foreground">
              Connectez-vous pour commenter
            </p>
          )}
        </div>
      )}
    </div>
  );
}
