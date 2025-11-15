"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Loader2, RefreshCw, Shield } from "lucide-react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { useVerifyOtpMutation, useResendOtpMutation } from "@/lib/api/authApi";
import { setCredentials, logout } from "@/lib/features/auth/authSlice";
import { RootState } from "@/lib/store";

export default function VerifyOTPPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  
  const [verifyOTP, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();
  
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(0);
  const [userEmail, setUserEmail] = useState('');
  const [hasSentCode, setHasSentCode] = useState(false);
  
  const authState = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Case 1: User is authenticated and already verified - redirect to hub
    if (authState.isAuthenticated && authState.user?.bmh_email_verified === true) {
      router.push('/hub');
      return;
    }
    
    // Case 2: User is authenticated but not verified - stay on page
    if (authState.isAuthenticated && authState.user?.email) {
      setUserEmail(authState.user.email);
      return;
    }
    
    // Case 3: User is not authenticated - redirect to signup
    if (!authState.isAuthenticated) {
      toast.error("Please sign up or sign in first.");
      router.push('/signup');
      return;
    }
  }, [authState.isAuthenticated, authState.user, router]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOTPKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const otpString = otpCode.join('');
    if (otpString.length !== 6) {
      toast.error("Please enter the complete 6-digit code");
      return;
    }

    if (!userEmail) {
      toast.error("Email not found. Please sign up again.");
      router.push('/signup');
      return;
    }

    try {
      const result = await verifyOTP({
        email: userEmail,
        otp_code: otpString
      }).unwrap();

      toast.success(result.message || "Email verified successfully!");
      if (authState.user) {
        dispatch(setCredentials({
          authData: {
            ...authState.authData,
            bmh_email_verified: true
          }
        }));
      }
      router.push("/hub");
    } catch (err: any) {
      toast.error(err.data?.message || "OTP verification failed");
      dispatch(logout());
      localStorage.clear();
      sessionStorage.clear();
      router.push("/signup");
    }
  };

  const handleResendOtp = async () => {
    if (!userEmail || resendTimer > 0) return;
    
    try {
      await resendOtp({ email: userEmail }).unwrap();
      toast.success("New verification code sent to your email");
      setResendTimer(60);
      setHasSentCode(true);
    } catch (err: any) {
      if (err.status === 429 || err.data?.code === 'otp_request_limit_exceeded') {
        toast.error(err.data?.message || "Too many requests. Please try again later.");
      } else {
        toast.error(err.data?.message || "Failed to resend code");
      }
    }
  };

  if (!userEmail) {
    return (
      <div className="grid place-content-center px-4 py-12 overflow-y-scroll">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (authState.isAuthenticated && authState.user?.bmh_email_verified === true) {
    return (
      <div className="grid place-content-center px-4 py-12 overflow-y-scroll">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Redirecting to hub...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="grid place-content-center px-4 py-12 overflow-y-scroll">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Verify your email</CardTitle>
          <CardDescription>
            We've sent a verification code to <strong>{userEmail}</strong>
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleOTPSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <div className="flex justify-center gap-3">
                {otpCode.map((digit, index) => (
                  <Input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOTPChange(index, e.target.value)}
                    onKeyDown={(e) => handleOTPKeyDown(index, e)}
                    className="w-12 h-12 text-center text-xl p-0"
                    autoFocus={index === 0}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Enter the 6-digit code sent to your email
              </p>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isVerifying || otpCode.some(d => !d)}>
              {isVerifying ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify Email"}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-2">
          <p className="text-center text-sm text-muted-foreground">
            Didn't receive the code?
          </p>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleResendOtp}
            disabled={isResending || resendTimer > 0}
          >
            {isResending ? (
              <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Sending...</>
            ) : resendTimer > 0 ? (
              <><RefreshCw className="h-4 w-4 mr-2" /> Resend in {resendTimer}s</>
            ) : (
              <><RefreshCw className="h-4 w-4 mr-2" /> {hasSentCode ? "Resend code" : "Send code"}</>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
