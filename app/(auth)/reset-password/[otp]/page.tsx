'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Eye, EyeOff, Loader2, Lock } from 'lucide-react'
import { Card } from '@/components/ui/card'

export default function ResetPasswordWithOtpPage() {
  return (
      <ResetPasswordWithOtpContent />
  );
}

function ResetPasswordWithOtpContent() {
  const params = useParams()
  const router = useRouter()
  const { verifyResetOTP, isVerifyingReset, setNewPassword, isSettingPassword } = useAuth()
  const otp = params.otp as string

  const [step, setStep] = useState<'verifying' | 'verified' | 'reset' | 'missingEmail'>('verifying')
  const [email, setEmail] = useState('')
  const [newPassword, setNewPasswordValue] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  useEffect(() => {
    // Get email from localStorage
    const storedEmail = localStorage.getItem('resetPasswordEmail')
    if (storedEmail) {
      setEmail(storedEmail)
      // Validate OTP format (should be 6 digits)
      if (!otp || !/^\d{6}$/.test(otp)) {
        setStep('reset')
        return
      }
      
      // Verify OTP when component mounts and email is available
      verifyOtpCode(storedEmail)
    } else {
      // Show toast and redirect to reset password page if no email is found
      toast.error('Email missing. Kindly make a new password reset request.')
      // Redirect after a short delay to allow user to see the message
      setTimeout(() => {
        router.push('/reset-password')
      }, 2000)
      return
    }
  }, [otp, router])

  // Calculate password strength
  useEffect(() => {
    if (newPassword) {
      let strength = 0;
      if (newPassword.length >= 8) strength += 1;
      if (/[A-Z]/.test(newPassword)) strength += 1;
      if (/[0-9]/.test(newPassword)) strength += 1;
      if (/[^A-Za-z0-9]/.test(newPassword)) strength += 1;
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(0);
    }
  }, [newPassword]);

  const verifyOtpCode = async (emailToUse: string) => {
    try {
      // Use the email passed as parameter
      await verifyResetOTP({ 
        email: emailToUse,
        otpCode: otp 
      })
      setStep('verified')
    } catch (error: any) {
      setStep('reset')
      toast.error(error?.data?.message || 'Invalid or expired OTP')
    }
  }

  const validatePassword = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!newPassword) {
      newErrors.password = "Password is required"
    } else if (newPassword.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }
    
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validatePassword()) return

    // Get email from localStorage to ensure we have the latest value
    const storedEmail = localStorage.getItem('resetPasswordEmail')
    if (!storedEmail) {
      toast.error('Email not found. Please request a new password reset.')
      router.push('/reset-password')
      return
    }

    try {
      await setNewPassword({ 
        email: storedEmail,
        otpCode: otp,
        newPassword 
      })
      
      // Remove the email from localStorage after successful password reset
      localStorage.removeItem('resetPasswordEmail')
      
      toast.success('Password reset successfully!')
      setTimeout(() => router.push('/signin'), 2000)
    } catch (error: any) {
      // Remove the email from localStorage even on error to prevent reuse
      localStorage.removeItem('resetPasswordEmail')
      
      const errorMessage = error?.data?.message || 'Failed to reset password. The link may have expired.'
      toast.error(errorMessage)
    }
  }

  // Password strength indicator component
  const PasswordStrengthIndicator = () => {
    if (!newPassword) return null;
    
    const strengthLabels = ["Very Weak", "Weak", "Medium", "Strong"];
    const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500"];
    const strengthIndex = Math.min(passwordStrength, 3);
    
    return (
      <div className="space-y-1">
        <div className="flex h-1.5 gap-1">
          {[1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={`flex-1 rounded-full ${
                level <= passwordStrength
                  ? strengthColors[strengthIndex]
                  : "bg-muted"
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          {strengthLabels[strengthIndex]}
        </p>
      </div>
    );
  };

  // Loading state while verifying OTP
  if (step === 'verifying') {
    return (
      <div className="grid place-content-center px-4 py-12 [&::-webkit-scrollbar]:w-0 overflow-y-scroll">
        <Card className="p-6">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/30">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
              </div>
              <h1 className="mt-4 text-2xl font-bold">Verifying reset link</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Please wait while we verify your reset link
              </p>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  // Missing email state
  if (step === 'missingEmail') {
    return (
      <div className="grid place-content-center px-4 py-12 [&::-webkit-scrollbar]:w-0 overflow-y-scroll">
        <Card className="p-6">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h1 className="mt-4 text-2xl font-bold">Email Missing</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Email missing. Kindly make a new password reset request.
              </p>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>Redirecting to reset password page...</p>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  // Invalid OTP state
  if (step === 'reset') {
    return (
      <div className="grid place-content-center px-4 py-12 [&::-webkit-scrollbar]:w-0 overflow-y-scroll">
        <Card className="p-6">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="mt-4 text-2xl font-bold">Invalid Reset Link</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                The password reset link is invalid or has expired.
              </p>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">What to do next?</h3>
              <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                Request a new password reset link from the password reset page.
              </p>
            </div>

            <Button onClick={() => router.push('/reset-password')} className="w-full">
              Request Reset Link
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  // OTP verified, show password reset form
  return (
    <div className=" grid place-content-center px-4 py-12 [&::-webkit-scrollbar]:w-0 overflow-y-scroll">
      <Card className="p-6 max-w-md ">
        <div className="w-full space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Set new password</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Create a strong password for your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPasswordValue(e.target.value)
                    if (errors.password) setErrors({})
                  }}
                  required
                  minLength={8}
                  className={`pl-10 ${errors.password ? "border-destructive" : ""}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <PasswordStrengthIndicator />
              {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              <p className="text-xs text-muted-foreground">Password must be at least 8 characters long</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    if (errors.confirmPassword) setErrors({})
                  }}
                  required
                  minLength={8}
                  className={`pl-10 ${errors.confirmPassword ? "border-destructive" : ""}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isSettingPassword}>
              {isSettingPassword ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting Password...
                </>
              ) : (
                'Reset Password'
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            <button 
              onClick={() => router.push('/signin')} 
              className="font-semibold text-primary hover:underline"
            >
              Back to Sign In
            </button>
          </p>
        </div>
      </Card>
    </div>
  )
}