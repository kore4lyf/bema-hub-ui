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
  const { isAuthenticated, user, sessionId } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // If user is not authenticated, redirect to signin
    if (!isAuthenticated) {
      router.push("/signin");
    }
    // If user is authenticated but email is not verified, redirect to verify page
    else if (user?.bmh_email_verified === false) {
      router.push("/signup/verify");
    }
    // If user is authenticated but session is invalid, redirect to signin
    else if (isAuthenticated && !sessionId) {
      router.push("/signin");
    }
  }, [isAuthenticated, user?.bmh_email_verified, sessionId, router]);

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

  // If user is authenticated but email is not verified, redirect to verify page
  if (user?.bmh_email_verified === false) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="mt-4 text-sm text-muted-foreground">Redirecting to email verification...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated and email is verified, render children
  return <>{children}</>;
}