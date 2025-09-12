
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

  useEffect(() => {
    if (!loading) {
      if (!user || user.email !== 'kamkunjin@gmail.com') {
        router.push('/admin/login');
      }
    }
  }, [user, loading, router]);

  if (loading || !user || user.email !== 'kamkunjin@gmail.com') {
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
