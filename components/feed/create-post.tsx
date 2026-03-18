"use client";

import { useState, useRef } from "react";
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getUserInitials = () => {
    return `${currentUser.firstName?.[0] || ""}${currentUser.lastName?.[0] || ""}`.toUpperCase();
  };

  const resetForm = () => {
    setContent("");
    setPostType("TEXT");
    setMediaUrl("");
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle file upload and convert to base64
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Le fichier est trop volumineux (max 5MB)");
      return;
    }

    // Vérifier le type de fichier
    if (!file.type.startsWith("image/")) {
      setError("Veuillez sélectionner une image valide");
      return;
    }

    // Convertir en base64
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      setMediaUrl(base64String);
      setError("");
    };
    reader.onerror = () => {
      setError("Erreur lors de la lecture du fichier");
    };
    reader.readAsDataURL(file);
  };

  const handlePublish = async () => {
    if (!content.trim()) {
      setError("Le contenu ne peut pas être vide");
      return;
    }

    if (postType === "IMAGE" && !mediaUrl.trim()) {
      setError("Veuillez sélectionner une photo");
      return;
    }

    if (postType === "VIDEO" && !mediaUrl.trim()) {
      setError("Veuillez fournir une URL pour la vidéo");
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

          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Créer un post</DialogTitle>
            </DialogHeader>

            <div className="space-y-3 sm:space-y-4">
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
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {postTypes.map((type) => (
                  <Button
                    key={type.id}
                    variant={postType === type.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPostType(type.id as any)}
                    disabled={isSubmitting}
                    className="text-xs sm:text-sm"
                  >
                    <type.icon className={`h-4 w-4 ${postType === type.id ? "mr-1" : "mr-0.5 sm:mr-1"} ${postType === type.id ? "" : type.color}`} />
                    <span className="hidden sm:inline">{type.label}</span>
                    <span className="sm:hidden">{type.label.substring(0, 2)}</span>
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

              {/* Media Upload/URL Input */}
              {postType === "IMAGE" && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Sélectionner une photo
                  </label>
                  <div 
                    className="border-2 border-dashed border-border rounded-lg p-4 cursor-pointer hover:bg-secondary transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      disabled={isSubmitting}
                      className="hidden"
                    />
                    <div className="text-center">
                      {!mediaUrl ? (
                        <>
                          <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Cliquez pour sélectionner une photo
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Photo sélectionnée
                        </p>
                      )}
                    </div>
                  </div>
                  {mediaUrl && (
                    <div className="relative">
                      <img
                        src={mediaUrl}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-md"
                      />
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setMediaUrl("");
                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
              
              {postType === "VIDEO" && (
                <div className="space-y-2">
                  <input
                    type="url"
                    placeholder="URL de la vidéo (YouTube, Vimeo, etc.)"
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-border rounded-md"
                  />
                  {mediaUrl && (
                    <div className="relative">
                      <div className="w-full h-48 bg-secondary rounded-md flex items-center justify-center">
                        <Video className="h-12 w-12 text-muted-foreground" />
                      </div>
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
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    setIsOpen(false);
                  }}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  Annuler
                </Button>
                <Button onClick={handlePublish} disabled={isSubmitting || !content.trim()} className="w-full sm:w-auto">
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
