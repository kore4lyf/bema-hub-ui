"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import GuestOnlyRoute from "@/components/auth/GuestOnlyRoute";
import { useResetPasswordRequestMutation } from "@/lib/api/authApi";
import { Card } from "@/components/ui/card";

export default function ResetPasswordPage() {
  return (
    <GuestOnlyRoute>
      <ResetPasswordContent />
    </GuestOnlyRoute>
  );
}

function ResetPasswordContent() {
  const [requestReset, { isLoading: isRequesting }] = useResetPasswordRequestMutation();
  const [email, setEmail] = useState("");

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await requestReset({ email }).unwrap();
      
      // Store email in localStorage for later use during OTP verification
      localStorage.setItem('resetPasswordEmail', email);
      
      toast.success("Password reset link sent to your email");
    } catch (error: any) {
      // Handle rate limiting (HTTP 429) with precise time formatting
      if (error.status === 429 || error.data?.code === 'password_reset_request_limit_exceeded') {
        toast.error(error.data?.message || "Too many password reset requests. Please try again later.");
      } else {
        toast.error(error.data?.message || "Failed to send reset link");
      }
    }
  };

  return (
    <div className="grid place-content-center px-4 py-12 [&::-webkit-scrollbar]:w-0 overflow-y-scroll">
      <Card className="p-6">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Reset your password</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your email address and we'll send you a reset link
            </p>
          </div>

          <form onSubmit={handleRequestReset} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={isRequesting}>
              {isRequesting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reset"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link href="/signin" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}