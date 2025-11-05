"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { Loader2 } from "lucide-react";

interface GuestOnlyRouteProps {
  children: React.ReactNode;
}

export default function GuestOnlyRoute({ children }: GuestOnlyRouteProps) {
const router = useRouter();
const pathname = usePathname();
  const authState = useSelector((state: RootState) => state.auth);

useEffect(() => {
// If user is authenticated and email is verified, redirect to dashboard
// But allow access to verification page for partially authenticated users
if (authState.isAuthenticated && authState.user?.bema_email_verified === true && pathname !== '/signup/verify') {
router.push("/dashboard");
return; // Add return to prevent further execution
}
  }, [authState.isAuthenticated, authState.user?.bema_email_verified, router, pathname]);

  // Show loading state while checking auth
  if (authState.isAuthenticated && authState.user?.bema_email_verified === true && pathname !== '/signup/verify') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="mt-4 text-sm text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    );
  }

  // Show redirecting message for authenticated users with unverified email
  // But allow access to verification page
  if (authState.isAuthenticated && authState.user?.bema_email_verified === false && pathname !== '/signup/verify') {
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