'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { hasAccessToken } from '@/lib/token';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    // Check if user has a valid token on mount
    checkAuth();

    // Define public routes that don't require authentication
    const publicRoutes = ['/login', '/signup'];
    const isPublicRoute = publicRoutes.some((route) => pathname?.startsWith(route));
    
    // If not on a public route and no token, redirect to login
    if (!isPublicRoute && !hasAccessToken()) {
      router.push('/login');
    }
    
    // If on a public route and has token, redirect to feed
    if (isPublicRoute && hasAccessToken()) {
      router.push('/feed');
    }
  }, [pathname, checkAuth, router]);

  return <>{children}</>;
}

