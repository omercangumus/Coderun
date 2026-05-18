'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { useAuth } from '@/lib/hooks/use-auth';

/**
 * Admin Layout — three-layer security:
 * 1. middleware.ts: blocks unauthenticated users (no token → /login)
 * 2. This layout: blocks non-superusers (token exists but isSuperuser=false → /login)
 * 3. Backend: all /admin/* API endpoints enforce get_current_superuser (HTTP 403)
 *
 * No admin content renders until isSuperuser is confirmed.
 * The spinner prevents any flash of admin UI for non-superusers.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // Wait for auth store to hydrate

    if (!user) {
      // No user — redirect to login
      router.replace('/login?from=/admin');
      return;
    }

    if (!user.isSuperuser) {
      // Authenticated but not superuser — redirect with reason
      router.replace('/login?reason=admin_required');
    }
  }, [user, isLoading, router]);

  // Block rendering until auth is confirmed — prevents any flash of admin content
  if (isLoading || !user || !user.isSuperuser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-on-surface-variant">Yetki kontrol ediliyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
