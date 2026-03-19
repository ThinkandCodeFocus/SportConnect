"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import { UserRole } from "@/lib/types/api";

const USER_ROLES: { value: UserRole; label: string; description: string }[] = [
  { value: "PLAYER", label: "Joueur", description: "Athlète professionnel ou amateur" },
  { value: "COACH", label: "Entraîneur", description: "Coach sportif" },
  { value: "AGENT", label: "Agent", description: "Agent de joueurs" },
  { value: "SCOUT", label: "Recruteur", description: "Scout professionnel" },
  { value: "CLUB_ADMIN", label: "Admin Club", description: "Administrateur de club" },
  { value: "FAN", label: "Fan", description: "Supporter et passionné" },
];

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    firstName: "",
    lastName: "",
    phone: "",
    role: "PLAYER" as UserRole,
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<{
    hasLength: boolean;
    hasUpperCase: boolean;
    hasLowerCase: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
  }>({
    hasLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecial: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Check password strength
    if (name === "password") {
      setPasswordStrength({
        hasLength: value.length >= 8,
        hasUpperCase: /[A-Z]/.test(value),
        hasLowerCase: /[a-z]/.test(value),
        hasNumber: /[0-9]/.test(value),
        hasSpecial: /[@#$%^&+=!]/.test(value),
      });
    }

    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleRoleChange = (value: UserRole) => {
    setFormData({
      ...formData,
      role: value,
    });
  };

  const validateForm = (): boolean => {
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return false;
    }

    if (formData.password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      return false;
    }

    if (!passwordStrength.hasUpperCase || !passwordStrength.hasLowerCase || !passwordStrength.hasNumber) {
      setError("Le mot de passe doit contenir des majuscules, minuscules et chiffres");
      return false;
    }

    if (!passwordStrength.hasSpecial) {
      setError("Le mot de passe doit contenir un caractere special parmi @ # $ % ^ & + = !");
      return false;
    }

    if (formData.phone && !/^\+?[0-9]{10,15}$/.test(formData.phone)) {
      setError("Le numero de telephone doit etre au format +221771234567 (10 a 15 chiffres)");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await register({
        email: formData.email,
        password: formData.password,
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone || undefined,
        role: formData.role,
      });
      // Redirection automatique vers "/" par le context
    } catch (err: any) {
      if (err?.errors && typeof err.errors === "object") {
        const firstError = Object.values(err.errors)[0] as string | undefined;
        setError(firstError || err.message || "Echec de l'inscription. Veuillez reessayer.");
      } else {
        setError(err.message || "Echec de l'inscription. Veuillez reessayer.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4 py-8">
      <div className="w-full max-w-2xl">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Card>
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-2xl">SC</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Créer un compte</CardTitle>
          <CardDescription>
            Rejoignez le réseau professionnel du sport
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Role Selection */}
            <div className="space-y-2">
              <Label htmlFor="role">Je suis un(e)</Label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez votre rôle" />
                </SelectTrigger>
                <SelectContent>
                  {USER_ROLES.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      <div className="flex flex-col">
                        <span className="font-medium">{role.label}</span>
                        <span className="text-xs text-muted-foreground">{role.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username">Nom d'utilisateur</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="johndoe"
                value={formData.username}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="exemple@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Phone (optional) */}
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone (optionnel)</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+221771234567"
                value={formData.phone}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="space-y-1 text-xs">
                  <PasswordRequirement
                    met={passwordStrength.hasLength}
                    text="Au moins 8 caractères"
                  />
                  <PasswordRequirement
                    met={passwordStrength.hasUpperCase}
                    text="Une lettre majuscule"
                  />
                  <PasswordRequirement
                    met={passwordStrength.hasLowerCase}
                    text="Une lettre minuscule"
                  />
                  <PasswordRequirement
                    met={passwordStrength.hasNumber}
                    text="Un chiffre"
                  />
                  <PasswordRequirement
                    met={passwordStrength.hasSpecial}
                    text="Un caractere special (@ # $ % ^ & + = !)"
                  />
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création en cours...
                </>
              ) : (
                "Créer mon compte"
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              En créant un compte, vous acceptez nos{" "}
              <Link href="/terms" className="text-primary hover:underline">
                conditions d'utilisation
              </Link>{" "}
              et notre{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                politique de confidentialité
              </Link>
              .
            </p>

            <div className="text-center">
              <span className="text-sm text-muted-foreground">
                Vous avez déjà un compte ?{" "}
              </span>
              <Link href="/login" className="text-sm text-primary hover:underline font-medium">
                Se connecter
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}

function PasswordRequirement({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2">
      {met ? (
        <CheckCircle2 className="h-3 w-3 text-green-500" />
      ) : (
        <div className="h-3 w-3 rounded-full border border-muted-foreground" />
      )}
      <span className={met ? "text-green-600" : "text-muted-foreground"}>
        {text}
      </span>
    </div>
  );
}
