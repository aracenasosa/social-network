'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';

export default function HomePage() {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();

  useEffect(() => {
    if (isLoading) return;
    
    if (user) {
      router.replace('/feed');
    } else {
      router.replace('/login');
    }
  }, [user, isLoading, router]);

  // Show nothing while redirecting
  return null;
}
