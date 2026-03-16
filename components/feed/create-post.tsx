"use client";

import { useState } from "react";
import { User, CreatePostRequest } from "@/lib/types/api";
import api from "@/lib/api/endpoints";
import {
  ImageIcon,
  Video,
  Trophy,
  X,
  Loader2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const postTypes = [
  { id: "TEXT", icon: ImageIcon, label: "Texte", color: "text-blue-600" },
  { id: "IMAGE", icon: ImageIcon, label: "Photo", color: "text-green-600" },
  { id: "VIDEO", icon: Video, label: "Vidéo", color: "text-red-600" },
  { id: "PERFORMANCE", icon: Trophy, label: "Performance", color: "text-yellow-600" },
];

interface CreatePostProps {
  onPostCreated: (post: any) => void;
  currentUser: User;
}

export function CreatePost({ onPostCreated, currentUser }: CreatePostProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState<"TEXT" | "IMAGE" | "VIDEO" | "PERFORMANCE">("TEXT");
  const [mediaUrl, setMediaUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const getUserInitials = () => {
    return `${currentUser.firstName?.[0] || ""}${currentUser.lastName?.[0] || ""}`.toUpperCase();
  };

  const resetForm = () => {
    setContent("");
    setPostType("TEXT");
    setMediaUrl("");
    setError("");
  };

  const handlePublish = async () => {
    if (!content.trim()) {
      setError("Le contenu ne peut pas être vide");
      return;
    }

    if ((postType === "IMAGE" || postType === "VIDEO") && !mediaUrl.trim()) {
      setError("Veuillez fournir une URL pour le média");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const postData: CreatePostRequest = {
        content: content.trim(),
        type: postType,
        mediaUrl: mediaUrl.trim() || undefined,
      };

      const response = await api.post.create(postData);
      onPostCreated(response.data);
      resetForm();
      setIsOpen(false);
    } catch (err: any) {
      console.error("Failed to create post:", err);
      setError(err.message || "Échec de la publication");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <div className="flex items-center gap-4 cursor-pointer">
              <Avatar className="h-10 w-10">
                <AvatarImage src={currentUser.username} />
                <AvatarFallback>{getUserInitials()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 h-12 px-4 border border-border rounded-full flex items-center text-muted-foreground hover:bg-secondary transition-colors">
                Commencer un post...
              </div>
            </div>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Créer un post</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {/* User Info */}
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={currentUser.username} />
                  <AvatarFallback>{getUserInitials()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">
                    {currentUser.firstName} {currentUser.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">Public</p>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Post Type Selection */}
              <div className="flex gap-2">
                {postTypes.map((type) => (
                  <Button
                    key={type.id}
                    variant={postType === type.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPostType(type.id as any)}
                    disabled={isSubmitting}
                  >
                    <type.icon className={`h-4 w-4 mr-1 ${postType === type.id ? "" : type.color}`} />
                    {type.label}
                  </Button>
                ))}
              </div>

              {/* Content */}
              <Textarea
                placeholder="Que voulez-vous partager ?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={isSubmitting}
                className="min-h-[120px] resize-none"
              />

              {/* Media URL Input */}
              {(postType === "IMAGE" || postType === "VIDEO") && (
                <div className="space-y-2">
                  <input
                    type="url"
                    placeholder={`URL de ${postType === "IMAGE" ? "l'image" : "la vidéo"}`}
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-border rounded-md"
                  />
                  {mediaUrl && (
                    <div className="relative">
                      {postType === "IMAGE" ? (
                        <img
                          src={mediaUrl}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-md"
                          onError={(e) => {
                            e.currentTarget.src = "https://via.placeholder.com/400x200?text=Image+non+disponible";
                          }}
                        />
                      ) : (
                        <div className="w-full h-48 bg-secondary rounded-md flex items-center justify-center">
                          <Video className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => setMediaUrl("")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    setIsOpen(false);
                  }}
                  disabled={isSubmitting}
                >
                  Annuler
                </Button>
                <Button onClick={handlePublish} disabled={isSubmitting || !content.trim()}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Publication...
                    </>
                  ) : (
                    "Publier"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Quick Action Buttons */}
        <div className="flex gap-2 mt-4">
          {postTypes.slice(0, 4).map((type) => (
            <Button
              key={type.id}
              variant="ghost"
              size="sm"
              className="flex-1"
              onClick={() => {
                setPostType(type.id as any);
                setIsOpen(true);
              }}
            >
              <type.icon className={`h-4 w-4 mr-1 ${type.color}`} />
              <span className="hidden sm:inline">{type.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
