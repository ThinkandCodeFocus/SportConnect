import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Hook to protect routes that require authentication
 * Redirects to login page if user is not authenticated
 */
export function useProtectedRoute() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Don't redirect while checking authentication status
    if (isLoading) return;

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  return {
    isCheckingAuth: isLoading,
    canAccess: isAuthenticated,
  };
}
