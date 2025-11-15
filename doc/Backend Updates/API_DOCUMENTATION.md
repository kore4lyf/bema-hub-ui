# BMH REST API Documentation

This document provides detailed information about all available REST API endpoints in the BMH WordPress plugin, including expected payloads, return data, and TypeScript interfaces.

## Base URL

All endpoints are prefixed with: `/wp-json/bmh/v1`

## General Settings Endpoint

### Get General Settings
**Endpoint:** `GET /settings/general`

**Description:** Retrieves site configuration details including logo, title, and tagline from the general settings.

**Request Payload:**
```typescript
// No payload required
```

**Success Response:**
```typescript
interface SiteDetailsResponse {
  logo: string; // Site logo URL
  title: string; // Site title
  tagline: string; // Site tagline
  base_url: string; // Base URL for the site
  themed_logo: boolean; // Whether themed logo is enabled
  logo_width: number; // Logo width in pixels
}
```

**Error Response:**
```typescript
interface SettingsErrorResponse {
  code: string; // Error code
  message: string; // Human-readable error message
  data: {
    status: number; // HTTP status code
  };
}
```

### Update General Settings
**Endpoint:** `PUT /settings/general`

**Description:** Updates site configuration details. Requires administrator privileges. Supports both form data and multipart form data with file uploads. PUT is the preferred method for updates.

**Request Payload (Form Data):**
```typescript
interface UpdateSettingsRequest {
  title?: string; // Site title
  tagline?: string; // Site tagline
  base_url?: string; // Base URL for the site
  themed_logo?: boolean; // Whether themed logo is enabled (true/false)
  logo_width?: number; // Logo width in pixels (1-1000)
  logo?: string; // Logo URL or placeholder {{logo}} to keep existing
}
```

**Request Payload (Multipart Form Data):**
```typescript
interface UpdateSettingsMultipartRequest {
  title?: string; // Site title
  tagline?: string; // Site tagline
  base_url?: string; // Base URL for the site
  themed_logo?: boolean; // Whether themed logo is enabled (true/false)
  logo_width?: number; // Logo width in pixels (1-1000)
  logo?: File; // Logo image file (JPG, PNG, GIF, WebP - max 5MB)
}
```

**Headers:**
- Authorization: Bearer [admin token]
- Content-Type: application/x-www-form-urlencoded or multipart/form-data

**Success Response:**
```typescript
interface UpdateSettingsResponse {
  logo: string; // Site logo URL
  title: string; // Site title
  tagline: string; // Site tagline
  base_url: string; // Base URL for the site
  themed_logo: boolean; // Whether themed logo is enabled
  logo_width: number; // Logo width in pixels
}
```

**Error Response:**
```typescript
interface SettingsUpdateErrorResponse {
  code: string; // Error code
  message: string; // Human-readable error message
  data: {
    status: number; // HTTP status code
  };
}
```

## Authentication Endpoints

### Sign In
**Endpoint:** `POST /auth/signin`

**Description:** Authenticates a user and generates an Enhanced JWT token with session management.

**Request Payload:**
```typescript
interface SigninRequest {
  username: string; // Username or email
  password: string; // User password
}
```

**Success Response:**
```typescript
interface SigninResponse {
  success: true;
  token: string; // JWT access token
  refresh_token: string; // Refresh token for getting new access tokens
  session_id: string; // Session identifier
  user_id: number; // WordPress user ID
  user_login: string; // WordPress username
  user_email: string; // User email address
  user_display_name: string; // User display name
  first_name: string; // User first name
  last_name: string; // User last name
  avatar_url: string; // URL to user avatar
  bmh_email_verified: boolean; // Email verification status
  bmh_referred_by: string; // Referral code or user ID
  bmh_across_campaign_badge: string; // Across campaign badge
  bmh_across_campaign_badge_exp_date: string; // Across campaign badge expiration date
  bmh_referral_count: number; // Referral count
  bmh_wallet_balance: number; // Wallet balance
  bmh_fraud_flag_count: number; // Fraud flag count
  role: string; // User role (subscriber, contributor, etc.)
}
```

