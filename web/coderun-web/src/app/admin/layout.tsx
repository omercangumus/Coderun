'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { useAuth } from '@/lib/hooks/use-auth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Kullanıcı yüklendi ama superuser değil → login'e yönlendir
    if (!isLoading && user && !user.isSuperuser) {
      router.replace('/login?reason=admin_required');
    }
    // Kullanıcı yok → login'e yönlendir
    if (!isLoading && !user) {
      router.replace('/login?from=/admin');
    }
  }, [user, isLoading, router]);

  // Yükleniyor veya yetkisiz → boş göster
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
