

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export const useLogged = () => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      if (user === null) {
        router.replace('/(auth)/login');
      }
    };

    // Delay to ensure navigation is ready
    const timer = setTimeout(checkAuth, 500);

    return () => clearTimeout(timer);
  }, [user, router]);
};