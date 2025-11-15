import React from 'react';
import { useGetSessionsQuery, useRevokeSessionMutation, useRevokeAllSessionsMutation } from '@/lib/api/authApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Laptop, Smartphone, Tablet, Monitor } from 'lucide-react';
import type { SessionResponse } from '@/lib/api/types';

export function SessionManager() {
  const { data: sessions = [], isLoading, refetch } = useGetSessionsQuery();
  const [revokeSession, { isLoading: isRevoking }] = useRevokeSessionMutation();
  const [revokeAllSessions, { isLoading: isRevokingAll }] = useRevokeAllSessionsMutation();

  const handleRevokeSession = async (sessionId: string) => {
    try {
      await revokeSession({ sessionId }).unwrap();
      toast.success('Session revoked successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to revoke session');
    }
  };

  const handleRevokeAllSessions = async () => {
    try {
      const result = await revokeAllSessions().unwrap();
      toast.success(result.message || 'All sessions revoked successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to revoke all sessions');
    }
  };

  const getDeviceIcon = (userAgent: string) => {
    if (userAgent.toLowerCase().includes('mobile')) {
      return <Smartphone className="h-4 w-4" />;
    } else if (userAgent.toLowerCase().includes('tablet')) {
      return <Tablet className="h-4 w-4" />;
    } else {
      return <Laptop className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Sessions</CardTitle>
        <CardDescription>Manage your active sessions across devices</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sessions.map((session: SessionResponse) => (
            <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <Laptop className="h-4 w-4" />
                <div>
                  <p className="font-medium text-sm">
                    {session.device_info.substring(0, 30)}
                    {session.device_info.length > 30 ? '...' : ''}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    IP: {session.ip_address}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Last activity: {new Date(session.last_activity * 1000).toLocaleString()}
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleRevokeSession(session.id)}
                disabled={isRevoking}
              >
                Revoke
              </Button>
            </div>
          ))}
          {sessions.length > 1 && (
            <div className="pt-4 border-t">
              <Button 
                variant="destructive" 
                onClick={handleRevokeAllSessions}
                disabled={isRevokingAll}
              >
                {isRevokingAll ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Revoking...
                  </>
                ) : (
                  'Revoke All Sessions'
                )}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}