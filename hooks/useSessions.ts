import { useGetSessionsQuery, useRevokeSessionMutation, useRevokeAllSessionsMutation } from '@/lib/api/authApi';

export const useSessions = () => {
  const { data: sessions, isLoading, refetch } = useGetSessionsQuery();
  const [revokeSession, revokeState] = useRevokeSessionMutation();
  const [revokeAllSessions, revokeAllState] = useRevokeAllSessionsMutation();
  
  const revokeSpecificSession = async (sessionId: string) => {
    try {
      await revokeSession({ sessionId }).unwrap();
      await refetch();
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to revoke session' };
    }
  };
  
  const revokeAllUserSessions = async () => {
    try {
      await revokeAllSessions().unwrap();
      await refetch();
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to revoke all sessions' };
    }
  };
  
  return {
    sessions: sessions || [],
    isLoading,
    revokeSpecificSession,
    revokeAllUserSessions,
    isRevoking: revokeState.isLoading,
    isRevokingAll: revokeAllState.isLoading
  };
};