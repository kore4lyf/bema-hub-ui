import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '@/lib/store';
import { authApi } from '@/lib/api/authApi';
import { logout, updateSessionTokens } from './authSlice';

// Refresh access token using refresh token
export const refreshAccessToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    const refreshToken = state.auth.refreshToken;
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    try {
      // Use the RTK Query endpoint for token refresh
      const [triggerRefresh] = authApi.endpoints.refreshToken.useMutation();
      const result = await triggerRefresh({ refresh_token: refreshToken }).unwrap();
      
      // Update the Redux state with new tokens
      dispatch(updateSessionTokens({
        accessToken: result.access_token,
        refreshToken: result.refresh_token || refreshToken // Keep existing if not provided
      }));
      
      return result;
    } catch (error) {
      // If refresh fails, logout the user
      dispatch(logout());
      throw error;
    }
  }
);