**Error Response:**
```typescript
interface ErrorResponse {
  code: string; // Error code
  message: string; // Human-readable error message
  data: {
    status: number; // HTTP status code
  };
}
```

### Validate Token
**Endpoint:** `POST /auth/validate`

**Description:** Validates an Enhanced JWT token and returns user information.

**Request Payload:**
```typescript
interface ValidateTokenRequest {
  token: string; // Enhanced JWT token to validate
}
```

**Success Response:**
```typescript
interface ValidateTokenResponse {
  valid: true;
  data: {
    user_id: number; // WordPress user ID
    bmh_email_verified: boolean; // Email verification status
    bmh_referred_by: string; // Referral code or user ID
    bmh_across_campaign_badge: string; // Across campaign badge
    bmh_across_campaign_badge_exp_date: string; // Across campaign badge expiration date
    bmh_referral_count: number; // Referral count
    bmh_wallet_balance: number; // Wallet balance
    bmh_fraud_flag_count: number; // Fraud flag count
    role: string; // User role
  };
}
```

### Sign Up
**Endpoint:** `POST /auth/signup`

**Description:** Creates a new user account.

**Request Payload:**
```typescript
interface SignupRequest {
  email: string; // User email address
  password: string; // User password
  first_name: string; // User first name
  last_name: string; // User last name
  phone_number?: string; // User phone number (optional)
  country: string; // User country
  state?: string; // User state (optional)
  referred_by?: string; // Referral code or user ID (optional)
}
```

**Success Response:**
```typescript
interface SignupResponse {
  success: true;
  message: string; // Success message
  user_email: string; // User email address
  bmh_email_verified: boolean; // Email verification status
  bmh_referred_by: string; // Referral code or user ID
  role: string; // User role
}
```

### Social Login
**Endpoint:** `POST /auth/social-login`

**Description:** Authenticates a user via social login provider with session management.

**Request Payload:**
```typescript
interface SocialLoginRequest {
  provider: 'google' | 'facebook' | 'twitter'; // Social login provider
  provider_id: string; // Provider-specific user ID
  email: string; // User email address
  first_name: string; // User first name
  last_name: string; // User last name
  phone_number?: string; // User phone number (optional)
  country?: string; // User country (optional)
  state?: string; // User state (optional)
}
```

**Success Response:**
```typescript
interface SocialLoginResponse {
  success: true;
  token: string; // JWT access token
  refresh_token: string; // Refresh token for getting new access tokens
  session_id: string; // Session identifier
  user_id: number; // WordPress user ID
  user_login: string; // WordPress username
  user_email: string; // User email address
  user_display_name: string; // User display name
  first_name: string; // User first name
  last_name: string; // User last name
  avatar_url: string; // URL to user avatar
  bmh_email_verified: boolean; // Email verification status
  bmh_referred_by: string; // Referral code or user ID
  bmh_across_campaign_badge: string; // Across campaign badge
  bmh_across_campaign_badge_exp_date: string; // Across campaign badge expiration date
  bmh_referral_count: number; // Referral count
  bmh_wallet_balance: number; // Wallet balance
  bmh_fraud_flag_count: number; // Fraud flag count
  role: string; // User role
}
```

### Sign Out
**Endpoint:** `POST /auth/signout`

**Description:** Signs out the current user by invalidating their session using timestamp-based invalidation.

**Headers:**
- Authorization: Bearer [token]

**Request Payload:**
```typescript
// No payload required
```

**Success Response:**
```typescript
interface SignoutResponse {
  success: true;
  message: string; // Success message
}
```

### Reset Password Request
**Endpoint:** `POST /auth/reset-password-request`

**Description:** Requests a password reset by sending an OTP to the user's email.

**Request Payload:**
```typescript
interface ResetPasswordRequestRequest {
  email: string; // User email address
}
```

**Success Response:**
```typescript
interface ResetPasswordRequestResponse {
  success: true;
  message: string; // Success message
}
```

### Reset Password
**Endpoint:** `POST /auth/reset-password`

**Description:** Resets a user's password using an OTP code.

**Request Payload:**
```typescript
interface ResetPasswordRequest {
  email: string; // User email address
  otp_code: string; // OTP code received via email
  new_password: string; // New password
}
```

