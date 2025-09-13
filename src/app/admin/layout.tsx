
'use client';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminNav } from '@/components/admin/nav';
import { DashboardHeader } from '@/components/admin/dashboard-header';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    if (pathname !== '/admin/login' && !isAdmin) {
      router.push('/admin/login');
    }
  }, [isAdmin, loading, router, pathname]);

  if (pathname === '/admin/login') {
      return <>{children}</>;
  }

  if (loading || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <AdminNav />
      </Sidebar>
      <SidebarInset>
        <DashboardHeader>
            <SidebarTrigger />
        </DashboardHeader>
        <main className="p-4 lg:p-6 px-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
