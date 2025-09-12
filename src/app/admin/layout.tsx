
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
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    // If we are not on the login page and the user is not the admin, redirect them.
    if (pathname !== '/admin/login' && (!user || user.email !== 'kamkunjin@gmail.com')) {
      router.push('/admin/login');
    }
  }, [user, loading, router, pathname]);

  // The login page handles its own UI and doesn't need the admin sidebar.
  // We return its children directly.
  if (pathname === '/admin/login') {
      return <>{children}</>;
  }


  // If still loading or the user is not the authorized admin, show a loader.
  // This prevents the admin dashboard from flashing before the redirect happens.
  if (loading || !user || user.email !== 'kamkunjin@gmail.com') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }


  // If the user is the admin, show the full admin dashboard layout.
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
