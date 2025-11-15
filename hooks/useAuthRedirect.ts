import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/hooks';

export const useAuthRedirect = () => {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  useEffect(() => {
    // Simple check - if not authenticated, redirect to signin
    if (!isAuthenticated) {
      router.push('/signin');
    }
  }, [isAuthenticated, router]);
};

export const useGuestRedirect = () => {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  useEffect(() => {
    // Simple check - if authenticated, redirect to hub
    if (isAuthenticated) {
      router.push('/hub');
    }
  }, [isAuthenticated, router]);
};