**Success Response:**
```typescript
interface ResetPasswordResponse {
  success: true;
  message: string; // Success message
}
```

### Verify OTP
**Endpoint:** `POST /auth/verify-otp`

**Description:** Verifies an OTP code for email verification or password reset.

**Request Payload:**
```typescript
interface VerifyOtpRequest {
  email: string; // User email address
  otp_code: string; // OTP code
}
```

**Success Response:**
```typescript
interface VerifyOtpResponse {
  success: true;
  message: string; // Success message
  token?: string; // JWT token (for email verification)
  user_id?: number; // User ID (for password reset)
}
```

## User Profile Endpoints

### Get Profile
**Endpoint:** `GET /profile`

**Description:** Retrieves the authenticated user's profile information.

**Headers:**
- Authorization: Bearer [token]

**Request Payload:**
```typescript
// No payload required
```

**Success Response:**
```typescript
interface GetProfileResponse {
  id: number; // User ID
  username: string; // Username
  email: string; // Email address
  display_name: string; // Display name
  first_name: string; // First name
  last_name: string; // Last name
  avatar_url: string; // Avatar URL
  bmh_phone_number: string; // Phone number
  bmh_country: string; // Country
  bmh_state: string; // State
  bmh_referred_by: string; // Referred by
  bmh_role: string; // Role
  bmh_account_type: string; // Account type
  bmh_email_verified: boolean; // Email verified
  bmh_phone_verified: boolean; // Phone verified
  bmh_fraud_flag_count: number; // Fraud flag count
  bmh_device_id: string; // Device ID
  bmh_last_signin: number; // Last signin timestamp
  bmh_last_signout: number; // Last signout timestamp
  bmh_google_id: string; // Google ID
  bmh_facebook_id: string; // Facebook ID
  bmh_twitter_id: string; // Twitter ID
  bmh_across_campaign_badge: string; // Across campaign badge
  bmh_across_campaign_badge_exp_date: string; // Across campaign badge expiration date
  bmh_referral_count: number; // Referral count
  bmh_wallet_balance: number; // Wallet balance
  role: string; // User role
}
```

### Update Profile
**Endpoint:** `PUT /profile`

**Description:** Updates the authenticated user's profile information.

**Headers:**
- Authorization: Bearer [token]
- Content-Type: application/json

**Request Payload:**
```typescript
interface UpdateProfileRequest {
  first_name?: string; // First name
  last_name?: string; // Last name
  display_name?: string; // Display name
  bmh_phone_number?: string; // Phone number
  bmh_country?: string; // Country
  bmh_state?: string; // State
  bmh_role?: string; // Role
  bmh_account_type?: string; // Account type
  bmh_email_verified?: boolean; // Email verified
  bmh_phone_verified?: boolean; // Phone verified
  bmh_fraud_flag_count?: number; // Fraud flag count
  bmh_device_id?: string; // Device ID
  bmh_last_signin?: number; // Last signin timestamp
  bmh_last_signout?: number; // Last signout timestamp
  bmh_google_id?: string; // Google ID
  bmh_facebook_id?: string; // Facebook ID
  bmh_twitter_id?: string; // Twitter ID
  bmh_across_campaign_badge?: string; // Across campaign badge
  bmh_across_campaign_badge_exp_date?: string; // Across campaign badge expiration date
  bmh_referral_count?: number; // Referral count
  bmh_wallet_balance?: number; // Wallet balance
}
```

**Success Response:**
```typescript
interface UpdateProfileResponse {
  id: number; // User ID
  username: string; // Username
  email: string; // Email address
  display_name: string; // Display name
  first_name: string; // First name
  last_name: string; // Last name
  avatar_url: string; // Avatar URL
  bmh_phone_number: string; // Phone number
  bmh_country: string; // Country
  bmh_state: string; // State
  bmh_referred_by: string; // Referred by
  bmh_role: string; // Role
  bmh_account_type: string; // Account type
  bmh_email_verified: boolean; // Email verified
  bmh_phone_verified: boolean; // Phone verified
  bmh_fraud_flag_count: number; // Fraud flag count
  bmh_device_id: string; // Device ID
  bmh_last_signin: number; // Last signin timestamp
  bmh_last_signout: number; // Last signout timestamp
  bmh_google_id: string; // Google ID
  bmh_facebook_id: string; // Facebook ID
  bmh_twitter_id: string; // Twitter ID
  bmh_across_campaign_badge: string; // Across campaign badge
  bmh_across_campaign_badge_exp_date: string; // Across campaign badge expiration date
  bmh_referral_count: number; // Referral count
  bmh_wallet_balance: number; // Wallet balance
  role: string; // User role
}
```

