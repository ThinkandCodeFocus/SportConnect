"use client";

import { useState } from "react";
import { Post, User } from "@/lib/types/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Trash2,
  Edit,
  Flag,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Comments } from "./comments";

interface PostCardProps {
  post: Post;
  currentUser: User | null;
  onLike: (postId: string) => void;
  onUnlike: (postId: string) => void;
  onDelete: (postId: string) => void;
}

export function PostCard({ post, currentUser, onLike, onUnlike, onDelete }: PostCardProps) {
  const [commentsCount, setCommentsCount] = useState(post.commentsCount);
  const isOwnPost = currentUser?.id === post.authorId;
  const author = post.author;
  
  const getAuthorInitials = () => {
    if (!author) return "U";
    return `${author.firstName?.[0] || ""}${author.lastName?.[0] || ""}`.toUpperCase();
  };

  const getTimeAgo = () => {
    try {
      return formatDistanceToNow(new Date(post.createdAt), {
        addSuffix: true,
        locale: fr,
      });
    } catch {
      return "récemment";
    }
  };

  const getRoleLabel = (role: string) => {
    const roleLabels: Record<string, string> = {
      PLAYER: "Joueur",
      COACH: "Entraîneur",
      AGENT: "Agent",
      SCOUT: "Recruteur",
      CLUB_ADMIN: "Admin Club",
      FAN: "Fan",
    };
    return roleLabels[role] || role;
  };

  return (
    <Card>
      <CardContent className="pt-6">
        {/* Author Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={author?.username} />
              <AvatarFallback>{getAuthorInitials()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-foreground">
                {author ? `${author.firstName} ${author.lastName}` : "Utilisateur"}
              </p>
              <p className="text-sm text-muted-foreground">
                {author && getRoleLabel(author.role)} • {getTimeAgo()}
              </p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isOwnPost ? (
                <>
                  <DropdownMenuItem>
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => onDelete(post.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem>
                    <Flag className="h-4 w-4 mr-2" />
                    Signaler
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Post Content */}
        <div className="space-y-3">
          <p className="text-foreground whitespace-pre-wrap">{post.content}</p>

          {/* Media */}
          {post.mediaUrl && (
            <div className="rounded-lg overflow-hidden">
              {post.type === "IMAGE" && (
                <img
                  src={post.mediaUrl}
                  alt="Post media"
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/600x400?text=Image+non+disponible";
                  }}
                />
              )}
              {post.type === "VIDEO" && (
                <video
                  src={post.mediaUrl}
                  controls
                  className="w-full h-auto"
                >
                  Votre navigateur ne supporte pas la lecture de vidéos.
                </video>
              )}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 my-3 text-sm text-muted-foreground">
          {post.likesCount > 0 && (
            <span>{post.likesCount} {post.likesCount === 1 ? "j'aime" : "j'aimes"}</span>
          )commentsCount > 0 && (
            <span>{commentsCount} {
            <span>{post.commentsCount} {post.commentsCount === 1 ? "commentaire" : "commentaires"}</span>
          )}
          {post.sharesCount > 0 && (
            <span>{post.sharesCount} {post.sharesCount === 1 ? "partage" : "partages"}</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1"
            onClick={() => {
              // TODO: Implémenter la logique pour vérifier si déjà liké
              onLike(post.id);
            }}
          >
            <Heart className="h-4 w-4 mr-2" />
            J'aime
          </Button>

          <Button variant="ghost" size="sm" className="flex-1">
            <Share2 className="h-4 w-4 mr-2" />
            Partager
          </Button>
        </div>

        {/* Comments Section */}
        <Comments
          postId={post.id}
          currentUser={currentUser}
          commentsCount={commentsCount}
          onCommentAdded={() => setCommentsCount(commentsCount + 1)}
        />
      </CardContent>
    </Card>
  );
}
