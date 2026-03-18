"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { User, UserProfile } from "@/lib/types/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";

interface EditProfileDialogProps {
  user: User;
  profile: UserProfile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProfileDialog({ user, profile, open, onOpenChange }: EditProfileDialogProps) {
  const { updateProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    bio: profile?.bio || "",
    location: profile?.location || "",
    country: profile?.country || "",
    position: profile?.position || "",
    currentClub: profile?.currentClub || "",
    experience: profile?.experience || "",
    profilePicture: profile?.profilePicture || "",
    coverPhoto: profile?.coverPhoto || "",
    skills: profile?.skills?.join(", ") || "",
    languages: profile?.languages?.join(", ") || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await updateProfile({
        bio: formData.bio || undefined,
        location: formData.location || undefined,
        country: formData.country || undefined,
        position: formData.position || undefined,
        currentClub: formData.currentClub || undefined,
        experience: formData.experience || undefined,
        profilePicture: formData.profilePicture || undefined,
        coverPhoto: formData.coverPhoto || undefined,
        skills: formData.skills ? formData.skills.split(",").map((s) => s.trim()) : undefined,
        languages: formData.languages ? formData.languages.split(",").map((l) => l.trim()) : undefined,
      });
      
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || "Échec de la mise à jour du profil");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier le profil</DialogTitle>
          <DialogDescription>
            Mettez à jour vos informations professionnelles
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              placeholder="Parlez de vous, votre parcours, vos objectifs..."
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="position">Poste / Spécialité</Label>
              <Input
                id="position"
                name="position"
                placeholder="Ex: Milieu offensif"
                value={formData.position}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentClub">Club actuel</Label>
              <Input
                id="currentClub"
                name="currentClub"
                placeholder="Ex: AS Jeanne d'Arc"
                value={formData.currentClub}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Ville</Label>
              <Input
                id="location"
                name="location"
                placeholder="Ex: Paris"
                value={formData.location}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Pays</Label>
              <Input
                id="country"
                name="country"
                placeholder="Ex: France"
                value={formData.country}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">Expérience</Label>
            <Input
              id="experience"
              name="experience"
              placeholder="Ex: 5 ans au niveau professionnel"
              value={formData.experience}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills">Compétences (séparées par des virgules)</Label>
            <Input
              id="skills"
              name="skills"
              placeholder="Ex: Passes décisives, Vision de jeu, Technique"
              value={formData.skills}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="languages">Langues (séparées par des virgules)</Label>
            <Input
              id="languages"
              name="languages"
              placeholder="Ex: Français, Anglais, Espagnol"
              value={formData.languages}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profilePicture">URL Photo de profil</Label>
            <Input
              id="profilePicture"
              name="profilePicture"
              type="url"
              placeholder="https://example.com/photo.jpg"
              value={formData.profilePicture}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverPhoto">URL Photo de couverture</Label>
            <Input
              id="coverPhoto"
              name="coverPhoto"
              type="url"
              placeholder="https://example.com/cover.jpg"
              value={formData.coverPhoto}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                "Enregistrer"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
