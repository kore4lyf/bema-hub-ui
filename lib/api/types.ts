/**
 * Type definitions for Bema Hub API based on official documentation
 */

// Site interfaces
export interface SiteDetails {
  logo: string;
  title: string;
  tagline: string;
  base_url: string;
  themed_logo: boolean;
  logo_width: number;
}

export interface SiteState {
  details: SiteDetails | null;
  loading: boolean;
  error: string | null;
}

// Site settings update interface
export interface UpdateSettingsRequest {
  title?: string;
  tagline?: string;
  base_url?: string;
  themed_logo?: boolean;
  logo_width?: number;
  logo?: string;
}

// Request interfaces
export interface SignupRequest {
  email: string
  password: string
  first_name: string
  last_name: string
  phone_number: string
  country: string
  state: string
  referred_by?: string
}

export interface VerifyOtpRequest {
  email: string
  otp_code: string
}

export interface SigninRequest {
  username: string
  password: string
}

export interface SocialLoginRequest {
  provider: string
  provider_id: string
  email: string
  first_name: string
  last_name: string
  phone_number?: string
  country?: string
  state?: string
}

export interface ValidateTokenRequest {
  token: string
}

export interface ResetPasswordRequestRequest {
  email: string
}

export interface ResetPasswordVerifyRequest {
  email: string
  otp_code: string
}

export interface ResetPasswordFinalRequest {
  email: string
  otp_code: string
  new_password: string
}

export interface UpdateProfileRequest {
  first_name?: string
  last_name?: string
  display_name?: string
  bmh_phone_number?: string
  bmh_country?: string
  bmh_state?: string
  bmh_role?: string
  bmh_account_type?: string
  bmh_email_verified?: boolean
  bmh_phone_verified?: boolean
  bmh_fraud_flag_count?: number
  bmh_device_id?: string
  bmh_last_signin?: number
  bmh_last_signout?: number
  bmh_google_id?: string
  bmh_facebook_id?: string
  bmh_twitter_id?: string
  bmh_across_campaign_badge?: string
  bmh_across_campaign_badge_exp_date?: string
  bmh_referral_count?: number
  bmh_wallet_balance?: number
}

export interface ResendOtpRequest {
  email: string
}

// Response interfaces
export interface AuthResponse {
  success?: boolean
  message?: string
  token?: string
  user_email?: string
  user_id?: number
  user_login?: string
  user_display_name?: string
  first_name?: string
  last_name?: string
  avatar_url?: string
  bmh_email_verified?: boolean
  bmh_referred_by?: string
  role?: string
}

export interface SignupResponse {
  success: boolean
  message: string
  user_email: string
  bmh_email_verified: boolean
  bmh_referred_by: string
  role: string
}

export interface VerifyOtpResponse {
  success: boolean
  message: string
}

export interface SigninResponse {
  success: boolean;
  token: string;
  refresh_token: string;
  session_id: string;
  user_id: number;
  user_login: string;
  user_email: string;
  user_display_name: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
  bmh_email_verified: boolean;
  bmh_referred_by: string;
  bmh_across_campaign_badge: string;
  bmh_across_campaign_badge_exp_date: string;
  bmh_referral_count: number;
  bmh_wallet_balance: number;
  bmh_fraud_flag_count: number;
  role: string;
}

export interface SocialLoginResponse {
  success: boolean;
  token: string;
  refresh_token: string;
  session_id: string;
  user_id: number;
  user_login: string;
  user_email: string;
  user_display_name: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
  bmh_email_verified: boolean;
  bmh_referred_by: string;
  bmh_across_campaign_badge: string;
  bmh_across_campaign_badge_exp_date: string;
  bmh_referral_count: number;
  bmh_wallet_balance: number;
  bmh_fraud_flag_count: number;
  role: string;
}

export interface SignoutResponse {
  success: boolean
  message: string
}

export interface RevokeAllSessionsResponse {
  success: boolean
  message: string
}

export interface ValidateTokenResponse {
  valid: boolean;
  data?: {
    user_id: number;
    bmh_email_verified: boolean;
    bmh_referred_by: string;
    bmh_across_campaign_badge: string;
    bmh_across_campaign_badge_exp_date: string;
    bmh_referral_count: number;
    bmh_wallet_balance: number;
    bmh_fraud_flag_count: number;
    role: string;
  }
}

export interface ResetPasswordRequestResponse {
  success: boolean
  message: string
}

export interface ResetPasswordVerifyResponse {
  success: boolean
  message: string
}

export interface ResetPasswordResponse {
  success: boolean
  message: string
}

export interface ProfileResponse {
  id: number;
  username: string;
  email: string;
  display_name: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
  bmh_phone_number: string;
  bmh_country: string;
  bmh_state: string;
  bmh_referred_by: string;
  bmh_role: string;
  bmh_account_type: string;
  bmh_email_verified: boolean;
  bmh_phone_verified: boolean;
  bmh_fraud_flag_count: number;
  bmh_device_id: string;
  bmh_last_signin: number;
  bmh_last_signout: number;
  bmh_google_id?: string;
  bmh_facebook_id?: string;
  bmh_twitter_id?: string;
  bmh_across_campaign_badge: string;
  bmh_across_campaign_badge_exp_date: string;
  bmh_referral_count: number;
  bmh_wallet_balance: number;
  bmh_tier_level?: string;
  role: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in: number;
}

export interface SessionResponse {
  id: string;
  device_info: string;
  ip_address: string;
  created_at: number;
  last_activity: number;
  is_current: boolean;
}

export interface RevokeSessionRequest {
  sessionId: string;
}

// MailerLite interfaces
export interface MailerLiteSubscribeRequest {
  email: string;
}

export interface MailerLiteUnsubscribeRequest {
  token: string;
}

export interface MailerLiteAddToWebsiteGroupRequest {
  token: string;
  userData?: {
    email?: string;
    first_name?: string;
    last_name?: string;
  };
}

export interface MailerLiteResponse {
  success: boolean;
  message: string;
}