## Session Management Endpoints

### Get Sessions
**Endpoint:** `GET /sessions`

**Description:** Retrieves all active sessions for the authenticated user.

**Headers:**
- Authorization: Bearer [token]

**Request Payload:**
```typescript
// No payload required
```

**Success Response:**
```typescript
interface GetSessionsResponse {
  [session_id: string]: {
    device_info: {
      user_agent: string;
      ip_address: string;
      timestamp: number;
      platform?: string;
    };
    last_activity: number;
  };
}
```

### Revoke Session
**Endpoint:** `DELETE /sessions/{session_id}`

**Description:** Revokes a specific session for the authenticated user.

**Headers:**
- Authorization: Bearer [token]

**Request Payload:**
```typescript
// No payload required
```

**Success Response:**
```typescript
interface RevokeSessionResponse {
  success: true;
  message: string; // Success message
}
```

### Revoke All Sessions
**Endpoint:** `DELETE /sessions`

**Description:** Revokes all sessions for the authenticated user (signs out all devices).

**Headers:**
- Authorization: Bearer [token]

**Request Payload:**
```typescript
// No payload required
```

**Success Response:**
```typescript
interface RevokeAllSessionsResponse {
  success: true;
  message: string; // Success message
}
```

## OTP Endpoints

### Resend OTP
**Endpoint:** `POST /auth/resend-otp`

**Description:** Resends an OTP code to the user's email.

**Request Payload:**
```typescript
interface ResendOtpRequest {
  email: string; // User email address
}
```

**Success Response:**
```typescript
interface ResendOtpResponse {
  success: true;
  message: string; // Success message
}
```

### Verify Password Reset OTP
**Endpoint:** `POST /auth/verify-password-reset-otp`

**Description:** Verifies an OTP code for password reset.

**Request Payload:**
```typescript
interface VerifyPasswordResetOtpRequest {
  email: string; // User email address
  otp_code: string; // OTP code
}
```

**Success Response:**
```typescript
interface VerifyPasswordResetOtpResponse {
  success: true;
  message: string; // Success message
  user_id: number; // User ID
}
```

## MailerLite Endpoints

### Add User to Website Group
**Endpoint:** `POST /mailerlite/add-to-website-group`

**Description:** Adds a user to the website group in MailerLite.

**Headers:**
- Authorization: Bearer [token]

**Request Payload:**
```typescript
interface AddToWebsiteGroupRequest {
  email?: string; // User email (optional if authenticated)
  first_name?: string; // First name (optional if authenticated)
  last_name?: string; // Last name (optional if authenticated)
}
```

**Success Response:**
```typescript
interface AddToWebsiteGroupResponse {
  success: true;
  message: string; // Success message
}
```

### Subscribe to Newsletter
**Endpoint:** `POST /mailerlite/subscribe-newsletter`

**Description:** Subscribes a user to the newsletter in MailerLite.

**Request Payload:**
```typescript
interface SubscribeNewsletterRequest {
  email: string; // User email address
}
```

**Success Response:**
```typescript
interface SubscribeNewsletterResponse {
  success: true;
  message: string; // Success message
}
```

### Unsubscribe from Newsletter
**Endpoint:** `GET /mailerlite/unsubscribe-newsletter`

**Description:** Unsubscribes a user from the newsletter in MailerLite.

**Headers:**
- Authorization: Bearer [token]

**Request Payload:**
```typescript
// No payload required
```

**Success Response:**
```typescript
interface UnsubscribeNewsletterResponse {
  success: true;
  message: string; // Success message
}
```