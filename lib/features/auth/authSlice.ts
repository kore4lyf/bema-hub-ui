import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { ProfileResponse } from '@/lib/api/types'

interface User {
  id: string
  email: string
  name: string
  username?: string
  avatar_url?: string
  first_name?: string
  last_name?: string
  bmh_email_verified?: boolean
  bmh_referred_by?: string
  bmh_tier_level?: string
  bmh_account_type?: string
  bmh_phone_verified?: boolean
  bmh_fraud_flag_count?: number
  bmh_country?: string
  bmh_state?: string
  bmh_phone_number?: string
  role?: string
  display_name?: string
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

interface Session {
  session_id: string
  created_at: number
  last_activity: number
  device_info: {
    user_agent: string
    ip_address: string
    platform: string
  }
  is_active: boolean
}

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  sessionId: string | null
  sessions: Session[]
  isAuthenticated: boolean
  authData: any | null
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  sessionId: null,
  sessions: [],
  isAuthenticated: false,
  authData: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ authData: any }>) => {
      const { authData } = action.payload
      state.accessToken = authData.token || authData.accessToken || state.accessToken
      state.refreshToken = authData.refresh_token || authData.refreshToken || state.refreshToken
      state.sessionId = authData.session_id || authData.sessionId || state.sessionId
      state.user = {
        id: authData.user_id?.toString() || authData.id?.toString() || '',
        email: authData.user_email || authData.email || '',
        name: authData.user_display_name || authData.display_name || '',
        username: authData.user_login || authData.username,
        avatar_url: authData.avatar_url,
        first_name: authData.first_name,
        last_name: authData.last_name,
        bmh_email_verified: authData.bmh_email_verified,
        bmh_referred_by: authData.bmh_referred_by,
        bmh_tier_level: authData.bmh_tier_level,
        bmh_account_type: authData.bmh_account_type,
        bmh_phone_verified: authData.bmh_phone_verified,
        bmh_fraud_flag_count: authData.bmh_fraud_flag_count,
        bmh_country: authData.bmh_country,
        bmh_state: authData.bmh_state,
        bmh_phone_number: authData.bmh_phone_number,
        role: authData.role,
        display_name: authData.display_name,
        bmh_device_id: authData.bmh_device_id,
        bmh_last_signin: authData.bmh_last_signin,
        bmh_last_signout: authData.bmh_last_signout,
        bmh_google_id: authData.bmh_google_id,
        bmh_facebook_id: authData.bmh_facebook_id,
        bmh_twitter_id: authData.bmh_twitter_id,
        bmh_across_campaign_badge: authData.bmh_across_campaign_badge,
        bmh_across_campaign_badge_exp_date: authData.bmh_across_campaign_badge_exp_date,
        bmh_referral_count: authData.bmh_referral_count,
        bmh_wallet_balance: authData.bmh_wallet_balance,
      }
      state.authData = authData
      state.isAuthenticated = !!state.accessToken
    },
    signOut: (state) => {
      state.user = null
      state.accessToken = null
      state.refreshToken = null
      state.sessionId = null
      state.sessions = []
      state.isAuthenticated = false
      state.authData = null
    },
    logout: (state) => {
      state.user = null
      state.accessToken = null
      state.refreshToken = null
      state.sessionId = null
      state.sessions = []
      state.isAuthenticated = false
      state.authData = null
    },
    hydrateAuth: (state, action: PayloadAction<AuthState>) => {
      return { ...state, ...action.payload }
    },
    updateSessionTokens: (state, action: PayloadAction<{ accessToken: string; refreshToken?: string }>) => {
      state.accessToken = action.payload.accessToken
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken
      }
    },
    setSessionId: (state, action: PayloadAction<string>) => {
      state.sessionId = action.payload
    },
    setSessions: (state, action: PayloadAction<Session[]>) => {
      state.sessions = action.payload
    },
    addSession: (state, action: PayloadAction<Session>) => {
      state.sessions.push(action.payload)
    },
    removeSession: (state, action: PayloadAction<string>) => {
      state.sessions = state.sessions.filter(session => session.session_id !== action.payload)
    },
  },
})

export const { 
  setCredentials, 
  signOut, 
  logout,
  hydrateAuth,
  updateSessionTokens,
  setSessionId,
  setSessions,
  addSession,
  removeSession
} = authSlice.actions
export default authSlice.reducer