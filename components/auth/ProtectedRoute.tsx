"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // If user is not authenticated, redirect to signin
    if (!isAuthenticated) {
      router.push("/signin");
      return;
    }

    // If user is authenticated but email is not verified, redirect to verify page
    if (isAuthenticated && user?.bema_email_verified === false) {
      router.push("/signup/verify");
      return; // Add return to prevent further execution
    }
  }, [isAuthenticated, user, router]);

  // Show loading state while checking auth
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="mt-4 text-sm text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show loading state while checking email verification
  if (isAuthenticated && user?.bema_email_verified === false) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="mt-4 text-sm text-muted-foreground">Redirecting to email verification...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}